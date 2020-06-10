import React, { useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import Modal from "react-modal";
import Model from "src/Components/Model/Model";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import modalStyle from "src/utils/styles/styles";

import * as S from "../Tile.style";

Modal.setAppElement("body");

interface Props {
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
}

const ModelTile = React.memo((props: Props) => {
  const { tile, dashboardId, projectId } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <S.ModelPlotComponent id={"sensor" + tile.id}>
      <S.Header>
        <S.HeaderLeft>
          <S.Handler className="Handler">
            <FaGripVertical size={"1.2em"} />
          </S.Handler>
          <S.PlotName>{tile.name}</S.PlotName>
        </S.HeaderLeft>
        <S.HeaderRight>
          <S.Menu onClick={() => setModalIsOpen(true)}>
            <IoMdMenu size={"1.6em"} />
          </S.Menu>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={modalStyle}
            contentLabel="Historical data"
          >
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
          </Modal>
        </S.HeaderRight>
      </S.Header>
      <S.Model>
        <Model
          modelId={tile.type}
          projectId={projectId}
          insidePlotComponent={true}
        />
      </S.Model>
    </S.ModelPlotComponent>
  );
});
export default ModelTile;
