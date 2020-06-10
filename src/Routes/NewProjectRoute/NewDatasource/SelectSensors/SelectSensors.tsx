import React, { SyntheticEvent, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";

import * as T from "../../NewProject.style";
import * as S from "./SelectSensors.style";

interface Props {
  setSelectedSensors: (sensors: string[]) => void;
  setTimeIndex: (index: number) => void;
  timeIndex: number;
}

const SelectSensors = (props: Props) => {
  const { setSelectedSensors, setTimeIndex, timeIndex } = props;

  const [sensor, setSensor] = useState("");
  const [sensors, setSensors] = useState([
    "Default sample rate",
    "Slow sample rate",
    "Fast sample rate",
    "Load [N]",
    "Displacement [mm]",
    "AccelerometerX",
    "0 Degrees Transvers on Axle",
    "Rosett +45 Degrees Along Axle",
    "Rosett 90 Degrees Along Axle",
    "Rosett -45 Degrees Along Axle",
    "Radius +45 Degrees Along Axle",
    "MX840A 0 hardware time default sample rate",
  ] as string[]);

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const addSensor = (e: SyntheticEvent) => {
    e.preventDefault();
    if (sensor.length > 0) {
      setSensors(sensors.concat(sensor));
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    // handle timeIndex here

    // dropped outside the list
    if (!destination) {
      return;
    }
    // if in the same one

    const items = reorder(sensors, source.index, destination.index) as string[];
    setSensors(items);
  };

  return (
    <S.Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <T.Columns>
          <S.ColumnLeft>
            <S.SmallText>
              Select your sensors. Remember, you need need to have the sensors
              in the SAME order as the data source
            </S.SmallText>
          </S.ColumnLeft>
          <Droppable droppableId="selected">
            {(provided: any, snapshot: any) => (
              <S.ColumnRight
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <S.Flex>
                  <TextInput
                    onChange={(e: any) => setSensor(e.target.value)}
                    placeholder="add a sensor"
                    value={sensor}
                  />
                  <Button onClick={addSensor}>Add sensor</Button>
                </S.Flex>
                {sensors.map((sensor: string, i: number) => (
                  <Draggable key={sensor} draggableId={sensor} index={i}>
                    {(provided, snapshot) => (
                      <S.Selected
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        onClick={() => {
                          //setIndex(sensor);
                          //setTimeIndex(sensors.indexOf(sensor));
                        }}
                      >
                        <div>{sensor}</div>

                        {/*
                        TODO: handle time index
                        sensor === index && (
                          <div>
                            <IoMdTimer
                              color="black"
                              size="1.2em"
                              style={{ padding: "1px" }}
                            />
                          </div>
                        )*/}
                      </S.Selected>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </S.ColumnRight>
            )}
          </Droppable>
        </T.Columns>
        <T.Columns>
          <S.ColumnLeft>
            <T.SmallText>Set sensors.</T.SmallText>
          </S.ColumnLeft>
          <S.ColumnRight>
            <Button
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                setSelectedSensors(sensors);
              }}
            >
              Set sensors
            </Button>
          </S.ColumnRight>
        </T.Columns>
      </DragDropContext>
    </S.Container>
  );
};

export default SelectSensors;
