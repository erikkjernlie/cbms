import { getJSONResponse } from "src/utils/util";
import { rootAPI } from "./api";

export async function fetchBlueprints() {
  return getJSONResponse(rootAPI + "/blueprints/");
}

export async function fetchBlueprint(blueprintID: string) {
  return getJSONResponse(rootAPI + "/blueprints/" + blueprintID);
}
