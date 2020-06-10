import { useEffect, useState } from "react";
import { getJSONResponse } from "src/utils/util";

import { rootAPI } from "./api";

// sourceURL is on the form /datasourcees/{id}, /processors/{id} or /topics/{id}
export async function getOutputNames(sourceUrl: string) {
  const sourceJSON = await getJSONResponse(rootAPI + sourceUrl);
  return sourceJSON.output_names || [];
}

export async function createDatasource(formData: FormData) {
  const createLink = rootAPI + "/datasources/create";
  return fetch(createLink, {
    method: "POST",
    body: formData
  });
}

export async function stopDatasource(processorId: string) {
  return fetch(rootAPI + "/datasources/" + processorId + "/stop");
}

export async function deleteDatasource(processorId: string) {
  return fetch(rootAPI + "/datasources/" + processorId + "/delete");
}

export async function fetchDatasources() {
  const datasourcesResponse = await getJSONResponse(rootAPI + "/datasources/");
  return datasourcesResponse || [];
}

export async function startDatasource(datasourceID: string) {
  const startLink = rootAPI + "/datasources/" + datasourceID + "/start";
  return fetch(startLink, { credentials: "include" });
}

export async function getAvailableSensors(address: string) {
  return getJSONResponse(rootAPI + "/datasources/" + address + "/format");
}

export async function getAvailableSources() {
  return getJSONResponse(rootAPI + "/datasources/available");
}

export async function subscribeToDatasource(id: string) {
  return fetch(rootAPI + "/datasources/" + id + "/subscribe", {
    credentials: "include"
  });
}

// Datasources as in frontend datasource:
export async function getProjectSources(projectId: string) {
  return getJSONResponse(rootAPI + "/sources/get/" + projectId);
}

export async function deleteProjectSource(
  projectId: string,
  processorId: string
) {
  return getJSONResponse(
    rootAPI + "/sources/" + projectId + "/" + processorId + "/delete"
  );
}

export async function addProjectSource(
  projectId: string,
  processorType: string,
  processorName: string
) {
  const link =
    rootAPI +
    "/sources/" +
    projectId +
    "/" +
    processorType +
    "/" +
    processorName +
    "/new";
  return fetch(link, { credentials: "include" });
}

// TODO: change location
export const useDatasources = () => {
  const [datasources, setDatasources] = useState([] as string[]);
  const [loading, setLoading] = useState(true);

  const fetchDatasources = async () => {
    try {
      setLoading(true);
      const datasourcesResponse = await getJSONResponse(
        rootAPI + "/datasources/"
      );

      const sources =
        (Object.entries(datasourcesResponse).map(source => {
          return source[0];
        }) as string[]) || [];

      setDatasources(sources);
    } catch (error) {
      return error.text;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasources();
  }, []);

  return { datasources, loading };
};
