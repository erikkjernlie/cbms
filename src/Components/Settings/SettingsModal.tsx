import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import Modal from "react-modal";
import * as T from "src/Components/Navigation/Navbar/Navbar.style";
import { Button } from "src/Components/UI/Button/Button.style";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";

import * as S from "../Dashboard/Tile/Tile.style";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  projectId: string;
  dashboardId: string;
  tile: TileFormat;
  children?: React.ReactNode;
}

const SettingsModal = (props: Props) => {
  const { projectId, dashboardId, tile, children } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <React.Fragment>
      <S.Menu onClick={() => setModalIsOpen(true)}>
        <IoMdMenu size={"1.6em"} />
      </S.Menu>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="SettingsModal"
        contentLabel="Historical data"
      >
        <T.UserHeader>
          <T.NumberCircle>P</T.NumberCircle> Plot Settings: {tile.name}
        </T.UserHeader>
        <T.UserBody>
          {children}
          <S.Align className="Center">
            <Button
              className="Grey"
              onClick={() => {
                closeModal();
              }}
            >
              Close
            </Button>
            <Button
              className="Red"
              onClick={() => {
                deleteTile(projectId, dashboardId, tile);
              }}
            >
              Delete plot
            </Button>
          </S.Align>
        </T.UserBody>
      </Modal>
    </React.Fragment>
  );
};

export default SettingsModal;
