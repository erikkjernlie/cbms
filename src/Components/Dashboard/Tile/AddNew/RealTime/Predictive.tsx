import cloneDeep from "lodash.clonedeep";
import React, { useEffect, useState } from "react";
import CSVReader from "react-csv-reader";
import Select from "react-select";
import * as S from "src/Components/Dashboard/Dashboard.style";
import Button from "src/Components/UI/Button/Button";
import { storage } from "src/firebase";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import TrainModel from "src/utils/MachineLearning/TrainModel.jsx";
import { ID } from "src/utils/util";

interface Props {
  handleSelectChange: (e: any) => void;
  selectValue: Topic;
  topics: Topic[];
  add: (source: Source) => void;
  remove: (source: Source) => void;
  clear: () => void;
  tile: TileFormat;
  projectId: string;
  setTile: (tile: TileFormat) => void;
  type: "real-time" | "history" | "predictions" | "history-predictions";
}

const Predictive = React.memo((props: Props) => {
  console.log("predictive tile");
  const {
    handleSelectChange,
    selectValue,
    topics,
    add,
    tile,
    clear,
    setTile,
    projectId,
    remove,
    type
  } = props;

  const [selectedChannels, setSelectedChannels] = useState([] as any[]);

  const [progress, setProgress] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(false);
  const [startingTraining, setStartingTraining] = useState(false);

  const [localIsComplex, setLocalIsComplex] = useState(false);
  const [localReduceTrainingTime, setLocalReduceTrainingTime] = useState(false);

  const [lastStep, setLastStep] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);
  const [finishedTraning, setFinishedTraining] = useState(false);
  const [output, setOutput] = useState("");
  const [inputs, setInputs] = useState([] as string[]);
  const [reportData, setReportData] = useState("");

  const [config, setConfig] = useState({
    input: [],
    output: [],
    internal: [],
    sensors: {},
    sensorNames: [],
    sensorIndexes: {},
    projectName: "",
    differentValueRanges: false,
    reduceTrainingTime: false,
    isComplex: false,
    data: [],
    predictedValueAbsoluteError: 0,
    predictedValuePercentageError: 0
  } as any);

  useEffect(() => {
    setProjectName(tile.name);
    setStep2(true);
  }, [tile]);

  useEffect(() => {
    setProjectName(ID());
    setStep2(true);
  }, []);

  useEffect(() => {
    console.log("CONFIG", config);
  }, [config]);

  useEffect(() => {
    console.log("setting");
    setTile({
      ...tile,
      category: type
    });
  }, []);

  useEffect(() => {
    console.log("PLOT", tile);
  }, [tile]);

  const addChannel = (channels: Channel[]) => {
    console.log("adding", channels);
  };

  const setConfigVariable = (variable: string, value: any) => {
    console.log("setting variable", variable, "to", value, "in config", config);
    const c: Record<string, any> = cloneDeep(config);
    c[variable] = value;
    console.log("NEW CONFIG", c);
    setConfig(c);
  };

  const uploadData = async (data: any, project: any, progressMethod: any) => {
    let rows_joined = data.map((x: any) => x.join(","));
    let csvstr = rows_joined.join("\n");
    const csvblob = new Blob([csvstr], { type: "application/vnd.ms-excel" });
    const uploadTaskData = storage.ref(`${project}/data.csv`).put(csvblob);
    uploadTaskData.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("upload data", progress);
        progressMethod(progress);
      },
      error => {
        console.log(error);
      },
      async () => {
        console.log("UPLOAD COMPLETE");
        await uploadConfig(
          config,
          projectId + "/" + config["projectName"],
          setProgress
        );

        console.log("redirect");
      }
    );
  };

  const uploadConfig = async (
    config: any,
    project: any,
    progressMethod: any
  ) => {
    const configblob = new Blob([JSON.stringify(config)], {
      type: "application/json"
    });
    const uploadTaskConfig = storage
      .ref(`${project}/config.json`)
      .put(configblob);
    // observer for when the state changes, e.g. progress
    uploadTaskConfig.on(
      "state_changed",
      (snapshot: any) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        progressMethod(progress);
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        console.log("COMPLETED 2");
        setLastStep(true);
      }
    );
  };

  const setProjectName = (value: any) => {
    setConfigVariable("projectName", value);
  };

  const startTraining = async () => {
    setStartingTraining(true);
    if (config.output && config.output.length === 1) {
      await handleUpload();
    } else {
      alert("Can only train with one output");
    }
  };

  const setSensorNames = (value: any) => {
    const c: Record<string, any> = cloneDeep(config);
    c["sensorNames"] = value;
    console.log("NEW CONFIG", c);
    let content = {} as Record<string, any>;
    for (var i = 0; i < value.length; i++) {
      content[value[i] as string] = i;
    }
    c["sensorIndexes"] = content;
    console.log("C is now", c);
    setConfig(c);
  };

  const selectDataset = (data: any) => {
    console.log("data", data);
    setSelectedDataset(true);
    setDataPoints(data);
    console.log("data[0]", data[0]);
    let names = data[0] as string[];
    setSensorNames(names);
    setStep4(true);
  };

  const handleUpload = async () => {
    setUploading(true);
    console.log("start upload");
    await uploadData(
      dataPoints,
      projectId + "/" + config["projectName"],
      setProgress
    );

    setUploading(false);

    if (config && config.projectName && config.projectName.length > 0) {
      if (localStorage.getItem("projects")) {
        localStorage.setItem(
          "projects",
          localStorage.getItem("projects") + " " + config.projectName
        );
      } else {
        localStorage.setItem("projects", config.projectName);
      }
    }
    // props.history.push(config.projectName + "/configuration");
  };

  const changeDatasetFact = (id: any) => {
    switch (id) {
      case "reduceTrainingTime":
        setConfigVariable("reduceTrainingTime", !localReduceTrainingTime);
        setLocalReduceTrainingTime(!localReduceTrainingTime);
        break;
      case "isComplex":
        setConfigVariable("isComplex", !localIsComplex);
        setLocalIsComplex(!localIsComplex);
        break;
      default:
        break;
    }
  };

  const handleOutput = (e: any) => {
    if (output !== "" && output !== e.value) {
      // remove
      remove({
        topicId: config.topic,
        channel: {
          channelName: output,
          id: config.sensorIndexes[output]
        } as Channel
      });
    }
    console.log("OUTPUT", e);
    setOutput(e.value);
    setConfigVariable("output", [e.value]);
    if (topics !== undefined) {
      let topic = topics.find((topic: Topic) => topic.id === config.topic);
      if (topic !== undefined) {
        let indexOfElement = topic.channels
          .map((channel: Channel) => channel.channelName)
          .indexOf(e.value);
        add({
          topicId: config.topic,
          channel: { channelName: e.value, id: indexOfElement }
        });
      }
    }
    setStep5(true);
  };

  return (
    <div>
      <Q.Columns>
        <Q.ColumnLeft noPadding={false}>Inspect dataset</Q.ColumnLeft>
        <Q.ColumnRight noPadding={false}>
          Before doing any predictions, we strongly recommend to inspect the
          dataset.
        </Q.ColumnRight>
      </Q.Columns>
      <Q.Columns>
        <Q.ColumnLeft noPadding={false}>
          <Q.SmallText>
            Choose real-time datasource. The sensor you want to predict must
            exist in the datasource
          </Q.SmallText>
        </Q.ColumnLeft>
        <Q.ColumnRight noPadding={false}>
          <Select
            className="Select"
            onChange={(e: any) => {
              let topic = topics.find(
                (topic: Topic) => topic.url.split("/")[2] === e.value
              );
              setStep3(true);
              if (topic !== undefined) {
                setConfigVariable("topic", topic.id);
              }
            }}
            options={topics.map((topic: Topic, index: number) => ({
              value: topic.url.split("/")[2],
              label: topic.url.split("/")[2]
            }))}
          />
        </Q.ColumnRight>
      </Q.Columns>
      {step3 && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={false}>Upload dataset (.csv)</Q.ColumnLeft>
          <Q.ColumnRight noPadding={false}>
            <CSVReader
              cssClass="react-csv-input"
              onFileLoaded={(e: any) => selectDataset(e)}
            />
          </Q.ColumnRight>
        </Q.Columns>
      )}
      {topics && step4 && (
        <React.Fragment>
          <Q.Columns>
            <Q.ColumnLeft noPadding={true}>
              <S.Column>
                <Q.SmallText>
                  Which value do you want to predict? (only one value)
                </Q.SmallText>
              </S.Column>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={true}>
              {config && config.sensorNames && (
                <Select
                  className="Select"
                  onChange={handleOutput}
                  options={config.sensorNames.map((sensor: string) => ({
                    value: sensor,
                    label: sensor
                  }))}
                />
              )}
            </Q.ColumnRight>
          </Q.Columns>
          <Q.Columns>
            <Q.ColumnLeft noPadding={true}>
              <S.Column>
                <Q.SmallText>
                  Which values do you want to use to predict ...?
                </Q.SmallText>
              </S.Column>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={true}>
              {config && config.sensorNames && (
                <Select
                  className="Select"
                  isMulti
                  onChange={(newList: any, object: any) => {
                    if (object.action === "select-option") {
                      console.log("add", object);
                      const newInputs = inputs.concat(object.option.value);
                      setInputs(newInputs);
                      setConfigVariable("input", newInputs);
                      console.log("topics", topics);
                      console.log("ADD", selectValue, object, config);
                      if (topics !== undefined) {
                        let topic = topics.find(
                          (topic: Topic) => topic.id === config.topic
                        );
                        if (topic !== undefined) {
                          let indexOfElement = topic.channels
                            .map((channel: Channel) => channel.channelName)
                            .indexOf(object.option.value);
                          add({
                            topicId: config.topic,
                            channel: {
                              channelName: object.option.value,
                              id: indexOfElement
                            }
                          });
                        }
                      }
                    } else if (object.action === "remove-value") {
                      console.log("remove", object);
                      const newInputs = inputs.filter(
                        (s: string) => s !== object.removedValue.value
                      );
                      setInputs(newInputs);
                      setConfigVariable("input", newInputs);
                      if (topics !== undefined) {
                        let topic = topics.find(
                          (topic: Topic) => topic.id === config.topic
                        );
                        if (topic !== undefined) {
                          let indexOfElement = topic.channels
                            .map((channel: Channel) => channel.channelName)
                            .indexOf(object.removedValue.value);
                          remove({
                            topicId: config.topic,
                            channel: {
                              channelName: object.removedValue.value,
                              id: indexOfElement
                            }
                          });
                        }
                      }
                    } else if (object.action === "clear") {
                      console.log("clear", object);
                      setInputs([]);
                      setConfigVariable("input", []);
                      clear();
                    }
                  }}
                  options={config.sensorNames
                    .filter((s: string) => s !== output)
                    .map((sensor: string) => {
                      return {
                        value: sensor,
                        label: sensor
                      };
                    })}
                />
              )}
            </Q.ColumnRight>
          </Q.Columns>
        </React.Fragment>
      )}

      {step5 && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={true}>
            Do you consider the data to be very complex? Any function that can
            be approximated with a (non-high-degree) polynomial is generally not
            considered complex.
          </Q.ColumnLeft>
          <Q.ColumnRight noPadding={true}>
            <input
              type="checkbox"
              checked={localIsComplex}
              onClick={() => changeDatasetFact("isComplex")}
            />
          </Q.ColumnRight>
        </Q.Columns>
      )}
      {step5 && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={true}>
            Do you want to possibly reduce the training time by discarding
            covariant features? Training machine learning models require many
            calculations, which can be sped up by considering a reduced number
            of features.
          </Q.ColumnLeft>
          <Q.ColumnRight noPadding={true}>
            {" "}
            <input
              type="checkbox"
              checked={localReduceTrainingTime}
              onClick={() => changeDatasetFact("reduceTrainingTime")}
            />
          </Q.ColumnRight>
        </Q.Columns>
      )}

      {step5 && (
        <Q.Columns>
          <Q.ColumnLeft>Start training model</Q.ColumnLeft>
          <Q.ColumnRight>
            <Button
              className="Simple"
              onClick={startTraining}
              loading={startingTraining}
            >
              Start training your model
            </Button>
          </Q.ColumnRight>
        </Q.Columns>
      )}
      {startingTraining && lastStep && (
        <TrainModel
          name={projectId + "/" + config.projectName}
          setFinishedTraining={(finishedTraining: boolean) =>
            setFinishedTraining(finishedTraining)
          }
        />
      )}
      {finishedTraning && <div>Finished training</div>}
      {/*finishedTraning && <Project name={config.projectName} config={config} />*/}
    </div>
  );
});

export default Predictive;
