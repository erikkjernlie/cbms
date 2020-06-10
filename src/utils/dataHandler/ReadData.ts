import { Buffer } from "src/types/datahandling";
import { Channel, Topic } from "src/types/datasource";

const struct = require("@aksel/structjs");

export default function parseData(data: any, topic: Topic) {
  let datasourceBuffer = {} as Buffer;
  const byteFormat = topic.byteFormat;
  datasourceBuffer.unpacker = struct(byteFormat);
  const channels = topic.channels;
  datasourceBuffer.timestamp_buffer = [];
  datasourceBuffer.value_buffer = {};
  channels.forEach((channel: Channel) => {
    datasourceBuffer.value_buffer[channel.id] = [];
  });

  const unpacker = datasourceBuffer.unpacker;
  const unpackIterator = unpacker.iter_unpack(data);
  let unpacked = unpackIterator.next().value;
  while (unpacked) {
    datasourceBuffer.timestamp_buffer.push(new Date(unpacked[0] * 1000));
    const channelsIds = topic.channels.map((it: Channel) => it.id);
    channelsIds.forEach((channelID: number) => {
      if (
        datasourceBuffer.value_buffer &&
        datasourceBuffer.value_buffer[channelID]
      ) {
        datasourceBuffer.value_buffer[channelID].push(unpacked[channelID + 1]);
      }
    });
    unpacked = unpackIterator.next().value;
  }
  return datasourceBuffer;
}
