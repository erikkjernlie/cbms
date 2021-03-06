import * as tf from "@tensorflow/tfjs";
import { csv } from "d3";
import { storage } from "../../firebase";
import "./ProjectSetup.css";

export function uploadData(data, project, progressMethod) {
  let rows_joined = data.map((x) => x.join(","));
  let csvstr = rows_joined.join("\n");
  const csvblob = new Blob([csvstr], { type: "application/vnd.ms-excel" });
  const uploadTaskData = storage.ref(`${project}/data.csv`).put(csvblob);
  uploadTaskData.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      progressMethod(progress);
    },
    (error) => {
      console.log(error);
    }
  );
}

export function uploadConfig(config, project, progressMethod) {
  const configblob = new Blob([JSON.stringify(config)], {
    type: "application/json",
  });
  const uploadTaskConfig = storage
    .ref(`${project}/config.json`)
    .put(configblob);
  // observer for when the state changes, e.g. progress
  uploadTaskConfig.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      progressMethod(progress);
    },
    (error) => {
      console.log(error);
    }
  );
}

export function uploadProcessedConfig(config, project) {
  const configblob = new Blob([JSON.stringify(config)], {
    type: "application/json",
  });
  const uploadTaskConfig = storage
    .ref(`${project}/config_mod.json`)
    .put(configblob);
  // observer for when the state changes, e.g. progress
  uploadTaskConfig.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
    },
    (error) => {
      console.log(error);
    }
  );
}

export async function loadConfig(project, func) {
  const downloadRefConfig = storage.ref(`${project}/config.json`);
  await downloadRefConfig.getDownloadURL().then(async (url) => {
    await fetch(url)
      .then((response) => response.json())
      .then((jsonData) => {
        func(jsonData);
      });
  });
}

export async function loadProcessedConfig(project, func) {
  const downloadRefConfig = storage.ref(`${project}/config_mod.json`);
  await downloadRefConfig.getDownloadURL().then(async (url) => {
    await fetch(url)
      .then((response) => response.json())
      .then((jsonData) => {
        func(jsonData);
      });
  });
}

export async function loadData(project, func) {
  if (project) {
    const downloadRefData = storage.ref(`${project}/data.csv`);
    await downloadRefData.getDownloadURL().then(async (url) => {
      await csv(url).then((data) => {
        func(data);
      });
    });
  }
}

export async function loadCSVData(project) {
  if (project) {
    const downloadRefData = storage.ref(`${project}/data.csv`);
    await downloadRefData.getDownloadURL().then(async (url) => {
      await csv(url).then((data) => {});
    });
  }
}

export async function getTensorflowModel(project, setModel) {
  let model = await tf.loadLayersModel("indexeddb://" + project + "/model");
  setModel(model);
}

export async function fetchProcessedConfig(projectName) {
  if (projectName) {
    const downloadRefConfig = storage.ref(`${projectName}/config_mod.json`);
    return downloadRefConfig.getDownloadURL().then(async (url) => {
      return fetch(url).then((response) => response.json());
    });
  }
}

export async function fetchConfig(projectName) {
  const downloadRefConfig = storage.ref(`${projectName}/config.json`);
  return downloadRefConfig.getDownloadURL().then(async (url) => {
    return fetch(url).then((response) => response.json());
  });
}

export async function fetchModel(projectName) {
  try {
    if (projectName) {
      const model = await tf.loadLayersModel(
        "indexeddb://" + projectName + "/model"
      );
      return model;
    }
  } catch (err) {
    console.error(err);
  } finally {
  }
}

export default uploadConfig;
