import React, { SyntheticEvent, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdTimer } from "react-icons/io";
import { toast } from "react-toastify";
import Button from "src/Components/UI/Button/Button";

import * as T from "../../NewProject.style";
import * as S from "./SelectSensors.style";

interface Props {
  availableSensors: string[];
  setSelectedSensors: (sensors: string[]) => void;
  setTimeIndex: (index: number) => void;
  timeIndex: number;
}

const SelectSensorsFromJSON = (props: Props) => {
  const {
    setSelectedSensors,
    availableSensors,
    setTimeIndex,
    timeIndex,
  } = props;

  const [sensors, setSensors] = useState([] as string[]);
  const [index, setIndex] = useState("");
  const [possibleSensors, setPossibleSensors] = useState(
    props.availableSensors
  );

  useEffect(() => {
    setPossibleSensors(availableSensors);
  }, [availableSensors]);

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: string[],
    destination: any,
    droppableSource: any,
    droppableDestination: any
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);
    if (droppableSource.droppableId === "select") {
      setPossibleSensors(sourceClone as string[]);
      setSensors(destClone as string[]);
      setTimeIndex(destClone.indexOf(index));
    } else {
      setPossibleSensors(destClone as string[]);
      setSensors(sourceClone as string[]);
      setTimeIndex(sourceClone.indexOf(index));
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // if in the same one
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "select") {
        const items = reorder(
          possibleSensors,
          source.index,
          destination.index
        ) as string[];
        setPossibleSensors(items);
      } else {
        const items = reorder(
          sensors,
          source.index,
          destination.index
        ) as string[];
        setSensors(items);
        setTimeIndex(items.indexOf(index));
      }
    } else {
      if (source.droppableId === "select") {
        move(possibleSensors, sensors, source, destination);
      } else {
        move(sensors, possibleSensors, source, destination);
      }
    }
  };

  return (
    <S.Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <T.Columns>
          <Droppable droppableId="select">
            {(provided: any, snapshot: any) => (
              <S.ColumnLeft
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {possibleSensors &&
                  possibleSensors.map((sensor: string, index: number) => (
                    <Draggable key={sensor} draggableId={sensor} index={index}>
                      {(provided, snapshot) => (
                        <S.Select
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          onClick={() => {
                            if (!sensors.includes(sensor)) {
                              //setSensors(sensors.concat(sensor));
                              setSensors(sensors.concat(sensor));
                              setPossibleSensors(
                                possibleSensors.filter((s) => s !== sensor)
                              );
                            }
                          }}
                        >
                          {sensor}
                        </S.Select>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </S.ColumnLeft>
            )}
          </Droppable>
          <Droppable droppableId="selected">
            {(provided: any, snapshot: any) => (
              <S.ColumnRight
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {sensors.length === 0 && <div>Drop your sensors here</div>}
                {sensors.map((sensor: string, i: number) => (
                  <Draggable key={sensor} draggableId={sensor} index={i}>
                    {(provided, snapshot) => (
                      <S.Selected
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        onClick={() => {
                          setIndex(sensor);
                          setTimeIndex(sensors.indexOf(sensor));
                        }}
                      >
                        <div>{sensor}</div>

                        {sensor === index && (
                          <div>
                            <IoMdTimer
                              color="black"
                              size="1.2em"
                              style={{ padding: "1px" }}
                            />
                          </div>
                        )}
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
            <T.SmallText>
              Set sensors. Remember, you need to have a sensor with a timestamp
            </T.SmallText>
          </S.ColumnLeft>
          <S.ColumnRight>
            <Button
              onClick={(e: SyntheticEvent) => {
                e.preventDefault();
                if (timeIndex !== -1) {
                  setSelectedSensors(sensors);
                } else {
                  toast.warn(
                    "Click on the selected sensor which is your timestamp",
                    {
                      position: toast.POSITION.BOTTOM_CENTER,
                    }
                  );
                }
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

export default SelectSensorsFromJSON;
