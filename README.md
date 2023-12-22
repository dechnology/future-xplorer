# TDRI - 創新情境生成工具

This project is built with [Nuxt 3](https://v3.nuxtjs.org) and [Tailwind CSS](https://tailwindcss.com), and can be hosted using docker-compose.

## Prerequisites

### Create a `.env` file

Create a `.env` file in the root of the project with the following content:

```plaintext
IMAGE_NAME=<IMAGE_NAME> # you specify the image name you want to use, local or prebuilt.
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

## GitHub Actions

The GitHub Actions workflow is defined in `.github/workflows/main.yml`, it will build the Docker image, push it to the GitHub Container Registry, and deploy it to the EC2 server.

To use the GitHub Actions, you need to set the following secrets in the repository settings:

- `EC2_HOST`
- `EC2_KEY`
- `MONOGO_PASSWORD`
- `OPENAI_API_KEY`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

## Usage with self-built Docker

### Build the Docker image for Nuxt 3 App

```zsh
docker build -t <IMAGE_NAME> .
```

### Run the Docker compose with the `.env` file

```zsh
docker compose --env-file .env.docker up -d
```

## Usage released Docker registry

We have released the Docker image to the GitHub Container Registry, you set the <IMAGE_NAME> in `.env` to `ghcr.io/eesoymilk/future-xplorer:main` and run the docker-compose:

```zsh
docker compose --env-file .env.docker up -d
```

## Development Server (dev mode)

### Install dependencies

Make sure to install the dependencies:

```zsh
yarn install
```

### Run the development server

Start the development server on `http://localhost:3000`:

```zsh
yarn dev
```

> Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
