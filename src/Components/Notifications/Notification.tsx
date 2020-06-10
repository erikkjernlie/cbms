import moment from "moment";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import Button from "src/Components/UI/Button/Button";
import useNotificationsStore from "src/stores/listeners/notificationsStore";
import { Timestamp } from "src/types/datahandling";
import { Topic } from "src/types/datasource";

import * as S from "./Notification.style";
import NotificationPlot from "./NotificationPlot";

interface Props {
  startedAt?: Timestamp;
  endedAt?: Timestamp;
  finished: boolean | string;
  id: string;
  description: string;
  severity: string;
  sensor: string;
  triggerReason: string;
  headerItem?: boolean;
  topics: Topic[];
  limitValue: number | null;
  projectId: string;
}

const Notification = (props: Props) => {
  const {
    startedAt,
    endedAt,
    finished,
    id,
    description,
    severity,
    sensor,
    triggerReason,
    headerItem,
    topics,
    limitValue,
    projectId,
  } = props;

  const [displayPlot, setDisplayPlot] = useState(false);

  const { deletingNotification, deleteNotification } = useNotificationsStore(
    (state) => ({
      deletingNotification: state.deletingNotification,
      deleteNotification: state.deleteNotification,
    })
  );

  return (
    <S.Container headerItem={headerItem ? true : false}>
      <div>
        <S.Notification headerItem={headerItem ? true : false}>
          <S.NotificationItem headerItem={headerItem ? true : false}>
            {startedAt
              ? moment(new Date(startedAt.seconds * 1000)).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )
              : "Time of occurence"}
          </S.NotificationItem>
          <S.NotificationItem headerItem={headerItem ? true : false}>
            {!endedAt ? (
              headerItem ? (
                "Duration"
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <ClipLoader
                    size={10}
                    //size={"150px"} this also works
                    color={"#123abc"}
                    loading={true}
                  />
                </div>
              )
            ) : (
              startedAt && (
                <div>{endedAt.seconds - startedAt.seconds} seconds</div>
              )
            )}
          </S.NotificationItem>
          <S.NotificationItem headerItem={headerItem ? true : false}>
            {sensor.charAt(0).toUpperCase() + sensor.slice(1)}
          </S.NotificationItem>
          <S.NotificationItem headerItem={headerItem ? true : false}>
            {description.charAt(0).toUpperCase() + description.slice(1)}
          </S.NotificationItem>
          <S.NotificationItem
            size={"small"}
            headerItem={headerItem ? true : false}
            color={
              severity.toLocaleLowerCase() === "high"
                ? "red"
                : severity.toLocaleLowerCase() === "medium"
                ? "yellow"
                : "green"
            }
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </S.NotificationItem>
          <S.NotificationItem headerItem={headerItem ? true : false}>
            {triggerReason.charAt(0).toUpperCase() + triggerReason.slice(1)}
          </S.NotificationItem>
        </S.Notification>

        {!headerItem && endedAt && (
          <S.Plot expanded={displayPlot}>
            <NotificationPlot
              startedAt={startedAt}
              endedAt={endedAt}
              sensor={sensor}
              topics={topics}
              limitValue={limitValue}
            />
          </S.Plot>
        )}
      </div>

      <S.Center>
        {headerItem ? null : displayPlot ? (
          <S.NotificationItem headerItem={headerItem ? true : false}>
            <S.Center>
              <Button className="Black" onClick={() => setDisplayPlot(false)}>
                <FiChevronUp size={"18px"} />
              </Button>
              <Button
                className="Blue"
                onClick={() => deleteNotification(projectId, id)}
                loading={deletingNotification === id}
              >
                Delete notification
              </Button>
            </S.Center>
          </S.NotificationItem>
        ) : (
          <S.NotificationItem headerItem={headerItem ? true : false}>
            <Button
              className="Black"
              onClick={() => setDisplayPlot(true)}
              loading={deletingNotification === id}
            >
              <S.Center>
                <FiChevronDown size={"18px"} />
              </S.Center>
            </Button>
          </S.NotificationItem>
        )}
      </S.Center>
    </S.Container>
  );
};

export default Notification;
