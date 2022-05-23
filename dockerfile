FROM denoland/deno:alpine-1.20.6 as base

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache server.ts

CMD ["run","--allow-net", "server.ts"]