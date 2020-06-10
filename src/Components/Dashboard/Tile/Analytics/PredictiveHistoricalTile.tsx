import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { fetchTopics } from "src/backendAPI/topics";
import * as T from "src/Components/Navigation/Navbar/Navbar.style";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { Buffer, TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import { DownloadData } from "src/utils/dataHandler/DownloadData";
import parseData from "src/utils/dataHandler/ReadData";
import { fetchProcessedConfig } from "src/utils/MachineLearning/transferLib";
import { plottingColors } from "src/utils/styles/styles";
import { byteToString } from "src/utils/util";

import * as S from "../Tile.style";

import "src/utils/styles/styles.css";
import { getHistoricalFromSource } from "src/backendAPI/transformations";

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

const PredictiveHistoricalTile = React.memo((props: Props) => {
  const { topics, tile, dashboardId, projectId, gridLayout } = props;

  const loadDataInMilliseconds = [10000, 30000, 60000, 180000];

  const [data, setData] = useState({} as Buffer);
  const [error, setError] = useState("");
  const [tileData, setTileData] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [csvData, setCsvData] = useState([] as any[]);
  const [topic, setTopic] = useState({} as Topic);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [predictedValues, setPredictedValues] = useState([] as number[]);
  const [selectedChannels, setSelectedChannels] = useState(
    tile.channels || ([] as any[])
  );

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

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

  // PROBLEM: NOT SHOWING LABEL FOR PREDICTED VALUE
  // NOT PREDICTING CORRECTLY? USING OPPOSITE VALUE?
  // real-time does not work correctly

  const remove = (channel: Source) => {
    if (selectedChannels.some((e: Source) => channel === e)) {
      const channels = selectedChannels.filter((e: Source) => channel !== e);
      setSelectedChannels(channels);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const submit = (time: number) => {
    setLoading(true);
    setLoadingTime(time);
    let now = Date.now();

    getHistoricalFromSource("0000", now, time).then((response) => {
      //const reader = resp.body?.getReader();
      if (response !== null) {
        response
          .arrayBuffer()
          .then((resp) => {
            const sourceID = byteToString(resp.slice(0, 4));
            let index = topics
              .map((topic: Topic) => topic.id)
              .indexOf(sourceID);
            if (index === -1) {
              setError("No data");
            } else {
              let parsedData = parseData(resp.slice(4), topics[index]);
              setTopic(topics[index]);
              setData(parsedData);
            }
          })
          .then(() => {
            setLoading(false);
          });
      }
    });
  };

  // TODO: HVER GANG JEG ENDRER PÅ ANTALL SENSORER I HISTORY; SÅ HENTER DNE ALLE VERDIER PÅ NYTT

  useEffect(() => {
    if (Object.entries(topics).length !== 0) {
      submit(10000);
    }
  }, [topics]);

  useEffect(() => {
    if (Object.entries(data).length !== 0 && selectedChannels) {
      let tempData = selectedChannels.map((channel: any, index: number) => ({
        name: channel.channel.channelName,
        type: tile.type,
        x: data.timestamp_buffer as any[],
        y: data.value_buffer[channel.channel.id] as any[],
        mode: tile.mode,
        line: { color: plottingColors[index % plottingColors.length] },
      }));

      if (
        predictedValues &&
        config &&
        config.output &&
        config.output.length === 1
      ) {
        if (
          selectedChannels
            .map((channel: Source) => channel.channel.channelName)
            .indexOf("predicted_" + config.output[0]) < 0
        )
          tempData = tempData.concat({
            name: "predicted_" + config.output[0],
            type: tile.type,
            x: data.timestamp_buffer as any[],
            y: predictedValues as any[],
            mode: tile.mode,
            line: {
              color:
                plottingColors[selectedChannels.length % plottingColors.length],
            },
          });

        add(config.topic, {
          channelName: "predicted_" + config.output[0],
          id: selectedChannels.length,
        });
        setTileData(tempData);
      } else {
        setTileData(tempData);
      }
      const boom = tempData
        .map((da: any) => {
          let name = da.name;
          let yValues = da.y as number[];
          let xValues = da.x;
          return yValues.map((yValue: number, index: number) => {
            let xValue = new Date(xValues[index]).getTime();
            return {
              name: name,
              value: yValue,
              timestamp: xValue,
            };
          });
        })
        .flatMap((b) => b);
      setCsvData(boom);
    }
  }, [data, predictedValues]);

  const standardize = (x: any, mean: any, std: any) => {
    return (x - mean) / std;
  };

  const [config, setConfig] = useState({} as any);

  const [outputNames, setOutputNames] = useState([]);
  const [outputIndex, setOutputIndex] = useState(-1);
  const [manuallyPredictedOutput, setManuallyPredictedOutput] = useState(-1);
  const [inputIndexes, setInputIndexes] = useState([] as any[]);

  useEffect(() => {
    async function fetch() {
      try {
        if (projectId) {
          const model = await tf.loadLayersModel(
            "indexeddb://" + tile.name + "/model"
          );
          if (Object.keys(data).length !== 0) {
          }
          const c = await fetchProcessedConfig(projectId + "/" + tile.name);
          setModel(model);
          setConfig(c);
          const topicsJSON = await fetchTopics();
          let outputNames = topicsJSON[c.topic].output_names;
          let inputIndexes = [];
          for (let i = 0; i < c.input.length; i++) {
            let index = outputNames.indexOf(c.input[i]);
            inputIndexes.push({
              index: index,
              name: c.input[i],
            });
          }
          let outputIndex = outputNames.indexOf(c.output[0]);
          setOutputNames(outputNames);
          setOutputIndex(outputIndex);
          setInputIndexes(inputIndexes);
          if (Object.keys(data).length !== 0) {
            if (model) {
              const topic = topics.find((x: Topic) => x.id === c.topic);
              const predictedValues = predict(data, topic, c, model);
              setPredictedValues(predictedValues);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    }
    fetch();
  }, [data]);

  const normalize = (x: any, min: any, max: any) => {
    return (x - min) / (max - min);
  };

  const predictVal = (mlModel: any, dataPoint: any) => {
    const tensor = tf.tensor2d([dataPoint], [1, dataPoint.length]);
    const prediction = mlModel.predict(tensor).dataSync();
    tensor.dispose();
    if (prediction.length === 1) {
      return prediction[0];
    } else {
      return prediction;
    }
  };

  const predict = (data: any, topic: Topic, config: any, mlModel: any) => {
    let predictedValues = [] as number[];
    if (mlModel) {
      const numberOfDatapoints = data.timestamp_buffer.length;
      for (let i = 0; i < numberOfDatapoints; i++) {
        let modifiedX = [];
        for (
          let inputIndex = 0;
          inputIndex < config.input.length;
          inputIndex++
        ) {
          let input = config.input[inputIndex];
          let index = topic.channels
            .map((channel: Channel) => channel.channelName)
            .indexOf(input);
          let values = data.value_buffer[index];
          let obj = config.sensors[config.input[inputIndex]];

          if (config && config.differentValueRanges) {
            modifiedX.push(standardize(values[i], obj.mean, obj.std));
          } else {
            modifiedX.push(normalize(values[i], obj.min, obj.max));
          }
        }
        let predicted = predictVal(mlModel, modifiedX);
        predictedValues.push(predicted);
      }
    }
    return predictedValues;
  };

  const predictManually = () => {
    if (model) {
      let inputToPredicting = config.input.map((key: string) => {
        return Number(inputValuesForPrediction[key]);
      });
      if (inputToPredicting.length === config.input.length) {
        let val = 5; // predictVal(inputToPredicting);
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

  const [model, setModel] = useState(null as any);
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
            {loadDataInMilliseconds &&
              loadDataInMilliseconds.map(
                (milliseconds: number, index: number) => (
                  <Button
                    key={index}
                    className="Small"
                    onClick={() => submit(milliseconds)}
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
                            .map((source: Source) => source.channel.channelName)
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
              <S.Content>
                <div>
                  <S.PlotSettingsSubTitle>
                    Predict manually
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
                </div>
              </S.Content>
              <S.Content>
                <S.PlotSettingsSubTitle>
                  Do you want to download the data?
                </S.PlotSettingsSubTitle>
                <DownloadData
                  csvData={csvData}
                  fileName={tile.name}
                  type="csv"
                />
                <DownloadData
                  csvData={csvData}
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
export default PredictiveHistoricalTile;
