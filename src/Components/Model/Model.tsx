import React, { useEffect, useRef, useState } from "react";
import {
  Md3DRotation,
  MdAddToQueue,
  MdChevronRight,
  MdClose,
  MdDashboard,
  MdLineStyle,
} from "react-icons/md";
import { useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { fetchTopics } from "src/backendAPI/topics";
import Button from "src/Components/UI/Button/Button";
import { Select } from "src/Components/UI/Dropdown/Dropdown.style";
import TextInput from "src/Components/UI/TextInput/TextInput";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { RawTopic, Topic, TopicsJson } from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";

import * as S from "./Model.style";

interface Props {
  modelId: string;
  projectId: string;
  insidePlotComponent?: boolean;
}

interface DigitalTwin {
  name: string;
  parts: string[];
}

export default function Model(props: Props) {
  const { modelId, projectId, insidePlotComponent } = props;

  const [digTwin, setDigTwin] = useState({
    name: "test",
    parts: ["part1", "part2"],
  } as DigitalTwin);
  const [myApp, setMyApp] = useState(null as any);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState({} as Topic[]);
  const [selectedModelStyle, setSelectedModelStyle] = useState("style1");
  const [loading, setLoading] = useState(false);
  const [editingSensor, setEditingSensor] = useState("");
  const [sensorSize, setSensorSize] = useState(0.1);
  const [selectValue, setSelectValue] = useState({} as Topic);
  const [selectedChannels, setSelectedChannels] = useState([] as any[]);
  const [showSideBar, setShowSideBar] = useState(true);
  const [updateModel, setUpdateModel] = useState(false);

  const history = useHistory();

  const { newData, setDatasources, subscribeDatasources } = useDataStore(
    (state) => ({
      newData: state.newData,
      setDatasources: state.setDatasources,
      subscribeDatasources: state.subscribeDatasources,
    })
  );

  const { currentModel, deleteModel, fetching } = useProjectStore((state) => ({
    currentModel: state.currentModel,
    deleteModel: state.deleteModel,
    fetching: state.fetching,
  }));

  const modelStyles = [
    "surface",
    "surface_mesh",
    "outline_mesh",
    "lines",
    "points",
    "outline",
  ];

  useEffect(() => {
    loadSources();
  }, []);

  // Loads 3D model when a new model is selected (clicked on)

  const setSize = (size: number) => {
    setSensorSize(size);
  };

  const addSensor = () => {
    setEditingSensor("adding");
  };

  const removeSensor = () => {
    setEditingSensor("deleting");
  };

  const loadSources = async () => {
    const topicsJSON = (await fetchTopics()) as TopicsJson;
    if (!topicsJSON) {
      setError("Could not load data sources");
    }
    if (!topicsJSON) return;
    let topics = Object.entries(topicsJSON).map((tempTopic: any) => {
      let id = tempTopic[0];
      let topic = tempTopic[1] as RawTopic;
      return {
        id: id,
        url: topic.url,
        byteFormat: topic.byte_format,
        channels: makeChannels(topic) || [],
      };
    });
    setTopics(topics);
  };

  const handleSelectChange = (e: any) => {
    const element = topics.find(
      (x: Topic) => e.target.value === x.url.split("/")[2]
    ) as Topic;
    setSelectValue(element);
  };

  const add = async (topicId: string, channel: any) => {
    if (
      !selectedChannels ||
      selectedChannels.filter(
        (e: any) =>
          e.id[0] === topicId &&
          e.id[1] === channel.id &&
          e.name === channel.channelName
      ).length === 0
    ) {
      const channels = selectedChannels.concat({
        id: [topicId, channel.id],
        name: channel.channelName,
      });
      setSelectedChannels(channels);
    }
  };

  const finishedAddingSensor = () => {
    setEditingSensor("");
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {error && <div>{error}</div>}
      {loading && <ClipLoader loading={true} size={70} color="blue" />}
      {editingSensor === "adding" && (
        <div>
          <S.AddingSensor>
            <S.Title>See data from sensor</S.Title>

            <S.SideBarTitle>Choose scale of sensor size: </S.SideBarTitle>
            <S.SideBarTitle>
              <TextInput
                value={sensorSize}
                type="number"
                onChange={(e: any) => setSize(e.target.value)}
                placeholder="choose size"
              />{" "}
            </S.SideBarTitle>
            <S.SideBarTitle>
              Select sensor data:
              <div>
                {topics && (
                  <React.Fragment>
                    <Select onChange={handleSelectChange}>
                      <option>None</option>

                      {Object.entries(topics).map((topic: any) => {
                        let key = topic[0];
                        let value = topic[1];
                        return (
                          <option key={key}>{value.url.split("/")[2]}</option>
                        );
                      })}
                    </Select>
                  </React.Fragment>
                )}
                {selectValue &&
                  selectValue.channels &&
                  selectValue.channels.map((channel: any) => {
                    return (
                      <div
                        key={channel.id}
                        onClick={() => add(selectValue.id, channel)}
                      >
                        {channel.channelName}
                      </div>
                    );
                  })}
              </div>
            </S.SideBarTitle>
            <Button onClick={() => finishedAddingSensor()} className="Blue">
              Finished adding sensor
            </Button>
          </S.AddingSensor>
        </div>
      )}
      <div
        id="noModel"
        style={{
          position: "absolute",
          top: "300px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div>No model</div>
      </div>
      <S.ModelOptions onClick={() => setShowSideBar(true)}>
        Show sidebar
        <MdChevronRight size={"18px"} />
      </S.ModelOptions>

      <div
        id="loadingModel"
        style={{
          position: "absolute",
          top: "300px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div>
          <ClipLoader
            size={70}
            //size={"150px"} this also works
            color={"white"}
            loading={true}
          />
        </div>
      </div>
      {showSideBar && !insidePlotComponent && (
        <S.SideBar>
          <S.SideBarRow>
            <S.SideBarTitleContainer>
              <MdDashboard size={"18px"} />
              <S.SideBarTitle>{modelId}</S.SideBarTitle>
            </S.SideBarTitleContainer>
            {digTwin && digTwin.parts && (
              <S.SideBarItem>
                Antall deler: {digTwin.parts.length}
              </S.SideBarItem>
            )}
            {digTwin && digTwin.name && (
              <S.SideBarItem>Filnavn: {digTwin.name}</S.SideBarItem>
            )}
          </S.SideBarRow>
          <S.SideBarRow>
            <S.SideBarTitleContainer>
              <Md3DRotation size={"18px"} />
              <S.SideBarTitle>Choose draw style</S.SideBarTitle>
            </S.SideBarTitleContainer>
            {modelStyles.map((style) => {
              return (
                <S.SideBarItem
                  selected={style === selectedModelStyle}
                  onClick={() => {
                    setSelectedModelStyle(style);
                  }}
                >
                  {style}
                </S.SideBarItem>
              );
            })}
          </S.SideBarRow>
          <S.SideBarRow>
            <S.SideBarTitleContainer>
              <MdAddToQueue size={"18px"} />
              <S.SideBarTitle>Demo: Add sensor</S.SideBarTitle>
            </S.SideBarTitleContainer>
            <S.SideBarItem
              onClick={() => addSensor()}
              disabled={editingSensor !== ""}
            >
              Add sensor
            </S.SideBarItem>

            {editingSensor && (
              <S.SideBarItem
                onClick={() => {
                  setEditingSensor("");
                }}
              >
                Stop {editingSensor} sensors
              </S.SideBarItem>
            )}
          </S.SideBarRow>
          <S.SideBarRow>
            <S.SideBarTitleContainer>
              <MdLineStyle size={"18px"} />
              <S.SideBarTitle>Demo: 3D visualiations</S.SideBarTitle>
            </S.SideBarTitleContainer>
            <S.SideBarItem className="Black">
              Show distance result
            </S.SideBarItem>
            <S.SideBarItem className="Black">Global index result</S.SideBarItem>
            <S.SideBarItem className="Black">Local index result</S.SideBarItem>
            <S.SideBarItem className="Black">Normal - no colors</S.SideBarItem>
          </S.SideBarRow>
          <S.SideBarRow onClick={() => setShowSideBar(false)} className="Blue">
            <S.SideBarTitleContainer>
              <MdClose size={"18px"} />
              <S.SideBarTitleClose>Hide sidebar</S.SideBarTitleClose>
            </S.SideBarTitleContainer>
          </S.SideBarRow>
          <S.SideBarRow onClick={() => setShowSideBar(false)} className="Blue">
            <S.SideBarTitleContainer>
              <MdClose size={"18px"} />
              <Button
                className="Black"
                loading={fetching}
                onClick={() => deleteModel(projectId, modelId, history)}
              >
                Delete model
              </Button>
            </S.SideBarTitleContainer>
          </S.SideBarRow>
        </S.SideBar>
      )}
      <canvas
        id="canvas-model"
        height={insidePlotComponent ? "100%" : "600px"}
      ></canvas>
    </div>
  );
}
