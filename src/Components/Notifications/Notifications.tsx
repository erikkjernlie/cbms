import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import { fetchTopics } from "src/backendAPI/topics";
import Notification from "src/Components/Notifications/Notification";
import Button from "src/Components/UI/Button/Button";
import useNotificationsStore from "src/stores/listeners/notificationsStore";
import { INotification } from "src/types/datahandling";
import { RawTopic, Topic, TopicsJson } from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";

import AddEventTrigger from "./EventTrigger/AddEventTrigger";
import EventTriggers from "./EventTrigger/EventTriggers";
import * as S from "./Notification.style";

Modal.setAppElement("body");

interface Props {
  projectId: string;
}

export default function Notifications(props: Props) {
  const { projectId } = props;

  const [topics, setTopics] = useState([] as Topic[]);
  const layout = {
    height: 400,
    autosize: true,
    padding: 0,
    title: "Delay",
    xaxis: {
      title: "Timestamp",
    },
    yaxis: {
      title: "Delay in seconds",
    },
    plot_bgcolor: "#fff",
    showlegend: true,
  };

  const {
    notifications,
    deletingNotification,
    deleteAllNotifications,
    timestamps,
    delayAssetToBackend,
    totalDelays,
    delayBackendToFrontend,
  } = useNotificationsStore((state) => ({
    deletingNotification: state.deletingNotification,
    deleteAllNotifications: state.deleteAllNotifications,
    notifications: state.notifications,
    timestamps: state.timestamps,
    delayAssetToBackend: state.delayAssetToBackend,
    delayBackendToFrontend: state.delayBackendToFrontend,
    totalDelays: state.totalDelays,
  }));

  useEffect(() => {
    loadSources();
  }, [projectId]);

  const loadSources = async () => {
    const topicsJSON = (await fetchTopics()) as TopicsJson;

    if (!topicsJSON) return;
    let newTopics = Object.entries(topicsJSON).map((tempTopic: any) => {
      let id = tempTopic[0];
      let topic = tempTopic[1] as RawTopic;
      return {
        id: id,
        url: topic.url,
        byteFormat: topic.byte_format,
        channels: makeChannels(topic) || [],
      };
    });
    setTopics(newTopics);
  };

  return (
    <div>
      <S.Flex>
        <AddEventTrigger projectId={projectId} topics={topics} />
        <EventTriggers projectId={projectId} />
        <Button
          onClick={() => deleteAllNotifications(props.projectId)}
          loading={deletingNotification === "all"}
          className="Grey"
        >
          Delete all notifications
        </Button>
      </S.Flex>

      <S.Notifications>
        <Notification
          finished={"Finished"}
          id={"Id"}
          description={"Description"}
          severity={"Severity"}
          sensor={"Sensor"}
          triggerReason={"Trigger reason"}
          headerItem={true}
          topics={topics}
          limitValue={null}
          projectId={projectId}
        />
      </S.Notifications>
      <S.Bar />
      <S.Notifications>
        {notifications &&
          notifications.map((notification: INotification, index: number) => (
            <Notification
              key={index}
              projectId={projectId}
              topics={topics}
              startedAt={notification.startedAt}
              endedAt={notification.endedAt}
              finished={notification.finished}
              id={notification.id}
              description={notification.description}
              severity={notification.severity}
              sensor={notification.sensor}
              triggerReason={notification.triggerReason}
              limitValue={
                notification.valueExceeded ? notification.valueExceeded : null
              }
            />
          ))}
      </S.Notifications>
    </div>
  );
}
