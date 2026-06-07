# @\_linked/fuseki

## 2.0.0

### Major Changes

- [#3](https://github.com/linked-cm/fuseki/pull/3) [`ca4caf8`](https://github.com/linked-cm/fuseki/commit/ca4caf8f118ef2d7cd78fa9a19e02163521deb1b) Thanks [@flyon](https://github.com/flyon)! - `FusekiStore` now takes a config object: `new FusekiStore({ name: 'appData', endpoint: '...' })` (was positional args). Also tracks `SparqlStore` → `SparqlDataset` rename in `@_linked/core`.

  Build pipeline is now explicit per-step (`rimraf && build-esm && build-cjs && copy-to-lib && dual-package`) so silent build failures no longer ship empty tarballs.

## 1.0.2

### Patch Changes

- [`cebcac8`](https://github.com/linked-cm/fuseki/commit/cebcac88c5fef826a7c22221cb045710105db61d) - Initial release under the new publishing setup.
