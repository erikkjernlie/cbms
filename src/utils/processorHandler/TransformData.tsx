import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";
import ReactSelect from "react-select";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { fetchTopics } from "src/backendAPI/topics";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import {
  Channel,
  Datasource,
  RawTopic,
  Source,
  Topic,
  TopicsJson,
} from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";

import * as S from "../../Components/Dashboard/Tile/Tile.style";
import Button from "../../Components/UI/Button/Button";
import TextInput from "../../Components/UI/TextInput/TextInput";
import useDatasourceStore from "../../stores/project/datasourceStore";
import { useProcessorStarter } from "./processorStarter";

Modal.setAppElement("body");

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  propTopics: Topic[];
  edit: boolean;
  source: Datasource;
  projectId: string;
}

const filterTypes = ["lowpass", "highpass", "bandpass", "bandstop"];

const customStyles = {
  content: {
    backgroundColor: "white",
    width: "70%",
    border: "1px solid #ccc",
    boxShadow: "1px 1px 1px black",
    padding: "32px",
    left: "15%",
    top: "30%",
    transition: "all 1s ease-out",
  },
};

export default function TransformData(props: Props) {
  const { isOpen, toggleModal, propTopics, edit, source, projectId } = props;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState(propTopics || ([] as Topic[]));
  const [datasource, setDatasource] = useState({} as Topic);
  const [input, setInput] = useState({} as Source);
  const [processorName, setProcessorName] = useState("");
  const [initParams, setInitParams] = useState({
    btype: "highpass",
    sample_spacing: 20,
    cutoff_frequency: 5,
    buffer_size: 50,
    order: 10,
  });

  const { initiateProcessor, created, started } = useProcessorStarter();

  // Setting data source based on user selection
  const setSource = (e: any) => {
    const element = topics.find((x: Topic) => e.value === x.url.split("/")[2]);
    if (element !== undefined) {
      setDatasource(element);
    }
  };

  // Change value of init param
  const setInitParam = (e: any, key: string) => {
    e.preventDefault();
    let value;
    switch (key) {
      case "order":
        value = parseInt(e.target.value.toString());
        break;
      case "sample_spacing":
        value = parseInt(e.target.value.toString());
        break;
      case "cutoff_frequency":
        value = parseFloat(e.target.value.toString());
        break;
      case "buffer_size":
        value = parseInt(e.target.value.toString());
        break;
      default:
        value = e.target.value;
        break;
    }

    setInitParams({
      ...initParams,
      [key]: value,
    });
  };

  // Updating topics in order to subscribe to the new processor
  const updateSources = async () => {
    const topicsJSON = (await fetchTopics()) as TopicsJson;
    if (!topicsJSON) {
      setError("Could not load data sources");
    }
    if (!topicsJSON) return;
    let tempTopics = Object.entries(topicsJSON).map((tempTopic: any) => {
      let id = tempTopic[0];
      let topic = tempTopic[1] as RawTopic;
      return {
        id: id,
        url: topic.url,
        byteFormat: topic.byte_format,
        channels: makeChannels(topic) || [],
      } as Topic;
    });
    setTopics(tempTopics);
  };

  const initiateFilter = async () => {
    setLoading(true);
    const errorResponse = await initiateProcessor(projectId, "butterworth", {
      name: processorName,
      params: initParams,
      channel: input,
    });
    setLoading(false);
    if (errorResponse && errorResponse.length > 0) {
      setError(errorResponse);
    } else {
      setError("");
      updateSources();
      toggleModal();
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        style={customStyles}
        contentLabel="AddTransformation"
      >
        <S.RightCorner onClick={toggleModal}>
          <MdClose />
        </S.RightCorner>
        <S.PlotConfig>
          {error &&
            toast.error(
              () => (
                <div>
                  <div>{error}</div>
                  <Button onClick={() => setError("")}>OK</Button>
                </div>
              ),
              {
                position: toast.POSITION.BOTTOM_CENTER,
              }
            )}
          <S.ModalMainHeader>Add New Filtered Datasource</S.ModalMainHeader>
          {loading && (
            <Q.Columns>
              <ClipLoader size={70} color={"darkgrey"} loading={true} />
            </Q.Columns>
          )}

          {!loading && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                initiateFilter();
              }}
              id="addTransformation"
            >
              <Q.Columns>
                <Q.ColumnLeft>
                  <div>Filter name</div>
                </Q.ColumnLeft>
                <Q.ColumnRight>
                  <TextInput
                    value={processorName}
                    onChange={(e: any) => setProcessorName(e.target.value)}
                  />
                </Q.ColumnRight>
              </Q.Columns>
              <Q.Columns>
                <Q.ColumnLeft>
                  <p>Select datasource and sensor</p>
                </Q.ColumnLeft>
                <Q.ColumnRight>
                  <ReactSelect
                    className="Select"
                    onChange={setSource}
                    options={topics.map((topic: Topic, index: number) => ({
                      value: topic.url.split("/")[2],
                      label: topic.url.split("/")[2],
                    }))}
                  />
                  {datasource && datasource.channels && (
                    <ReactSelect
                      className="Select"
                      onChange={(e: any) =>
                        setInput({ topicId: datasource.id, channel: e.value })
                      }
                      options={datasource.channels.map((channel: Channel) => {
                        return {
                          value: channel,
                          label: channel.channelName,
                        };
                      })}
                    />
                  )}
                </Q.ColumnRight>
              </Q.Columns>
              <Q.Columns>
                <Q.ColumnLeft>
                  <div>Set filter details</div>
                </Q.ColumnLeft>
                <Q.ColumnRight>
                  <Q.Row>
                    <Q.Label>Filter type</Q.Label>
                    <ReactSelect
                      className="Select"
                      onChange={(e: any) =>
                        setInitParams({
                          ...initParams,
                          ["btype"]: e.value,
                        })
                      }
                      options={filterTypes.map(
                        (filter: string, index: number) => {
                          return {
                            value: filter,
                            label: filter,
                          };
                        }
                      )}
                    />
                  </Q.Row>
                  <Q.Row>
                    <Q.Label>Frequency</Q.Label>
                    <TextInput
                      value={initParams.sample_spacing}
                      className="Curve"
                      type="number"
                      onChange={(e) => setInitParam(e, "sample_spacing")}
                    />
                  </Q.Row>
                  <Q.Row>
                    <Q.Label>Buffer size</Q.Label>
                    <TextInput
                      className="Curve"
                      type="number"
                      value={initParams.buffer_size}
                      onChange={(e) => setInitParam(e, "buffer_size")}
                    />
                  </Q.Row>
                  <Q.Row>
                    <Q.Label>Cutoff Frequency</Q.Label>
                    <TextInput
                      className="Curve"
                      type="number"
                      value={initParams.cutoff_frequency}
                      onChange={(e) => setInitParam(e, "cutoff_frequency")}
                    />
                  </Q.Row>
                  <Q.Row>
                    <Q.Label>Order</Q.Label>
                    <TextInput
                      className="Curve"
                      type="number"
                      value={initParams.order}
                      onChange={(e) => setInitParam(e, "order")}
                    />
                  </Q.Row>
                </Q.ColumnRight>
              </Q.Columns>
              <Q.Columns>
                <Q.ColumnLeft></Q.ColumnLeft>
                <Q.ColumnRight>
                  <Button
                    className="centered"
                    type="submit"
                    form="addTransformation"
                  >
                    Create
                  </Button>
                </Q.ColumnRight>
              </Q.Columns>
            </form>
          )}
        </S.PlotConfig>
      </Modal>
    </div>
  );
}
