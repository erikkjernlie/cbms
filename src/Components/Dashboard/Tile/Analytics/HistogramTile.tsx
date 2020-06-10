import React, { useEffect, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import Plot from "react-plotly.js";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import {
  getHistoricalFromFile,
  getHistoricalFromSource,
} from "src/backendAPI/transformations";
import SettingsModal from "src/Components/Settings/SettingsModal";
import Button from "src/Components/UI/Button/Button";
import useProjectStore from "src/stores/project/projectStore";
import { Buffer, Histogram, TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";
import parseData from "src/utils/dataHandler/ReadData";
import { plottingColors } from "src/utils/styles/styles";
import stats, { histogram } from "stats-lite";

import * as S from "../Tile.style";

interface Props {
  topics: Topic[];
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
  gridLayout: any;
}

const HistogramTile = React.memo((props: Props) => {
  const { topics, tile, dashboardId, projectId, gridLayout } = props;

  const loadDataInMilliseconds = [10000, 30000, 60000, 180000];

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);
  const [data, setData] = useState({} as Buffer);
  const [statData, setStatData] = useState([] as any[]);
  const [topic, setTopic] = useState({} as Topic);
  const [selectedChannels, setSelectedChannels] = useState(
    tile.channels || ([] as Source[])
  );

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  useEffect(() => {
    if (tile.type === "file") {
      configureFile();
    }
  }, [tile]);

  useEffect(() => {
    if (tile.type === "source" && topics !== undefined) {
      configureDatasource(
        tile.mode ? parseInt(tile.mode) * 1000 : (10000 as number)
      );
    }
  }, [tile, topics]);

  useEffect(() => {
    if (Object.entries(data).length !== 0 && selectedChannels) {
      const tempData = selectedChannels.map((channel: Source) => {
        const values = data.value_buffer[channel.channel.id];
        const histogram = (stats.histogram(values, 5) as unknown) as Histogram;
        let testingArray = [] as any[];
        testingArray.push({
          histfunc: "sum",
          y: histogram.values,
          x: histogram.values.map((value: number, index: number) => {
            return index + 1 === histogram.binWidth
              ? histogram.binLimits[1]
              : histogram.binLimits[0] + histogram.binWidth * index;
          }),
          type: "histogram",
          name: channel.channel.channelName,
        });
        return testingArray;
      });
      setStatData(tempData);
    }
  }, [selectedChannels, data]);

  const configureFile = async () => {
    setLoading(true);
    const filename = tile.fill ? tile.fill : "";

    const response = await getHistoricalFromFile(projectId, filename);
    const headers = response[0];
    if (response && response[2]) {
      const tempData = response[2].map((data: any, index: number) => {
        const histogram = (stats.histogram(data, 5) as unknown) as Histogram;
        let testingArray = [] as any[];
        testingArray.push({
          histfunc: "sum",
          y: histogram.values,
          x: histogram.values.map((value: number, index: number) => {
            return index + 1 === histogram.binWidth
              ? histogram.binLimits[1]
              : histogram.binLimits[0] + histogram.binWidth * index;
          }),
          type: "histogram",
          name: headers[index + 1],
        });
        return testingArray;
      });
      setStatData(tempData);
      setLoading(false);
    }
  };

  const configureDatasource = (time: number) => {
    setLoading(true);
    setLoadingTime(time);
    let t = {} as Topic;
    if (topic.id === undefined) {
      const topicId = tile.channels
        ? tile.channels.map((channel: Source) => channel.topicId)[0]
        : "";
      if (topicId === "") {
        setError("No topic registered on tile channels");
        setLoading(false);
        return;
      }
      const temp = topics.find((t: Topic) => t.id === topicId);
      if (temp === undefined) {
        setError("Tile data source not subscribed to");
        setLoading(false);
        return;
      }
      t = temp;
      setTopic(t);
      setError("");
    } else {
      t = topic;
    }

    let now = Date.now();

    getHistoricalFromSource(t.id, now, time).then((response) => {
      if (response !== null) {
        response
          .arrayBuffer()
          .then((resp) => {
            let parsedData = parseData(resp.slice(4), t);
            setData(parsedData);
          })
          .then(() => {
            setLoading(false);
          });
      }
    });
  };

  const addChannel = (topicId: string, channel: any) => {
    if (
      selectedChannels.filter(
        (e: Source) => e.topicId === topicId && channel === e.channel
      ).length === 0
    ) {
      const channels = selectedChannels.concat({
        topicId: topicId,
        channel: channel,
      });
      setSelectedChannels(channels);
    }
  };

  const removeChannel = (channel: Source) => {
    if (selectedChannels.some((e: Source) => channel === e)) {
      const channels = selectedChannels.filter((e: Source) => channel !== e);
      setSelectedChannels(channels);
    }
  };

  return (
    <S.PlotComponent>
      <S.Header>
        <S.HeaderLeft>
          <S.Handler className="Handler">
            <FaGripVertical size={"1.2em"} />
          </S.Handler>
          <S.PlotName>{tile.name}</S.PlotName>
        </S.HeaderLeft>
        <S.HeaderRight>
          <S.Buttons>
            {tile.type === "source" &&
              loadDataInMilliseconds &&
              loadDataInMilliseconds.map(
                (milliseconds: number, index: number) => (
                  <Button
                    key={index}
                    className="Small"
                    onClick={() => configureDatasource(milliseconds)}
                    loading={loading && loadingTime === milliseconds}
                  >
                    {milliseconds / 1000}s
                  </Button>
                )
              )}
          </S.Buttons>
          <SettingsModal
            projectId={projectId}
            dashboardId={dashboardId}
            tile={tile}
          >
            <S.Content>
              <S.PlotSettingsSubTitle>Add sensors</S.PlotSettingsSubTitle>
              {tile.type === "source" && topic && topic.channels && (
                <Select
                  className="Select"
                  isMulti
                  onChange={(newList: any, object: any) => {
                    if (object.action === "select-option") {
                      addChannel(topic.id, object.option.value);
                    }
                  }}
                  options={topic.channels
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
            </S.Content>
          </SettingsModal>
        </S.HeaderRight>
      </S.Header>

      {error || loading ? (
        error ? (
          <S.Error>{error}</S.Error>
        ) : (
          <S.Loading>
            <ClipLoader size={15} color={"#123abc"} loading={loading} />
          </S.Loading>
        )
      ) : (
        <div
          style={{ display: "flex", flexDirection: "row", width: "inherit" }}
        >
          {statData &&
            statData.map((item: any, index: number) => {
              const width = 100 / statData.length + "%";

              const layout = {
                height: 400,
                autosize: true,
                padding: 0,
                plot_bgcolor: "#fff",
                showlegend: false,
                title: item[0].name,
              };
              return (
                <Plot
                  key={index}
                  style={{ width: width }}
                  layout={layout}
                  config={{ responsive: true }}
                  frames={[]}
                  data={item}
                  useResizeHandler={true}
                />
              );
            })}
        </div>
      )}
      <div>
        {selectedChannels && selectedChannels.length > 0 && (
          <S.SelectedChannels>
            {selectedChannels.map((channel: Source, index: number) => {
              return (
                <S.SelectedChannel
                  key={channel.channel.id}
                  onClick={() => removeChannel(channel)}
                  colorValue={plottingColors[index % plottingColors.length]}
                >
                  <TiDelete size={"14px"} />
                  <div>{channel.channel.channelName}</div>
                </S.SelectedChannel>
              );
            })}
          </S.SelectedChannels>
        )}
      </div>
    </S.PlotComponent>
  );
});
export default HistogramTile;
