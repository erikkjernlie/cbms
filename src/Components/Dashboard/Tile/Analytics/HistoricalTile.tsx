import React, { useEffect, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import {
  getHistoricalFromFile,
  getHistoricalFromSource,
} from "src/backendAPI/transformations";
import * as T from "src/Components/Navigation/Navbar/Navbar.style";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { Buffer, TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import { DownloadData } from "src/utils/dataHandler/DownloadData";
import parseData from "src/utils/dataHandler/ReadData";
import { plottingColors } from "src/utils/styles/styles";

import * as S from "../Tile.style";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  topics: any;
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
  gridLayout: any;
}

const layout = {
  height: 400,
  autosize: true,
  padding: 0,
  plot_bgcolor: "#fff",
  showlegend: false,
};

const HistoricalTile = React.memo((props: Props) => {
  const { topics, tile, dashboardId, projectId, gridLayout } = props;

  const loadDataInMilliseconds = [10000, 30000, 60000, 1800000];

  const [data, setData] = useState({} as Buffer);
  const [reportData, setReportData] = useState("");
  const [tileData, setTileData] = useState([] as any[]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);
  const [fileOrProcessor, setFileOrProcessor] = useState("processor");
  const [topic, setTopic] = useState({} as Topic);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(
    tile.channels || ([] as any[])
  );

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  // importing plotLayout causes a weird bug; selectedChannels are toggled on and off when clicking on "10s", "30s", etc.

  useEffect(() => {
    if (tile.fill !== undefined) {
      setFileOrProcessor("file");
      configureFile();
    }
  }, [tile]);

  useEffect(() => {
    if (
      fileOrProcessor === "processor" &&
      topics.length !== 0 &&
      tile.channels
    ) {
      configureDatasource(10000);
    }
  }, [fileOrProcessor, tile, topics]);

  useEffect(() => {
    if (Object.entries(data).length !== 0 && selectedChannels) {
      const tempData = selectedChannels.map((channel: any, index: number) => ({
        name: channel.channel.channelName,
        type: tile.type,
        x: data.timestamp_buffer as any[],
        y: data.value_buffer[channel.channel.id] as any[],
        mode: tile.mode,
        line: { color: plottingColors[index % plottingColors.length] },
      }));
      setTileData(tempData);
    }
  }, [selectedChannels, data]);

  const configureFile = async () => {
    setLoading(true);
    const filename = tile.fill ? tile.fill : "";
    getHistoricalFromFile(projectId, filename).then((response) => {
      const headers = response[0];
      if (response && response[1]) {
        const x_axis = response[1].map((x_point: any) => new Date(x_point));
        const y_values = response[2];
        const tempData = y_values.map((datapoints: any, index: number) => ({
          name: headers[index + 1],
          type: tile.type,
          x: x_axis as any[],
          y: datapoints as any[],
          mode: tile.mode,
          line: { color: plottingColors[index % plottingColors.length] },
        }));
        setTileData(tempData);
        setLoading(false);
      }
    });
  };

  const configureDatasource = (time: number) => {
    setLoading(true);
    setLoadingTime(time);
    let now = Date.now();

    let t = {} as Topic;
    if (topic.id === undefined) {
      const topicId = tile.channels
        ? tile.channels.map((channel: Source) => channel.topicId)[0]
        : "";
      if (topicId === "") {
        setError("No topic registered on tile channels");
        return;
      }
      t = topics.find((t: Topic) => t.id === topicId);
      if (t === undefined) {
        setError("Tile data source not subscribed to");
        return;
      }
      setTopic(t);
    } else {
      t = topic;
    }
    let correctSensors = true;

    if (t && t.channels) {
      const topicChannels = t.channels.map(
        (channel: Channel) => channel.channelName
      );
      const channelNames = selectedChannels.map(
        (source: Source) => source.channel.channelName
      );
      if (
        topicChannels &&
        topicChannels.length > 0 &&
        channelNames &&
        channelNames.length > 0
      ) {
        const result = channelNames.every((val) => topicChannels.includes(val));
        if (!result) {
          correctSensors = false;
          setError(
            "Looks like there is something wrong with the datasource: mismatch with sensor values."
          );
        }
      }
    }

    getHistoricalFromSource(t.id, now, time).then((response) => {
      //const reader = resp.body?.getReader();
      if (response !== null) {
        response
          .arrayBuffer()
          .then((resp) => {
            const parsedData = parseData(resp.slice(4), t);
            setData(parsedData);
          })
          .then(() => {
            setLoading(false);
          });
      }
    });
  };

  const add = (topicId: string, channel: any) => {
    if (
      selectedChannels.filter(
        (e: Source) => e.topicId === topicId && channel === e.channel
      ).length === 0
    ) {
      const channels = selectedChannels.concat({
        topicId: topicId,
        channel: channel,
      });
      setSelectedChannels(channels);
    }
  };

  const remove = (channel: Source) => {
    if (selectedChannels.some((e: Source) => channel === e)) {
      const channels = selectedChannels.filter((e: Source) => channel !== e);
      setSelectedChannels(channels);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // TODO: HVER GANG JEG ENDRER PÅ ANTALL SENSORER I HISTORY; SÅ HENTER DNE ALLE VERDIER PÅ NYTT

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
            {fileOrProcessor === "processor" &&
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

          {reportData && (
            <iframe
              srcDoc={reportData}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          )}
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
              {fileOrProcessor === "processor" && (
                <S.Content>
                  <S.PlotSettingsSubTitle>Add sensors</S.PlotSettingsSubTitle>
                  {topic && topic.channels && (
                    <Select
                      className="Select"
                      isMulti
                      onChange={(newList: any, object: any) => {
                        if (object.action === "select-option") {
                          add(topic.id, object.option.value);
                        }
                      }}
                      options={topic.channels
                        .filter(
                          (channel: Channel) =>
                            selectedChannels
                              .map(
                                (source: Source) => source.channel.channelName
                              )
                              .indexOf(channel.channelName) < 0
                        )
                        .map((channel: Channel) => {
                          return {
                            value: channel,
                            label: channel.channelName,
                          };
                        })}
                    />
                  )}
                </S.Content>
              )}
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

              <S.Content className="Center">
                <Button
                  className="Red"
                  onClick={() => {
                    deleteTile(projectId, dashboardId, tile);
                  }}
                >
                  Delete plot
                </Button>
              </S.Content>
            </T.UserBody>
          </Modal>
        </S.HeaderRight>
      </S.Header>

      {error || loading ? (
        error ? (
          <S.Error>{error}</S.Error>
        ) : (
          <S.Loading>
            <ClipLoader
              size={15}
              //size={"150px"} this also works
              color={"#123abc"}
              loading={loading}
            />
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
                  onClick={() => remove(channel)}
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
export default HistoricalTile;
