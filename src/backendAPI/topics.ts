import { getJSONResponse } from "src/utils/util";

import { rootAPI } from "./api";

export async function fetchTopics() {
  return getJSONResponse(rootAPI + "/topics/");
}

export async function subscribeToSource(sourceId: string) {
  return fetch(rootAPI + "/topics/" + sourceId + "/subscribe", {
    credentials: "include",
  });
}

export async function unSubscribeSource(sourceId: string) {
  return fetch(rootAPI + "/topics/" + sourceId + "/unsubscribe", {
    credentials: "include",
  });
}
