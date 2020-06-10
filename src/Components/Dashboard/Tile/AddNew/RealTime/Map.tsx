import cloneDeep from "lodash.clonedeep";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import * as S from "src/Components/Dashboard/Tile/Tile.style";
import { Button } from "src/Components/UI/Button/Button.style";
import SelectComponent from "src/Components/UI/Dropdown/Select";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";
import { Channel, Source, Topic } from "src/types/datasource";

interface Props {
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
  topics: Topic[];
}

const Map = (props: Props) => {
  const { tile, setTile, topics } = props;

  const [dynamicOrStatic, setDynamicOrStatic] = useState("static");
  const [loading, setLoading] = useState(false);
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [positionChannels, setPositionChannels] = useState([] as Source[]);
  const [topic, setTopic] = useState({} as Topic);

  useEffect(() => {
    setTile({
      ...tile,
      category: "map",
      type: "static",
    });
  }, []);

  useEffect(() => {
    if (loading && long !== "" && lat !== "") {
      setLoading(false);
    }
  }, [loading, tile]);

  const setMapType = (type: string) => {
    setDynamicOrStatic(type);
    setTile({ ...tile, type: type });
  };

  const setLongLat = (e: any, type: string) => {
    if (type === "auto") {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude.toString());
        setLong(position.coords.longitude.toString());
        setTile({
          ...tile,
          fill: position.coords.latitude + "," + position.coords.longitude,
        });
      });
    } else {
      type === "lat" ? setLat(e.target.value) : setLong(e.target.value);
      setTile({ ...tile, fill: lat + "," + long });
    }
  };

  const setPositionTopic = (e: any) => {
    const element = topics.find((topic: Topic) => {
      return e.target.value === topic.url.split("/")[2];
    });
    setTopic(element || ({} as Topic));
  };

  const setPositionChannel = (e: any, type: string) => {
    const element = topic.channels.find(
      (channel: Channel) => channel.channelName === e.target.value
    ) as Channel;
    const source = { topicId: topic.id, channel: element } as Source;

    let current = cloneDeep(positionChannels);
    type === "long" ? (current[0] = source) : (current[1] = source);
    setPositionChannels(current);
    setTile({ ...tile, channels: current });
  };

  return (
    <div>
      <Q.Columns>
        <Q.ColumnLeft noPadding={false}>
          <Q.SmallText>
            Choose between static (same position at all times) and dynamic
            (asset is moving) position
          </Q.SmallText>
        </Q.ColumnLeft>
        <Q.ColumnRight noPadding={false}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              className="Simple"
              selected={dynamicOrStatic === "static"}
              onClick={() => setMapType("static")}
            >
              Static Position
            </Button>
            <Button
              className="Simple"
              selected={dynamicOrStatic === "dynamic"}
              onClick={() => setMapType("dynamic")}
            >
              Dynamic position
            </Button>
          </div>
        </Q.ColumnRight>
      </Q.Columns>
      <Q.Columns>
        <Q.ColumnLeft noPadding={false}>
          <Q.SmallText>
            Choose between getting the position of your device or get position
            from a datasource
          </Q.SmallText>
        </Q.ColumnLeft>
        <Q.ColumnRight noPadding={false}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            {loading && (
              <S.Error>
                <ClipLoader size={20} color={"grey"} loading={true} />
              </S.Error>
            )}
            {dynamicOrStatic === "static" && !loading && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Button onClick={(e) => setLongLat(e, "auto")}>
                    Get Current
                  </Button>
                </div>
                <hr
                  style={{
                    margin: "auto",
                    width: "1px",
                    height: "90px",
                    color: "#cdcdcd",
                    marginRight: "30px",
                    marginLeft: "30px",
                  }}
                />
                <div>
                  <label style={{ fontSize: "12px" }}>Latitude</label>
                  <TextInput
                    value={lat}
                    placeholder={lat}
                    onChange={(e) => setLongLat(e, "lat")}
                  />
                  <label style={{ fontSize: "12px" }}>Longitude</label>
                  <TextInput
                    value={long}
                    placeholder={long}
                    onChange={(e) => setLongLat(e, "long")}
                  />
                </div>
              </div>
            )}
            {dynamicOrStatic === "dynamic" && !loading && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Button onClick={(e) => setLongLat(e, "auto")}>
                    Get Current
                  </Button>
                </div>
                <hr
                  style={{
                    margin: "auto",
                    width: "1px",
                    height: "90px",
                    color: "#cdcdcd",
                    marginRight: "30px",
                    marginLeft: "30px",
                  }}
                />
                <div>
                  <label style={{ fontSize: "12px" }}>Choose datasource</label>
                  <SelectComponent onChange={setPositionTopic}>
                    <option>None</option>
                    {topics.map((topic: Topic, index: number) => (
                      <option key={index}>{topic.url.split("/")[2]}</option>
                    ))}
                  </SelectComponent>
                  {topic.channels !== undefined && (
                    <div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontSize: "12px" }}>Latitude</label>
                        <SelectComponent
                          onChange={(e) => setPositionChannel(e, "lat")}
                        >
                          <option>None</option>
                          {topic.channels.map((channel: Channel) => (
                            <option key={channel.id}>
                              {channel.channelName}
                            </option>
                          ))}
                        </SelectComponent>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ fontSize: "12px" }}>Longitude</label>
                        <SelectComponent
                          onChange={(e) => setPositionChannel(e, "long")}
                        >
                          <option>None</option>
                          {topic.channels.map((channel: Channel) => (
                            <option key={channel.id}>
                              {channel.channelName}
                            </option>
                          ))}
                        </SelectComponent>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Q.ColumnRight>
      </Q.Columns>
    </div>
  );
};

export default Map;
