import { rootAPI } from "./api";
import { getJSONResponse } from "src/utils/util";
import { EventTriggerParams } from "src/types/datahandling";

export async function deleteEventTrigger(
  projectId: string,
  eventTriggerId: string
) {
  const link =
    rootAPI +
    "/projects/" +
    projectId +
    "/event_triggers/" +
    eventTriggerId +
    "/delete";
  return fetch(link);
}

export async function getEventTriggerList(projectId: string) {
  return getJSONResponse(
    rootAPI + "/projects/" + projectId + "/event_triggers/list"
  );
}

export async function newEventTrigger(
  projectId: string,
  trigger_id: string,
  topic_id: string,
  init_params: EventTriggerParams
) {
  const formData = new FormData();
  formData.append("id", trigger_id);
  formData.append("topic_id", topic_id);
  formData.append("init_params", JSON.stringify(init_params));

  return fetch(rootAPI + "/projects/" + projectId + "/event_triggers/new", {
    method: "POST",
    body: formData
  });
}
