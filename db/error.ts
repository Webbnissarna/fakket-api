import { GQLError } from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";
export function checkDepth(depth: number) {
  const maxDepthEnv = Deno.env.get("MAX_QUERY_DEPTH");
  if (maxDepthEnv) {
    const maxDepth = parseInt(maxDepthEnv);
    if (depth >= maxDepth) {
      console.log("max deoth");
      return false;
    }
    return true;
  } else {
    throw new GQLError("No max depth defined");
  }
}
