export type FusekiAuthConfig = {
    username: string;
    password: string;
};
export type FusekiDatasetConfig = FusekiAuthConfig & {
    baseUrl: string;
    dataset: string;
};
export type FusekiCreateDatasetConfig = FusekiDatasetConfig & {
    dbType: string;
};
export type DatasetAdminResult = {
    ok: boolean;
    status?: number;
    json?: any;
    raw?: string;
    error?: string;
};
export type DatasetExistsResult = {
    exists: boolean;
    error?: string;
};
export type DatasetClearResult = {
    ok: boolean;
    status?: number;
    error?: string;
    raw?: string;
};
export declare const buildAuthHeaders: (auth: FusekiAuthConfig, extra?: Record<string, string>) => Record<string, string>;
export declare function datasetExists(config: FusekiDatasetConfig): Promise<DatasetExistsResult>;
export declare function createDataset(config: FusekiCreateDatasetConfig): Promise<DatasetAdminResult>;
export declare function ensureDatasetExists(config: FusekiCreateDatasetConfig): Promise<DatasetAdminResult & {
    created?: boolean;
}>;
export declare function clearDataset(config: FusekiDatasetConfig): Promise<DatasetClearResult>;
export type DatasetsBatchConfig = {
    baseUrl: string;
    username: string;
    password: string;
    dbType?: string;
    log?: (message: string) => void;
};
export declare function ensureDatasetsExist(datasets: string[], config: DatasetsBatchConfig): Promise<void>;
export declare function clearDatasets(datasets: string[], config: Omit<DatasetsBatchConfig, 'dbType'>): Promise<void>;
