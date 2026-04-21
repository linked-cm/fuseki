import { SparqlStore } from '@_linked/core/sparql/SparqlStore';
import type { SparqlJsonResults } from '@_linked/core/sparql/resultMapping';
export interface ImportOptions {
    contentType?: string;
    graph?: string;
    mode?: 'append' | 'replace';
}
export declare class FusekiStore extends SparqlStore {
    static targetClass: import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
    private baseUrl;
    private dataset;
    private defaultGraph?;
    constructor(dataset?: string | {
        value?: string;
    } | {
        id?: string;
    }, baseUrl?: string, options?: {
        defaultGraph?: string;
    });
    private static normalizeDatasetName;
    private getGraphStoreEndpoint;
    private getAdminAuth;
    private getHeaders;
    protected executeSparqlSelect(sparql: string): Promise<SparqlJsonResults>;
    protected executeSparqlUpdate(sparql: string): Promise<void>;
    datasetExists(): Promise<boolean>;
    createDataset(options?: {
        dbType?: string;
    }): Promise<any>;
    ensureDatasetExists(options?: {
        dbType?: string;
    }): Promise<any>;
    private getContentTypeFromPath;
    importData(data: string | Uint8Array, options?: ImportOptions): Promise<any>;
    importFile(filePath: string, options?: ImportOptions): Promise<any>;
}
