# GLAZE

> This project is under active development

## How to contribute

```shell
pnpm i

pnpm dev

pnpm debug:server
```

A `.env` file is needed to run the project. Put it in the `packages/backend` directory.

```dotenv
DATABASE_URL="postgresql://postgres: @127.0.0.1:5432/postgres?schema=glaze"
JWT_SECRET="hello glaze"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PREFIX="glaze"

# tencent cloud cos
TENCENT_SECRET_ID=
TENCENT_SECRET_KEY=
TENCENT_BUCKET=
TENCENT_REGION=

# domain path
PREVIEW_PATH="preview.localhost"
DEPLOYMENT_PATH="glaze.localhost"
```
