"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuthHeaders = void 0;
exports.datasetExists = datasetExists;
exports.createDataset = createDataset;
exports.ensureDatasetExists = ensureDatasetExists;
exports.clearDataset = clearDataset;
exports.ensureDatasetsExist = ensureDatasetsExist;
exports.clearDatasets = clearDatasets;
var buildAuthHeaders = function (auth, extra) {
    if (extra === void 0) { extra = {}; }
    return __assign(__assign({}, extra), { Authorization: 'Basic ' +
            Buffer.from("".concat(auth.username, ":").concat(auth.password)).toString('base64') });
};
exports.buildAuthHeaders = buildAuthHeaders;
var getAdminDatasetsEndpoint = function (baseUrl) {
    return "".concat(baseUrl, "/$/datasets");
};
function datasetExists(config) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, headers, res, text, json, expectedName_1, datasets, exists, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    endpoint = getAdminDatasetsEndpoint(config.baseUrl);
                    headers = (0, exports.buildAuthHeaders)(config, {
                        Accept: 'application/json, text/plain',
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(endpoint, { method: 'GET', headers: headers })];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.text()];
                case 3:
                    text = _b.sent();
                    if (!res.ok) {
                        return [2 /*return*/, { exists: false, error: text || res.statusText }];
                    }
                    if (!text) {
                        return [2 /*return*/, { exists: false }];
                    }
                    json = void 0;
                    try {
                        json = JSON.parse(text);
                    }
                    catch (_c) {
                        return [2 /*return*/, {
                                exists: false,
                                error: 'Fuseki dataset listing returned invalid JSON.',
                            }];
                    }
                    expectedName_1 = '/' + config.dataset;
                    datasets = Array.isArray(json === null || json === void 0 ? void 0 : json.datasets) ? json.datasets : [];
                    exists = datasets.some(function (entry) {
                        var name = entry === null || entry === void 0 ? void 0 : entry['ds.name'];
                        return name && typeof name === 'string' && expectedName_1 === name;
                    });
                    return [2 /*return*/, { exists: exists }];
                case 4:
                    err_1 = _b.sent();
                    if (((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED' || (err_1 === null || err_1 === void 0 ? void 0 : err_1.code) === 'ECONNREFUSED') {
                        return [2 /*return*/, { exists: false, error: 'Connection refused.' }];
                    }
                    return [2 /*return*/, {
                            exists: false,
                            error: "Error when checking if Fuseki dataset ".concat(config.dataset, " exists. Fetch ").concat(endpoint, ": ").concat(err_1),
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createDataset(config) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, headers, body, res, text, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    endpoint = getAdminDatasetsEndpoint(config.baseUrl);
                    headers = (0, exports.buildAuthHeaders)(config, {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                        Accept: 'application/json, text/plain',
                    });
                    body = new URLSearchParams({
                        dbName: config.dataset,
                        dbType: config.dbType,
                    }).toString();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(endpoint, { method: 'POST', headers: headers, body: body })];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.text()];
                case 3:
                    text = _b.sent();
                    if (res.ok || res.status === 409) {
                        if (!text) {
                            return [2 /*return*/, { ok: true, status: res.status }];
                        }
                        try {
                            return [2 /*return*/, { ok: true, status: res.status, json: JSON.parse(text) }];
                        }
                        catch (_c) {
                            return [2 /*return*/, { ok: true, status: res.status, raw: text }];
                        }
                    }
                    return [2 /*return*/, { ok: false, status: res.status, error: text || res.statusText }];
                case 4:
                    err_2 = _b.sent();
                    if (((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED' || (err_2 === null || err_2 === void 0 ? void 0 : err_2.code) === 'ECONNREFUSED') {
                        return [2 /*return*/, { ok: false, error: 'Connection refused.' }];
                    }
                    return [2 /*return*/, {
                            ok: false,
                            error: "Error when creating dataset in Fuseki: ".concat(err_2),
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function ensureDatasetExists(config) {
    return __awaiter(this, void 0, void 0, function () {
        var exists, createResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, datasetExists(config)];
                case 1:
                    exists = _a.sent();
                    if (exists.exists) {
                        return [2 /*return*/, { ok: true, created: false }];
                    }
                    if (exists.error) {
                        return [2 /*return*/, { ok: false, error: exists.error }];
                    }
                    return [4 /*yield*/, createDataset(config)];
                case 2:
                    createResult = _a.sent();
                    if (createResult === null || createResult === void 0 ? void 0 : createResult.ok) {
                        return [2 /*return*/, __assign(__assign({}, createResult), { created: true })];
                    }
                    return [2 /*return*/, createResult];
            }
        });
    });
}
function clearDataset(config) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, headers, res, text, err_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    endpoint = "".concat(config.baseUrl, "/").concat(config.dataset, "/update");
                    headers = (0, exports.buildAuthHeaders)(config, {
                        'Content-Type': 'application/sparql-update',
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(endpoint, {
                            method: 'POST',
                            headers: headers,
                            body: 'CLEAR ALL',
                        })];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.text()];
                case 3:
                    text = _b.sent();
                    if (!res.ok) {
                        return [2 /*return*/, { ok: false, status: res.status, error: text || res.statusText }];
                    }
                    return [2 /*return*/, { ok: true, status: res.status, raw: text }];
                case 4:
                    err_3 = _b.sent();
                    if (((_a = err_3 === null || err_3 === void 0 ? void 0 : err_3.cause) === null || _a === void 0 ? void 0 : _a.code) === 'ECONNREFUSED' || (err_3 === null || err_3 === void 0 ? void 0 : err_3.code) === 'ECONNREFUSED') {
                        return [2 /*return*/, { ok: false, error: 'Connection refused.' }];
                    }
                    return [2 /*return*/, { ok: false, error: "Error when clearing dataset: ".concat(err_3) }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function ensureDatasetsExist(datasets, config) {
    return __awaiter(this, void 0, void 0, function () {
        var datasets_1, datasets_1_1, dataset, result, detail, e_1_1;
        var e_1, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!config.dbType) {
                        throw new Error('dbType is required to create datasets.');
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    datasets_1 = __values(datasets), datasets_1_1 = datasets_1.next();
                    _c.label = 2;
                case 2:
                    if (!!datasets_1_1.done) return [3 /*break*/, 5];
                    dataset = datasets_1_1.value;
                    return [4 /*yield*/, ensureDatasetExists({
                            baseUrl: config.baseUrl,
                            dataset: dataset,
                            username: config.username,
                            password: config.password,
                            dbType: config.dbType,
                        })];
                case 3:
                    result = _c.sent();
                    if (result === null || result === void 0 ? void 0 : result.created) {
                        (_b = config.log) === null || _b === void 0 ? void 0 : _b.call(config, "Created dataset ".concat(dataset, " (empty)"));
                        return [3 /*break*/, 4];
                    }
                    if (result === null || result === void 0 ? void 0 : result.ok) {
                        return [3 /*break*/, 4];
                    }
                    detail = (result === null || result === void 0 ? void 0 : result.error) ? String(result.error) : 'Unknown error';
                    throw new Error("Failed to ensure dataset ".concat(dataset, ": ").concat(detail));
                case 4:
                    datasets_1_1 = datasets_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (datasets_1_1 && !datasets_1_1.done && (_a = datasets_1.return)) _a.call(datasets_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function clearDatasets(datasets, config) {
    return __awaiter(this, void 0, void 0, function () {
        var datasets_2, datasets_2_1, dataset, result, detail, e_2_1;
        var e_2, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, 6, 7]);
                    datasets_2 = __values(datasets), datasets_2_1 = datasets_2.next();
                    _c.label = 1;
                case 1:
                    if (!!datasets_2_1.done) return [3 /*break*/, 4];
                    dataset = datasets_2_1.value;
                    return [4 /*yield*/, clearDataset({
                            baseUrl: config.baseUrl,
                            dataset: dataset,
                            username: config.username,
                            password: config.password,
                        })];
                case 2:
                    result = _c.sent();
                    if (result === null || result === void 0 ? void 0 : result.ok) {
                        (_b = config.log) === null || _b === void 0 ? void 0 : _b.call(config, "Cleared dataset ".concat(dataset));
                        return [3 /*break*/, 3];
                    }
                    detail = (result === null || result === void 0 ? void 0 : result.error) ? String(result.error) : 'Unknown error';
                    throw new Error("Failed to clear dataset ".concat(dataset, ": ").concat(detail));
                case 3:
                    datasets_2_1 = datasets_2.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_2_1 = _c.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (datasets_2_1 && !datasets_2_1.done && (_a = datasets_2.return)) _a.call(datasets_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=datasets.js.map