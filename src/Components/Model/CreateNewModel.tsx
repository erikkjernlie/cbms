import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FolderStructure from "src/Components/FolderStructure";
import Button from "src/Components/UI/Button/Button";
import SelectComponent from "src/Components/UI/Dropdown/Select";
import TextInput from "src/Components/UI/TextInput/TextInput";
import FileUpload from "src/Routes/NewProjectRoute/NewFMU/FileUpload";
import * as S from "src/Routes/NewProjectRoute/NewProject.style";
import useProjectStore from "src/stores/project/projectStore";

interface Props {
  projectId: string;
}

export default function CreateNewModel(props: Props): React.ReactElement {
  const { projectId } = props;

  const [error, setError] = useState("");
  const [fileSystem, setFileSystem] = useState("fmu");
  const [modelName, setModelName] = useState("");

  const history = useHistory();

  const { creating, createNewModel } = useProjectStore((state) => ({
    creating: state.fetching,
    createNewModel: state.createNewModel,
  }));

  const selectFileSystemHandler = (e: any) => {
    setFileSystem(e.target.value);
  };

  const createModel = (filename: string) => {
    if (modelName.length > 0 && modelName !== "new" && !/\s/.test(modelName)) {
      createNewModel(projectId, modelName, filename, history);
    } else if (modelName === "new") {
      setError("Dashboard name cannot be named new");
    } else if (/\s/.test(modelName)) {
      setError("Dashboard name cannot contain spaces");
    }
  };

  return (
    <div>
      <div>
        <form>
          <S.Title>Create a model</S.Title>
          <S.Columns>
            <S.ColumnLeft>
              <S.SmallText>Choose a name for your model</S.SmallText>
            </S.ColumnLeft>
            <S.ColumnRight>
              <TextInput
                onChange={(e) => {
                  setModelName(e.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                value={modelName}
              />
            </S.ColumnRight>
          </S.Columns>
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
                projectName={projectId}
                modelName={modelName}
                fileSystem={fileSystem}
                createNewProject={false}
                createModel={(filename: string) => createModel(filename)}
              />
            </S.ColumnRight>
          </S.Columns>
          <S.Columns>
            <S.ColumnLeft>
              <S.SmallText>Press the button to create your model</S.SmallText>
            </S.ColumnLeft>
            <S.ColumnRight>
              <Button type="submit" loading={creating} className="MediumBlue">
                Create model
              </Button>
            </S.ColumnRight>
          </S.Columns>{" "}
        </form>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
