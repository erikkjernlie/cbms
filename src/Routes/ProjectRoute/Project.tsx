import React, { useContext, useEffect } from "react";
import { Route, RouteComponentProps, Switch, useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import CreateNewDashboard from "src/Components/Dashboard/CreateNewDashboard";
import Dashboard from "src/Components/Dashboard/Dashboard";
import SubNavbar from "src/Components/Navigation/SubNavbar/SubNavbar";
import UserContext from "src/context/UserContext";
import useNotificationsStore from "src/stores/listeners/notificationsStore";
import useProjectStore from "src/stores/project/projectStore";

import Datasources from "../../Components/Datasources/Datasources";
import CreateNewModel from "../../Components/Model/CreateNewModel";
import Model from "../../Components/Model/Model";
import Notifications from "../../Components/Notifications/Notifications";

import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";

export default function Project({
  match,
}: RouteComponentProps<{ projectId: string }>) {
  const { projectId } = match.params;

  const { profile } = useContext(UserContext);
  const history = useHistory();

  const {
    projectData,
    fetchProjectData,
    fetching,
    dashboards,
  } = useProjectStore((state) => ({
    fetchProjectData: state.fetchProjectData,
    projectData: state.projectData,
    fetching: state.fetching,
    dashboards: state.dashboards,
  }));

  const { listenToConfiguration } = useNotificationsStore((state) => ({
    listenToConfiguration: state.listenToConfiguration,
  }));

  const { listenToNotifications } = useNotificationsStore((state) => ({
    listenToNotifications: state.listenToNotifications,
  }));

  useEffect(() => {
    localStorage.setItem("project", projectId);
    fetchProjectData(projectId, history);
    listenToConfiguration(projectId);
    listenToNotifications(projectId);
  }, []);

  if (!profile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        <ClipLoader size={35} color={"black"} loading={true} />
      </div>
    );
  }
  if (profile && profile.projects && profile.projects.indexOf(projectId) < 0) {
    return <div>You do not have access to this project</div>;
  }

  return (
    <div>
      {
        <SubNavbar
          projectId={projectId}
          projectData={projectData}
          fetching={fetching}
        />
      }
      {fetching && (
        <div
          id="loadingModel"
          style={{
            position: "absolute",
            top: "250px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div>
            <ClipLoader size={70} color={"darkgrey"} loading={true} />
          </div>
        </div>
      )}
      {!fetching && (
        <Switch>
          <Route
            exact
            path={"/" + projectId + "/notifications"}
            render={(props) => <Notifications projectId={projectId} />}
          />
          <Route
            exact
            path={"/" + projectId + "/datasources"}
            render={(props) => <Datasources projectId={projectId} />}
          />
          <Route
            exact
            path={"/" + projectId + "/dashboards/new"}
            render={(props) => {
              return <CreateNewDashboard projectId={projectId} />;
            }}
          />
          <Route
            path={"/" + projectId + "/dashboards/:dashboardId"}
            render={(props) => {
              // if no dashboardId or dashboard -> redirect to dashboards/new
              return (
                <Dashboard
                  projectId={projectId}
                  dashboardId={props.match.params.dashboardId}
                />
              );
            }}
          />
          <Route
            exact
            path={"/" + projectId + "/models/new"}
            render={(props) => {
              return <CreateNewModel projectId={projectId} />;
            }}
          />
          <Route
            path={"/" + projectId + "/models/:modelId"}
            render={(props) => {
              return (
                <Model
                  projectId={projectId}
                  modelId={props.match.params.modelId}
                />
              );
            }}
          />
        </Switch>
      )}
    </div>
  );
}
