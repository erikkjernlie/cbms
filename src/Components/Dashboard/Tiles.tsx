import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { react } from "plotly.js";
import React, { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import NTNULogo from "src/assets/NTNULogo";
import { fetchTopics } from "src/backendAPI/topics";
import FFTTile from "src/Components/Dashboard/Tile/Analytics/FFTTile";
import HistogramTile from "src/Components/Dashboard/Tile/Analytics/HistogramTile";
import HistoricalTile from "src/Components/Dashboard/Tile/Analytics/HistoricalTile";
import PredictiveHistoricalTile from "src/Components/Dashboard/Tile/Analytics/PredictiveHistoricalTile";
import SpectrogramTile from "src/Components/Dashboard/Tile/Analytics/SpectrogramTile";
import StatisticsTile from "src/Components/Dashboard/Tile/Analytics/StatisticsTile";
import ModelTile from "src/Components/Dashboard/Tile/Model/ModelTile";
import MapTile from "src/Components/Dashboard/Tile/RealTime/MapTile";
import PredictiveTile from "src/Components/Dashboard/Tile/RealTime/PredictiveTile";
import RealTimeTile from "src/Components/Dashboard/Tile/RealTime/RealTimeTile";
import VideoStreamingTile from "src/Components/Dashboard/Tile/RealTime/VideoStreamingTile";
import Button from "src/Components/UI/Button/Button";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import {
  EditedSelectedSource,
  RawTopic,
  SelectedSource,
  Source,
  Topic,
  TopicsJson,
} from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";
import { deepCopy } from "src/utils/util";

import * as S from "./Dashboard.style";
import AddNew from "./Tile/AddNew/AddNew";
import InspectData from "./Tile/AddNew/Analytics/InspectData";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface Props {
  dashboardId: string;
  projectId: string;
  topics: Topic[];
}

const Tiles = React.memo((props: Props) => {
  const { tiles, fetching } = useProjectStore((state) => ({
    tiles: state.tiles,
    fetching: state.fetching,
  }));

  const { dashboardId, projectId, topics } = props;
  // hooks
  const [error, setError] = useState("");
  const [selectedSources, setSelectedSources] = useState([] as Source[]);
  const [initialLayout, setInitialLayout] = useState([] as any[]);
  const [currentModal, setCurrentModal] = useState("");
  const [creatingReport, setCreatingReport] = useState(false);
  const [breakpoint, setBreakpoint] = useState(null);
  const [cols, setCols] = useState(null);
  const [newCounter, setNewCounter] = useState(0);
  const [deletingDashboard, setDeletingDashboard] = useState(false);

  const onBreakpointChange = (breakpoint: any, cols: any) => {
    setBreakpoint(breakpoint);
    setCols(cols);
  };

  const onResize = (
    layout: any,
    oldLayoutItem: any,
    layoutItem: any,
    placeholder: any
  ) => {
    if (layoutItem.w < 7) {
    }
  };

  const { setDatasources, subscribeDatasources } = useDataStore((state) => ({
    setDatasources: state.setDatasources,
    subscribeDatasources: state.subscribeDatasources,
  }));

  useEffect(() => {
    if (tiles.length > 0) {
      tiles.forEach((tile: TileFormat) => {
        if (tile && tile.channels) {
          tile.channels.forEach((channel: Source) => {
            addChannel(channel);
          });
        }
      });
    }
    if (Object.entries(topics).length !== 0 && selectedSources) {
      subscribe();
    }
  }, [tiles, topics, selectedSources]);

  const addChannel = (channel: Source): boolean => {
    if (
      selectedSources.filter((source: Source) => source === channel).length ===
      0
    ) {
      const channels = selectedSources.concat(channel);
      setSelectedSources(channels);
      return true;
    }
    return false;
  };

  const subscribeToChannels = async (selectedSources: SelectedSource[]) => {
    const subscribeSources = selectedSources
      .filter(
        (source: SelectedSource) =>
          source.selectedChannels !== undefined &&
          source.selectedChannels.length > 0
      )
      .map(
        (source: SelectedSource) =>
          ({
            id: source.id,
            name: source.url.split("/")[2],
            byteFormat: source.byteFormat,
            url: source.url,
            subscribedChannels: source.selectedChannels,
          } as EditedSelectedSource)
      );
    setDatasources(subscribeSources);
    subscribeDatasources(subscribeSources);
  };

  // listen to specific sources
  const subscribe = () => {
    let topicsClone = deepCopy(topics);
    topicsClone.map((topic: Topic, index: number) => {
      topicsClone[index] = {
        ...topicsClone[index],
        selectedChannels: selectedSources
          .filter((source: Source) => source.topicId === topic.id)
          .map((source: Source) => {
            return source.channel;
          }),
      };
    });
    subscribeToChannels(topicsClone);
  };

  const removeChannel = (channel: Source) => {
    // if we are subscribing to it
    if (
      selectedSources.filter((source: Source) => source === channel).length >= 1
    ) {
      const channels = selectedSources.filter(
        (source: Source) => !(source === channel)
      );
      setSelectedSources(channels);
    }
  };

  // Function finds all subscribed topics (A topic is a subscribed datasource or processor)

  return (
    <ResponsiveReactGridLayout
      className="layout"
      onLayoutChange={(layout) => {
        setInitialLayout(layout);
      }}
      onBreakpointChange={onBreakpointChange}
      draggableHandle={".Handler"}
      cols={{ xl: 12, lg: 12, md: 6, sm: 6, s: 6, xs: 6, xxs: 6 }}
      onResize={onResize}
      rowHeight={120}
    >
      {tiles &&
        initialLayout &&
        tiles.map((tl: TileFormat, index: number) => {
          if (tl.category === "real-time") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <RealTimeTile
                  selectedSources={selectedSources}
                  dashboardId={dashboardId}
                  projectId={projectId}
                  tile={tl}
                  topics={topics}
                  _addChannel={addChannel}
                  _removeChannel={removeChannel}
                />
              </div>
            );
          } else if (tl.category === "history") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <HistoricalTile
                  tile={tl}
                  topics={topics}
                  gridLayout={initialLayout}
                  dashboardId={dashboardId}
                  projectId={projectId}
                />
              </div>
            );
          } else if (tl.category === "youtube") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <VideoStreamingTile
                  tile={tl}
                  dashboardId={dashboardId}
                  projectId={projectId}
                />
              </div>
            );
          } else if (tl.category === "model") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 12,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 12,
                  maxW: 12,
                }}
              >
                <ModelTile
                  tile={tl}
                  dashboardId={dashboardId}
                  projectId={projectId}
                />
              </div>
            );
          } else if (tl.category === "map") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <MapTile
                  tile={tl}
                  dashboardId={dashboardId}
                  projectId={projectId}
                  topics={topics}
                />
              </div>
            );
          } else if (tl.category === "spectrogram") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <SpectrogramTile
                  tile={tl}
                  topics={topics}
                  projectId={projectId}
                  dashboardId={dashboardId}
                />
              </div>
            );
          } else if (tl.category === "statistics") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <StatisticsTile
                  tile={tl}
                  topics={topics}
                  gridLayout={initialLayout}
                  dashboardId={dashboardId}
                  projectId={projectId}
                />
              </div>
            );
          } else if (tl.category === "statistics_distribution") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <HistogramTile
                  tile={tl}
                  topics={topics}
                  gridLayout={initialLayout}
                  dashboardId={dashboardId}
                  projectId={projectId}
                />
              </div>
            );
          } else if (tl.category === "fft") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <FFTTile
                  tile={tl}
                  topics={topics}
                  gridLayout={initialLayout}
                  dashboardId={dashboardId}
                  projectId={projectId}
                />
              </div>
            );
          } else if (tl.category === "predictions") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <PredictiveTile
                  selectedSources={selectedSources}
                  dashboardId={dashboardId}
                  projectId={projectId}
                  tile={tl}
                  topics={topics}
                  _addChannel={addChannel}
                  _removeChannel={removeChannel}
                />
              </div>
            );
          } else if (tl.category === "history-predictions") {
            return (
              <div
                key={tl.id}
                data-grid={{
                  i: tl.id,
                  x: (index * 6) % 12,
                  y: 0,
                  w: 6,
                  h: 4,
                  minH: 4,
                  maxH: 4,
                  minW: 6,
                  maxW: 12,
                }}
              >
                <PredictiveHistoricalTile
                  dashboardId={dashboardId}
                  projectId={projectId}
                  tile={tl}
                  topics={topics}
                  gridLayout={initialLayout}
                />
              </div>
            );
          } else {
            return <div></div>;
          }
        })}
    </ResponsiveReactGridLayout>
  );
});
export default Tiles;
