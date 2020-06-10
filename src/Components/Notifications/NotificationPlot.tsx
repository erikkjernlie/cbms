import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { IoMdMenu } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import { getHistoricalFromSource } from "src/backendAPI/transformations";
import { Buffer, Timestamp } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import parseData from "src/utils/dataHandler/ReadData";
import { modalStyle, plottingColors } from "src/utils/styles/styles";

import * as S from "../Dashboard/Tile/Tile.style";
import Button from "../UI/Button/Button";

Modal.setAppElement("body");

interface Props {
  topics: Topic[];
  startedAt?: Timestamp;
  endedAt?: Timestamp;
  sensor?: string;
  limitValue: number | null;
}

const layout = {
  height: 400,
  autosize: true,
  padding: 0,
  plot_bgcolor: "#fff",
  showlegend: false,
};

export default function NotificationPlot(props: Props) {
  const { topics, startedAt, endedAt, sensor, limitValue } = props;

  const [loadingTime, setLoadingTime] = useState(0);
  const [data, setData] = useState({} as Buffer);
  const [loading, setLoading] = useState(false);
  const [plotData, setPlotData] = useState([] as any[]);
  const [csvData, setCsvData] = useState([] as any[]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [topic, setTopic] = useState({} as Topic);
  const [selectedChannels, setSelectedChannels] = useState([] as Source[]);

  // find topic
  useEffect(() => {
    findTopic();
  }, [topics]);

  // get data for plot when started
  useEffect(() => {
    if (topic !== undefined && topic.id) {
      getData(5000);
    }
  }, [topic]);

  // change plotted data and csv data every time the data or the selected channels are changed
  useEffect(() => {
    if (Object.entries(data).length !== 0 && selectedChannels) {
      const limitArray = [] as any[];
      data.timestamp_buffer.forEach((x: any) => limitArray.push(limitValue));
      const tempPlotData = [];
      tempPlotData.push({
        name: "Limit value",
        x: data.timestamp_buffer,
        y: limitArray,
        type: "line",
        mode: "lines",
        line: {
          color:
            plottingColors[selectedChannels.length % plottingColors.length],
        },
      });
      selectedChannels.forEach((channel: Source, index: number) => {
        tempPlotData.push({
          name: channel.channel.channelName,
          type: "scattergl-visible",
          x: data.timestamp_buffer as any[],
          y: data.value_buffer[channel.channel.id] as any[],
          mode: "lines",
          line: { color: plottingColors[index % plottingColors.length] },
        });
      });
      setPlotData(tempPlotData);
      const csvFormattedData = tempPlotData
        .filter((sensor: any) => sensor.y.length > 1)
        .map((sensor: any) => {
          let name = sensor.name;
          let yValues = sensor.y as number[];
          let xValues = sensor.x;
          if (yValues) {
            return yValues.map((yValue: number, index: number) => {
              let xValue = new Date(xValues[index]).getTime();
              return {
                name: name,
                value: yValue,
                timestamp: xValue,
              };
            });
          } else {
            return {};
          }
        })
        .flatMap((b) => b);
      setCsvData(csvFormattedData);
    }
  }, [selectedChannels, data]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getData = async (timeInMilliSeconds: number) => {
    setLoading(true);
    setLoadingTime(timeInMilliSeconds);
    const duration =
      endedAt!.seconds * 1000 +
      timeInMilliSeconds -
      (startedAt!.seconds * 1000 - timeInMilliSeconds);
    getHistoricalFromSource(
      topic.id,
      endedAt!.seconds * 1000 + timeInMilliSeconds,
      duration
    ).then((response) => {
      if (response !== null) {
        response
          .arrayBuffer()
          .then((resp) => {
            let parsedData = parseData(resp.slice(4), topic);
            setData(parsedData);
          })
          .then(() => {
            setLoading(false);
          });
      }
    });
  };

  const findTopic = () => {
    if (topics && sensor) {
      topics.forEach((topic: Topic) => {
        const sensorChannel = topic.channels.filter(
          (channel: Channel) =>
            channel.channelName === sensor &&
            topic.url.split("/")[1] === "datasources"
        );
        if (sensorChannel.length !== 0) {
          setTopic(topic);
          setSelectedChannels(
            selectedChannels.concat({
              topicId: topic.id,
              channel: sensorChannel[0],
            })
          );
        }
      });
    }
  };

  // add sensor
  const add = (sourceObject: Source) => {
    if (
      selectedChannels &&
      selectedChannels.filter((e: any) => e === sourceObject).length === 0
    ) {
      const channels = selectedChannels.concat(sourceObject);
      setSelectedChannels(channels);
    }
  };

  // remove sensor
  const remove = (channel: Source) => {
    if (
      selectedChannels &&
      selectedChannels.some((e: Source) => channel.channel === e.channel)
    ) {
      const channels = selectedChannels.filter(
        (e: Source) => channel.channel !== e.channel
      );
      setSelectedChannels(channels);
    }
  };


  return (
    <S.PlotNotification>
      <S.Header>
        <S.HeaderLeft></S.HeaderLeft>
        <S.HeaderRight>
          <S.Buttons>
            <Button
              className="Small"
              onClick={() => getData(5000)}
              loading={loading && loadingTime === 5000}
            >
              +/- 5s
            </Button>
            <Button
              className="Small"
              onClick={() => getData(10000)}
              loading={loading && loadingTime === 10000}
            >
              +/- 10s
            </Button>
            <Button
              className="Small"
              onClick={() => getData(30000)}
              loading={loading && loadingTime === 30000}
            >
              +/- 30s
            </Button>
            <Button
              className="Small"
              onClick={() => getData(60000)}
              loading={loading && loadingTime === 60000}
            >
              +/- 1min
            </Button>
          </S.Buttons>
          <S.Menu onClick={() => setModalIsOpen(true)}>
            <IoMdMenu size={"1.6em"} />
          </S.Menu>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={modalStyle}
            contentLabel="Settings"
          >
            <div>
              <div>
                <h2>Select the sensors you want to add: </h2>
                {topic.channels &&
                  topic.channels.map((channel: Channel) => {
                    if (
                      selectedChannels
                        .map((c) => c.channel.channelName)
                        .indexOf(channel.channelName) < 0
                    ) {
                      return (
                        <S.Channel
                          key={channel.id}
                          onClick={() =>
                            add({ topicId: topic.id, channel: channel })
                          }
                        >
                          {channel.channelName}
                        </S.Channel>
                      );
                    }
                  })}
              </div>
              <div>
                <h2>Do you want to download the data?</h2>
                <CSVLink data={csvData} filename={"event_trigger.csv"}>
                  Download data
                </CSVLink>
              </div>
            </div>
          </Modal>
        </S.HeaderRight>
      </S.Header>
      <S.Plot>
        {plotData && (
          <Plot
            style={{ width: "100%", height: "400px" }}
            layout={layout}
            config={{ responsive: true }}
            frames={[]}
            data={plotData as any}
            useResizeHandler={true}
          />
        )}
      </S.Plot>

      <div>
        {selectedChannels && selectedChannels.length > 0 && (
          <div>
            <S.SelectedChannels>
              {selectedChannels.map((channel: Source, index: number) => {
                let extra;
                if (index + 1 === selectedChannels.length) {
                  extra = (
                    <S.SelectedChannel
                      key={selectedChannels.length}
                      colorValue={
                        plottingColors[
                          selectedChannels.length % plottingColors.length
                        ]
                      }
                    >
                      <TiDelete size={"14px"} />
                      <div>Limit exceeded</div>
                    </S.SelectedChannel>
                  );
                }
                return (
                  <S.SelectedChannels>
                    <S.SelectedChannel
                      key={index}
                      onClick={() => remove(channel)}
                      colorValue={plottingColors[index % plottingColors.length]}
                    >
                      <TiDelete size={"14px"} />
                      <div>{channel.channel.channelName}</div>
                    </S.SelectedChannel>
                    {extra}
                  </S.SelectedChannels>
                );
              })}
            </S.SelectedChannels>
          </div>
        )}
      </div>
    </S.PlotNotification>
  );
}
