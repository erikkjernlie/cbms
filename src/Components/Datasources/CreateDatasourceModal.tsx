import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";
import * as S from "src/Components/Dashboard/Tile/Tile.style";
import Button from "src/Components/UI/Button/Button";

import CreateDatasource from "../../Routes/NewProjectRoute/NewDatasource/CreateDatasource";

Modal.setAppElement("body");

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  projectId: string;
}

const customStyles = {
  content: {
    backgroundColor: "white",
    margin: "0px",
    width: "70%",
    left: "15%",
    border: "1px solid #ccc",
    boxShadow: "1px 1px 1px black",
    padding: "0px",
    top: "20%",
    transition: "all 1s ease-out",
  },
};

export default function CreateDatasourceModal(props: Props) {
  const { isOpen, toggleModal, projectId } = props;

  const [createdDatasource, setCreatedDatasource] = useState("");

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        style={customStyles}
        contentLabel="AddDatasource"
      >
        <S.PlotConfig>
          <S.RightCorner onClick={toggleModal}>
            <MdClose />
          </S.RightCorner>
          <S.ModalMainHeader>Create New Datasource</S.ModalMainHeader>
          <CreateDatasource
            setCreatedDatasource={(created: string) =>
              setCreatedDatasource(created)
            }
            projectId={projectId}
            toggleModal={toggleModal}
          />
        </S.PlotConfig>
      </Modal>
    </div>
  );
}
