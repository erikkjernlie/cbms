import axios from "axios";
import React, { useState } from "react";
import { rootAPI } from "src/backendAPI/api";
import Progress from "src/Components/Animations/Progress";
import TextInput from "src/Components/UI/TextInput/TextInput";
import { TileFormat } from "src/types/datahandling";

interface Props {
  tile?: TileFormat;
  setTile?: (tile: TileFormat) => void;
  type?: string;
  setFilename?: (filename: string) => void;
  projectId: string;
  onlyCSV?: boolean;
}

export const FileUploader = (props: Props) => {
  const { tile, setTile, type, projectId, setFilename, onlyCSV } = props;

  const [loading, setLoading] = useState(false);
  const [uploadFilePercentage, setUploadFilePercentage] = useState(0);

  const uploadFile = (e: any) => {
    setLoading(true);
    const createLink = rootAPI + "/project/datafile";
    e.preventDefault();

    let file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    if (type) {
      formData.append("type", type);
    } else {
      formData.append("type", "none");
    }
    axios
      .post(createLink, formData, {
        headers: {
          projectName: projectId,
          fileName: file.name.split(".")[0],
          fileType: file.name.split(".")[1]
        },
        onUploadProgress: (progressEvent: any) => {
          setUploadFilePercentage(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        }
      })
      .then((resp: any) => {
        if (setFilename) {
          setFilename(file.name);
        }
        if (tile && setTile) {
          setTile({
            ...tile,
            fill: file.name
          });
        }
      });
  };

  return (
    <div>
      {loading && <Progress value={uploadFilePercentage} />}
      {onlyCSV ? (
        <TextInput
          type="file"
          accept=".csv"
          id="file"
          name="Choose File"
          onChange={uploadFile}
        />
      ) : (
        <TextInput
          type="file"
          accept=".csv, .xlsx"
          id="file"
          name="Choose File"
          onChange={uploadFile}
        />
      )}
    </div>
  );
};
