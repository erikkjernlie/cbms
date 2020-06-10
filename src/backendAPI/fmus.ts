import { getJSONResponse } from "src/utils/util";
import { rootAPI } from "./api";

export async function fetchFMUs() {
  return getJSONResponse(rootAPI + "/fmus/");
}
