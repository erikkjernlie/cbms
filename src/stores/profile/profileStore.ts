import cloneDeep from "lodash.clonedeep";
import {
  createProfile,
  deleteProjectFromUserProfile,
  getUserProfile,
} from "src/backendAPI/profile";
import { Profile } from "src/types/project";
import create from "zustand";

const [useProfileStore] = create((set, get) => ({
  profile: {} as Profile,
  fetchingProfile: false,
  profileError: "",
  numberOfUsers: 0,

  getProfile: async (email: string) => {
    if (email !== null) {
      set({
        fetchingProfile: true,
      });
      getUserProfile(email)
        .then((data: any) => {
          set({
            profile: data,
          });
        })
        .catch((error) => {
          set({
            error: error.toString(),
          });
        })
        .finally(() => {
          set({
            fetchingProfile: false,
          });
        });
    }
  },
  removeProjectFromProfile: async (email: string, project: string) => {
    set({ fetchingProfile: true });
    deleteProjectFromUserProfile(email, project)
      .then(() => {
        const projects = get().profile.projects.filter(
          (p: string) => p !== project
        );
        const b = cloneDeep(get().profile) as Profile;
        b.projects = projects;
        set({
          profile: b,
        });
      })
      .finally(() =>
        set({
          fetchingProfile: false,
        })
      );
  },
  resetProfile: () => {
    set({
      profile: {} as Profile,
    });
  },
  createProfile: async (email: string, profile: Profile) => {
    set({
      fetchingProfile: true,
    });

    createProfile(email, profile)
      .then(() => {
        set({
          profile: profile,
        });
      })
      .catch((error) => {
        set({
          error: error.toString(),
        });
      })
      .finally(() => {
        set({
          fetchingProfile: false,
        });
      });
  },
}));

export default useProfileStore;
