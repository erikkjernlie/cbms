import React, { useEffect, useState } from "react";
import { AiOutlineDotChart, AiOutlineLineChart } from "react-icons/ai";
import ReactSelect from "react-select";
import { ClipLoader } from "react-spinners";
import { fetchTopics } from "src/backendAPI/topics";
import * as S from "src/Components/Dashboard/Dashboard.style";
import * as T from "src/Components/Dashboard/Tile/Tile.style";
import Button from "src/Components/UI/Button/Button";
import Select from "src/Components/UI/Dropdown/Select";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { FilterFormat, FilterParams, TileFormat } from "src/types/datahandling";
import {
  Channel,
  RawTopic,
  Source,
  Topic,
  TopicsJson,
} from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";
import { FileUploader } from "src/utils/dataHandler/UploadFile";
import { useProcessorStarter } from "src/utils/processorHandler/processorStarter";

import "src/utils/styles/styles.css";

interface Props {
  handleSelectChange: (e: any) => void;
  selectValue: Topic;
  topics: Topic[];
  add: (source: Source) => void;
  remove: (source: Source) => void;
  clear: () => void;
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
  type: "real-time" | "history" | "predictions";
  projectId: string;
}

const filterTypes = ["lowpass", "highpass", "bandpass", "bandstop"];

const defaultItem = {
  btype: "highpass",
  sample_spacing: 20,
  cutoff_frequency: 10,
  buffer_size: 500,
  order: 10,
};

const Curve = (props: Props) => {
  const {
    handleSelectChange,
    selectValue,
    topics,
    add,
    tile,
    clear,
    setTile,
    remove,
    type,
    projectId,
  } = props;

  const [addFilter, setAddFilter] = useState(false);
  const [fType, setFType] = useState([] as FilterFormat[]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceOrFile, setSourceOrFile] = useState("source");
  const { initiateProcessor, created, started } = useProcessorStarter();

  useEffect(() => {
    setTile({
      ...tile,
      category: type,
    });
  }, []);

  useEffect(() => {}, [tile]);

  const addToSelected = (source: Source) => {
    add(source);
    const exists = fType.find((s: FilterFormat) => s.channel === source);
    if (exists) {
      return;
    }
    const newF = fType.concat({
      channel: source,
      name: source.channel.channelName,
      params: defaultItem,
    });
    setFType(newF);
  };

  const removeFromSelected = (source: Source) => {
    remove(source);
    const exists = fType.find((s: FilterFormat) => s.channel === source);
    if (exists) {
      setFType(fType.filter((s: FilterFormat) => s.channel !== source));
      return;
    }
  };

  const setName = (channel: Source, e: any) => {
    const check = fType.find((item: FilterFormat) => item.channel === channel);
    if (check) {
      const existing = fType.map((item: FilterFormat) => {
        return item.channel === channel
          ? { ...item, name: e.target.value }
          : item;
      }) as FilterFormat[];
      setFType(existing);
    } else {
      setFType(
        fType.concat({
          channel: channel,
          params: defaultItem,
          name: e.target.value,
        } as FilterFormat)
      );
    }
  };

  const setInfo = (channel: Source, param: string, e: any) => {
    let value;
    switch (param) {
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

    const check = fType.find((item: FilterFormat) => item.channel === channel);
    if (check) {
      const filterElement = {
        ...check.params,
        [param]: value,
      } as FilterParams;
      const existing = fType.map((item: FilterFormat) => {
        return item.channel === channel
          ? { ...item, params: filterElement }
          : item;
      }) as FilterFormat[];
      setFType(existing);
    } else {
      const newElement = {
        ...defaultItem,
        [param]: value,
      };

      setFType(
        fType.concat({
          channel: channel,
          params: newElement,
          name: "",
        } as FilterFormat)
      );
    }
  };

  const removeFilterVar = (channel: Source) => {
    setFType(fType.filter((item: FilterFormat) => item.channel !== channel));
  };

  const setFilterName = (name: string) => {
    if (name.length < 4) {
      setError("Name must consist of at least 4 characters!");
      return false;
    }
    if (parseInt(name.substring(0, 1)).toString() === name.substring(0, 1)) {
      setError("Filter name must start with a character");
      return false;
    }
    const checking = name.replace(/[^a-z0-9_]/gi, "");
    if (checking.length !== name.length) {
      setError(
        "Filter name contains illegal characters (only a-z, 0-9 and underscore allowed)"
      );
      return false;
    }
    setError("");
    return true;
  };

  const findNew = async (name: string) => {
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
    const filtered =
      tempTopics.find((topic: Topic) => topic.url.split("/")[2] === name) ||
      ({} as Topic);
    return filtered;
  };

  const setFilter = async (filterVar: FilterFormat) => {
    setLoading(true);
    if (!(filterVar.channel && filterVar.name.length > 0 && filterVar.params)) {
      setError("Missing information!");
      setLoading(false);
      return;
    }
    if (!filterVar) {
      setError("ERRROR! No data found");
      setLoading(false);
      return;
    }
    const validName = setFilterName(filterVar.name);
    if (!validName) {
      setLoading(false);
      return;
    }
    const errorMessage = await initiateProcessor(
      projectId,
      "butterworth",
      filterVar
    );

    if (errorMessage && errorMessage.length > 0) {
      setError(errorMessage);
    } else {
      setError("");
      const existingChannels = tile.channels || ([] as Source[]);
      const newAddition = await findNew(filterVar.name);
      if (newAddition) {
        const newChannel = {
          topicId: newAddition.id ? newAddition.id : "",
          channel: newAddition.channels[0] || ({} as Channel),
        } as Source;
        setTile({
          ...tile,
          type: "processor",
          channels: existingChannels
            .concat(newChannel)
            .filter((source: Source) => source !== filterVar.channel),
        });
      }

      setFType(fType.filter((f: FilterFormat) => f !== filterVar));
    }
    setLoading(false);
  };

  return (
    <div>
      {type === "history" && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={false}>
            <Q.SmallText>Select data source or upload file</Q.SmallText>
          </Q.ColumnLeft>
          <Q.ColumnRight noPadding={false}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                className="Simple"
                selected={sourceOrFile === "source"}
                onClick={() => setSourceOrFile("source")}
              >
                Use data source
              </Button>
              <Button
                className="Simple"
                selected={sourceOrFile === "file"}
                onClick={() => setSourceOrFile("file")}
              >
                Upload file
              </Button>
            </div>
          </Q.ColumnRight>
        </Q.Columns>
      )}
      {topics && sourceOrFile === "source" && (
        <React.Fragment>
          <Q.Columns>
            <Q.ColumnLeft noPadding={true}>
              <S.Column>
                <Q.SmallText>Select datasource</Q.SmallText>
              </S.Column>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={true}>
              <ReactSelect
                className="Select"
                onChange={handleSelectChange}
                options={topics.map((topic: Topic, index: number) => ({
                  value: topic.url.split("/")[2],
                  label: topic.url.split("/")[2],
                }))}
              />
              {selectValue && selectValue.channels && (
                <ReactSelect
                  className="Select"
                  isMulti
                  onChange={(newList: any, object: any) => {
                    if (object.action === "select-option") {
                      addToSelected({
                        topicId: selectValue.id,
                        channel: object.option.value,
                      });
                    } else if (object.action === "remove-value") {
                      removeFromSelected({
                        topicId: selectValue.id,
                        channel: object.removedValue.value,
                      });
                    } else if (object.action === "clear") {
                      clear();
                    }
                  }}
                  options={selectValue.channels.map((channel: Channel) => {
                    return {
                      value: channel,
                      label: channel.channelName,
                    };
                  })}
                />
              )}
            </Q.ColumnRight>
          </Q.Columns>
        </React.Fragment>
      )}
      {sourceOrFile === "file" && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={true}>
            <S.Column>
              <Q.SmallText>Upload file</Q.SmallText>
            </S.Column>
          </Q.ColumnLeft>
          <Q.ColumnRight noPadding={true}>
            <FileUploader
              tile={tile}
              setTile={setTile}
              type="get"
              projectId={projectId}
            />
          </Q.ColumnRight>
        </Q.Columns>
      )}
      <Q.Columns>
        <Q.ColumnLeft>
          <S.Column>
            <Q.SmallText>Choose scatter or lines</Q.SmallText>
          </S.Column>
        </Q.ColumnLeft>
        <Q.ColumnRight>
          <T.IconContainer>
            <T.PlotIcon
              selected={tile.mode === "markers"}
              onClick={() =>
                setTile({
                  ...tile,
                  mode: "markers",
                  type: "scattergl",
                })
              }
            >
              <AiOutlineDotChart size="3em" />
            </T.PlotIcon>
            <T.PlotIcon
              selected={tile.mode === "lines"}
              onClick={() =>
                setTile({ ...tile, mode: "lines", type: "scattergl" })
              }
            >
              <AiOutlineLineChart size="3em" />
            </T.PlotIcon>
          </T.IconContainer>
        </Q.ColumnRight>
      </Q.Columns>
      {type === "real-time" && (
        <Q.Columns>
          <Q.ColumnLeft>
            <S.Column>
              <div>Filter data?</div>
            </S.Column>
          </Q.ColumnLeft>
          <Q.ColumnRight>
            <S.Column>
              <input type="checkbox" onClick={() => setAddFilter(!addFilter)} />
            </S.Column>
          </Q.ColumnRight>
        </Q.Columns>
      )}
      {addFilter && (
        <React.Fragment>
          <Q.Columns>
            <Q.ColumnLeft>
              <div>Set filter details</div>
            </Q.ColumnLeft>
            <Q.ColumnRight>
              {loading && (
                <ClipLoader size={70} color={"darkgrey"} loading={true} />
              )}
            </Q.ColumnRight>
          </Q.Columns>

          {!loading &&
            fType &&
            fType.length > 0 &&
            fType.map((filterVar: FilterFormat, index: number) => {
              if (filterVar.channel.topicId === selectValue.id) {
                return (
                  <Q.Columns key={index}>
                    <Q.ColumnLeft>
                      <div>{filterVar.channel.channel.channelName}</div>
                    </Q.ColumnLeft>
                    <Q.ColumnRight>
                      <Q.Row>
                        <Q.Label>Filtered Channel Name</Q.Label>
                        <TextInput
                          className="Curve"
                          value={filterVar.name}
                          maxLength={20}
                          onChange={(e) => setName(filterVar.channel, e)}
                        />
                      </Q.Row>
                      <Q.Row>
                        <Q.Label>Filter type</Q.Label>
                        <Select
                          className="Curve"
                          onChange={(e) =>
                            setInfo(filterVar.channel, "btype", e)
                          }
                        >
                          <option>None</option>
                          {filterTypes.map((filter: string, index: number) => {
                            return <option key={index}>{filter}</option>;
                          })}
                        </Select>
                      </Q.Row>
                      <Q.Row>
                        <Q.Label>Frequency</Q.Label>
                        <TextInput
                          value={filterVar.params.sample_spacing}
                          className="Curve"
                          type="number"
                          onChange={(e) =>
                            setInfo(filterVar.channel, "sample_spacing", e)
                          }
                        />
                      </Q.Row>
                      <Q.Row>
                        <Q.Label>Buffer size</Q.Label>
                        <TextInput
                          className="Curve"
                          type="number"
                          value={filterVar.params.buffer_size}
                          onChange={(e) =>
                            setInfo(filterVar.channel, "buffer_size", e)
                          }
                        />
                      </Q.Row>
                      <Q.Row>
                        <Q.Label>Cutoff Frequency</Q.Label>
                        <TextInput
                          className="Curve"
                          type="number"
                          value={filterVar.params.cutoff_frequency}
                          onChange={(e) =>
                            setInfo(filterVar.channel, "cutoff_frequency", e)
                          }
                        />
                      </Q.Row>
                      <Q.Row>
                        <Q.Label>Order</Q.Label>
                        <TextInput
                          className="Curve"
                          type="number"
                          value={filterVar.params.order}
                          onChange={(e) =>
                            setInfo(filterVar.channel, "order", e)
                          }
                        />
                      </Q.Row>
                      <Q.Row>
                        <Button
                          className="HalfWidth"
                          onClick={() => setFilter(filterVar)}
                        >
                          Set filter
                        </Button>
                        <Button
                          className="HalfWidth"
                          onClick={() => removeFilterVar(filterVar.channel)}
                        >
                          No filter for this channel
                        </Button>
                      </Q.Row>
                    </Q.ColumnRight>
                  </Q.Columns>
                );
              }
            })}
        </React.Fragment>
      )}
      {error && <S.Error>{error}</S.Error>}
    </div>
  );
};

export default Curve;
