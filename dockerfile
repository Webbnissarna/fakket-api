FROM denoland/deno:alpine-1.20.6 as deps
WORKDIR /app
USER deno
COPY deps.ts .
RUN deno cache deps.ts

FROM denoland/deno:alpine-1.23.2 as app
WORKDIR /app
USER deno
COPY . .
RUN deno cache server.ts

FROM lukechannings/deno:v1.23.2 as develop
WORKDIR /app
RUN deno install -qAf --unstable https://deno.land/x/denon/denon.ts
USER deno
COPY --from=deps --chown=deno:deno /deno-dir/ /deno-dir/
COPY --from=app --chown=deno:deno /deno-dir/ /deno-dir/
COPY --from=app --chown=deno:deno /app/ /app/
EXPOSE 8080
ENTRYPOINT [ "denon" ]
CMD ["run","--allow-net", "server.ts"]

FROM denoland/deno:alpine-1.23.2 as runner
WORKDIR /app
USER deno
COPY --from=deps /deno-dir/ /deno-dir/
COPY --from=app /deno-dir/ /deno-dir/
COPY --from=app /app/ /app/
EXPOSE 8080
CMD ["run","--allow-net", "server.ts"]
