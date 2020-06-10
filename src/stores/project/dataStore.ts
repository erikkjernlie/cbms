import cloneDeep from "lodash.clonedeep";
import { subscribeToSource, unSubscribeSource } from "src/backendAPI/topics";
import { Buffer } from "src/types/datahandling";
import { EditedSelectedSource } from "src/types/datasource";
import { byteToString } from "src/utils/util";
import create from "zustand";

const struct = require("@aksel/structjs");

const [useDataStore] = create((set, get) => ({
  isOpen: false,
  isConnecting: false,
  datasources: {}, // this one is different in vue
  datasourcesBuffer: {},
  pushDataIntervalID: undefined,
  packetCounter: 0,
  prevSubscriptions: [],
  newData: null,
  websocket: null, // should it be here?
  setDatasources: (incomingDatasources: any) => {
    let newDatasources = {} as any; // create source dict
    incomingDatasources.forEach((source: any) => {
      const channels = source.subscribedChannels;
      let newChannels = [];
      for (let i = 0; i < channels.length; i++) {
        const channelName = channels[i].channelName;
        const id = channels[i].id;
        if (
          newChannels.filter(
            (channel: any) => channel.id === id && channelName === channel.name
          ).length === 0
        )
          newChannels.push({
            id: id,
            name: channelName,
          });
      }
      newDatasources[source.id] = {
        name: source.name,
        byteFormat: source.byteFormat,
        channels: newChannels,
      };
      set({
        datasources: newDatasources,
      });
    });
  },
  initBuffers: () => {
    let newBuffer = {} as any;
    for (const sourceId in get().datasources) {
      let newDatasourcesBuffer = {} as Buffer;
      const byteFormat = get().datasources[sourceId].byteFormat;
      newDatasourcesBuffer.unpacker = struct(byteFormat);
      const channels = get().datasources[sourceId].channels;
      newDatasourcesBuffer.timestamp_buffer = [];
      newDatasourcesBuffer.value_buffer = {};
      channels.forEach((channel: any) => {
        newDatasourcesBuffer.value_buffer[channel.id] = [];
      });
      newBuffer[sourceId] = newDatasourcesBuffer;

      // TODO: use immer (npm package) for state updates?
    }
    set({
      datasourcesBuffer: newBuffer,
    });
  },
  closeWebSocketConnection: () => {
    if (get().websocket) {
      get().websocket.close(1000, "Deliberate disconnection");
      clearInterval(get().pushDataIntervalID);
      set({
        websocket: null,
      });
    }
  },
  initParser: () => {
    get().initBuffers();
    let interval = setInterval(() => {
      get().pushData();
      // TODO: handle interval here
    }, 10); // this interval must be cleared later
  },
  resetBuffers: () => {
    for (const sourceId in get().datasourcesBuffer) {
      let datasourceBuffer = get().datasourcesBuffer[sourceId];
      datasourceBuffer.timestamp_buffer = [];
      Object.keys(datasourceBuffer.value_buffer).forEach((channelID) => {
        datasourceBuffer.value_buffer[channelID] = [];
      });
      /*
      set({
        ...datasourceBuffer,
        [sourceId]: datasourceBuffer,
      });*/
    }
  },
  pushData: async () => {
    if (get().packetCounter > 0) {
      set({
        newData: cloneDeep(get().datasourcesBuffer),
      });
      // reset or init buffers here, any difference?
      get().initBuffers();
      set({
        packetCounter: 0,
      });
    }
  },

  parseData: (data: any, sourceID: string) => {
    const datasourceBuffer = get().datasourcesBuffer[sourceID];

    if (datasourceBuffer === undefined) {
      return;
    }
    if (get().packetCounter === 0) {
      set({
        packetCounter: 1,
      });
    }

    const unpacker = datasourceBuffer.unpacker;
    const unpackIterator = unpacker.iter_unpack(data);
    let unpacked = unpackIterator.next().value;
    let delay = 0;
    let counter = 0;
    let lastTimestamp = unpacked[0] * 1000;
    while (unpacked) {
      if (get().datasources[sourceID] && get().datasources[sourceID].channels) {
        lastTimestamp = unpacked[0] * 1000;
        datasourceBuffer.timestamp_buffer.push(new Date(unpacked[0] * 1000));
        delay += (Date.now() - unpacked[0] * 1000) / 1000;
        counter += 1;
        datasourceBuffer.delay = (delay / counter).toFixed(3);
        datasourceBuffer.timestamp = Date.now();
        const tempChannelsIds = get().datasources[sourceID].channels.map(
          (it: any) => it.id
        );
        const channelsIds = Array.from(new Set(tempChannelsIds));
        channelsIds.forEach((channelID: any) => {
          if (
            datasourceBuffer.value_buffer &&
            datasourceBuffer.value_buffer[channelID]
          ) {
            datasourceBuffer.value_buffer[channelID].push(
              unpacked[channelID + 1]
            );
          }
        });
        unpacked = unpackIterator.next().value;
      }
    }
    /*
    set({
      ...datasourceBuffer,
      [sourceID]: datasourceBuffer,
    });*/
  },
  initWebSocketConnection: async () => {
    if (
      process.env.REACT_APP_SOCKET_ENDPOINT !== undefined &&
      get().websocket === null
    ) {
      let websocket = new WebSocket(process.env.REACT_APP_SOCKET_ENDPOINT);
      set({
        isConnecting: true,
        websocket: websocket,
      });
      websocket.binaryType = "arraybuffer";
      websocket.onopen = () => {
        set({
          isConnecting: false,
          isOpen: true,
        });
      };
      websocket.onerror = () => {
        set({
          isConnecting: false,
          isOpen: false,
        });
        websocket.close();
      };
      websocket.onclose = () => {
        set({
          isOpen: false,
        });
        // clearInterval(this.pushDataIntervalID);
      };
      get().initParser();
      websocket.onmessage = (event) => {
        if (event.data.byteLength > 0) {
          const data = event.data;
          const sourceID = byteToString(new Uint8Array(data, 0, 4));
          get().parseData(data.slice(4), sourceID);
        }
      };
    }
  },
  subscribeDatasources: async (sources: EditedSelectedSource[]) => {
    if (sources.length !== 0) {
      if (!get().isOpen) {
        // handle authCookie
        await get().initWebSocketConnection();
        // handle initWebSocket
      } else {
        get().initBuffers();
      }
      const removedSources = get().prevSubscriptions.filter(
        (sub: EditedSelectedSource) =>
          !sources.some((source: EditedSelectedSource) => source.id === sub.id)
      );
      const addedSources = sources.filter(
        (source: EditedSelectedSource) =>
          !get().prevSubscriptions.some(
            (prevSub: EditedSelectedSource) => prevSub.id === source.id
          )
      );
      removedSources.forEach((source: EditedSelectedSource) => {
        unSubscribeSource(source.id);
      });
      addedSources.forEach((source: EditedSelectedSource) => {
        subscribeToSource(source.id).catch((error) => console.log(error));
      });
      const prevSubscriptions = sources.map((source: EditedSelectedSource) => ({
        id: source.id,
        url: source.url,
      }));
      set({
        prevSubscriptions: prevSubscriptions,
      });
    }
  },
}));

export default useDataStore;
