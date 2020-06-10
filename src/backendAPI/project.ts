import { TileFormat } from "src/types/datahandling";
import { getJSONResponse } from "src/utils/util";

import { rootAPI } from "./api";

export async function createProject(email: string, projectName: string) {
  let formData = new FormData();
  formData.append("email", email);
  formData.append("date", new Date().toString());
  formData.append("projectName", projectName);
  return fetch(rootAPI + "/projects/new", {
    method: "POST",
    body: formData,
  });
}

export async function fetchProject() {
  return getJSONResponse(rootAPI + "/project/new");
}

export async function getDataFromProjects(projects: string[]) {
  let formData = new FormData();
  projects.forEach((project) => formData.append("project", project));
  return fetch(rootAPI + "/projects/", {
    method: "POST",
    body: formData,
  });
}

export async function getAllProjects(project: string) {
  return getJSONResponse(rootAPI + "/projects/all/" + project);
}

export async function getDataFromProject(project: string) {
  return getJSONResponse(rootAPI + "/project/" + project);
}

export async function getDashboard(project: string, dashboard: string) {
  return getJSONResponse(
    rootAPI + "/project/" + project + "/dashboards/" + dashboard
  );
}

export async function getModel(project: string, model: string) {
  return getJSONResponse(rootAPI + "/project/" + project + "/models/" + model);
}

export async function createDashboard(project: string, dashboard: string) {
  let formData = new FormData();
  formData.append("dashboard", dashboard);
  return fetch(rootAPI + "/projects/" + project + "/dashboards/new", {
    method: "POST",
    body: formData,
  });
}

export async function createModel(
  project: string,
  model: string,
  filename: string
) {
  let formData = new FormData();
  formData.append("model", model);
  formData.append("filename", filename);
  return fetch(rootAPI + "/projects/" + project + "/models/new", {
    method: "POST",
    body: formData,
  });
}

export async function addChannelToTile(
  project: string,
  dashboard: string,
  tile: string,
  channel: string
) {
  let formData = new FormData();
  formData.append("channel", channel);
  return fetch(
    rootAPI +
      "/projects/" +
      project +
      "/dashboards/" +
      dashboard +
      "/tiles/" +
      tile +
      "/channels/new",
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function removeChannelFromTile(
  project: string,
  dashboard: string,
  tile: string,
  channel: string
) {
  let formData = new FormData();
  formData.append("channel", channel);
  return fetch(
    rootAPI +
      "/projects/" +
      project +
      "/dashboards/" +
      dashboard +
      "/tiles/" +
      tile +
      "/channels/delete",
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function deleteDashboard(project: string, dashboard: string) {
  return fetch(
    rootAPI + "/projects/" + project + "/dashboards/" + dashboard + "/delete"
  );
}

export async function deleteModel(project: string, model: string) {
  return fetch(
    rootAPI + "/projects/" + project + "/models/" + model + "/delete"
  );
}

export async function deleteTile(
  project: string,
  dashboard: string,
  tile: string
) {
  return fetch(
    rootAPI +
      "/projects/" +
      project +
      "/dashboards/" +
      dashboard +
      "/tiles/" +
      tile +
      "/delete"
  );
}

export async function createTile(
  project: string,
  dashboard: string,
  tile: TileFormat
) {
  return fetch(
    rootAPI + "/projects/" + project + "/dashboards/" + dashboard + "/tile/new",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tile),
    }
  );
}
