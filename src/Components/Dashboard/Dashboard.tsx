import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import NTNULogo from "src/assets/NTNULogo";
import { fetchTopics } from "src/backendAPI/topics";
import Button from "src/Components/UI/Button/Button";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { TileFormat } from "src/types/datahandling";
import {
  Datasource,
  EditedSelectedSource,
  RawTopic,
  SelectedSource,
  Source,
  Topic,
  TopicsJson,
} from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";
import { deepCopy } from "src/utils/util";

import * as S from "./Dashboard.style";
import AddNew from "./Tile/AddNew/AddNew";
import InspectData from "./Tile/AddNew/Analytics/InspectData";
import Tiles from "./Tiles";

interface Props {
  dashboardId: string;
  projectId: string;
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Dashboard = React.memo((props: Props) => {
  // props
  const { dashboardId, projectId } = props;
  // hooks
  const [error, setError] = useState("");
  const [topics, setTopics] = useState([] as Topic[]);
  const [selectedSources, setSelectedSources] = useState([] as Source[]);
  const [initialLayout, setInitialLayout] = useState([] as any[]);
  const [currentModal, setCurrentModal] = useState("");
  const [creatingReport, setCreatingReport] = useState(false);
  const [breakpoint, setBreakpoint] = useState(null);
  const [cols, setCols] = useState(null);
  const [newCounter, setNewCounter] = useState(0);
  const [deletingDashboard, setDeletingDashboard] = useState(false);

  const history = useHistory();

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    const topicsJSON = (await fetchTopics()) as TopicsJson;
    if (!topicsJSON) {
      setError("Could not load data sources");
    }
    if (!topicsJSON) return;
    let topics = Object.entries(topicsJSON).map((tempTopic: any) => {
      let id = tempTopic[0];
      let topic = tempTopic[1] as RawTopic;
      return {
        id: id,
        url: topic.url,
        byteFormat: topic.byte_format,
        channels: makeChannels(topic) || [],
      };
    });

    setTopics(topics);
  };

  useEffect(() => {
    loadSources();
  }, []);

  const { permanentlyDeleteDashboard, fetching, tiles } = useProjectStore(
    (state) => ({
      permanentlyDeleteDashboard: state.permanentlyDeleteDashboard,
      fetching: state.fetching,
      tiles: state.tiles,
    })
  );

  const _deleteDashboard = () => {
    toast.error(
      () => (
        <div>
          <div>Are you sure you want to delete the dashboard?</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              className="BlackWhite"
              onClick={() => {
                setDeletingDashboard(true);
                permanentlyDeleteDashboard(projectId, dashboardId, history)
                  .then(() => {})
                  .catch((error: string) => {
                    toast.error("Could not delete dashboard", {
                      position: toast.POSITION.BOTTOM_CENTER,
                    });
                  })
                  .finally(() => {
                    setDeletingDashboard(false);
                  });
              }}
            >
              {!deletingDashboard ? "Yes" : "Deleting"}
            </Button>
            <Button onClick={() => {}} className="BlackWhite">
              No
            </Button>
          </div>
        </div>
      ),
      {
        position: toast.POSITION.BOTTOM_CENTER,
      }
    );
  };

  const createReport = () => {
    if (tiles.length === 0) {
      toast.error("You do not have any curve plots to make a report of.");
      return;
    }
    setCreatingReport(true);
    const pdf = new jsPDF();
    pdf.addImage(NTNULogo, "PNG", 60, 30, 90, 50);

    centeredText(pdf, "Digital Twin Cloud Platform", 100, 16, "bold");
    centeredText(pdf, "Project: " + projectId, 110, 12);
    centeredText(pdf, "Dashboard: " + dashboardId, 115, 10);
    let lastHeight = 0;
    let index = 0;
    pdf.addPage();
    if (tiles) {
      for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i] as TileFormat;
        if (
          tile.category === "real-time" ||
          tile.category === "history" ||
          tile.category === "spectrogram" ||
          tile.category === "fft" ||
          tile.category === "statistics"
        ) {
          if (
            document !== null &&
            document.querySelector("#sensor" + tile.id) !== null
          ) {
            if (index % 2 == 0) {
              const input = document.querySelector(
                "#sensor" + tile.id
              ) as HTMLElement;
              html2canvas(input).then((canvas) => {
                pdf.setFontSize(16);

                const imgData = canvas.toDataURL("image/png");
                pdf.text(30, 25, "Tile: " + tile.name);
                pdf.setFontSize(11);

                pdf.text(30, 30, "Tile type: " + tile.category);
                const imgWidth = 150;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                lastHeight = imgHeight;
                pdf.addImage(imgData, "PNG", 29, 35, imgWidth, imgHeight);
                if (i === tiles.length - 1) {
                  pdf.save(projectId + "_" + dashboardId + "_report" + ".pdf");
                  setCreatingReport(false);
                }
              });
            } else {
              const input = document.querySelector(
                "#sensor" + tile.id
              ) as HTMLElement;
              html2canvas(input).then((canvas) => {
                pdf.setFontSize(16);

                const imgData = canvas.toDataURL("image/png");
                pdf.text(30, lastHeight + 50, "Tile: " + tile.name);
                pdf.setFontSize(11);

                pdf.text(30, lastHeight + 55, "Tile type: " + tile.category);
                const imgWidth = 150;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(
                  imgData,
                  "PNG",
                  29,
                  60 + lastHeight,
                  imgWidth,
                  imgHeight
                );
                if (i === tiles.length - 1) {
                  setCreatingReport(false);
                  pdf.save("asdsad.pdf");
                } else {
                  pdf.addPage();
                }
              });
            }
            index = index + 1;
          }
        }
      }
    }
  };

  const centeredText = (
    doc: jsPDF,
    text: string,
    y: number,
    fontSize: number,
    type?: string
  ) => {
    if (type && type.length !== 0) {
      doc.setFontType(type);
    }
    doc.setFontSize(fontSize);
    let textWidth =
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(textOffset, y, text);
  };

  return (
    <div>
      <S.DashboardNavbar>
        <AddNew
          tiles={tiles}
          topics={topics}
          dashboardId={dashboardId}
          projectId={projectId}
        />
        <Button
          className="Black"
          onClick={() => createReport()}
          loading={creatingReport}
        >
          Generate report
        </Button>
        <InspectData projectId={projectId} />
        <Button className="Grey" onClick={() => _deleteDashboard()}>
          Delete dashboard
        </Button>
      </S.DashboardNavbar>
      {error && <div>{error}</div>}
      <Tiles projectId={projectId} dashboardId={dashboardId} topics={topics} />
    </div>
  );
});

export default Dashboard;
