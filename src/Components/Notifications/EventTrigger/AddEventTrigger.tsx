import React, { useState } from "react";
import Modal from "react-modal";
import {
  createProcessor,
  startProcessorRequest,
} from "src/backendAPI/processors";
import Button from "src/Components/UI/Button/Button";
import { Select } from "src/Components/UI/Dropdown/Dropdown.style";
import SelectComponent from "src/Components/UI/Dropdown/Select";
import TextInput from "src/Components/UI/TextInput/TextInput";
import { useEventTriggers } from "src/hooks/project/project";
import useDatasourceStore from "src/stores/project/datasourceStore";
import { Channel, Source, Topic } from "src/types/datasource";
import { ID } from "src/utils/util";
import useProfileStore from "src/stores/profile/profileStore";

Modal.setAppElement("body");

interface Props {
  projectId: string;
  topics: Topic[];
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    minWidth: "900px",
    marginRight: "-30%",
    transform: "translate(-50%, -50%)",
    transition: "1s ease-in-out",
  },
};

export default function AddEventTrigger(props: Props) {
  const { projectId, topics } = props;

  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState({} as Topic);
  const [selectedSensors, setSelectedSensors] = useState([] as Source[]);
  const [data, setData] = useState({} as any);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [receiveSMS, setReceiveSMS] = useState(false);

  const { addSourceToDatabase } = useDatasourceStore();
  const { createEventTrigger } = useEventTriggers();

  const handleSelectChange = (e: any) => {
    const element = topics.find(
      (x: Topic) => e.target.value === x.url.split("/")[2]
    );
    if (element !== undefined) {
      setSelectValue(element);
    }
  };

  const { profile } = useProfileStore((state) => ({
    profile: state.profile,
  }));

  const submit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const createData = new FormData();
    if (selectValue) {
      let id = "e_trigger_" + ID();
      createData.append("id", id);
      createData.append("blueprint", "event_trigger");
      createData.append("topic", selectValue.id);
      if (receiveSMS && profile && profile.admin) {
        createData.append("phoneNumber", profile.phoneNumber);
      }
      createData.append(
        "init_params",
        JSON.stringify({
          number_of_inputs: selectValue.channels.length,
          trigger_inputs: JSON.stringify(data),
          project_id: projectId,
          phone_number: receiveSMS ? profile.phoneNumber : "00000000",
        } as any)
      );

      createProcessor(createData).then(() => {
        addSourceToDatabase(projectId, id, "processor");
        const startData = new FormData();
        selectedSensors.forEach((sensor: Source, index: number) => {
          startData.append("sensor", JSON.stringify(sensor));
          startData.append("input_ref", index.toString());
          startData.append("measurement_ref", sensor.channel.id.toString());
          startData.append("measurement_proportion", "1");
        });
        startData.append("output_ref", "0");
        startData.append("id", id);
        startProcessorRequest(startData).then(() => {
          createEventTrigger(projectId, id, selectValue.id, {
            number_of_inputs: selectValue.channels.length,
            trigger_inputs: JSON.stringify(data),
            project_id: projectId,
          } as any).then(() => {
            setLoading(false);
            setModalIsOpen(false);
          });
        });
      });
    }
  };

  const setSeverity = (
    index: string,
    name: string,
    severity: string,
    severityLevel: string
  ) => {
    setData({
      ...data,
      [index]: {
        ...(data as any)[index],
        [severityLevel]: severity,
      },
    });
  };

  const setDescription = (
    index: string,
    name: string,
    description: string,
    minOrMaxDescription: string
  ) => {
    setData({
      ...data,
      [index]: {
        ...(data as any)[index],
        [minOrMaxDescription]: description,
      },
    });
  };

  const changeMinMax = (
    e: any,
    index: number,
    name: string,
    minOrMax: string
  ) => {
    // immutable object
    setData({
      ...data,
      [index]: {
        ...(data as any)[index],
        [minOrMax]: e.target.value,
      },
    });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <Button className="Blue" onClick={() => setModalIsOpen(true)}>
        Add event trigger
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add event trigger"
      >
        <div>
          <React.Fragment>
            {topics && (
              <React.Fragment>
                <h2>Select datasource here:</h2>
                <Select onChange={handleSelectChange}>
                  <option>None</option>

                  {Object.entries(topics).map((topic: any) => {
                    let key = topic[0];
                    let value = topic[1] as Topic;
                    return <option key={key}>{value.url.split("/")[2]}</option>;
                  })}
                </Select>
              </React.Fragment>
            )}
          </React.Fragment>
          <React.Fragment>
            <h2>Selected sensors after selecting datasource</h2>
            {selectValue &&
              selectValue.channels &&
              selectValue.channels.map((channel: Channel) => {
                return (
                  <div
                    key={channel.id}
                    onClick={() => {
                      if (
                        selectedSensors.filter(
                          (e: Source) =>
                            e.topicId === selectValue.id &&
                            channel === e.channel
                        ).length === 0
                      ) {
                        const newSelectedSensors = selectedSensors.concat({
                          topicId: selectValue.id,
                          channel: channel,
                        });
                        setData({
                          ...data,
                          [channel.id.toString() as string]: {
                            min: 0,
                            max: 0,
                            name: channel.channelName,
                            minDescription: "No description",
                            maxDescription: "No description",
                            minSeverityLevel: "low",
                            maxSeverityLevel: "low",
                          },
                        });
                        setSelectedSensors(newSelectedSensors);
                      }
                    }}
                  >
                    <div>{channel.channelName}</div>
                  </div>
                );
              })}
          </React.Fragment>
        </div>
        {profile && profile.admin && (
          <div>
            <div>I want to receive notifications on my phone</div>
            <input
              type="checkbox"
              onClick={() => {
                setReceiveSMS(!receiveSMS);
              }}
            />
          </div>
        )}
        <React.Fragment>
          {selectedSensors &&
            selectedSensors.map((sensor: Source) => {
              return (
                <div key={sensor.channel.channelName}>
                  <div>channel: {sensor.channel.channelName}</div>
                  <div style={{ display: "flex" }}>
                    <div>
                      min:{" "}
                      <TextInput
                        onChange={(e: any) =>
                          changeMinMax(
                            e,
                            sensor.channel.id,
                            sensor.channel.channelName,
                            "min"
                          )
                        }
                        defaultValue={0}
                        type={"number"}
                      />
                    </div>
                    <div>
                      description below min:
                      <TextInput
                        onChange={(e: any) =>
                          setDescription(
                            sensor.channel.id.toString(),
                            sensor.channel.channelName,
                            e.target.value,
                            "minDescription"
                          )
                        }
                        placeholder={"Too low stress.."}
                      />
                    </div>
                    <SelectComponent
                      onChange={(e: any) =>
                        setSeverity(
                          sensor.channel.id.toString(),
                          sensor.channel.channelName,
                          e.target.value,
                          "minSeverityLevel"
                        )
                      }
                    >
                      <option selected>low</option>
                      <option>medium</option>
                      <option>high</option>
                    </SelectComponent>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div>
                      max:
                      <TextInput
                        onChange={(e: any) =>
                          changeMinMax(
                            e,
                            sensor.channel.id,
                            sensor.channel.channelName,
                            "max"
                          )
                        }
                        defaultValue={0}
                        type={"number"}
                      />
                    </div>
                    <div>
                      description below min:
                      <TextInput
                        placeholder={"Too high displacement.."}
                        onChange={(e: any) =>
                          setDescription(
                            sensor.channel.id.toString(),
                            sensor.channel.channelName,
                            e.target.value,
                            "maxDescription"
                          )
                        }
                      />
                    </div>
                    <SelectComponent
                      onChange={(e: any) =>
                        setSeverity(
                          sensor.channel.id.toString(),
                          sensor.channel.channelName,
                          e.target.value,
                          "maxSeverityLevel"
                        )
                      }
                    >
                      <option selected>low</option>
                      <option>medium</option>
                      <option>high</option>
                    </SelectComponent>
                  </div>
                </div>
              );
            })}
        </React.Fragment>
        <Button onClick={(e) => submit(e)} loading={loading}>
          SUBMIT FORM
        </Button>
      </Modal>
    </div>
  );
}
