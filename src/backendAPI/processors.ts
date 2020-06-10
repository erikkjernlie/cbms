import { getJSONResponse } from "src/utils/util";

import { rootAPI } from "./api";

export async function createProcessor(formData: FormData) {
  const createLink = rootAPI + "/processors/create";
  return fetch(createLink, {
    method: "POST",
    body: formData,
  });
}

export async function processorSetInput(
  processorId: string,
  formData: FormData
) {
  const inputLink = rootAPI + "/processors/" + processorId + "/inputs";
  return fetch(inputLink, {
    method: "POST",
    body: formData,
  });
}

export async function processorSetOutput(
  processorId: string,
  formData: FormData
) {
  const outputLink = rootAPI + "/processors/" + processorId + "/outputs";
  return fetch(outputLink, {
    method: "POST",
    body: formData,
  });
}

export async function startProcessorRequest(formData: FormData) {
  return fetch(rootAPI + "/processors/start", {
    method: "POST",
    body: formData,
  });
}

export async function stopProcessor(processorId: string) {
  return fetch(rootAPI + "/processors/" + processorId + "/stop");
}

export async function deleteProcessor(processorId: string) {
  return fetch(rootAPI + "/processors/" + processorId + "/delete");
}

export async function fetchProcessorList() {
  return getJSONResponse(rootAPI + "/processors/");
}

export async function fetchProcessorInformation(processorID: string) {
  return getJSONResponse(rootAPI + "/processors/" + processorID);
}

// Sends request to change inputs or outputs of running process,
// endPoint is either 'inputs' or 'outputs'
export async function editProcessorIOs(
  processorID: string,
  endPoint: string,
  formData: FormData
) {
  const link = rootAPI + "/processors/" + processorID + "/" + endPoint;
  return fetch(link, {
    method: "post",
    body: formData,
  });
}
