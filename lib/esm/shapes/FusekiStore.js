var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FusekiStore_1;
import { SparqlStore } from '@_linked/core/sparql/SparqlStore';
import fs from 'node:fs/promises';
import path from 'node:path';
import { linkedShape } from '../package.js';
import { fuseki } from '../ontologies/fuseki.js';
import { buildAuthHeaders, createDataset as createDatasetUtil, datasetExists as datasetExistsUtil, ensureDatasetExists as ensureDatasetExistsUtil, } from '../utils/datasets.js';
let FusekiStore = FusekiStore_1 = class FusekiStore extends SparqlStore {
    constructor(dataset, baseUrl = process.env.FUSEKI_BASE_URL, options) {
        var _a;
        const normalizedDataset = dataset
            ? FusekiStore_1.normalizeDatasetName(dataset)
            : '';
        super();
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.dataset = normalizedDataset;
        this.defaultGraph =
            (_a = options === null || options === void 0 ? void 0 : options.defaultGraph) !== null && _a !== void 0 ? _a : process.env.FUSEKI_DEFAULT_GRAPH;
    }
    static normalizeDatasetName(dataset) {
        var _a, _b;
        const raw = typeof dataset === 'string'
            ? dataset
            : (_b = (_a = dataset.value) !== null && _a !== void 0 ? _a : dataset.id) !== null && _b !== void 0 ? _b : dataset.toString();
        return raw
            .trim()
            .replace(/^<(.+)>$/, '$1')
            .replace(/^\/+/, '');
    }
    getGraphStoreEndpoint(graph) {
        const base = `${this.baseUrl}/${this.dataset}/data`;
        if (graph) {
            return `${base}?graph=${encodeURIComponent(graph)}`;
        }
        return `${base}?default`;
    }
    getAdminAuth() {
        const authUser = process.env.FUSEKI_USER;
        const authPass = process.env.FUSEKI_PASSWORD;
        if (!authUser || !authPass) {
            throw new Error('FUSEKI_USER and FUSEKI_PASSWORD are required.');
        }
        return { username: authUser, password: authPass };
    }
    getHeaders(extra = {}) {
        const headers = { ...extra };
        const authUser = process.env.FUSEKI_USER;
        const authPass = process.env.FUSEKI_PASSWORD;
        if (authUser && authPass) {
            return buildAuthHeaders({ username: authUser, password: authPass }, extra);
        }
        return headers;
    }
    // ── SparqlStore abstract method implementations ──
    async executeSparqlSelect(sparql) {
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
            return JSON.parse(text);
        }
        catch (_a) {
            console.warn('Fuseki did not return valid JSON');
            console.warn('Response text:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
            // Return empty result set so callers don't crash
            return { head: { vars: [] }, results: { bindings: [] } };
        }
    }
    async executeSparqlUpdate(sparql) {
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
    async datasetExists() {
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
            }
            else {
                console.warn('Fuseki dataset listing failed:', result.error);
            }
        }
        return result.exists;
    }
    async createDataset(options = {}) {
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
    async ensureDatasetExists(options = {}) {
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
    getContentTypeFromPath(filePath) {
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
    async importData(data, options = {}) {
        var _a, _b, _c;
        const contentType = options.contentType;
        if (!contentType) {
            throw new Error('importData requires a contentType option.');
        }
        const mode = (_a = options.mode) !== null && _a !== void 0 ? _a : 'append';
        const targetGraph = (_b = options.graph) !== null && _b !== void 0 ? _b : this.defaultGraph;
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
                body: data,
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
            }
            catch (_d) {
                return { ok: true, status: res.status, raw: text };
            }
        }
        catch (err) {
            if (((_c = err === null || err === void 0 ? void 0 : err.cause) === null || _c === void 0 ? void 0 : _c.code) === 'ECONNREFUSED' || (err === null || err === void 0 ? void 0 : err.code) === 'ECONNREFUSED') {
                console.error('Connection refused. Is the Fuseki endpoint running?', err.message);
                return { error: 'Connection refused.' };
            }
            console.error('Error when importing data into Fuseki:', err);
            return { error: `Error when importing data into Fuseki: ${err}` };
        }
    }
    async importFile(filePath, options = {}) {
        const contentType = options.contentType || this.getContentTypeFromPath(filePath);
        if (!contentType) {
            throw new Error(`Unsupported file extension for ${filePath}`);
        }
        const data = await fs.readFile(filePath);
        return this.importData(data, { ...options, contentType });
    }
};
FusekiStore.targetClass = fuseki.FusekiStore;
FusekiStore = FusekiStore_1 = __decorate([
    linkedShape,
    __metadata("design:paramtypes", [Object, String, Object])
], FusekiStore);
export { FusekiStore };
//# sourceMappingURL=FusekiStore.js.map