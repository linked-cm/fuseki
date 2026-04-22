"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusekiStore = void 0;
var SparqlStore_1 = require("@_linked/core/sparql/SparqlStore");
var promises_1 = __importDefault(require("node:fs/promises"));
var node_path_1 = __importDefault(require("node:path"));
var package_js_1 = require("../package.js");
var fuseki_js_1 = require("../ontologies/fuseki.js");
var datasets_js_1 = require("../utils/datasets.js");
var FusekiStore = /** @class */ (function (_super) {
    __extends(FusekiStore, _super);
    function FusekiStore(dataset, baseUrl, options) {
        if (baseUrl === void 0) { baseUrl = process.env.FUSEKI_BASE_URL; }
        var _this = this;
        var _a;
        var normalizedDataset = dataset
            ? FusekiStore_1.normalizeDatasetName(dataset)
            : '';
        _this = _super.call(this) || this;
        _this.baseUrl = baseUrl.replace(/\/+$/, '');
        _this.dataset = normalizedDataset;
        _this.defaultGraph =
            (_a = options === null || options === void 0 ? void 0 : options.defaultGraph) !== null && _a !== void 0 ? _a : process.env.FUSEKI_DEFAULT_GRAPH;
        return _this;
    }
    FusekiStore_1 = FusekiStore;
    FusekiStore.normalizeDatasetName = function (dataset) {
        var _a, _b;
        var raw = typeof dataset === 'string'
            ? dataset
            : (_b = (_a = dataset.value) !== null && _a !== void 0 ? _a : dataset.id) !== null && _b !== void 0 ? _b : dataset.toString();
        return raw
            .trim()
            .replace(/^<(.+)>$/, '$1')
            .replace(/^\/+/, '');
    };
    FusekiStore.prototype.getGraphStoreEndpoint = function (graph) {
        var base = "".concat(this.baseUrl, "/").concat(this.dataset, "/data");
        if (graph) {
            return "".concat(base, "?graph=").concat(encodeURIComponent(graph));
        }
        return "".concat(base, "?default");
    };
    FusekiStore.prototype.getAdminAuth = function () {
        var authUser = process.env.FUSEKI_USER;
        var authPass = process.env.FUSEKI_PASSWORD;
        if (!authUser || !authPass) {
            throw new Error('FUSEKI_USER and FUSEKI_PASSWORD are required.');
        }
        return { username: authUser, password: authPass };
    };
    FusekiStore.prototype.getHeaders = function (extra) {
        if (extra === void 0) { extra = {}; }
        var headers = __assign({}, extra);
        var authUser = process.env.FUSEKI_USER;
        var authPass = process.env.FUSEKI_PASSWORD;
        if (authUser && authPass) {
            return (0, datasets_js_1.buildAuthHeaders)({ username: authUser, password: authPass }, extra);
        }
        return headers;
    };
    // ── SparqlStore abstract method implementations ──
    FusekiStore.prototype.executeSparqlSelect = function (sparql) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, headers, res, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.baseUrl, "/").concat(this.dataset, "/sparql");
                        headers = this.getHeaders({
                            'Content-Type': 'application/sparql-query',
                            Accept: 'application/sparql-results+json',
                        });
                        console.log("[FusekiStore] SPARQL query -> ".concat(endpoint));
                        console.log("[FusekiStore] query: ".concat(sparql));
                        return [4 /*yield*/, fetch(endpoint, {
                                method: 'POST',
                                headers: headers,
                                body: sparql,
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        text = _a.sent();
                        try {
                            return [2 /*return*/, JSON.parse(text)];
                        }
                        catch (_b) {
                            console.warn('Fuseki did not return valid JSON');
                            console.warn('Response text:', text.substring(0, 500) + (text.length > 500 ? '...' : ''));
                            // Return empty result set so callers don't crash
                            return [2 /*return*/, { head: { vars: [] }, results: { bindings: [] } }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FusekiStore.prototype.executeSparqlUpdate = function (sparql) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, headers, res, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = "".concat(this.baseUrl, "/").concat(this.dataset, "/update");
                        headers = this.getHeaders({
                            'Content-Type': 'application/sparql-update',
                            Accept: 'application/sparql-results+json, application/json, text/plain',
                        });
                        console.log("[FusekiStore] SPARQL update -> ".concat(endpoint));
                        console.log("[FusekiStore] query: ".concat(sparql));
                        return [4 /*yield*/, fetch(endpoint, {
                                method: 'POST',
                                headers: headers,
                                body: sparql,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.text()];
                    case 2:
                        text = _a.sent();
                        console.warn('Fuseki update failed:', text || res.statusText);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── Fuseki admin operations ──
    FusekiStore.prototype.datasetExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auth, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auth = this.getAdminAuth();
                        return [4 /*yield*/, (0, datasets_js_1.datasetExists)({
                                baseUrl: this.baseUrl,
                                dataset: this.dataset,
                                username: auth.username,
                                password: auth.password,
                            })];
                    case 1:
                        result = _a.sent();
                        if (result.error) {
                            if (result.error === 'Connection refused.') {
                                console.error('Connection refused. Is the Fuseki endpoint running?');
                            }
                            else {
                                console.warn('Fuseki dataset listing failed:', result.error);
                            }
                        }
                        return [2 /*return*/, result.exists];
                }
            });
        });
    };
    FusekiStore.prototype.createDataset = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var auth, dbType, result;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auth = this.getAdminAuth();
                        dbType = options.dbType || process.env.FUSEKI_DB_TYPE || 'tdb2';
                        return [4 /*yield*/, (0, datasets_js_1.createDataset)({
                                baseUrl: this.baseUrl,
                                dataset: this.dataset,
                                username: auth.username,
                                password: auth.password,
                                dbType: dbType,
                            })];
                    case 1:
                        result = _a.sent();
                        if (!result.ok) {
                            console.warn('Fuseki dataset creation failed:', result.error);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    FusekiStore.prototype.ensureDatasetExists = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var auth, dbType, result;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auth = this.getAdminAuth();
                        dbType = options.dbType || process.env.FUSEKI_DB_TYPE || 'tdb2';
                        return [4 /*yield*/, (0, datasets_js_1.ensureDatasetExists)({
                                baseUrl: this.baseUrl,
                                dataset: this.dataset,
                                username: auth.username,
                                password: auth.password,
                                dbType: dbType,
                            })];
                    case 1:
                        result = _a.sent();
                        if (!result.ok) {
                            console.warn('Fuseki dataset ensure failed:', result.error);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // ── Graph Store Protocol (data import) ──
    FusekiStore.prototype.getContentTypeFromPath = function (filePath) {
        var ext = node_path_1.default.extname(filePath).toLowerCase();
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
    };
    FusekiStore.prototype.importData = function (data_1) {
        return __awaiter(this, arguments, void 0, function (data, options) {
            var contentType, mode, targetGraph, endpoint, method, headers, res, text, err_1;
            var _a, _b, _c;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        contentType = options.contentType;
                        if (!contentType) {
                            throw new Error('importData requires a contentType option.');
                        }
                        mode = (_a = options.mode) !== null && _a !== void 0 ? _a : 'append';
                        targetGraph = (_b = options.graph) !== null && _b !== void 0 ? _b : this.defaultGraph;
                        endpoint = this.getGraphStoreEndpoint(targetGraph);
                        method = mode === 'replace' ? 'PUT' : 'POST';
                        headers = this.getHeaders({
                            'Content-Type': contentType,
                            Accept: 'application/json, text/plain',
                        });
                        console.log("[FusekiStore] importData (".concat(mode, ") -> ").concat(endpoint));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(endpoint, {
                                method: method,
                                headers: headers,
                                body: data,
                            })];
                    case 2:
                        res = _d.sent();
                        return [4 /*yield*/, res.text()];
                    case 3:
                        text = _d.sent();
                        if (!res.ok) {
                            console.warn('Fuseki import failed:', text || res.statusText);
                            return [2 /*return*/, { error: text || res.statusText, status: res.status }];
                        }
                        if (!text) {
                            return [2 /*return*/, { ok: true, status: res.status }];
                        }
                        try {
                            return [2 /*return*/, JSON.parse(text)];
                        }
                        catch (_e) {
                            return [2 /*return*/, { ok: true, status: res.status, raw: text }];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _d.sent();
                        if (((_c = err_1 === null || err_1 === void 0 ? void 0 : err_1.cause) === null || _c === void 0 ? void 0 : _c.code) === 'ECONNREFUSED' || (err_1 === null || err_1 === void 0 ? void 0 : err_1.code) === 'ECONNREFUSED') {
                            console.error('Connection refused. Is the Fuseki endpoint running?', err_1.message);
                            return [2 /*return*/, { error: 'Connection refused.' }];
                        }
                        console.error('Error when importing data into Fuseki:', err_1);
                        return [2 /*return*/, { error: "Error when importing data into Fuseki: ".concat(err_1) }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FusekiStore.prototype.importFile = function (filePath_1) {
        return __awaiter(this, arguments, void 0, function (filePath, options) {
            var contentType, data;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contentType = options.contentType || this.getContentTypeFromPath(filePath);
                        if (!contentType) {
                            throw new Error("Unsupported file extension for ".concat(filePath));
                        }
                        return [4 /*yield*/, promises_1.default.readFile(filePath)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.importData(data, __assign(__assign({}, options), { contentType: contentType }))];
                }
            });
        });
    };
    var FusekiStore_1;
    FusekiStore.targetClass = fuseki_js_1.fuseki.FusekiStore;
    FusekiStore = FusekiStore_1 = __decorate([
        package_js_1.linkedShape,
        __metadata("design:paramtypes", [Object, String, Object])
    ], FusekiStore);
    return FusekiStore;
}(SparqlStore_1.SparqlStore));
exports.FusekiStore = FusekiStore;
//# sourceMappingURL=FusekiStore.js.map