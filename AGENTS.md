# Ecommerce Inventory API

## Project Shape

- TypeScript Node.js API using Express 5 and PostgreSQL via `pg`.
- Runtime entrypoint: [src/server.ts](src/server.ts). It checks the database connection before listening.
- Express setup and global middleware live in [src/app.ts](src/app.ts).
- Keep feature code separated into `routes`, `controllers`, `services`, `repositories`, `validations`, and `types` under [src](src).
- Shared error and response utilities are in [src/utils](src/utils); database and environment configuration are in [src/config](src/config).

## Commands

```text
npm ci
npm run dev
npm run build
npm start
```

- `npm run dev` starts `src/server.ts` with `ts-node-dev`.
- `npm run build` is the type-check and production compilation check; output goes to `dist/`.
- There is currently no test script in `package.json`.

## TypeScript And Imports

- Follow strict TypeScript settings in [tsconfig.json](tsconfig.json), including NodeNext modules.
- Use explicit `.js` extensions in relative imports, even when the source file is `.ts`.
- Preserve the existing ESM style and avoid weakening compiler strictness to resolve local type errors.

## API Conventions

- Wrap async controllers with `catchAsync` from [src/utils/catchAsync.ts](src/utils/catchAsync.ts).
- Use `AppError` from [src/utils/appError.ts](src/utils/appError.ts) for expected HTTP failures so the global handler can map the status code.
- Use `sendResponse` from [src/utils/sendResponse.ts](src/utils/sendResponse.ts) for successful endpoint responses. Keep its `success`, `message`, `meta`, and `data` envelope consistent.
- Validate request input with `validate` from [src/middlewares/validate.ts](src/middlewares/validate.ts); schemas receive `body`, `query`, and `params`.
- Register new routes in the app/router composition rather than calling repositories directly from route handlers.
- The validation middleware currently parses for validation but does not assign parsed values back to `req`; do not rely on transforms or defaults being present on the request afterward.

## Environment And Database

- Local configuration is loaded from a root `.env` file by [src/config/index.ts](src/config/index.ts).
- Supported variables are `NODE_ENV`, `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
- PostgreSQL must be running and reachable before `npm run dev` or `npm start` can serve requests.
- Never commit `.env` or credentials. Update `.env.example` when adding a required environment variable.

## Verification

- Run `npm run build` after TypeScript changes.
- For endpoint changes, also exercise `/health` and the affected route against a reachable PostgreSQL instance.
- Keep changes focused on the owning layer and avoid unrelated formatting or configuration churn.