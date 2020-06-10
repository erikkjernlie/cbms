import React, { useState } from "react";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import { createDatasource, getAvailableSensors, getAvailableSources, startDatasource, subscribeToDatasource } from "src/backendAPI/datasources";
import Button from "src/Components/UI/Button/Button";
import { Select } from "src/Components/UI/Dropdown/Dropdown.style";
import TextInput from "src/Components/UI/TextInput/TextInput";
import useDatasourceStore from "src/stores/project/datasourceStore";

import * as S from "../NewProject.style";
import SelectSensors from "./SelectSensors/SelectSensors";
import SelectSensorsFromJSON from "./SelectSensors/SelectSensorsFromJSON";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  setCreatedDatasource: (source: string) => void;
  projectId: string;
  toggleModal?: () => void;
}

export default function CreateDatasource(props: Props) {
  const { setCreatedDatasource, projectId, toggleModal } = props;

  const [id, setId] = useState("");
  const [address, setAddress] = useState(""); // 10.53.27.203 rigg
  const [timeIndex, setTimeIndex] = useState(-1);
  const [type, setType] = useState("json");
  const [creating, setCreating] = useState(false);
  const [fetchingAttributes, setFetchingAttributes] = useState(false);
  const [fetchingDevices, setFetchingDevices] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availableSensors, setAvailableSensors] = useState([]);
  const [availableDevices, setAvailableDevices] = useState({} as any);
  const [selectedSensors, setSelectedSensors] = useState([] as any[]); // TODO: change this to string?

  const {
    addSourceToDatabase,
    fetchSourcesFromDatabase,
  } = useDatasourceStore();

  const setDataType = (data: string) => {
    setType(data);
  };

  const start = async () => {
    let element = document.querySelector("#datasource_id") as HTMLInputElement;
    let id = element.value;
    await startDatasource(id).then(async () => {
      subscribe();
    });
  };

  const subscribe = async () => {
    let element = document.querySelector("#datasource_id") as HTMLInputElement;
    let id = element.value;
    subscribeToDatasource(id)
      .then((response) => {
        return response;
      })
      .then(async (rawData) => {
        setCreating(false);
        setCreatedDatasource(id);
        fetchSourcesFromDatabase(projectId);
      })
      .catch((error) => {
        return error.text;
      });
  };

  const fetchDataSourceAttributes = (e: any) => {
    e.preventDefault();
    setFetchingAttributes(true);

    getAvailableSensors(address)
      .then((resp) => {
        setAvailableSensors(resp.sensors);
      })
      .finally(() => {
        setFetchingAttributes(false);
      });
  };

  const fetchDevices = (e: any) => {
    e.preventDefault();
    setFetchingDevices(true);

    getAvailableSources()
      .then((resp) => {
        setAvailableDevices(resp);
        //setAvailableSensors(resp.sensors);
      })
      .finally(() => {
        //setFetchingAttributes(false);
        //setModalIsOpen(true);
        setModalIsOpen(true);
        setFetchingDevices(false);
      });
  };

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const onSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    const element = document.getElementById("formElement") as
      | HTMLFormElement
      | undefined;
    const formData = new FormData(element);
    Array.from(selectedSensors)
      .map((k) => ["output_name", k])
      .forEach(([k, v]) => {
        formData.append(k, v);
      });

    let i = 0;

    Array.from(selectedSensors)
      .map((k) => ["output_ref", k])
      .forEach(([k, v]) => {
        formData.append(k, String(i));
        i++;
      });

    formData.append("time_index", String(timeIndex));
    formData.append("port", "7331");
    await createDatasource(formData).then(async (response) => {
      await addSourceToDatabase(projectId, id, "datasource").then(async () => {
        await start().then(() => {
          setLoading(false);
          setModalIsOpen(false);
          setCreated(true);
          if (toggleModal) {
            toggleModal();
          }
        });
      });
    });
  };

  return (
    <div>
      <div>
        <div>
          <form id="formElement" onSubmit={onSubmit}>
            <S.GridContainer>
              <S.Columns>
                <S.ColumnLeft noPadding={true}>
                  <S.SmallText>Choose your name for the datasource</S.SmallText>
                </S.ColumnLeft>
                <S.ColumnRight noPadding={true}>
                  <TextInput
                    id="datasource_id"
                    type="text"
                    name="id"
                    onChange={(e: any) => setId(e.target.value)}
                    value={id}
                  />
                </S.ColumnRight>
              </S.Columns>
              <S.Columns>
                <S.ColumnLeft noPadding={true}>
                  <S.SmallText>
                    Select the IP address where you get the data, e.g.
                    10.53.27.203
                  </S.SmallText>
                </S.ColumnLeft>
                <S.ColumnRight noPadding={true}>
                  <S.Flex>
                    <TextInput
                      id="datasource_adress"
                      type="text"
                      name="address"
                      onChange={(e: any) => setAddress(e.target.value)}
                      value={address}
                    />

                    <Button
                      onClick={(e) => fetchDevices(e)}
                      loading={fetchingDevices}
                      className="BlackLong"
                    >
                      I do not know my IP address.
                    </Button>
                  </S.Flex>

                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    className="ScrollModal"
                    contentLabel="Modal"
                  >
                    <S.UserHeader>
                      <S.NumberCircle>A</S.NumberCircle> Available datasources
                    </S.UserHeader>
                    <S.Info>
                      <h2>Finding your IP adress</h2>
                      <S.Text>
                        Instructions for mac, iphone, windows etc.
                      </S.Text>
                      <h2>Already sending data to the server?</h2>
                      <S.Text>
                        The following IP addresses are not yet associated with a
                        datasource. If you cannot find your IP address here,
                        please check if you are sending data to the correct IP
                        address or check if a datasource has already been
                        configured with your IP address. is receiving data from
                        the IP addresses listed below. The IP addresses are
                        listed with their corresponding sensors.
                      </S.Text>
                      {Object.keys(availableDevices).length !== 0 &&
                        Object.keys(availableDevices).map((device: string) => {
                          if (!device.endsWith("_data")) {
                            const sensors = availableDevices[device].sensors;
                            return (
                              <div>
                                <h4>{device}</h4>
                                <div>
                                  {sensors &&
                                    sensors.map((sensor: string) => (
                                      <div>{sensor}</div>
                                    ))}
                                </div>
                              </div>
                            );
                          }
                        })}
                    </S.Info>
                  </Modal>
                </S.ColumnRight>
              </S.Columns>
              <S.Columns>
                <S.ColumnLeft noPadding={true}>
                  <S.SmallText>
                    Do the sensor send CSV or JSON data?
                  </S.SmallText>
                </S.ColumnLeft>
                <S.ColumnRight noPadding={true}>
                  <Select
                    name="data_type"
                    value={type}
                    onChange={(e) => setDataType(e.target.value)}
                  >
                    <option value="json" selected>
                      JSON
                    </option>
                    <option value="bytes">CSV</option>
                  </Select>
                </S.ColumnRight>
              </S.Columns>
              {type === "json" && address && (
                <S.Columns>
                  <S.ColumnLeft>
                    <S.SmallText>
                      See available sensors from IP adress
                    </S.SmallText>
                  </S.ColumnLeft>
                  <S.ColumnRight>
                    <div>
                      <Button
                        onClick={(e) => fetchDataSourceAttributes(e)}
                        loading={fetchingAttributes}
                      >
                        See available sensors from datasource
                      </Button>
                    </div>
                  </S.ColumnRight>
                </S.Columns>
              )}
              {type === "json" &&
                address &&
                availableSensors &&
                availableSensors.length !== 0 && (
                  <SelectSensorsFromJSON
                    availableSensors={availableSensors}
                    setSelectedSensors={(s: any[]) => {
                      setSelectedSensors(s);
                    }}
                    timeIndex={timeIndex}
                    setTimeIndex={(index) => setTimeIndex(index)}
                  />
                )}

              {type === "bytes" && (
                <React.Fragment>
                  <S.Columns>
                    <S.ColumnLeft></S.ColumnLeft>
                    <S.ColumnRight>You have selected CSV data</S.ColumnRight>
                  </S.Columns>
                  <S.Columns>
                    <S.ColumnLeft>
                      <S.SmallText>Are you using catman?</S.SmallText>
                    </S.ColumnLeft>
                    <S.ColumnRight>
                      <input type="checkbox" name="catman" checked />
                    </S.ColumnRight>
                  </S.Columns>
                  <SelectSensors
                    setSelectedSensors={(s) => {
                      setSelectedSensors(s);
                    }}
                    timeIndex={timeIndex}
                    setTimeIndex={(index) => setTimeIndex(index)}
                  />
                </React.Fragment>
              )}
            </S.GridContainer>
            {selectedSensors && selectedSensors.length !== 0 && (
              <S.Columns>
                <S.ColumnLeft>
                  <S.SmallText>Create datasource</S.SmallText>
                </S.ColumnLeft>
                <S.ColumnRight>
                  <Button type="submit" loading={loading}>
                    Create datasource
                  </Button>
                </S.ColumnRight>
              </S.Columns>
            )}
          </form>
        </div>
      </div>
      {creating && (
        <ClipLoader
          size={15}
          //size={"150px"} this also works
          color={"#123abc"}
          loading={creating}
        />
      )}
    </div>
  );
}
