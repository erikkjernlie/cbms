import React, { useEffect, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import { ClipLoader } from "react-spinners";
import {
  getSpectrogramFromFile,
  getSprectrogramFromDatasource,
} from "src/backendAPI/transformations";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import { Source, Topic } from "src/types/datasource";
import { DownloadData } from "src/utils/dataHandler/DownloadData";
import modalStyle from "src/utils/styles/styles";

import * as S from "../Tile.style";

Modal.setAppElement("body");

interface Props {
  tile: TileFormat;
  topics: Topic[];
  projectId: string;
  dashboardId: string;
}

const SpectrogramTile = React.memo((props: Props) => {
  const { tile, topics, projectId, dashboardId } = props;

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tileData, setTileData] = useState({} as any);
  const [topic, setTopic] = useState({} as Topic);

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  const layout = {
    title: title,
    height: 400,
    autosize: true,
    padding: 0,
    plot_bgcolor: "#fff",
    xaxis: {
      title: "Time (s)",
    },
    yaxis: {
      title: "Frequency (Hz)",
    },
  };

  useEffect(() => {
    if (tile.type === "file") {
      configureFile();
    }
  }, [tile]);

  useEffect(() => {
    if (tile.type === "source" && topics !== undefined) {
      configureDatasource();
    }
  }, [tile, topics]);

  const configureFile = async () => {
    setLoading(true);
    const file = tile.fill ? tile.fill : "";
    const sample = tile.mode ? tile.mode : "";
    const data = await getSpectrogramFromFile(projectId, file, sample);

    // setTitle("Spectrogram from file " + tile.fill);
    const pData = [
      {
        x: data[2],
        y: data[1],
        z: data[0],
        type: "heatmap",
        colorscale: "YlGnBu",
      },
    ];
    setTileData(pData);
    setLoading(false);
  };

  const configureDatasource = async () => {
    setLoading(true);
    let t = {} as Topic;
    if (topic.id === undefined) {
      const topicId = tile.channels
        ? tile.channels.map((channel: Source) => channel.topicId)[0]
        : "";
      if (topicId === "") {
        setError("No topic registered on tile channels");
        setLoading(false);
        return;
      }
      const temp = topics.find((t: Topic) => t.id === topicId);
      if (temp === undefined) {
        setError("Tile data source not subscribed to");
        setLoading(false);
        return;
      }
      t = temp;
      setTopic(t);
      setError("");
    } else {
      t = topic;
    }
    let response;
    try {
      const mode = tile.mode ? tile.mode : "";
      const channels = tile.channels ? tile.channels : ([] as Source[]);
      response = await getSprectrogramFromDatasource(
        t.url.split("/")[2],
        mode,
        channels
      );
    } catch (error) {
      setError("Error loading spectrogram");
      setLoading(false);
      return;
    }
    if (response === undefined) {
      setError("No response");
      setLoading(false);
      return;
    }
    setTitle("");
    const pData = [
      {
        x: response[2],
        y: response[1],
        z: response[0],
        type: "heatmap",
        colorscale: "YlGnBu",
      },
    ];
    setTileData(pData);
    setLoading(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <S.ModelPlotComponent>
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
            contentLabel="Map Configuration"
          >
            <div>
              <h2>Do you want to do anything?</h2>
            </div>
            <div>
              <S.Content>
                <S.PlotSettingsSubTitle>
                  Do you want to download the data?
                </S.PlotSettingsSubTitle>
                <DownloadData
                  csvData={tileData}
                  fileName={tile.name}
                  type="csv"
                />
                <DownloadData
                  csvData={tileData}
                  fileName={tile.name}
                  type="xlsx"
                />
              </S.Content>
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
            </div>
          </Modal>
        </S.HeaderRight>
      </S.Header>
      {error || loading ? (
        error ? (
          <S.Error>{error}</S.Error>
        ) : (
          <S.Loading>
            <ClipLoader size={15} color={"#123abc"} loading={loading} />
          </S.Loading>
        )
      ) : (
        <S.Plot>
          {tileData && (
            <Plot
              style={{ width: "100%" }}
              layout={layout}
              config={{ responsive: true }}
              frames={[]}
              data={tileData as any}
              useResizeHandler={true}
            />
          )}
        </S.Plot>
      )}
    </S.ModelPlotComponent>
  );
});

export default SpectrogramTile;
