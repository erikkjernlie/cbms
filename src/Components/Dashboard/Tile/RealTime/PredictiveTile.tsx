import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useMemo, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import { ClipLoader } from "react-spinners";
import { rootAPI } from "src/backendAPI/api";
import { fetchTopics } from "src/backendAPI/topics";
import * as T from "src/Components/Navigation/Navbar/Navbar.style";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import AddChannels from "src/utils/dataHandler/AddChannels";
import { fetchProcessedConfig } from "src/utils/MachineLearning/transferLib";
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

export default function PredictiveTile(props: Props) {
  const {
    topics,
    _addChannel,
    _removeChannel,
    tile,
    dashboardId,
    projectId,
  } = props;
  const { setDatasources, subscribeDatasources, newData } = useDataStore(
    (state) => ({
      setDatasources: state.setDatasources,
      subscribeDatasources: state.subscribeDatasources,
      newData: state.newData,
    })
  );

  const [startSubscribe, setStartSubscribe] = useState(false);
  const [removingChannel, setRemovingChannel] = useState("");
  const [addingChannel, setAddingChannel] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectValue, setSelectValue] = useState({} as Topic);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [numberOfPoints, setNumberOfPoints] = useState(1000);
  const [data, setData] = useState([] as any[]);
  const [selectedChannels, setSelectedChannels] = useState([] as Source[]);
  const [datapoints, setDatapoints] = useState([] as number[]);
  const [predicted, setPredicted] = useState([] as number[]);
  const [time, setTime] = useState([] as number[]);
  const [config, setConfig] = useState({} as any);
  const [outputNames, setOutputNames] = useState([]);
  const [outputIndex, setOutputIndex] = useState(-1);
  const [manuallyPredictedOutput, setManuallyPredictedOutput] = useState(-1);
  const [inputIndexes, setInputIndexes] = useState([] as any[]);
  const [doUpdates, setDoUpdates] = useState(true);

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
    showlegend: true,
  };

  useEffect(() => {
    if (tile.channels !== undefined && tile.channels.length > 0) {
      setSelectedChannels(tile.channels);
    }
  }, []);

  useEffect(() => {
    if (topics && newData && !startSubscribe && selectedChannels) {
      setStartSubscribe(true);
    }
  }, [topics, newData, startSubscribe, selectedChannels]);

  // more effective than useEffect?
  useMemo(() => {
    requestAnimationFrame(() => updateTile());
  }, [newData]);

  useEffect(() => {
    document.addEventListener("visibilitychange", function () {
      setDoUpdates(!document.hidden);
    });
  }, []);

  const standardize = (x: any, mean: any, std: any) => {
    return (x - mean) / std;
  };

  useEffect(() => {
    async function fetch() {
      try {
        if (projectId) {
          const model = await tf.loadLayersModel(
            rootAPI +
              "/machinelearning/" +
              projectId +
              "/" +
              tile.name +
              "/model.json"
          );
          const c = await fetchProcessedConfig(projectId + "/" + tile.name);
          setModel(model);
          setConfig(c);
          const topicsJSON = await fetchTopics();
          let tempOutputNames = topicsJSON[c.topic].output_names;
          let inputIndexes = [];
          for (let i = 0; i < c.input.length; i++) {
            let index = tempOutputNames.indexOf(c.input[i]);
            inputIndexes.push({
              index: index,
              name: c.input[i],
            });
          }
          let outputIndex = tempOutputNames.indexOf(c.output[0]);
          setOutputNames(tempOutputNames);
          setOutputIndex(outputIndex);
          setInputIndexes(inputIndexes);
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    }
    fetch();
  }, []);

  const normalize = (x: any, min: any, max: any) => {
    return (x - min) / (max - min);
  };

  const predictVal = (dataPoint: any) => {
    let start = Date.now();

    const tensor = tf.tensor2d([dataPoint], [1, dataPoint.length]);
    const prediction = model.predict(tensor).dataSync();
    tensor.dispose();
    let end = Date.now();
    if (prediction.length === 1) {
      return prediction[0];
    } else {
      return prediction;
    }
  };

  const [model, setModel] = useState(null as any);

  const [delayArray, setDelayArray] = useState([] as any);

  const predictValues = (timestampValues: any, y: any) => {
    let predictedValues = [] as number[];
    if (model && inputIndexes) {
      let x = [] as any[];
      const topic = topics.find((x: Topic) => x.id === config.topic);
      inputIndexes.forEach((element: any) => {});
      inputIndexes.forEach((elem) => {
        x.push(y[config.topic + "/" + elem.index]);
      });
      if (topic !== undefined) {
        if (x && x.length > 0) {
          for (let i = 0; i < x[0].length; i++) {
            let modifiedX = [];
            let x_test = [] as any[];

            for (let j = 0; j < x.length; j++) {
              let obj = config.sensors[config.input[j]];
              x_test.push(x[j][i]);
              if (config && config.differentValueRanges) {
                modifiedX.push(standardize(x[j][i], obj.mean, obj.std));
              } else {
                modifiedX.push(normalize(x[j][i], obj.min, obj.max));
              }
            }

            let predicted = predictVal(modifiedX);

            predictedValues.push(predicted);
          }
        }
      }
    }
    return predictedValues;
  };

  const [dummyArray, setDummyArray] = useState([] as number[]);

  const updateTile = () => {
    if (doUpdates) {
      if (topics && newData && Object.entries(newData) !== null) {
        const delay = topics.map((element: any) => {
          if (newData[element.id] && newData[element.id].delay)
            return [element.url.split("/")[2], newData[element.id].delay];
        });
        setDelayArray(delay);
      }
      if (startSubscribe) {
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

        const predictedValues = predictValues(newXValues, newYValues);
        if (config.output) {
          let op = config.output[0];
          const topic = topics.find((x: Topic) => x.id === config.topic);
          if (topic !== undefined) {
            let index = topic.channels
              .map((channel) => channel.channelName)
              .indexOf(op);
            let datap = newYValues[config.topic + "/" + index];
            let tempTimevalues = newXValues[config.topic + "/" + index];

            setDatapoints(datapoints.concat(datap));
            setTime(time.concat(tempTimevalues));
            setPredicted(predicted.concat(predictedValues));
            setD([
              {
                y: predicted.concat(predictedValues),
                type: "scattergl",
                name: "Predicted",
                x: time.concat(tempTimevalues),
                marker: { color: "#e69a8d" },
                hoverinfo: "none",
              },
              {
                y: datapoints.concat(datap),
                x: time.concat(tempTimevalues),
                name: "Real value",
                type: "scattergl",
                marker: { color: "#5f4a8b" },
                hoverinfo: "none",
              },
            ]);
          }
        }
      }
    }
  };

  const [d, setD] = useState([] as any[]);
  // add channels to selectedChannels here, then call addChannel(..) when the user presses add channel
  const add = async (channel: Source) => {
    if (
      selectedChannels.filter(
        (e: Source) => JSON.stringify(e) === JSON.stringify(channel)
      ).length === 0
    ) {
      const channels = selectedChannels.concat(channel);
      // set fetching here
      setAddingChannel(channel.channel.channelName);

      addChannel(projectId, dashboardId, tile.id, JSON.stringify(channel)).then(
        () => {
          setSelectedChannels(channels);
          setAddingChannel("");
          setData([]); // reset when adding????
          _addChannel(channel, tile); // for global state management
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

  const predictManually = () => {
    if (model) {
      let inputToPredicting = config.input.map((key: string) => {
        return Number(inputValuesForPrediction[key]);
      });
      if (inputToPredicting.length === config.input.length) {
        let val = predictVal(inputToPredicting);
        setManuallyPredictedOutput(val);
        return val;
      } else {
        return NaN;
      }
    } else {
      return NaN;
    }
  };

  const [inputValuesForPrediction, setInputValuesForPrediction] = useState(
    {} as any
  );

  const onChange = (sensorName: string) => (e: any) => {
    let obj = inputValuesForPrediction;
    if (config.differentValueRanges) {
      obj[sensorName] = standardize(
        e.target.value,
        config.sensors[sensorName].mean,
        config.sensors[sensorName].std
      );
    } else {
      obj[sensorName] = normalize(
        e.target.value,
        config.sensors[sensorName].min,
        config.sensors[sensorName].max
      );
    }

    setInputValuesForPrediction(obj);
    let prediction = predictManually();
    if (prediction !== null) {
      setManuallyPredictedOutput(prediction);
    } else {
      console.log("error");
    }
  };

  return (
    <S.PlotComponent>
      <S.Header>
        <S.HeaderLeft>
          <S.Handler className="Handler">
            <FaGripVertical size={"1.2em"} />
          </S.Handler>
          <S.PlotName>Predictive tile: {tile.name}</S.PlotName>
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
                <div>
                  <S.PlotSettingsSubTitle>
                    Predict manually:
                  </S.PlotSettingsSubTitle>
                  {config &&
                    config.input &&
                    config.input.map((inputValue: string) => (
                      <div key={inputValue}>
                        {inputValue}:{" "}
                        <input onChange={onChange(inputValue)} type="number" />
                      </div>
                    ))}
                  {manuallyPredictedOutput !== null && (
                    <div>Predicted value: {manuallyPredictedOutput}</div>
                  )}
                  <div style={{ display: "flex" }}>
                    Input parameters:{" "}
                    {config &&
                      config.input &&
                      config.input.map((input: string, index: number) => {
                        if (index === config.input.length - 1) {
                          return <div>{input}</div>;
                        } else {
                          return <div>{input}, </div>;
                        }
                      })}
                  </div>
                  {config && config.output && (
                    <div>Predicting on {config.output[0]}</div>
                  )}
                </div>
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
      <div id={"sensor" + tile.id}>
        {delayArray.length === 0 ? (
          <ClipLoader
            size={15}
            //size={"150px"} this also works
            color={"#123abc"}
            loading={true}
          />
        ) : (
          <S.Plot>
            <Plot
              style={{ width: "100%" }}
              layout={layout}
              config={{ responsive: true }}
              frames={[]}
              data={d}
              useResizeHandler={true}
            />
          </S.Plot>
        )}
      </div>
    </S.PlotComponent>
  );
}
