# Developer Guide

Run the following command to enable requests with Genkit Developer Tools:

Reference: [Genkit - Vertext AI Plugin](https://firebase.google.com/docs/genkit/plugins/vertex-ai#configuration)

```sh
gcloud auth application-default login --project YOUR_PROJECT_ID
```

You can start the local emulator with the following command:

```sh
pnpm start
```

You can test the local environment using the URLs below:

* Hosting: http://localhost:3000
* Emulator Suite: http://localhost:3000
* Genkit Developer Tools: http://localhost:1234

## Dependencies

The main packages used in this project are as follows:

- pnpm
- Genkit
- Firebase
- MUI
- biome

## File Layout

The main directory structure is as follows:

* `hosting/`: Firebase Hosting
* `functions/`: Cloud Functions