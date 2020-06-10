import React, { useEffect, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import { ClipLoader } from "react-spinners";
import {
  getFFTFromDatasource,
  getFFTFromFile,
} from "src/backendAPI/transformations";
import * as S from "src/Components/Dashboard/Tile/Tile.style";
import * as T from "src/Components/Navigation/Navbar/Navbar.style";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { Buffer, TileFormat } from "src/types/datahandling";
import { Source, Topic } from "src/types/datasource";
import { DownloadData } from "src/utils/dataHandler/DownloadData";
import { plottingColors } from "src/utils/styles/styles";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  topics: any;
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
  gridLayout: any;
}

const loadDataInMilliseconds = [10000, 30000, 60000, 180000];

const FFTTile = React.memo((props: Props) => {
  const { topics, tile, dashboardId, projectId, gridLayout } = props;

  const [title, setTitle] = useState("");
  const [data, setData] = useState({} as Buffer);
  const [error, setError] = useState("");
  const [tileData, setTileData] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);
  const [topic, setTopic] = useState({} as Topic);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(
    tile.channels || ([] as any[])
  );

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  // importing tileLayout causes a weird bug; selectedChannels are toggled on and off when clicking on "10s", "30s", etc.
  const layout = {
    title: title,
    height: 400,
    autosize: true,
    padding: 0,
    plot_bgcolor: "#fff",
    showlegend: false,
    xaxis: {
      title: "Frequency (Hz)",
    },
    yaxis: {
      title: "Amplitude",
    },
  };

  useEffect(() => {
    if (tile && tile.type === "file") {
      configureFile();
    }
  }, [tile]);

  useEffect(() => {
    if (topics.length !== 0 && tile.channels && tile.type === "processor") {
      configureDatasource(10000);
    }
  }, [tile, topics]);

  useEffect(() => {
    if (Object.entries(data).length !== 0 && tile.channels) {
      const tempData = tile.channels.map((channel: any, index: number) => ({
        name: channel.channel.channelName,
        type: tile.type,
        x: data.timestamp_buffer as any[],
        y: data.value_buffer[channel.channel.id] as any[],
        mode: tile.mode,
        line: { color: plottingColors[index % plottingColors.length] },
      }));
      setTileData(tempData);
    }
  }, [data, tile]);

  const configureFile = async () => {
    setLoading(true);
    const filename = tile.fill ? tile.fill : "";
    const sample_spacing = tile.mode ? tile.mode : "";
    const response = await getFFTFromFile(projectId, filename, sample_spacing);
    if (response && response.length > 0) {
      setError("");

      const tempData = [
        {
          name: response[0],
          type: "scatter",
          x: response[1].slice(1) as any[],
          y: response[2].slice(1) as any[],
          line: { color: plottingColors[0 % plottingColors.length] },
        },
      ];
      setTileData(tempData);
    } else {
      setError("Something went wrong!");
    }
    setLoading(false);
  };

  const configureDatasource = async (time: number) => {
    setLoading(true);
    setLoadingTime(time);
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

      t = topics.find((t: Topic) => t.id === topicId);
      if (t === undefined) {
        setError("Tile datasource not subscribed to");
        setLoading(false);
        return;
      }
      setError("");
      setTopic(t);
    } else {
      t = topic;
    }

    const now = Date.now();
    const channel_id = tile.channels ? tile.channels[0].channel.id : 0;
    const sample_spacing = tile.mode ? tile.mode : "0.01";
    const response = await getFFTFromDatasource(
      t.url.split("/")[2],
      channel_id,
      now,
      time,
      sample_spacing
    );
    const tempData = [
      {
        type: "scatter",
        x: response[0].slice(1) as any[],
        y: response[1].slice(1) as any[],
        line: { color: plottingColors[0 % plottingColors.length] },
      },
    ];
    setTileData(tempData);
    setLoading(false);
  };

  // TODO: HVER GANG JEG ENDRER PÅ ANTALL SENSORER I HISTORY; SÅ HENTER DNE ALLE VERDIER PÅ NYTT
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <S.PlotComponent id={"sensor" + tile.id}>
      <S.Header>
        <S.HeaderLeft>
          <S.Handler className="Handler">
            <FaGripVertical size={"1.2em"} />
          </S.Handler>
          <S.PlotName>{tile.name}</S.PlotName>
        </S.HeaderLeft>
        <S.HeaderRight>
          <S.Buttons>
            {tile.type === "processor" &&
              loadDataInMilliseconds &&
              loadDataInMilliseconds.map(
                (milliseconds: number, index: number) => (
                  <Button
                    key={index}
                    className="Small"
                    onClick={() => configureDatasource(milliseconds)}
                    loading={loading && loadingTime === milliseconds}
                  >
                    {milliseconds / 1000}s
                  </Button>
                )
              )}
          </S.Buttons>
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
            </T.UserBody>
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
      <div>
        {selectedChannels && selectedChannels.length > 0 && (
          <S.SelectedChannels>
            {selectedChannels.map((channel: any, index: number) => {
              return (
                <S.SelectedChannel
                  key={index}
                  colorValue={plottingColors[index % plottingColors.length]}
                >
                  <TiDelete size={"14px"} />
                  <div>{channel.channel.channelName}</div>
                </S.SelectedChannel>
              );
            })}
          </S.SelectedChannels>
        )}
      </div>
    </S.PlotComponent>
  );
});
export default FFTTile;
