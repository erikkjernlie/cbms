import React from "react";
import Select from "react-select";
import * as S from "src/Components/Dashboard/Tile/Tile.style";
import { Channel, Source, Topic } from "src/types/datasource";

interface Props {
  topics: Topic[];
  handleSelectChange: (e: any) => void;
  selectValue: Topic;
  add: (channel: Source) => Promise<void>;
  remove: (channel: Source) => Promise<void>;
  addingChannel: string;
  clear: () => void;
  selectedChannels: Source[];
}

const AddChannels = React.memo((props: Props) => {
  const {
    topics,
    handleSelectChange,
    selectValue,
    add,
    remove,
    addingChannel,
    clear,
    selectedChannels,
  } = props;

  return (
    <div>
      <S.PlotSettingsSubTitle>Add sensors</S.PlotSettingsSubTitle>
      <div>
        <div>
          <Select
            className="Select"
            onChange={handleSelectChange}
            options={topics.map((topic: Topic, index: number) => ({
              value: topic.url.split("/")[2],
              label: topic.url.split("/")[2],
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
                    channel: object.option.value,
                  });
                } else if (object.action === "remove-value") {
                  remove({
                    topicId: selectValue.id,
                    channel: object.removedValue.value,
                  });
                } else if (object.action === "clear") {
                  clear();
                }
              }}
              options={selectValue.channels
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
        </div>
      </div>
    </div>
  );
});

export default AddChannels;
