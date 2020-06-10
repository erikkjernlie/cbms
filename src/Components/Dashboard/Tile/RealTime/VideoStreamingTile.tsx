import React, { useMemo } from "react";
import { FaGripVertical } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import SettingsModal from "src/Components/Settings/SettingsModal";
import { TileFormat } from "src/types/datahandling";

import * as S from "../Tile.style";

interface Props {
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
}

const VideoStreamingTile = (props: Props) => {
  const { tile, dashboardId, projectId } = props;

  const onReady = (e: any) => {
    e.target.pauseVideo();
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
          <SettingsModal
            projectId={projectId}
            dashboardId={dashboardId}
            tile={tile}
          >
            <S.Content>
              <S.PlotSettingsSubTitle>
                Do you want to copy the youtube link to your clipboard?
              </S.PlotSettingsSubTitle>
              <S.Copy
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://www.youtube.com/watch?v=" + tile.type
                  );
                  toast.info(
                    "Copied your youtube link to the clipboard. Paste the link in your browser to watch it.",
                    {
                      position: toast.POSITION.BOTTOM_CENTER,
                    }
                  );
                }}
              >
                <MdContentCopy size={"1.6em"} /> Click here to copy the link
              </S.Copy>
            </S.Content>
          </SettingsModal>
        </S.HeaderRight>
      </S.Header>
      <S.Video>
        <iframe
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            width: "100%",
            height: "450px",
          }}
          src={`https://www.youtube.com/embed/` + tile.type}
          frameBorder="0"
        />
      </S.Video>
    </S.PlotComponent>
  );
};

const MemoizedVideoStreamingTile = (props: Props) => {
  return useMemo(() => {
    return (
      <VideoStreamingTile
        tile={props.tile}
        dashboardId={props.dashboardId}
        projectId={props.projectId}
      />
    );
  }, [props.tile, props.dashboardId, props.projectId]);
};

export default MemoizedVideoStreamingTile;
