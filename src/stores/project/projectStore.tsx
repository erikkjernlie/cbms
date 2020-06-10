import cloneDeep from "lodash.clonedeep";
import React from "react";
import { toast } from "react-toastify";
import {
  addChannelToTile,
  createDashboard,
  createModel,
  createProject,
  createTile,
  deleteDashboard,
  deleteModel,
  deleteTile,
  getDashboard,
  getDataFromProject,
  getDataFromProjects,
  getModel,
  removeChannelFromTile,
} from "src/backendAPI/project";
import { Button } from "src/Components/UI/Button/Button.style";
import { INotification, TileFormat } from "src/types/datahandling";
import { ProjectData, ProjectInfo } from "src/types/project";
import create from "zustand";

const [useProjectStore] = create((set, get) => ({
  fetching: true,
  project: "",
  projects: [],
  projectInfo: [] as ProjectInfo[],
  currentModel: {},
  deletingTile: false,
  projectData: null,
  tiles: [] as TileFormat[],
  tileData: [],
  subscriptions: [],
  models: [],
  notifications: [] as INotification[],
  dashboards: [],
  numberOfProjects: 0,
  setProject: (projectId: string) => {
    set({
      project: projectId,
    });
  },
  resetProjectInfo: () => {
    set({
      projectInfo: [],
    });
  },

  deleteModel: async (projectId: string, model: string, history: any) => {
    set({
      fetching: true,
    });
    return deleteModel(projectId, model).then(() => {
      let index = get().models.indexOf(model);
      let newModels = get().models.filter((d: string) => d !== model);
      if (index < newModels.length) {
        localStorage.setItem(projectId + "/models", newModels[index]);
        history.push("/" + projectId + "/models/" + newModels[index]);
      } else if (newModels.length > 0) {
        let length = newModels.length;
        localStorage.setItem(projectId + "/models", newModels[length - 1]);
        history.push("/" + projectId + "/models/" + newModels[length - 1]);
      } else {
        localStorage.setItem(projectId + "/models", "new");
        history.push("/" + projectId + "/models/new");
      }
      set({
        models: newModels,
        fetching: false,
      });
    });
  },
  createNewModel: async (
    projectId: string,
    model: string,
    filename: string,
    history: any
  ) => {
    set({
      fetching: true,
    });
    createModel(projectId, model, filename)
      .then(() => {
        const newModels = get().models.concat(model).sort();
        set({
          models: newModels,
        });

        if (filename.split(".")[1] === "fmu") {
          localStorage.setItem(projectId + "/subNavbar", "models");
          localStorage.setItem(projectId + "/models", model);
          history.push("/" + projectId + "/models/" + model);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        set({
          fetching: false,
        });
      });
  },

  addChannel: async (
    projectId: string,
    dashboardId: string,
    tileId: string,
    channel: string
  ) => {
    addChannelToTile(projectId, dashboardId, tileId, channel);
  },
  removeChannel: async (
    projectId: string,
    dashboardId: string,
    tileId: string,
    channel: string
  ) => {
    removeChannelFromTile(projectId, dashboardId, tileId, channel);
  },
  createNewTile: async (
    projectId: string,
    dashboard: string,
    tile: TileFormat
  ) => {
    set({
      fetching: true,
    });
    let id = "";

    const newTile = cloneDeep(tile) as any;
    if (newTile.channels) {
      newTile.channels = newTile.channels.map((channel: any) =>
        JSON.stringify(channel)
      );
    }
    createTile(projectId, dashboard, newTile)
      .catch((error) => {
        console.log(error);
      })
      .then(async (response: any) => {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse.id) {
          id = jsonResponse.id;
        }
      })
      .finally(() => {
        if (id) {
          tile.id = id;
          const newTiles = get().tiles.concat(tile);

          set({
            tiles: newTiles,
          });
        }
        set({
          fetching: false,
        });
      });
  },
  permanentlyDeleteTile: async (
    project: string,
    dashboard: string,
    tile: TileFormat
  ) => {
    return deleteTile(project, dashboard, tile.id).then(() => {
      const newTiles = get().tiles.filter((p: TileFormat) => p.id !== tile.id);
      set({
        tiles: newTiles,
      });
    });
  },
  deleteTile: async (project: string, dashboard: string, tile: TileFormat) => {
    toast.error(
      () => (
        <div>
          <div>Are you sure you want to delete it?</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              className="BlackWhite"
              onClick={() => {
                set({
                  deletingPlot: true,
                });
                get()
                  .permanentlyDeleteTile(project, dashboard, tile)
                  .catch((error: string) => {
                    toast.error("Could not delete dashboard", {
                      position: toast.POSITION.BOTTOM_CENTER,
                    });
                  })
                  .finally(() => {
                    set({
                      deletingPlot: false,
                    });
                  });
              }}
            >
              {!get().deletingPlot ? "Yes" : "Deleting"}
            </Button>
            <Button onClick={() => {}} className="BlackWhite">
              No
            </Button>
          </div>
        </div>
      ),
      {
        position: toast.POSITION.BOTTOM_CENTER,
      }
    );
  },
  createNewDashboard: async (
    projectId: string,
    dashboard: string,
    history: any
  ) => {
    set({
      fetching: true,
    });
    createDashboard(projectId, dashboard)
      .then(() => {
        set({
          dashboards: get().dashboards.concat(dashboard).sort(),
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        localStorage.setItem(projectId + "/subNavbar", "dashboards");
        localStorage.setItem(projectId + "/dashboards", dashboard);
        history.push("/" + projectId + "/dashboards/" + dashboard);
        set({
          fetching: false,
        });
      });
  },
  permanentlyDeleteDashboard: async (
    project: string,
    dashboard: string,
    history: any
  ) => {
    set({
      fetching: true,
    });
    return deleteDashboard(project, dashboard).then(() => {
      let index = get().dashboards.indexOf(dashboard);
      let newDashboards = get().dashboards.filter(
        (d: string) => d !== dashboard
      );
      if (index < newDashboards.length) {
        localStorage.setItem(project + "/dashboards", newDashboards[index]);
        history.push("/" + project + "/dashboards/" + newDashboards[index]);
      } else if (newDashboards.length > 0) {
        let length = newDashboards.length;
        localStorage.setItem(
          project + "/dashboards",
          newDashboards[length - 1]
        );
        history.push(
          "/" + project + "/dashboards/" + newDashboards[length - 1]
        );
      } else {
        localStorage.setItem(project + "/dashboards", "new");
        history.push("/" + project + "/dashboards/new");
      }
      set({
        dashboards: newDashboards,
        fetching: false,
      });
    });
  },
  addProject: (project: string) => {
    // add from firestore
    const tempProjects = get().projects.concat(project);
    set({
      projects: tempProjects,
    });
  },
  removeProject: (project: string) => {
    // remove from firestore
    const tempProjects = get().projects.filter((p: string) => p !== project);
    set({
      projects: tempProjects,
    });
  },
  setProjects: async (projects: string[]) => {
    set({
      projects: projects,
    });
  },
  saveProject: async (email: string, projectName: string) => {
    if (email) {
      set({ fetching: true });
      return createProject(email, projectName)
        .then(() => {})
        .catch((error: any) => {
          console.log(error);
        })
        .finally(() => {
          set({
            fetching: false,
          });
        });
    }
  },
  getProjectInfo: async () => {
    if (get().projects && get().projects.length !== 0) {
      set({
        fetching: true,
      });
      getDataFromProjects(get().projects)
        .then(async (data: any) => {
          const projectInfo = await data.json();
          set({
            projectInfo: projectInfo,
          });
        })
        .catch((error) => console.log("error", error))
        .finally(() => {
          set({
            fetching: false,
          });
        });
    }
  },
  fetchTiles: async (projectId: string, dashboardId: string) => {
    // remember to check if user has access

    let tileData = [] as TileFormat[];

    getDashboard(projectId, dashboardId)
      .then((rawData: any[]) =>
        rawData.forEach((tile) => {
          let info = [] as any[];

          if (tile.channels) {
            info = tile.channels.map((chnl: any) => {
              return JSON.parse(chnl);
            });
          }
          const plt = {
            id: tile.id,
            name: tile.name,
            type: tile.type,
            fill: tile.fill,
            mode: tile.mode,
            channels: info,
            category: tile.category,
          } as TileFormat;
          tileData.push(plt);
        })
      )
      .catch((error) => {
        set({ tiles: tileData });
      })
      .finally(() => {
        set({
          tiles: tileData,
        });
      });
  },
  fetchModelInformation: async (projectId: string, modelId: string) => {
    // remember to check if user has access

    getModel(projectId, modelId)
      .then((data: any) => {
        set({
          currentModel: data,
        });
      })
      .catch((error) => {
        set({
          currentModel: {},
        });
      })
      .finally(() => {});
  },
  fetchProjectData: async (projectId: string, history: any) => {
    // remember to check if user has access
    set({
      fetching: true,
      dashboards: [],
      notifications: [],
      models: [],
      project: projectId,
    });
    // can check if it exists first here
    const data = await getDataFromProject(projectId);
    const dashboards = data["dashboards"].map((model: any) => model.name);
    const models = data["models"].map((model: any) => model.name);
    const projectData = data["project"] as ProjectData;

    // TODO: we have all the data here, so we do not need to fetch data
    set({
      dashboards: dashboards,
      models: models,
      projectData: projectData,
      fetching: false,
    });
  },
}));

export default useProjectStore;
