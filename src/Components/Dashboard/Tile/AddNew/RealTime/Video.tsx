import React, { useEffect } from "react";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";
import { TileFormat } from "src/types/datahandling";

interface Props {
  tile: TileFormat;
  setTile: (tile: TileFormat) => void;
}

const Video = (props: Props) => {
  const { tile, setTile } = props;

  useEffect(() => {
    setTile({
      ...tile,
      category: "youtube",
      type: "",
    });
  }, []);

  return (
    <Q.Columns>
      <Q.ColumnLeft noPadding={false}>
        <Q.SmallText>
          {" "}
          Write the ID of the youtube-video. This is typically the last values
          of the youtubelink, e.g. "C0DPdy98e4c" in
          "https://www.youtube.com/watch?v=C0DPdy98e4c"
        </Q.SmallText>
      </Q.ColumnLeft>
      <Q.ColumnRight noPadding={false}>
        <TextInput
          placeholder=""
          value={tile.type}
          onChange={(e: any) =>
            setTile({
              ...tile,
              type: e.target.value,
            })
          }
        />
      </Q.ColumnRight>
    </Q.Columns>
  );
};

export default Video;
