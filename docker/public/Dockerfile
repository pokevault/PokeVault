FROM node:21-alpine3.18 AS build-env
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN pnpm i
RUN pnpm build
RUN pnpm prune --prod

FROM build-env
WORKDIR /app/build
CMD [ "node", "." ]