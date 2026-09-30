---
'@_linked/fuseki': patch
---

Add `shapes/index`, the side-effect-only module that registers this package's shapes, so `import '@_linked/fuseki/shapes/index'` resolves like it does for every other linked package. The package defines no shapes today (`FusekiStore` is a dataset, not a `@linkedShape`), so it registers only the ontology.
