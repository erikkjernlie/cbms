import axios from "axios";
import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { rootAPI } from "src/backendAPI/api";
import Morph from "src/Components/Animations/Morph";
import Progress from "src/Components/Animations/Progress";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";
import UserContext from "src/context/UserContext";
import useProjectStore from "src/stores/project/projectStore";

import * as S from "../NewProject.style";

import "src/utils/styles/styles.css";

interface Props {
  projectName: string;
  fileSystem: string;
  createNewProject: boolean;
  modelName: string;
  createModel: (filename: string) => void;
}

export default function FileUpload(props: Props) {
  const {
    projectName,
    fileSystem,
    createNewProject,
    modelName,
    createModel,
  } = props;

  const [error, setError] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  const [startedCreatingProject, setStartedCreatingProject] = useState(false);
  const [uploadFmmOrFmuPercentage, setUploadFmmOrFmuPercentage] = useState(0);
  const [uploadFtlFilesPercentage, setUploadFtlFilesPercentage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState("");

  const { user, profile } = useContext(UserContext);
  const history = useHistory();

  const saveProject = useProjectStore((state) => state.saveProject);

  async function uploadFTLfiles(event: any) {
    setLoading(true);

    const URL = rootAPI + "/project/ftlFiles";
    const formData = new FormData();

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append("file" + i, event.target.files[i]);
    }

    axios
      .post(URL, formData, {
        headers: {
          projectName: projectName,
          fileName: fileName,
          fileType: fileType,
        },
        onUploadProgress: (progressEvent: any) => {
          setUploadFtlFilesPercentage(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      })
      .then(() => {
        setLoading(false);
        setDatabaseLoading(true);
        createModel(fileName + "." + fileType);
      })
      .catch((err) => console.warn(err));
  }

  async function uploadFmmOrFmuFile(event: any) {
    setLoading(true);
    setStartedCreatingProject(true);
    const createLink = rootAPI + "/models/upload";
    event.preventDefault();
    let file = event.target.files[0];
    setFileName(file.name.split(".")[0]);
    setFileType(file.name.split(".")[1]);
    const formData = new FormData();

    formData.append("file", file);
    formData.append("modelName", modelName);

    axios
      .post(createLink, formData, {
        headers: {
          projectName: projectName,
          fileName: fileName,
          modelName: modelName,
          fileType: fileType,
        },
        onUploadProgress: (progressEvent) => {
          setUploadFmmOrFmuPercentage(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      })
      .then(() => {
        setLoading(true);
        if (file.name.split(".")[1] === "fmu") {
          setDatabaseLoading(true);
          createModel(file.name);
        }
      })
      .catch((err) => {
        setError(err.text);
        console.warn(err);
      });
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="FileUploadModal"
        contentLabel="Add new"
      >
        {data && (
          <iframe srcDoc={data} width="100%" height="100%" frameBorder="0" />
        )}
      </Modal>

      {loading && <Progress value={uploadFmmOrFmuPercentage} />}
      <div>
        {fileSystem === "fmm" && (
          <div>
            <TextInput
              type="file"
              accept=".fmm"
              id="fmm"
              name="Choose File"
              onChange={(event) => uploadFmmOrFmuFile(event)}
            />
            <S.SubDescription>Upload FMM file</S.SubDescription>
          </div>
        )}
        {fileSystem === "fmu" && (
          <div>
            <S.UploadFile>
              <TextInput
                type="file"
                accept=".fmu,.zip"
                id="fmu"
                name="Choose File"
                onChange={(event) => uploadFmmOrFmuFile(event)}
              />
            </S.UploadFile>
            <S.SubDescription>Upload FMU file</S.SubDescription>
          </div>
        )}
        {error &&
          toast.error(
            () => (
              <div>
                <div>{error}</div>
                <Button onClick={() => setError("")}>OK</Button>
              </div>
            ),
            {
              position: toast.POSITION.BOTTOM_CENTER,
            }
          )}
        {loading && uploadFmmOrFmuPercentage === 100 && (
          <S.Generating>
            <Morph></Morph>
            <S.SubDescription>Generating your 3D files...</S.SubDescription>
          </S.Generating>
        )}
      </div>
      <div style={{ marginTop: "20px" }}></div>
      {fileSystem === "fmm" && (
        <div>
          <div>Choose FTL files</div>
          <TextInput
            type="file"
            accept=".ftl"
            id="fmu"
            name="Chooe FTL files"
            multiple
            onChange={(event) => uploadFTLfiles(event)}
          />
          {loading && (
            <progress value={uploadFtlFilesPercentage} max="100"></progress>
          )}
          {loading && uploadFtlFilesPercentage === 100 && (
            <div>GENERATING FILES</div>
          )}
        </div>
      )}
      {databaseLoading && (
        <div>Saving your project. You will be redirected shortly</div>
      )}
    </div>
  );
}
