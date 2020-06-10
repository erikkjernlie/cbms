import React, { useEffect, useMemo, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import { ClipLoader } from "react-spinners";
import * as T from "src/Components/Navigation/Navbar/Navbar.style";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import AddChannels from "src/utils/dataHandler/AddChannels";
import { DownloadData } from "src/utils/dataHandler/DownloadData";
import { plottingColors } from "src/utils/styles/styles";

import * as S from "../Tile.style";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  selectedSources: Source[];
  topics: Topic[];
  _addChannel: (channel: Source, tile: TileFormat) => boolean;
  _removeChannel: (channel: Source, tile: TileFormat) => void;
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
}

export default function RealTimePlot(props: Props) {
  const {
    topics,
    _addChannel,
    _removeChannel,
    tile,
    dashboardId,
    projectId,
  } = props;

  const [error, setError] = useState("");
  const [startSubscribe, setStartSubscribe] = useState(false);
  const [removingChannel, setRemovingChannel] = useState("");
  const [addingChannel, setAddingChannel] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectValue, setSelectValue] = useState({} as Topic);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [numberOfPoints, setNumberOfPoints] = useState(1000);
  const [data, setData] = useState([] as any[]);
  const [delayArray, setDelayArray] = useState([] as any);

  const [dates, setDates] = useState([] as any);
  const [doUpdates, setDoUpdates] = useState(true);

  const { setDatasources, subscribeDatasources, newData } = useDataStore(
    (state) => ({
      setDatasources: state.setDatasources,
      subscribeDatasources: state.subscribeDatasources,
      newData: state.newData,
    })
  );

  const [selectedChannels, setSelectedChannels] = useState([] as Source[]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", function () {
      setDoUpdates(!document.hidden);
    });
  }, []);

  const { addChannel, removeChannel, deleteTile } = useProjectStore(
    (state) => ({
      addChannel: state.addChannel,
      removeChannel: state.removeChannel,
      deleteTile: state.deleteTile,
    })
  );

  const layout = {
    height: 400,
    autosize: true,
    padding: 0,
    plot_bgcolor: "#fff",
    showlegend: false,
  };

  useEffect(() => {
    if (tile.channels !== undefined && tile.channels.length > 0) {
      setSelectedChannels(tile.channels);
    }
  }, []);

  useEffect(() => {
    if (!topics || topics.length === 0) {
      setError("No data sources subscribed to");
    }
    if (selectedChannels.length === 0) {
      setError("No channels to subscribe to");
    }
    if (selectedChannels && topics) {
      const channelTopics = selectedChannels.map(
        (channel: Source) => channel.topicId
      );
      const topicIds = topics.map((topic: Topic) => topic.id);

      channelTopics.forEach((ct: string) => {
        if (topicIds.indexOf(ct) < 0) {
          setError("Missing subscription to one or more data sources");
          return;
        }
      });
      setError("");
    }
  }, [topics, selectedChannels]);

  useEffect(() => {
    if (topics && newData && !startSubscribe && selectedChannels) {
      setStartSubscribe(true);
    }
  }, [topics, newData, startSubscribe, selectedChannels]);

  // more effective than useEffect?
  useMemo(() => {
    requestAnimationFrame(() => updateTile());
  }, [newData]);

  const updateTile = () => {
    if (doUpdates) {
      let correctSensors = true;
      if (topics.length !== 0 && selectedChannels.length !== 0) {
        const topicIDs = Array.from(
          new Set(selectedChannels.map((source: Source) => source.topicId))
        );
        topicIDs.forEach((topicID: string) => {
          const topic = topics.find((topic: Topic) => topicID === topic.id);
          if (topic && topic.channels) {
            const topicChannels = topic.channels.map(
              (channel: Channel) => channel.channelName
            );
            const channelNames = selectedChannels
              .filter((channel: Source) => topic.id === channel.topicId)
              .map((source: Source) => source.channel.channelName);
            if (
              topicChannels &&
              topicChannels.length > 0 &&
              channelNames &&
              channelNames.length > 0
            ) {
              const result = channelNames.every((val) =>
                topicChannels.includes(val)
              );
              if (!result) {
                correctSensors = false;
                setError(
                  "Looks like there is something wrong with the datasource: mismatch with sensor values."
                );
              }
            }
          }
        });
      }

      if (startSubscribe && correctSensors) {
        let newXValues = {} as any;
        let newYValues = {} as any;

        for (let i = 0; i < selectedChannels.length; i++) {
          const sourceChannelID = selectedChannels[i].topicId;
          const newChannelData = newData[sourceChannelID];
          if (newChannelData) {
            newYValues[sourceChannelID + "/" + selectedChannels[i].channel.id] =
              newChannelData.value_buffer[selectedChannels[i].channel.id];
            newXValues[sourceChannelID + "/" + selectedChannels[i].channel.id] =
              newChannelData.timestamp_buffer;
          }
        }

        let tileData = selectedChannels.map(
          (channel: Source, index: number) => {
            if (channel && channel.channel) {
              let i = data
                .map((e: any) => e.name)
                .indexOf(channel.channel.channelName);
              if (i >= 0) {
                return {
                  name: channel.channel.channelName,
                  type: tile.type,
                  mode: tile.mode,
                  x:
                    data[i] && data[i].x
                      ? data[i].x.concat(
                          newXValues[channel.topicId + "/" + channel.channel.id]
                        ).length > numberOfPoints
                        ? data[i].x
                            .concat(
                              newXValues[
                                channel.topicId + "/" + channel.channel.id
                              ]
                            )
                            .slice(
                              data[i].x.concat(
                                newXValues[
                                  channel.topicId + "/" + channel.channel.id
                                ]
                              ).length - numberOfPoints,
                              data[i].x.concat(
                                newXValues[
                                  channel.topicId + "/" + channel.channel.id
                                ]
                              ).length
                            )
                        : data[i].x.concat(
                            newXValues[
                              channel.topicId + "/" + channel.channel.id
                            ]
                          )
                      : newXValues[channel.topicId + "/" + channel.channel.id],
                  y:
                    data[i] && data[i].y
                      ? data[i].y.concat(
                          newYValues[channel.topicId + "/" + channel.channel.id]
                        ).length > numberOfPoints
                        ? data[i].y
                            .concat(
                              newYValues[
                                channel.topicId + "/" + channel.channel.id
                              ]
                            )
                            .slice(
                              data[i].y.concat(
                                newYValues[
                                  channel.topicId + "/" + channel.channel.id
                                ]
                              ).length - numberOfPoints,
                              data[i].y.concat(
                                newYValues[
                                  channel.topicId + "/" + channel.channel.id
                                ]
                              ).length
                            )
                        : data[i].y.concat(
                            newYValues[
                              channel.topicId + "/" + channel.channel.id
                            ]
                          )
                      : newYValues[channel.topicId + "/" + channel.channel.id],
                  line: { color: plottingColors[index] },
                };
              } else {
                return {
                  name: channel.channel.channelName,
                  type: tile.type,
                  x: [],
                  y: [],
                  mode: tile.mode,
                };
              }
            }
          }
        );
        if (
          correctSensors &&
          topics &&
          newData &&
          Object.entries(newData) !== null
        ) {
          const delay = topics
            .filter((topic: Topic) =>
              selectedChannels
                .map((channel: Source) => channel.topicId)
                .includes(topic.id)
            )
            .map((element: any) => {
              if (newData[element.id] && newData[element.id].delay) {
                if (newData[element.id].delay < 0) {
                  return [
                    element.url.split("/")[2],
                    "Invalid date (negative delay): " +
                      newData[element.id].delay,
                  ];
                } else {
                  selectedChannels.map((channel: Source, index: number) => {
                    let d = newXValues[
                      channel.topicId + "/" + channel.channel.id
                    ].map((d: any, i: number) => {
                      if (i === 0) {
                        return d;
                      }
                    });
                  });

                  return [
                    element.url.split("/")[2],
                    (
                      Number(newData[element.id].delay) +
                      (Date.now() - newData[element.id].timestamp) / 1000
                    ).toFixed(3),
                  ];
                }
              }
            });

          selectedChannels.map((source: Source) => source.channel.channelName);
          const topicIDs = Array.from(
            new Set(selectedChannels.map((source: Source) => source.topicId))
          );
          topicIDs.forEach((topicID: string) => {
            const topic = topics.find((topic: Topic) => topicID === topic.id);
            const channelNames = selectedChannels.map(
              (source: Source) => source.channel.channelName
            );
          });
          if (delay && delay.length > 0 && delay[0] !== undefined) {
            setDelayArray(delay);
          }
        }
        setData(tileData);
      }
    }
  };

  const add = async (channel: Source) => {
    if (
      selectedChannels.filter(
        (e: Source) => JSON.stringify(e) === JSON.stringify(channel)
      ).length === 0
    ) {
      const channels = selectedChannels.concat(channel);
      setAddingChannel(channel.channel.channelName);
      addChannel(projectId, dashboardId, tile.id, JSON.stringify(channel)).then(
        () => {
          setSelectedChannels(channels);
          setAddingChannel("");
          setData([]);
          _addChannel(channel, tile);
        }
      );
    } else {
      // remove from channel
    }
  };

  const remove = async (channel: Source) => {
    setRemovingChannel(channel.channel.channelName);
    if (
      selectedChannels.filter(
        (e: Source) => JSON.stringify(e) === JSON.stringify(channel)
      ).length > 0
    ) {
      removeChannel(
        projectId,
        dashboardId,
        tile.id,
        JSON.stringify(channel)
      ).then(() => {
        const channels = selectedChannels.filter((c: Source) => c !== channel);
        setSelectedChannels(channels);
        setRemovingChannel("");
        _removeChannel(channel, tile);
      });
    }
  };

  const clear = () => {};

  const handleSelectChange = (e: any) => {
    const element = topics.find((x: Topic) => e.value === x.url.split("/")[2]);
    if (element !== undefined) {
      setSelectValue(element);
    }
  };

  return (
    <S.PlotComponent>
      <S.Header>
        <S.HeaderLeft>
          <S.Handler className="Handler">
            <FaGripVertical size={"1.2em"} />
          </S.Handler>
          <S.PlotName>{tile.name}</S.PlotName>
        </S.HeaderLeft>
        <S.HeaderRight>
          <S.Delay>
            {delayArray &&
              delayArray.map((delay: any, index: number) => {
                if (delay && delay[0] && delay[1]) {
                  return (
                    <div key={index}>
                      Delay from "{delay[0]}": {delay[1]} seconds
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </S.Delay>
          <S.Menu onClick={() => setModalIsOpen(true)}>
            <IoMdMenu size={"1.6em"} />
          </S.Menu>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="SettingsModal"
            contentLabel="Plot"
          >
            <T.UserHeader>
              <T.NumberCircle>P</T.NumberCircle> Plot Settings: {tile.name}
            </T.UserHeader>
            <T.UserBody>
              <S.Content>
                <AddChannels
                  topics={topics}
                  handleSelectChange={handleSelectChange}
                  selectValue={selectValue}
                  add={add}
                  remove={remove}
                  selectedChannels={selectedChannels}
                  addingChannel={addingChannel}
                  clear={clear}
                />
              </S.Content>
              <S.Content>
                <div>
                  <S.PlotSettingsSubTitle>
                    How many points do you want to display:
                  </S.PlotSettingsSubTitle>
                  <div>
                    <TextInput
                      type={"number"}
                      value={numberOfPoints}
                      onChange={(e: any) => setNumberOfPoints(e.target.value)}
                    />
                  </div>
                </div>
              </S.Content>
              <S.Content>
                <S.PlotSettingsSubTitle>
                  Do you want to download the data?
                </S.PlotSettingsSubTitle>
                <DownloadData csvData={data} fileName={tile.name} type="csv" />
                <DownloadData csvData={data} fileName={tile.name} type="xlsx" />
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
      <div id={"sensor" + tile.id}>
        {error && <S.Error>{error}</S.Error>}
        {!error && delayArray.length === 0 ? (
          <S.Loading>
            <ClipLoader
              size={15}
              //size={"150px"} this also works
              color={"#123abc"}
              loading={true}
            />
          </S.Loading>
        ) : (
          !error && (
            <S.Plot>
              <Plot
                style={{ width: "100%" }}
                layout={layout}
                config={{ responsive: true }}
                frames={[]}
                data={data}
                useResizeHandler={true}
              />
            </S.Plot>
          )
        )}
        {selectedChannels && selectedChannels.length > 0 && (
          <div style={{ display: "flex" }}>
            <S.SelectedChannels>
              {selectedChannels.map((channel: Source, index: number) => {
                if (channel && channel.channel) {
                  return (
                    <S.SelectedChannel
                      key={
                        channel.topicId +
                        "/" +
                        channel.channel.id +
                        Math.random()
                      }
                      onClick={() => remove(channel)}
                      colorValue={
                        removingChannel !== channel.channel.channelName
                          ? plottingColors[index % plottingColors.length]
                          : "grey"
                      }
                    >
                      <TiDelete size={"14px"} />
                      <div>{channel.channel.channelName}</div>
                    </S.SelectedChannel>
                  );
                } else {
                  return null;
                }
              })}
            </S.SelectedChannels>
          </div>
        )}
      </div>
    </S.PlotComponent>
  );
}
