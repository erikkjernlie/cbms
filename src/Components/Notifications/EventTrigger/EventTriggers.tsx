import React, { useState } from "react";
import Modal from "react-modal";
import Button from "src/Components/UI/Button/Button";
import { useEventTriggers } from "src/hooks/project/project";
import useDatasourceStore from "src/stores/project/datasourceStore";
import { TriggerData } from "src/types/datahandling";

import * as S from "../Notification.style";

Modal.setAppElement("body");

interface Props {
  projectId: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    minWidth: "900px",
    marginRight: "-30%",
    transform: "translate(-50%, -50%)",
    transition: "1s ease-in-out",
  },
};

export default function EventTriggers(props: Props) {
  const { projectId } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { deleteSourceFromDatabase } = useDatasourceStore();
  const {
    loadingEventTrigger,
    getEventTriggers,
    triggers,
    deleteEventTrigger,
  } = useEventTriggers();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const deleteTrigger = (id: string) => {
    deleteEventTrigger(projectId, id).then(() => {
      deleteSourceFromDatabase(projectId, id, "processor");

      getEventTriggers(projectId);
    });
  };

  return (
    <div>
      <Button
        className="Black"
        onClick={() => {
          getEventTriggers(projectId).then(() => setModalIsOpen(true));
        }}
        loading={loadingEventTrigger}
      >
        See current event triggers
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add event trigger"
      >
        {
          <S.EventTrigger key={"first"}>
            <S.Item headerItem={true}>Information </S.Item>
            <S.Item headerItem={true} params>
              Event trigger
            </S.Item>
            <hr />
          </S.EventTrigger>
        }
        {triggers &&
          triggers.map((trigger: any, index: number) => {
            let triggerData = {} as TriggerData;
            for (var prop in JSON.parse(trigger.init_params.trigger_inputs)) {
              triggerData = JSON.parse(trigger.init_params.trigger_inputs)[
                prop
              ] as TriggerData;
              break;
            }
            return (
              <S.EventTrigger key={index}>
                <S.Item headerItem={false}>
                  <S.TriggerItem>
                    <S.Bold>Id:</S.Bold>
                    {trigger.id}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Topic id:</S.Bold> {trigger.topic_id}
                  </S.TriggerItem>
                  <S.TriggerItem button>
                    {" "}
                    <Button
                      onClick={() => deleteTrigger(trigger.id)}
                      loading={loadingEventTrigger}
                      className="Grey"
                    >
                      Delete event trigger
                    </Button>
                  </S.TriggerItem>
                </S.Item>
                <S.Item headerItem={false} params>
                  <S.TriggerItem>
                    <S.Bold>Name:</S.Bold> {triggerData.name}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Min:</S.Bold>
                    {triggerData.min}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Minimum description: </S.Bold>
                    {triggerData.minDescription}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Minimum severity: </S.Bold>
                    {triggerData.minSeverityLevel}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Max: </S.Bold>
                    {triggerData.max}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Maximum description: </S.Bold>
                    {triggerData.maxDescription}
                  </S.TriggerItem>
                  <S.TriggerItem>
                    <S.Bold>Maximum severity: </S.Bold>
                    {triggerData.maxSeverityLevel}
                  </S.TriggerItem>
                </S.Item>
              </S.EventTrigger>
            );
          })}
      </Modal>
    </div>
  );
}
