import { companies } from "../db.ts";
import { getUser } from "../user/user.ts";
import { Company } from "../db.types.ts";
import { checkDepth } from "../error.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";
export function getCompany(orgId: string, depth: number): Company | null {
  if (!checkDepth(depth)) {
    return null;
    throw new GQLError(
      `Max query depth of ${Deno.env.get("MAX_QUERY_DEPTH")} reached.`
    );
  } else {
    const company = companies.find((c) => c.orgId === orgId);
    if (company) {
      return {
        ...company,
        owners: company.owners.map((owner) => getUser(owner, depth + 1)),
      };
    } else return null;
  }
}
