# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine as base

FROM base as builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Use production node environment by default.

WORKDIR /app
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN npm install -g turbo@^2
COPY . .

RUN ls -la /app
RUN turbo prune server --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN npm install -g pnpm@9
RUN pnpm install -r --filter=server --ignore-scripts 
#RUN pnpm add -r ts-node-dev --filter=server

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=server

FROM base as production
WORKDIR /app
ENV NODE_ENV production
RUN npm install -g pnpm@9

COPY --from=installer /app/apps/server/package.json ./apps/server/package.json
COPY --from=installer /app/apps/server/dist ./apps/server/dist
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages

RUN pnpm install -r --filter=server --ignore-scripts 
# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 5001

RUN ls -la apps/server

# Copy the rest of the source files into the image.
# Run the application.
CMD ["node", "apps/server/dist/server.js"]


