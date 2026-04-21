Lincd Fuseki Store – Env Vars
=============================

The `FusekiStore` sends SPARQL over HTTP to a Fuseki dataset. Configure it via environment variables (single names per concept).

Base and dataset
- FUSEKI_BASE_URL (required): e.g. `http://localhost:3333` (host) or `http://fuseki:3030` in Docker.
- FUSEKI_DATASET (required): dataset name (e.g. `cn-core`).
- FUSEKI_DEFAULT_GRAPH (optional): graph IRI to target; if unset, factories fall back to `process.env.DATA_ROOT`.

Auth
- FUSEKI_USER (optional): basic auth user.
- FUSEKI_PASSWORD (optional): basic auth password.

Example
```
FUSEKI_BASE_URL=http://localhost:3333
FUSEKI_DATASET=cn-core
FUSEKI_DEFAULT_GRAPH=https://create.now/data
FUSEKI_USER=admin
FUSEKI_PASSWORD=admin
```

Notes
- Inserts/updates are POSTed to `/update`; selects use `/sparql`.
- Trailing slashes in `FUSEKI_BASE_URL` are trimmed automatically; dataset and standard Fuseki paths are appended.
