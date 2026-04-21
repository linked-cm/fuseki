import { SparqlStore } from '@_linked/core/sparql/SparqlStore';
import type { SparqlJsonResults } from '@_linked/core/sparql/resultMapping';
import fs from 'node:fs/promises';
import path from 'node:path';
import { linkedShape } from '../package.js';
import { fuseki } from '../ontologies/fuseki.js';
import {
  buildAuthHeaders,
  createDataset as createDatasetUtil,
  datasetExists as datasetExistsUtil,
  ensureDatasetExists as ensureDatasetExistsUtil,
} from '../utils/datasets.js';

export interface ImportOptions {
  contentType?: string;
  graph?: string;
  mode?: 'append' | 'replace';
}

@linkedShape
export class FusekiStore extends SparqlStore {
  static targetClass = fuseki.FusekiStore;
  private baseUrl: string;
  private dataset: string;
  private defaultGraph?: string;

  constructor(
    dataset?: string | { value?: string } | { id?: string },
    baseUrl: string = process.env.FUSEKI_BASE_URL,
    options?: { defaultGraph?: string }
  ) {
    const normalizedDataset = dataset
      ? FusekiStore.normalizeDatasetName(dataset)
      : '';
    super();
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.dataset = normalizedDataset;
    this.defaultGraph =
      options?.defaultGraph ?? process.env.FUSEKI_DEFAULT_GRAPH;
  }

  private static normalizeDatasetName(
    dataset: string | { value?: string } | { id?: string }
  ): string {
    const raw =
      typeof dataset === 'string'
        ? dataset
        : (dataset as any).value ?? (dataset as any).id ?? dataset.toString();
    return raw
      .trim()
      .replace(/^<(.+)>$/, '$1')
      .replace(/^\/+/, '');
  }

  private getGraphStoreEndpoint(graph?: string): string {
    const base = `${this.baseUrl}/${this.dataset}/data`;
    if (graph) {
      return `${base}?graph=${encodeURIComponent(graph)}`;
    }
    return `${base}?default`;
  }

  private getAdminAuth() {
    const authUser = process.env.FUSEKI_USER;
    const authPass = process.env.FUSEKI_PASSWORD;
    if (!authUser || !authPass) {
      throw new Error('FUSEKI_USER and FUSEKI_PASSWORD are required.');
    }
    return { username: authUser, password: authPass };
  }

  private getHeaders(
    extra: Record<string, string> = {}
  ): Record<string, string> {
    const headers = { ...extra };
    const authUser = process.env.FUSEKI_USER;
    const authPass = process.env.FUSEKI_PASSWORD;
    if (authUser && authPass) {
      return buildAuthHeaders(
        { username: authUser, password: authPass },
        extra
      );
    }
    return headers;
  }

  // ── SparqlStore abstract method implementations ──

  protected async executeSparqlSelect(
    sparql: string
  ): Promise<SparqlJsonResults> {
    const endpoint = `${this.baseUrl}/${this.dataset}/sparql`;
    const headers = this.getHeaders({
      'Content-Type': 'application/sparql-query',
      Accept: 'application/sparql-results+json',
    });

    console.log(`[FusekiStore] SPARQL query -> ${endpoint}`);
    console.log(`[FusekiStore] query: ${sparql}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: sparql,
    });
    const text = await res.text();

    try {
      return JSON.parse(text) as SparqlJsonResults;
    } catch {
      console.warn('Fuseki did not return valid JSON');
      console.warn(
        'Response text:',
        text.substring(0, 500) + (text.length > 500 ? '...' : '')
      );
      // Return empty result set so callers don't crash
      return { head: { vars: [] }, results: { bindings: [] } };
    }
  }

  protected async executeSparqlUpdate(sparql: string): Promise<void> {
    const endpoint = `${this.baseUrl}/${this.dataset}/update`;
    const headers = this.getHeaders({
      'Content-Type': 'application/sparql-update',
      Accept: 'application/sparql-results+json, application/json, text/plain',
    });

    console.log(`[FusekiStore] SPARQL update -> ${endpoint}`);
    console.log(`[FusekiStore] query: ${sparql}`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: sparql,
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn('Fuseki update failed:', text || res.statusText);
    }
  }

  // ── Fuseki admin operations ──

  async datasetExists(): Promise<boolean> {
    const auth = this.getAdminAuth();
    const result = await datasetExistsUtil({
      baseUrl: this.baseUrl,
      dataset: this.dataset,
      username: auth.username,
      password: auth.password,
    });
    if (result.error) {
      if (result.error === 'Connection refused.') {
        console.error('Connection refused. Is the Fuseki endpoint running?');
      } else {
        console.warn('Fuseki dataset listing failed:', result.error);
      }
    }
    return result.exists;
  }

  async createDataset(options: { dbType?: string } = {}): Promise<any> {
    const auth = this.getAdminAuth();
    const dbType = options.dbType || process.env.FUSEKI_DB_TYPE || 'tdb2';
    const result = await createDatasetUtil({
      baseUrl: this.baseUrl,
      dataset: this.dataset,
      username: auth.username,
      password: auth.password,
      dbType,
    });
    if (!result.ok) {
      console.warn('Fuseki dataset creation failed:', result.error);
    }
    return result;
  }

  async ensureDatasetExists(options: { dbType?: string } = {}): Promise<any> {
    const auth = this.getAdminAuth();
    const dbType = options.dbType || process.env.FUSEKI_DB_TYPE || 'tdb2';
    const result = await ensureDatasetExistsUtil({
      baseUrl: this.baseUrl,
      dataset: this.dataset,
      username: auth.username,
      password: auth.password,
      dbType,
    });
    if (!result.ok) {
      console.warn('Fuseki dataset ensure failed:', result.error);
    }
    return result;
  }

  // ── Graph Store Protocol (data import) ──

  private getContentTypeFromPath(filePath: string): string | null {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.n3':
        return 'text/n3';
      case '.ttl':
        return 'text/turtle';
      case '.nt':
        return 'application/n-triples';
      case '.nq':
        return 'application/n-quads';
      case '.trig':
        return 'application/trig';
      case '.jsonld':
      case '.json':
        return 'application/ld+json';
      case '.rdf':
      case '.xml':
        return 'application/rdf+xml';
      default:
        return null;
    }
  }

  async importData(
    data: string | Uint8Array,
    options: ImportOptions = {}
  ): Promise<any> {
    const contentType = options.contentType;
    if (!contentType) {
      throw new Error('importData requires a contentType option.');
    }

    const mode = options.mode ?? 'append';
    const targetGraph = options.graph ?? this.defaultGraph;
    const endpoint = this.getGraphStoreEndpoint(targetGraph);
    const method = mode === 'replace' ? 'PUT' : 'POST';

    const headers = this.getHeaders({
      'Content-Type': contentType,
      Accept: 'application/json, text/plain',
    });

    console.log(`[FusekiStore] importData (${mode}) -> ${endpoint}`);
    try {
      const res = await fetch(endpoint, {
        method,
        headers,
        body: data as BodyInit,
      });
      const text = await res.text();

      if (!res.ok) {
        console.warn('Fuseki import failed:', text || res.statusText);
        return { error: text || res.statusText, status: res.status };
      }

      if (!text) {
        return { ok: true, status: res.status };
      }

      try {
        return JSON.parse(text);
      } catch {
        return { ok: true, status: res.status, raw: text };
      }
    } catch (err: any) {
      if (err?.cause?.code === 'ECONNREFUSED' || err?.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. Is the Fuseki endpoint running?',
          err.message
        );
        return { error: 'Connection refused.' };
      }
      console.error('Error when importing data into Fuseki:', err);
      return { error: `Error when importing data into Fuseki: ${err}` };
    }
  }

  async importFile(
    filePath: string,
    options: ImportOptions = {}
  ): Promise<any> {
    const contentType =
      options.contentType || this.getContentTypeFromPath(filePath);
    if (!contentType) {
      throw new Error(`Unsupported file extension for ${filePath}`);
    }

    const data = await fs.readFile(filePath);
    return this.importData(data, { ...options, contentType });
  }
}
