---
'@_linked/fuseki': minor
---

The fuseki ontology's prefix label is now `fuseki`, matching its ontologySlug and the `ontologies/fuseki` module (`https://linked.cm/ont/{ontologySlug}/`, with the prefix equal to the slug). It was `lincd-fuseki`. The change covers the `linkedOntology` registration and the `@context` key in `data/fuseki.json`, so prefixed names compact to `fuseki:FusekiStore` and the ontology's exports sit under `fuseki` in the package tree.

No IRI changes: the namespace stays `https://linked.cm/ont/fuseki/`. `lincd-fuseki` is deprecated but still registered as an alias, so `lincd-fuseki:FusekiStore` keeps expanding; it is never emitted. Code that looks the ontology up in the package tree under `lincd-fuseki` must switch to `fuseki`. Stored data under the old IRIs is not migrated; clear dev datasets if any still hold them.
