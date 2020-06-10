import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import FolderStructure from "src/Components/FolderStructure";
import Button from "src/Components/UI/Button/Button";
import SelectComponent from "src/Components/UI/Dropdown/Select";
import TextInput from "src/Components/UI/TextInput/TextInput";
import UserContext from "src/context/UserContext";
import useProfileStore from "src/stores/profile/profileStore";
import useProjectStore from "src/stores/project/projectStore";
import { ID } from "src/utils/util";

import CreateDatasource from "./NewDatasource/CreateDatasource";
import UseExistingDatasource from "./NewDatasource/UseExistingDatasource";
import FileUpload from "./NewFMU/FileUpload";
import * as S from "./NewProject.style";

export default function NewProject() {
  const [projectName, setProjectName] = useState("project_" + ID());
  const [createNewDatasource, setCreateNewDatasource] = useState(true);
  const [useExistingDatasource, setUseExistingDatasource] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addDatasource, setAddDatasource] = useState(false);
  const [addModel, setAddModel] = useState(false);
  const [fileSystem, setFileSystem] = useState("fmu");
  const [datasource, setDataSource] = useState("");
  const [createdDatasource, setCreatedDatasource] = useState("");
  const [createdProject, setCreatedProject] = useState(false);
  const [createdModel, setCreatedModel] = useState(false);
  const [creating, setCreating] = useState(false);

  const history = useHistory();
  const { user, profile } = useContext(UserContext);

  const { saveProject, fetching, createNewModel } = useProjectStore(
    (state) => ({
      saveProject: state.saveProject,
      fetching: state.fetching,
      createNewModel: state.createNewModel,
    })
  );

  const getProfile = useProfileStore((state) => state.getProfile);

  useEffect(() => {
    if (createdModel) {
      toast.info(
        () => (
          <div>
            <div>Model Created</div>
            <Button>OK</Button>
          </div>
        ),
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    }
  }, [createdModel]);

  const selectFileSystemHandler = (e: any) => {
    setFileSystem(e.target.value);
  };

  const createModel = (filename: string) => {
    if (
      projectName.length > 0 &&
      projectName !== "new" &&
      !/\s/.test(projectName)
    ) {
      createNewModel(projectName, filename.split(".")[0], filename, history);
      setCreatedModel(true);
    }
  };

  return (
    <div>
      <S.Container>
        <S.Title>Create Project</S.Title>
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            if (projectName.length > 0) {
              if (user && user.email) {
                if (
                  profile &&
                  profile.projects &&
                  profile.projects.length >= 10
                ) {
                  toast.info(
                    "You have reached the maximum number of projects",
                    {
                      position: toast.POSITION.BOTTOM_CENTER,
                    }
                  );
                } else {
                  setCreating(true);
                  saveProject(user.email, projectName).then(() => {
                    getProfile(user.email).then(() => {
                      // history.push(projectName + "/dashboards/new");
                      setCreatedProject(true);
                      setCreating(false);
                    });
                  });
                }
              }
            }
          }}
        >
          <S.Columns>
            <S.ColumnLeft>Choose a name for your project:</S.ColumnLeft>
            <S.ColumnRight>
              <TextInput
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name..."
                value={projectName}
                disabled={createdProject}
              />
              <S.SubDescription>
                This is the name of your project and it cannot be changed later.
              </S.SubDescription>
              <Button
                className="MediumBlue"
                disabled={createdProject}
                onClick={() => {
                  if (user && user.email && projectName.length > 0) {
                    if (
                      profile &&
                      profile.projects &&
                      profile.projects.length >= 10
                    ) {
                      toast.info(
                        "You have reached the maximum number of projects",
                        {
                          position: toast.POSITION.BOTTOM_CENTER,
                        }
                      );
                    } else {
                      setCreating(true);
                      saveProject(user.email, projectName).then(() => {
                        getProfile(user.email).then(() => {
                          // history.push(projectName + "/dashboards/new");
                          setCreatedProject(true);
                          setCreating(false);
                        });
                      });
                    }
                  }
                }}
                loading={creating}
              >
                {createdProject ? "Created project" : "Create project"}
              </Button>
            </S.ColumnRight>
          </S.Columns>
        </form>
      </S.Container>
      {createdProject && (
        <S.Columns>
          <S.ColumnLeft>
            <S.SmallText>
              Do you want to add a 3D-model or set up a datasource?
            </S.SmallText>
          </S.ColumnLeft>
          <S.ColumnRight>
            <div style={{ display: "flex" }}>
              <Button
                className="Black"
                onClick={() => setAddDatasource(!addDatasource)}
              >
                Add datasource
              </Button>
              <Button className="Black" onClick={() => setAddModel(!addModel)}>
                Add model
              </Button>
              <Button
                className="Blue"
                loading={saving}
                onClick={() => {
                  if (user !== undefined) {
                    // TODO: choose something else here than testrig for the model
                    // TODO: write "no-added-model" if no model
                    history.push(projectName + "/dashboards/new");
                  }
                }}
              >
                Configure later.
              </Button>
            </div>
          </S.ColumnRight>
        </S.Columns>
      )}

      {createdProject && addDatasource && (
        <div>
          <S.Bar>
            <S.BarLine />
          </S.Bar>

          <S.Columns>
            <S.ColumnLeft>
              <div>
                <S.SmallText>
                  Choose between creating a new datasource or use an existing
                  one
                </S.SmallText>
              </div>
              <div>
                {datasource && (
                  <S.SmallText>Selected source: {datasource}</S.SmallText>
                )}
              </div>
            </S.ColumnLeft>
            <S.ColumnRight>
              <S.Flex>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setCreateNewDatasource(true);
                    setUseExistingDatasource(false);
                  }}
                  className="Simple"
                  selected={createNewDatasource}
                >
                  Create new datasource
                </Button>
                <Button
                  onClick={() => {
                    setUseExistingDatasource(true);
                    setCreateNewDatasource(false);
                  }}
                  className="Simple"
                  selected={!createNewDatasource}
                >
                  Use existing datasource
                </Button>
              </S.Flex>
            </S.ColumnRight>
          </S.Columns>
        </div>
      )}
      {addDatasource && (
        <React.Fragment>
          {createNewDatasource && (
            <CreateDatasource
              setCreatedDatasource={(source: string) =>
                setCreatedDatasource(source)
              }
              projectId={projectName}
            />
          )}
          {useExistingDatasource && (
            <div>
              <UseExistingDatasource
                setDataSource={(source: string) => setCreatedDatasource(source)}
              />
              {datasource && <div>Selected source: {datasource}</div>}
            </div>
          )}
        </React.Fragment>
      )}

      {createdProject && addModel && !createdModel && (
        <S.Columns>
          <S.ColumnLeft>
            {fileSystem === "fmu" && (
              <S.FMUFormat>
                <S.SmallText>FMU-format:</S.SmallText>
                <FolderStructure />
              </S.FMUFormat>
            )}
            {fileSystem === "fmm" && (
              <S.FMUFormat>
                <S.SmallText>First upload FMM-files</S.SmallText>
                <S.SmallText>Then upload corresponding FTL files</S.SmallText>
              </S.FMUFormat>
            )}
          </S.ColumnLeft>
          <S.ColumnRight>
            <SelectComponent onChange={(e) => selectFileSystemHandler(e)}>
              <option value="fmu">FMU</option>
              <option value="fmm">FMM</option>
            </SelectComponent>
            <S.SubDescription>Select file type</S.SubDescription>
            <FileUpload
              createNewProject={true}
              projectName={projectName}
              modelName={projectName}
              fileSystem={fileSystem}
              createModel={(filename: string) => createModel(filename)}
            />
          </S.ColumnRight>
        </S.Columns>
      )}
      {createdProject && (addDatasource || addModel) && (
        <S.Columns>
          <S.ColumnLeft>
            <S.SmallText>or choose to continue to project</S.SmallText>
          </S.ColumnLeft>

          <S.ColumnRight>
            <Button
              className="Blue"
              loading={saving}
              onClick={() => {
                if (user !== undefined) {
                  // TODO: choose something else here than testrig for the model
                  // TODO: write "no-added-model" if no model
                  history.push(projectName + "/dashboards/new");
                }
              }}
            >
              Create project
            </Button>
          </S.ColumnRight>
        </S.Columns>
      )}
    </div>
  );
}
