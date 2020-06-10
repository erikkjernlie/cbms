import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
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
  topics: Topic[];
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
  projectId: string;
}

const FFT = (props: Props) => {
  const {
    handleSelectChange,
    selectValue,
    add,
    remove,
    clear,
    topics,
    tile,
    setTile,
    projectId,
  } = props;

  const [sourceOrFile, setSourceOrFile] = useState("source");

  useEffect(() => {
    setTile({
      ...tile,
      category: "fft",
      type: "processor",
    });
  }, []);

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
              onClick={() => setSourceOrFile("source")}
            >
              Use data source
            </Button>
            <Button
              className="Simple"
              selected={sourceOrFile === "file"}
              onClick={() => {
                setTile({ ...tile, type: "file" });
                setSourceOrFile("file");
              }}
            >
              Upload file
            </Button>
          </div>
        </Q.ColumnRight>
      </Q.Columns>
      {topics && sourceOrFile === "source" && (
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
                    add({
                      topicId: selectValue.id,
                      channel: object.option.value,
                    });
                  } else if (object.action === "remove-value") {
                    remove({
                      topicId: selectValue.id,
                      channel: object.option.value,
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
      <Q.Columns>
        <Q.ColumnLeft>
          <S.Column>
            <Q.SmallText>Set FFT parameters</Q.SmallText>
          </S.Column>
        </Q.ColumnLeft>
        <Q.ColumnRight>
          <Q.Row>
            <Q.Label>Sample spacing</Q.Label>
            <TextInput
              className="Curve"
              onChange={(e) =>
                setTile({
                  ...tile,
                  mode: e.target.value,
                })
              }
              placeholder="0.01"
              defaultValue="0.01"
            ></TextInput>
          </Q.Row>
        </Q.ColumnRight>
      </Q.Columns>
    </div>
  );
};

export default FFT;
