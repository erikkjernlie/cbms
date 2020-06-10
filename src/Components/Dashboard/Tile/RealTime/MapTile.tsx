import L from "leaflet";
import React, { useEffect, useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import Modal from "react-modal";
import { toast } from "react-toastify";
import SettingsModal from "src/Components/Settings/SettingsModal";
import Button from "src/Components/UI/Button/Button";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import { Source, Topic } from "src/types/datasource";

import * as S from "../Tile.style";

import "leaflet/dist/leaflet.css";
import "src/utils/styles/styles.css";

Modal.setAppElement("body");

interface Props {
  tile: TileFormat;
  dashboardId: string;
  projectId: string;
  topics: Topic[];
}

var myIcon = L.icon({
  iconUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, 41],
});

const MapTile = React.memo((props: Props) => {
  const { tile, dashboardId, projectId, topics } = props;

  const [error, setError] = useState("");
  const [updatePos, setUpdatePos] = useState(false);
  const [userLocation, setUserLocation] = useState([] as number[]);
  const [locationSource, setLocationSource] = useState([] as Source[]);
  const [startSubscribe, setStartSubscribe] = useState(false);
  const [dataBuffer, setDataBuffer] = useState([] as any[]);
  const [doUpdates, setDoUpdates] = useState(true);

  const { deleteTile } = useProjectStore((state) => ({
    deleteTile: state.deleteTile,
  }));

  const { setDatasources, subscribeDatasources, newData } = useDataStore(
    (state) => ({
      setDatasources: state.setDatasources,
      subscribeDatasources: state.subscribeDatasources,
      newData: state.newData,
    })
  );

  useEffect(() => {
    let coords =
      tile.fill === undefined ? [0, 0] : (tile.fill.split(",") as any[]);

    if (tile.type === "static") {
      setUserLocation([parseFloat(coords[0]), parseFloat(coords[1])]);
    } else {
      setInterval(() => setUpdatePos(true), 5000);
      if (tile.channels !== undefined && tile.channels.length > 0) {
        setLocationSource(tile.channels);
      } else {
        setUserLocation([parseFloat(coords[0]), parseFloat(coords[1])]);
      }
    }
  }, []);

  useEffect(() => {
    if (
      topics &&
      newData &&
      !startSubscribe &&
      locationSource &&
      locationSource.length > 0
    ) {
      setStartSubscribe(true);
    } else if (newData) {
      if (doUpdates) {
        updateLocation();
      }
    }
  }, [topics, newData, startSubscribe, locationSource]);

  useEffect(() => {
    if (updatePos) {
      if (
        tile.channels !== undefined &&
        tile.channels.length > 0 &&
        dataBuffer.length > 0
      ) {
        setUserLocation([dataBuffer[1], dataBuffer[0]]);
        setDataBuffer([]);
        setUpdatePos(false);
      } else if (tile.channels && tile.channels.length === 0) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setUpdatePos(false);
        });
      } else {
        setError("Could not update position");
      }
    }
  }, [dataBuffer, updatePos]);

  useEffect(() => {
    document.addEventListener("visibilitychange", function () {
      setDoUpdates(!document.hidden);
    });
  }, []);

  const updateLocation = () => {
    let newYValues = [] as any[];
    for (let i = 0; i < locationSource.length; i++) {
      const sourceChannelID = locationSource[i].topicId;
      const newChannelData = newData[sourceChannelID];
      if (newChannelData) {
        newYValues[i] =
          newChannelData.value_buffer[locationSource[i].channel.id].reduce(
            (a: number, b: number) => a + b,
            0
          ) / newChannelData.value_buffer[locationSource[i].channel.id].length;
      }
    }

    if (newYValues.length > 0) {
      setDataBuffer([newYValues[0], newYValues[1]]);
      // setUserLocation([newYValues[0], newYValues[1]]);
    }
  };

  return (
    <S.ModelPlotComponent>
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
            <S.PlotSettingsSubTitle>My position</S.PlotSettingsSubTitle>
            Latitude: {userLocation[0]} <br />
            Longitude: {userLocation[1]}
          </SettingsModal>
        </S.HeaderRight>
      </S.Header>
      <S.Model>
        {userLocation.length > 0 && (
          <div>
            <Map
              className="Map"
              center={[userLocation[0], userLocation[1]]}
              zoom={12}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[userLocation[0], userLocation[1]]}
                icon={myIcon}
              >
                <Popup>
                  Coordinates: {userLocation[0]},{userLocation[1]}
                </Popup>
              </Marker>
            </Map>
          </div>
        )}
        {error &&
          toast.error(
            () => (
              <div>
                <div>{error}</div>
                <Button onClick={() => setError("")}>OK</Button>
              </div>
            ),
            {
              position: toast.POSITION.BOTTOM_CENTER,
            }
          )}
      </S.Model>
    </S.ModelPlotComponent>
  );
});
export default MapTile;
