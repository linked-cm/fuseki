export const buildAuthHeaders = (auth, extra = {}) => {
    return {
        ...extra,
        Authorization: 'Basic ' +
            Buffer.from(`${auth.username}:${auth.password}`).toString('base64'),
    };
};
const getAdminDatasetsEndpoint = (baseUrl) => `${baseUrl}/$/datasets`;
export async function datasetExists(config) {
    var _a;
    const endpoint = getAdminDatasetsEndpoint(config.baseUrl);
    const headers = buildAuthHeaders(config, {
        Accept: 'application/json, text/plain',
    });
    try {
        const res = await fetch(endpoint, { method: 'GET', headers });
        const text = await res.text();
        if (!res.ok) {
            return { exists: false, error: text || res.statusText };
        }
        if (!text) {
            return { exists: false };
        }
        let json;
        try {
            json = JSON.parse(text);
        }
        catch (_b) {
            return {
                exists: false,
                error: 'Fuseki dataset listing returned invalid JSON.',
            };
        }
        const expectedName = '/' + config.dataset;
        const datasets = Array.isArray(json === null || json === void 0 ? void 0 : json.datasets) ? json.datasets : [];
        const exists = datasets.some((entry) => {
            const name = entry === null || entry === void 0 ? void 0 : entry['ds.name'];
            return name && typeof name === 'string' && expectedName === name;
        });
        return { exists };
    }
    catch (err) {
        if (((_a = err === null || err === void 0 ? void 0 : err.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED' || (err === null || err === void 0 ? void 0 : err.code) === 'ECONNREFUSED') {
            return { exists: false, error: 'Connection refused.' };
        }
        return {
            exists: false,
            error: `Error when checking if Fuseki dataset ${config.dataset} exists. Fetch ${endpoint}: ${err}`,
        };
    }
}
export async function createDataset(config) {
    var _a;
    const endpoint = getAdminDatasetsEndpoint(config.baseUrl);
    const headers = buildAuthHeaders(config, {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Accept: 'application/json, text/plain',
    });
    const body = new URLSearchParams({
        dbName: config.dataset,
        dbType: config.dbType,
    }).toString();
    try {
        const res = await fetch(endpoint, { method: 'POST', headers, body });
        const text = await res.text();
        if (res.ok || res.status === 409) {
            if (!text) {
                return { ok: true, status: res.status };
            }
            try {
                return { ok: true, status: res.status, json: JSON.parse(text) };
            }
            catch (_b) {
                return { ok: true, status: res.status, raw: text };
            }
        }
        return { ok: false, status: res.status, error: text || res.statusText };
    }
    catch (err) {
        if (((_a = err === null || err === void 0 ? void 0 : err.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED' || (err === null || err === void 0 ? void 0 : err.code) === 'ECONNREFUSED') {
            return { ok: false, error: 'Connection refused.' };
        }
        return {
            ok: false,
            error: `Error when creating dataset in Fuseki: ${err}`,
        };
    }
}
export async function ensureDatasetExists(config) {
    const exists = await datasetExists(config);
    if (exists.exists) {
        return { ok: true, created: false };
    }
    if (exists.error) {
        return { ok: false, error: exists.error };
    }
    const createResult = await createDataset(config);
    if (createResult === null || createResult === void 0 ? void 0 : createResult.ok) {
        return { ...createResult, created: true };
    }
    return createResult;
}
export async function clearDataset(config) {
    var _a;
    const endpoint = `${config.baseUrl}/${config.dataset}/update`;
    const headers = buildAuthHeaders(config, {
        'Content-Type': 'application/sparql-update',
    });
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: 'CLEAR ALL',
        });
        const text = await res.text();
        if (!res.ok) {
            return { ok: false, status: res.status, error: text || res.statusText };
        }
        return { ok: true, status: res.status, raw: text };
    }
    catch (err) {
        if (((_a = err === null || err === void 0 ? void 0 : err.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED' || (err === null || err === void 0 ? void 0 : err.code) === 'ECONNREFUSED') {
            return { ok: false, error: 'Connection refused.' };
        }
        return { ok: false, error: `Error when clearing dataset: ${err}` };
    }
}
export async function ensureDatasetsExist(datasets, config) {
    var _a;
    if (!config.dbType) {
        throw new Error('dbType is required to create datasets.');
    }
    for (const dataset of datasets) {
        const result = await ensureDatasetExists({
            baseUrl: config.baseUrl,
            dataset,
            username: config.username,
            password: config.password,
            dbType: config.dbType,
        });
        if (result === null || result === void 0 ? void 0 : result.created) {
            (_a = config.log) === null || _a === void 0 ? void 0 : _a.call(config, `Created dataset ${dataset} (empty)`);
            continue;
        }
        if (result === null || result === void 0 ? void 0 : result.ok) {
            continue;
        }
        const detail = (result === null || result === void 0 ? void 0 : result.error) ? String(result.error) : 'Unknown error';
        throw new Error(`Failed to ensure dataset ${dataset}: ${detail}`);
    }
}
export async function clearDatasets(datasets, config) {
    var _a;
    for (const dataset of datasets) {
        const result = await clearDataset({
            baseUrl: config.baseUrl,
            dataset,
            username: config.username,
            password: config.password,
        });
        if (result === null || result === void 0 ? void 0 : result.ok) {
            (_a = config.log) === null || _a === void 0 ? void 0 : _a.call(config, `Cleared dataset ${dataset}`);
            continue;
        }
        const detail = (result === null || result === void 0 ? void 0 : result.error) ? String(result.error) : 'Unknown error';
        throw new Error(`Failed to clear dataset ${dataset}: ${detail}`);
    }
}
//# sourceMappingURL=datasets.js.map