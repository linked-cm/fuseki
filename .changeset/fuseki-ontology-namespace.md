---
'@_linked/fuseki': minor
---

The fuseki ontology moves from `http://lincd.org/ont/lincd-fuseki/` to `https://linked.cm/ont/fuseki/`, the first-party scheme every public package uses (`https://linked.cm/ont/{publicSlug}/`, next to its shapes at `https://linked.cm/shape/fuseki/`).

No data migration is needed. The ontology's only term, `fuseki.FusekiStore`, never types stored data: `FusekiStore` is a dataset class, not a shape, so nothing is written under the namespace. The prefix key (`lincd-fuseki`) and the `ontologies/fuseki` module are unchanged. Code that hard-codes `http://lincd.org/ont/lincd-fuseki/` must be updated.

A dataset synced by an older release may still hold a stale `https://linked.cm/shape/fuseki/FusekiStore` shape description (from when `FusekiStore` was a shape) whose `sh:targetClass` is the old IRI. Boot sync no longer prunes shapes that are not in code, so it stays until removed; it describes nothing and nothing reads it.
