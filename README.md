# taggr

Rediscover your memories while keeping your privacy.

Powered by machine learning.

## Architecture

Main structure separated between UI and backend. 

The UI follow an unidirectional dataflow pattern with React and a reactive uiStore. The UI fires ACTION which trigger processes in the backend, which modifies the uiStore and the App store.

### Stores

The app storage is divided in two parts, UI and backend. The UI store is reactive.

### Stores

Backend tasks are manages using queues, to present race conditions and allowing users to reset queues.
