import React, { useState } from "react";
import * as S from "src/Components/Dashboard/Dashboard.style";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";
import { Source, Topic } from "src/types/datasource";

import Curve from "../RealTime/Curve";
import Predictive from "../RealTime/Predictive";
import FFT from "./FFT";
import Spectrogram from "./Spectrogram";
import Statistics from "./Statistics";

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
  dashboardId: string;
}

const AddNewAnalytics = (props: Props) => {
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
    dashboardId,
  } = props;

  const [route, setRoute] = useState("curve");

  return (
    <S.AddNewComponentContainer>
      <S.ComponentHeader>
        <S.ComponentHeaderItem
          onClick={() => setRoute("curve")}
          selectedRoute={route === "curve"}
        >
          Curve Plot
        </S.ComponentHeaderItem>
        <S.ComponentHeaderItem
          onClick={() => setRoute("fft")}
          selectedRoute={route === "fft"}
        >
          Fast Fourier Transform
        </S.ComponentHeaderItem>
        <S.ComponentHeaderItem
          onClick={() => setRoute("spectrogram")}
          selectedRoute={route === "spectrogram"}
        >
          Spectrogram
        </S.ComponentHeaderItem>
        <S.ComponentHeaderItem
          onClick={() => setRoute("statistics")}
          selectedRoute={route === "statistics"}
        >
          Statistics
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
            type="history"
          />
        )}
        {route === "fft" && (
          <FFT
            add={add}
            remove={remove}
            clear={clear}
            handleSelectChange={handleSelectChange}
            selectValue={selectValue}
            topics={topics}
            tile={tile}
            setTile={setTile}
            projectId={projectId}
          />
        )}
        {route === "spectrogram" && (
          <Spectrogram
            handleSelectChange={handleSelectChange}
            selectValue={selectValue}
            projectId={projectId}
            dashboardId={dashboardId}
            tile={tile}
            setTile={setTile}
            topics={topics}
          />
        )}
        {route === "statistics" && (
          <div>
            <Statistics
              handleSelectChange={handleSelectChange}
              selectValue={selectValue}
              add={add}
              remove={remove}
              clear={clear}
              tile={tile}
              setTile={setTile}
              topics={topics}
              projectId={projectId}
            />
          </div>
        )}
      </S.InnerContent>
    </S.AddNewComponentContainer>
  );
};

export default AddNewAnalytics;
