import React, { useState } from "react";
import * as S from "src/Components/Dashboard/Dashboard.style";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";
import { Source, Topic } from "src/types/datasource";

import Curve from "./Curve";
import Map from "./Map";
import Predictive from "./Predictive";
import Video from "./Video";

interface Props {
  handleSelectChange: (e: any) => void;
  selectValue: Topic;
  topics: Topic[];
  add: (source: Source) => void;
  remove: (source: Source) => void;
  clear: () => void;
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
  projectId: string;
}

const AddNewRealTime = (props: Props) => {
  const {
    handleSelectChange,
    selectValue,
    topics,
    add,
    clear,
    tile,
    remove,
    setTile,
    projectId,
  } = props;

  const [route, setRoute] = useState("curve");

  return (
    <S.AddNewComponentContainer>
      <S.ComponentHeader>
        <S.ComponentHeaderItem
          onClick={() => setRoute("curve")}
          selectedRoute={route === "curve"}
        >
          Curve plot
        </S.ComponentHeaderItem>
        <S.ComponentHeaderItem
          onClick={() => setRoute("video")}
          selectedRoute={route === "video"}
        >
          Video streaming
        </S.ComponentHeaderItem>
        <S.ComponentHeaderItem
          onClick={() => setRoute("map")}
          selectedRoute={route === "map"}
        >
          Map
        </S.ComponentHeaderItem>
        <S.ComponentHeaderItem
          onClick={() => setRoute("predictions")}
          selectedRoute={route === "predictions"}
        >
          Predictions
        </S.ComponentHeaderItem>
      </S.ComponentHeader>
      <Q.Columns>
        <Q.ColumnLeft>
          <Q.SmallText>Choose a name</Q.SmallText>
        </Q.ColumnLeft>
        <Q.ColumnRight>
          <TextInput
            placeholder={tile.name}
            value={tile.name}
            onChange={(e: any) =>
              setTile({
                ...tile,
                name: e.target.value,
              })
            }
          />
        </Q.ColumnRight>
      </Q.Columns>
      <S.InnerContent>
        {route === "curve" && (
          <Curve
            projectId={projectId}
            handleSelectChange={handleSelectChange}
            selectValue={selectValue}
            topics={topics}
            add={add}
            remove={remove}
            clear={clear}
            tile={tile}
            setTile={setTile}
            type="real-time"
          />
        )}
        {route === "video" && <Video tile={tile} setTile={setTile} />}
        {route === "map" && (
          <Map topics={topics} tile={tile} setTile={setTile} />
        )}
        {route === "predictions" && (
          <Predictive
            projectId={projectId}
            handleSelectChange={handleSelectChange}
            selectValue={selectValue}
            topics={topics}
            add={add}
            remove={remove}
            clear={clear}
            tile={tile}
            setTile={setTile}
            type="predictions"
          />
        )}
      </S.InnerContent>
    </S.AddNewComponentContainer>
  );
};

export default AddNewRealTime;
