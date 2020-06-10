import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Morph from "src/Components/Animations/Morph";
import Button from "src/Components/UI/Button/Button";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { FileUploader } from "src/utils/dataHandler/UploadFile";

import "src/utils/styles/styles.css";
import { inspectDataset } from "src/backendAPI/transformations";

Modal.setAppElement("body");

interface Props {
  projectId: string;
}

const InspectData = (props: Props) => {
  const { projectId } = props;

  const [reportData, setReportData] = useState("");

  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  const inspectData = () => {
    setLoading(true);
    inspectDataset(projectId, filename).then((response: any) => {
      response.text().then((text: any) => {
        setLoading(false);
        setReportData(text);
      });
    });
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (filename !== "") {
      inspectData();
    }
  }, [filename]);

  return (
    <React.Fragment>
      <Button onClick={() => setModalIsOpen(true)} className="Black">
        Inspect dataset
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="MagicModal"
        contentLabel="Add new"
      >
        <Q.CenterContent>
          <Q.MediumTitle>
            Upload a dataset with comma-separated values (csv) and watch magic
            happen
          </Q.MediumTitle>
          <Q.Description>
            NB: the first row must contain the name of the sensors
          </Q.Description>
          <FileUploader
            projectId={projectId}
            setFilename={setFilename}
            onlyCSV={true}
          />
          {loading && <Morph></Morph>}
          {loading && <Q.SubDescription>Doing some magic...</Q.SubDescription>}
          {reportData && (
            <iframe
              srcDoc={reportData}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          )}
        </Q.CenterContent>
      </Modal>
    </React.Fragment>
  );
};

export default InspectData;
