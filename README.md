# TDRI - 未來情境探索輔助工具

This project is build with [Nuxt 3](https://v3.nuxtjs.org) and [Tailwind CSS](https://tailwindcss.com).

## Prerequisites

### Create a `.env` file

Create a `.env` file in the root of the project with the following content:

```bash
IMAGE_NAME=<IMAGE_NAME>
MONGO_USER=<MONGO_USER>
MONGO_PASSWORD=<MONGO_PASSWORD>
MONGO_HOST=<MONGO_HOST>
MONGO_PORT=<MONGO_PORT>
MONGO_DB=<MONGO_DB>
OPENAI_API_KEY=<OPENAI_API_KEY>

S3_DOMAIN=<S3_DOMAIN>
S3_ACCESS_KEY_ID=<S3_ACCESS_KEY_ID>
S3_SECRET_ACCESS_KEY=<S3_SECRET_ACCESS_KEY>
```

## Usage with Docker

### Build the Docker image for Nuxt 3 App

```bash
docker build -t <IMAGE_NAME> .
```

### Run the Docker compose with the `.env` file

```bash
docker compose --env-file .env.docker up -d
```

## Development Server

### Install dependencies

Make sure to install the dependencies:

```bash
yarn install
```

### Run the development server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
