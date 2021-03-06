import React, { useEffect, useState } from "react";
import Select from "react-select";
import * as S from "src/Components/Dashboard/Dashboard.style";
import { Button } from "src/Components/UI/Button/Button.style";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import { FileUploader } from "src/utils/dataHandler/UploadFile";

interface Props {
  handleSelectChange: (e: any) => void;
  selectValue: Topic;
  add: (source: Source) => void;
  remove: (source: Source) => void;
  clear: () => void;
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
  topics: Topic[];
  projectId: string;
}

const Statistics = (props: Props) => {
  const {
    handleSelectChange,
    selectValue,
    add,
    remove,
    clear,
    tile,
    setTile,
    topics,
    projectId
  } = props;

  const [sourceOrFile, setSourceOrFile] = useState("source");
  const [useHistogram, setUseHistogram] = useState(true);

  useEffect(() => {
    setTile({
      ...tile,
      category: "statistics_distribution",
      type: "source"
    });
  }, []);

  return (
    <div>
      <Q.Columns>
        <Q.ColumnLeft noPadding={false}>
          <Q.SmallText>Values or histogram</Q.SmallText>
        </Q.ColumnLeft>
        <Q.ColumnRight noPadding={false}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              className="Simple"
              selected={useHistogram}
              onClick={() => {
                setTile({
                  ...tile,
                  category: "statistics_distribution"
                });
                setUseHistogram(true);
              }}
            >
              Histogram
            </Button>
            <Button
              className="Simple"
              selected={!useHistogram}
              onClick={() => {
                setTile({
                  ...tile,
                  category: "statistics"
                });
                setUseHistogram(false);
              }}
            >
              Statistics summary
            </Button>
          </div>
        </Q.ColumnRight>
      </Q.Columns>
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
              <Q.SmallText>Duration</Q.SmallText>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={false}>
              <p>Duration (seconds)</p>
              <TextInput
                placeholder="0"
                value={tile.mode}
                onChange={e => setTile({ ...tile, mode: e.target.value })}
              />
            </Q.ColumnRight>
          </Q.Columns>
          <Q.Columns>
            <Q.ColumnLeft noPadding={true}>
              <S.Column>
                <Q.SmallText>Select datasource</Q.SmallText>
              </S.Column>
            </Q.ColumnLeft>
            <Q.ColumnRight noPadding={true}>
              <Select
                className="Select"
                onChange={handleSelectChange}
                options={topics.map((topic: Topic, index: number) => ({
                  value: topic.url.split("/")[2],
                  label: topic.url.split("/")[2]
                }))}
              />
              {selectValue && selectValue.channels && (
                <Select
                  className="Select"
                  isMulti
                  onChange={(newList: any, object: any) => {
                    if (object.action === "select-option") {
                      add({
                        topicId: selectValue.id,
                        channel: object.option.value
                      });
                    } else if (object.action === "remove-value") {
                      remove({
                        topicId: selectValue.id,
                        channel: object.option.value
                      });
                    } else if (object.action === "clear") {
                      clear();
                    }
                  }}
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
        <Q.Columns>
          <Q.ColumnLeft noPadding={true}>
            <S.Column>
              <Q.SmallText>Upload file</Q.SmallText>
            </S.Column>
          </Q.ColumnLeft>
          <Q.ColumnRight noPadding={true}>
            <FileUploader tile={tile} setTile={setTile} projectId={projectId} />
          </Q.ColumnRight>
        </Q.Columns>
      )}
    </div>
  );
};

export default Statistics;
