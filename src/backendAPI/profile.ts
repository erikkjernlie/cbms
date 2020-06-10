import { Profile } from "src/types/project";
import { getJSONResponse } from "src/utils/util";

import { rootAPI } from "./api";

// profile actions
export async function getUserProfile(email: string) {
  return getJSONResponse(rootAPI + "/profile/" + email);
}

export async function createProfile(email: string, profile: Profile) {
  let formData = new FormData();
  formData.append("firstName", profile.firstName);
  formData.append("lastName", profile.lastName);
  formData.append("occupation", profile.occupation);
  formData.append("phoneNumber", profile.phoneNumber);
  formData.append("email", email);
  return fetch(rootAPI + "/profile/new", {
    method: "POST",
    body: formData,
  });
}

export async function deleteProjectFromUserProfile(
  email: string,
  project: string
) {
  return getJSONResponse(
    rootAPI + "/profile/" + email + "/projects/" + project + "/delete"
  );
}
