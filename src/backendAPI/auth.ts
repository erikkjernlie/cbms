import { rootAPI } from "./api";

export async function fetchAuthCookie() {
  return fetch(rootAPI + "/session", {
    credentials: "include"
  });
}

export async function init() {
  return fetch(rootAPI + "", {
    credentials: "include"
  });
}
