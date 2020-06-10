import { Source } from "src/types/datasource";
import { getJSONResponse } from "src/utils/util";

import { rootAPI } from "./api";

export async function getFFTFromDatasource(
  topicId: string,
  channelId: number,
  now: number,
  duration: number,
  sample_spacing: string
) {
  const link =
    rootAPI +
    "/fft/" +
    topicId +
    "/" +
    channelId +
    "/" +
    (now - duration) +
    "/" +
    now +
    "/" +
    parseFloat(sample_spacing);
  return getJSONResponse(link);
}

export async function getFFTFromFile(
  projectId: string,
  file: string,
  spacing: string
) {
  const link =
    rootAPI + "/fft/file/" + projectId + "/" + file + "/" + parseFloat(spacing);
  return getJSONResponse(link);
}

export async function getSprectrogramFromDatasource(
  topicId: string,
  mode: string,
  channels: Source[]
) {
  const link = rootAPI + "/topics/" + topicId + "/spectrogram";
  let formData = new FormData();

  mode && formData.append("start", mode.split("/")[1]);
  mode && formData.append("end", mode.split("/")[0]);
  if (channels && channels.length > 0) {
    channels.forEach((channel: Source) =>
      formData.append("channel_id", channel.channel.id.toString())
    );
  }
  const response = await fetch(link, {
    method: "POST",
    body: formData
  });
  return response.json();
}

export async function getSpectrogramFromFile(
  projectId: string,
  file: string,
  sample: string
) {
  const link =
    rootAPI +
    "/project/spectrogram/file/" +
    projectId +
    "/" +
    file +
    "/" +
    parseFloat(sample);
  return getJSONResponse(link);
}

export async function getHistoricalFromSource(
  topicId: string,
  now: number,
  duration: number
) {
  const link =
    rootAPI +
    "/topics/" +
    topicId +
    "/history?start=" +
    (now - duration) +
    "&end=" +
    now;

  return fetch(link);
}

export async function getHistoricalFromFile(
  projectId: string,
  filename: string
) {
  const link = rootAPI + "/project/datafile/get/" + projectId + "/" + filename;
  return getJSONResponse(link);
}

export async function inspectDataset(projectId: string, filename: string) {
  return fetch(
    rootAPI + "/project/" + projectId + "/files/" + filename + "/inspect"
  );
}
