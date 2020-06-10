import React, { useState } from "react";
import ProjectSettings from "src/Routes/ProjectRoute/ProjectSettings";
import useDataStore from "src/stores/project/dataStore";
import { ProjectData } from "src/types/project";

import * as S from "../Navbar/Navbar.style";
import SubSubNavbar from "../SubSubNavbar/SubSubNavbar";

interface Props {
  projectId: string;
  projectData: ProjectData;
  fetching: boolean;
}

const SubNavbar = React.memo((props: Props) => {
  const { projectId, projectData, fetching } = props;

  const [route, setRoute] = useState(
    localStorage.getItem(projectId + "/subNavbar")
      ? localStorage.getItem(projectId + "/subNavbar") || ""
      : "dashboards"
  );

  const { closeWebSocketConnection } = useDataStore((state) => ({
    closeWebSocketConnection: state.closeWebSocketConnection,
  }));

  const changeRoute = (newRoute: string) => {
    localStorage.setItem(projectId + "/subNavbar", newRoute);
    setRoute(newRoute);
  };

  return (
    <div>
      <S.SubNavbar>
        <S.Flex>
          <S.Route
            onClick={() => changeRoute("dashboards")}
            selectedRoute={route === "dashboards"}
          >
            Dashboards
          </S.Route>
          <S.Route
            onClick={() => changeRoute("notifications")}
            selectedRoute={route === "notifications"}
          >
            Notifications
          </S.Route>
          <S.Route
            onClick={() => changeRoute("models")}
            selectedRoute={route === "models"}
          >
            Models
          </S.Route>
          <S.Route
            onClick={() => changeRoute("datasources")}
            selectedRoute={route === "datasources"}
          >
            Datasources
          </S.Route>
        </S.Flex>
        <S.SubNavbarItemRight>
          <S.ProjectSettings>
            <ProjectSettings projectId={projectId} />
          </S.ProjectSettings>
        </S.SubNavbarItemRight>
      </S.SubNavbar>
      <SubSubNavbar
        route={route}
        fetching={fetching}
        projectData={projectData}
        projectId={projectId}
      />
    </div>
  );
});

export default SubNavbar;
