import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import useProjectStore from "src/stores/project/projectStore";
import { ProjectData } from "src/types/project";

import * as S from "../Navbar/Navbar.style";

import "react-toastify/dist/ReactToastify.css";

interface Props {
  projectId: string;
  projectData: ProjectData;
  route: string;
  fetching: boolean;
}

const SubSubNavbar = React.memo((props: Props) => {
  // route is dashboard, notifications or models
  const { projectId, route } = props;

  const [subRoute, setSubRoute] = useState("");

  const history = useHistory();

  const {
    fetching,
    dashboards,
    models,
    fetchTiles,
    fetchModelInformation,
  } = useProjectStore((state) => ({
    fetching: state.fetching,
    dashboards: state.dashboards,
    models: state.models,
    fetchTiles: state.fetchTiles,
    fetchModelInformation: state.fetchModelInformation,
  }));

  useEffect(() => {
    // if we have e.g. dashboards as previous route
    if (route.length > 0) {
      let subTab = localStorage.getItem(projectId + "/" + route) || ""; // e.g. dashboardId1
      if (subTab.length > 0) {
        // assuming this item now exists, NB: dashboard could be deleted
        changeRoute(subTab);
      } else {
        if (route === "dashboards") {
          // if we have any dashboards => redirect to the first one
          if (dashboards.length > 0) {
            changeRoute(dashboards[0]);
          } else {
            // we do not have any dashboards => redirect so user can create one
            changeRoute("new");
          }
        } else if (route === "models") {
          // if we have any models => redirect to the first one
          if (models.length > 0) {
            changeRoute(models[0]);
          } else {
            // we do not have any models => redirect so user can create one
            changeRoute("new");
          }
        } else {
          history.push("/" + projectId + "/" + route); // testrig/models
        }
      }
    } else {
      // we are not at dashboard, models or notifications
      localStorage.setItem(projectId + "/subNavbar", "dashboards");
      if (dashboards.length > 0) {
        changeRoute(dashboards[0]);
      } else {
        // we do not have any dashboards => redirect so user can create one
        changeRoute("new");
      }
    }
  }, [route, fetching]);

  // selectedSubRoute = "testrig/dashboards/dashboard1123"

  const changeRoute = (newSubRoute: string) => {
    if (newSubRoute !== subRoute && route === "dashboards") {
      fetchTiles(projectId, newSubRoute);
    }
    if (newSubRoute !== subRoute && route === "models") {
      fetchModelInformation(projectId, newSubRoute);
    }
    if (localStorage.getItem(projectId + "/subNavBar") !== "") {
      setSubRoute(newSubRoute);
      localStorage.setItem(projectId + "/" + route, newSubRoute);
      history.push("/" + projectId + "/" + route + "/" + newSubRoute);
    }
  };

  // NB: THIS COMPONENT DOES NOT WORK WITH DIFFERENT MODELS AND NOTIFICATION TABS AS WELL

  return (
    <S.SubSubNavbar>
      {route === "dashboards" && (
        <S.Bar>
          <S.SubRoutes>
            {dashboards &&
              dashboards.map((dashboard: string) => {
                return (
                  <S.SubRoute
                    key={dashboard}
                    selectedRoute={subRoute === dashboard}
                    onClick={() => changeRoute(dashboard)}
                  >
                    {dashboard}
                  </S.SubRoute>
                );
              })}
            <S.AddSubRoute
              key={"new"}
              selectedRoute={subRoute === "new"}
              onClick={() => changeRoute("new")}
            >
              <AiOutlinePlusCircle size={"14px"} /> Add dashboard
            </S.AddSubRoute>
          </S.SubRoutes>
        </S.Bar>
      )}

      {route === "models" && (
        <S.Bar>
          <S.SubRoutes>
            {models &&
              models.map((model: string) => {
                return (
                  <S.SubRoute
                    key={model}
                    selectedRoute={subRoute === model}
                    onClick={() => changeRoute(model)}
                  >
                    {model}
                  </S.SubRoute>
                );
              })}
            <S.AddSubRoute
              key={"new"}
              selectedRoute={subRoute === "new"}
              onClick={() => changeRoute("new")}
            >
              <AiOutlinePlusCircle size={"14px"} /> Add model
            </S.AddSubRoute>
          </S.SubRoutes>
        </S.Bar>
      )}
    </S.SubSubNavbar>
  );
});

export default SubSubNavbar;
