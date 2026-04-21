/**
 * Load the data of this ontology into memory, thus adding the properties of the entities of this ontology to the local graph.
 */
export declare var loadData: () => Promise<typeof import("../data/fuseki.json")>;
/**
 * The namespace of this ontology, which can be used to create NamedNodes with URI's not listed in this file
 */
export declare var ns: (term: string) => import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
/**
 * The NamedNode of the ontology itself
 */
export declare var _self: import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
export declare var FusekiStore: import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
export declare const fuseki: {
    FusekiStore: import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
};
