import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ReactSelect from "react-select";
import * as S from "src/Components/Dashboard/Dashboard.style";
import { Button } from "src/Components/UI/Button/Button.style";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";
import { Channel, Topic } from "src/types/datasource";
import { FileUploader } from "src/utils/dataHandler/UploadFile";

interface Props {
  handleSelectChange: (e: any) => void;
  selectValue: Topic;
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
  topics: Topic[];
  projectId: string;
  dashboardId: string;
}

const Spectrogram = (props: Props) => {
  const {
    handleSelectChange,
    selectValue,
    tile,
    setTile,
    topics,
    projectId
  } = props;

  const [mostRecent, setMostRecent] = useState(true);
  const [duration, setDuration] = useState(0 as number);
  const [sourceOrFile, setSourceOrFile] = useState("source");
  const [startDate, setStartDate] = useState(new Date().getTime() as number);
  const [endDate, setEndDate] = useState(new Date().getTime() as number);

  useEffect(() => {
    setTile({
      ...tile,
      category: "spectrogram",
      type: "source"
    });
  }, []);

  const setTime = (param: string, e: any) => {
    if (mostRecent) {
      let now = Date.now();
      setTile({
        ...tile,
        mode: now + "/" + (now - parseInt(e) * 1000)
      });
    } else if (tile.mode !== undefined) {
      const temp = tile.mode.split("/");
      temp[param === "start" ? 0 : 1] = e;
      const edited = temp.join("/");
      setTile({
        ...tile,
        mode: edited
      });
    }
  };

  const handleSelectChannel = (e: any) => {
    const element = selectValue.channels.find((x: Channel) => e.value === x);
    if (element !== undefined) {
      const newChannels = [
        {
          topicId: selectValue.id,
          channel: element
        }
      ];
      setTile({
        ...tile,
        channels: newChannels
      });
    }
  };

  return (
    <div>
      <Q.Columns>
        <Q.ColumnLeft noPadding={false}>
          <Q.SmallText>Select data source or upload file</Q.SmallText>
        </Q.ColumnLeft>
        <Q.ColumnRight noPadding={false}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              className="Simple"
              selected={sourceOrFile === "source"}
              onClick={() => {
                setSourceOrFile("source");
                setTile({
                  ...tile,
                  type: "source"
                });
              }}
            >
              Use data source
            </Button>
            <Button
              className="Simple"
              selected={sourceOrFile === "file"}
              onClick={() => {
                setSourceOrFile("file");
                setTile({
                  ...tile,
                  type: "file"
                });
              }}
            >
              Upload file
            </Button>
          </div>
        </Q.ColumnRight>
      </Q.Columns>

      {sourceOrFile === "source" && (
        <div>
          <Q.Columns>
            <Q.ColumnLeft noPadding={false}>
              <Q.SmallText>Duration / get most recent data</Q.SmallText>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={false}>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  className="Simple"
                  selected={mostRecent}
                  onClick={() => setMostRecent(true)}
                >
                  Most recent
                </Button>
                <Button
                  className="Simple"
                  selected={!mostRecent}
                  onClick={() => setMostRecent(false)}
                >
                  Set time
                </Button>
              </div>
            </Q.ColumnRight>
          </Q.Columns>
          <Q.Columns>
            <Q.ColumnLeft noPadding={false}>
              <Q.SmallText>
                {mostRecent ? "Last X seconds" : "Set time"}
              </Q.SmallText>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={false}>
              {mostRecent ? (
                <TextInput
                  placeholder="0"
                  value={duration}
                  onChange={e => {
                    setTime("duration", e.target.value);
                    setDuration(e.target.value);
                  }}
                />
              ) : (
                <React.Fragment>
                  <div style={{ fontSize: "12px" }}>Start time</div>

                  <DatePicker
                    selected={new Date(startDate)}
                    onChange={(date: Date) => {
                      setTime("start", date.getTime());
                      setStartDate(date.getDate());
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />

                  <div style={{ fontSize: "12px" }}>End time</div>
                  <DatePicker
                    selected={new Date(endDate)}
                    onChange={(date: Date) => {
                      setEndDate(date.getDate());
                      setTime("end", date.getTime());
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </React.Fragment>
              )}
            </Q.ColumnRight>
          </Q.Columns>
          <Q.Columns>
            <Q.ColumnLeft noPadding={false}>
              <Q.SmallText>Select datasource and sensor</Q.SmallText>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={false}>
              <ReactSelect
                className="Select"
                onChange={handleSelectChange}
                options={topics.map((topic: Topic, index: number) => ({
                  value: topic.url.split("/")[2],
                  label: topic.url.split("/")[2]
                }))}
              />
              {selectValue && selectValue.channels && (
                <ReactSelect
                  className="Select"
                  onChange={handleSelectChannel}
                  options={selectValue.channels.map((channel: Channel) => {
                    return {
                      value: channel,
                      label: channel.channelName
                    };
                  })}
                />
              )}
            </Q.ColumnRight>
          </Q.Columns>
        </div>
      )}
      {sourceOrFile === "file" && (
        <div>
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
                projectId={projectId}
              />
            </Q.ColumnRight>
          </Q.Columns>
          <Q.Columns>
            <Q.ColumnLeft>
              <S.Column>
                <Q.SmallText>Datafrequency</Q.SmallText>
              </S.Column>
            </Q.ColumnLeft>
            <Q.ColumnRight>
              <TextInput
                type={"number"}
                value={tile.mode}
                onChange={e => {
                  setTile({ ...tile, mode: e.target.value });
                }}
              />
            </Q.ColumnRight>
          </Q.Columns>
        </div>
      )}
    </div>
  );
};

export default Spectrogram;
