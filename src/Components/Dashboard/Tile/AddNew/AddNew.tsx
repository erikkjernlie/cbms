import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import * as S from "src/Components/Dashboard/Dashboard.style";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import { Source, Topic } from "src/types/datasource";

import AddNewAnalytics from "./Analytics/AddNewAnalytics";
import AddNewModel from "./Model/AddNewModel";
import AddNewRealTime from "./RealTime/AddNewRealTime";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  topics: Topic[];
  projectId: string;
  dashboardId: string;
  tiles: TileFormat[];
}

const AddNew = React.memo((props: Props) => {
  const { topics, projectId, dashboardId, tiles } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [route, setRoute] = useState("real-time");
  const [error, setError] = useState("");
  const [tile, setTile] = useState({} as TileFormat);
  const [selectValue, setSelectValue] = useState({} as Topic);

  const { createNewTile } = useProjectStore((state) => ({
    createNewTile: state.createNewTile,
  }));

  const handleSelectChange = (e: any) => {
    const element = topics.find((x: Topic) => e.value === x.url.split("/")[2]);
    if (element !== undefined) {
      setSelectValue(element);
    }
  };

  const add = (source: Source) => {
    if (
      !tile.channels ||
      tile.channels.filter((e: Source) => e === source).length === 0
    ) {
      if (tile.channels === undefined) {
        tile.channels = [] as Source[];
      }
      const channels = tile.channels.concat(source);
      setTile({
        ...tile,
        channels: channels,
      });
    }
  };

  const clear = () => {
    setTile({
      ...tile,
      channels: [] as Source[],
    });
  };

  const remove = (source: Source) => {
    if (
      tile.channels &&
      tile.channels.filter((e: Source) => e === source).length >= 0
    ) {
      const channels = tile.channels.filter(
        (s: Source) =>
          s.topicId !== source.topicId && s.channel !== source.channel
      );

      setTile({
        ...tile,
        channels: channels,
      });
    }
  };

  const checkInputs = (tile: TileFormat) => {
    let errorRegistered = 0;

    if (tiles && tiles.map((t: TileFormat) => t.name).indexOf(tile.name) > -1) {
      setError("Tile name already exists. Please change");
      errorRegistered = 1;
      return false;
    }

    if (!tile.name || tile.name.length === 0) {
      setError("Please choose a name for your tile");
      errorRegistered = 1;
      return false;
    }

    switch (tile.category) {
      case "real-time":
        if (!tile.channels || tile.channels.length === 0) {
          setError("Please select datasource channel(s) to plot");
          errorRegistered = 1;
          break;
        } else if (!tile.type || !tile.mode) {
          setError("Please select plot type");
          errorRegistered = 1;
          break;
        }
        break;
      case "youtube":
        if (!tile.type) {
          setError("Please select link for youtube stream");
          errorRegistered = 1;
          break;
        }
        break;
      case "map":
        if (tile.type === "static" && !tile.fill) {
          setError("Please select coordinates or press Get Current");
          errorRegistered = 1;
          break;
        } else if (
          tile.type === "dynamic" &&
          !(tile.fill || (tile.channels && tile.channels.length === 2))
        ) {
          setError(
            "Please provide datasource channels for longitude and latitude or press Get Current"
          );
          errorRegistered = 1;
          break;
        } else if (!tile.type) {
          setError("Please select map type");
          errorRegistered = 1;
          break;
        }
        break;
      case "predictions":
        // TODO: should add error cases here
        break;
      case "history":
        if (!tile.fill && !(tile.channels && tile.channels.length > 0)) {
          setError("Please select file or provide datasource channel(s)");
          errorRegistered = 1;
          break;
        } else if (!tile.mode || !tile.type) {
          setError("Please select type of plot");
          errorRegistered = 1;
          break;
        }
        break;
      case "fft":
        if (
          tile.type === "processor" &&
          !(tile.channels && tile.channels.length > 0)
        ) {
          setError("Please provide datasource channel(s)");
          errorRegistered = 1;
          break;
        } else if (tile.type === "file" && !tile.fill) {
          setError("Please select file");
          errorRegistered = 1;
          break;
        } else if (!tile.mode) {
          setError("Please enter sample spacing");
          errorRegistered = 1;
          break;
        }
        break;
      case "spectrogram":
        if (
          tile.type === "source" &&
          !(tile.channels && tile.channels.length === 1) &&
          !tile.mode
        ) {
          setError(
            "Please make sure datasource channel and duration is selected"
          );
          errorRegistered = 1;
          break;
        } else if (tile.type === "file" && !tile.fill && !tile.frequency) {
          setError("Please provide both file and sampling frequency");
          errorRegistered = 1;
          break;
        }
        break;
      case "statistics":
        if (tile.type === "file" && !tile.fill) {
          setError("Please provide file or sensor(s)");
          errorRegistered = 1;
          break;
        } else if (
          tile.type === "source" &&
          !(tile.mode && tile.channels && tile.channels.length > 0)
        ) {
          setError("Please enter duration of statistics summary");
          errorRegistered = 1;
          break;
        }
        break;
      case "statistics_distribution":
        if (tile.type === "file" && !tile.fill) {
          setError("Please provide file or sensor(s)");
          errorRegistered = 1;
          break;
        } else if (
          tile.type === "source" &&
          !(tile.mode && tile.channels && tile.channels.length > 0)
        ) {
          setError("Please enter duration of statistics summary");
          errorRegistered = 1;
          break;
        }
        break;
      default:
        setError("Please select tile category");
        errorRegistered = 1;
        break;
    }
    if (errorRegistered === 1) {
      return false;
    } else {
      return true;
    }
  };

  const createTile = (e: any) => {
    e.preventDefault();
    const checkTile = checkInputs(tile);
    if (checkTile) {
      createNewTile(projectId, dashboardId, tile)
        .then(() => {
          closeModal();
        })
        .catch((error: any) => setError(error.toString()));
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setTile({} as TileFormat);
    setModalIsOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={() => setModalIsOpen(true)} className="Blue">
        Add new
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="AddNewModal"
        contentLabel="Add new"
      >
        <S.Header>
          <S.AddNewHeaderItem
            onClick={() => setRoute("real-time")}
            selectedRoute={route === "real-time"}
          >
            Real-time monitoring
          </S.AddNewHeaderItem>
          <S.AddNewHeaderItem
            onClick={() => setRoute("historical")}
            selectedRoute={route === "historical"}
          >
            Analytics and Statistics
          </S.AddNewHeaderItem>
          <S.AddNewHeaderItem
            onClick={() => setRoute("model")}
            selectedRoute={route === "model"}
          >
            3D-models
          </S.AddNewHeaderItem>
        </S.Header>
        <S.Content>
          {route === "historical" && (
            <AddNewAnalytics
              projectId={projectId}
              dashboardId={dashboardId}
              handleSelectChange={handleSelectChange}
              selectValue={selectValue}
              topics={topics}
              add={add}
              remove={remove}
              clear={clear}
              tile={tile}
              setTile={setTile}
            />
          )}
          {route === "real-time" && (
            <AddNewRealTime
              handleSelectChange={handleSelectChange}
              selectValue={selectValue}
              topics={topics}
              add={add}
              remove={remove}
              clear={clear}
              tile={tile}
              setTile={setTile}
              projectId={projectId}
            />
          )}
          {route === "model" && <AddNewModel projectId={projectId} />}
        </S.Content>
        {error && <S.Error>{error}</S.Error>}

        <S.ButtonContainer>
          <Button onClick={createTile} className="Long">
            Create
          </Button>
        </S.ButtonContainer>
      </Modal>
    </React.Fragment>
  );
});

export default AddNew;
