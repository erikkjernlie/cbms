import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

import { fetchAuthCookie } from "./backendAPI/auth";
import Invite from "./Components/Invite/Invite";
import Navbar from "./Components/Navigation/Navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import { useUser } from "./hooks/authentication/authentication";
import useIsOnline from "./hooks/errors/useIsOnline";
import AdminPage from "./Routes/AdminRoute/Admin";
import LandingPage from "./Routes/LandingPageRoute/LandingPage";
import NewProject from "./Routes/NewProjectRoute/NewProject";
import Project from "./Routes/ProjectRoute/Project";
import Projects from "./Routes/ProjectsRoute/Projects";
import SignInSignUp from "./Routes/SignInSignUpRoute/SignInSignUp";
import useProfileStore from "./stores/profile/profileStore";

import "./index.css";
import "src/utils/styles/styles.css";

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID as string);

const App = () => {
  const [fetchedAuthCookie, setFetchedAuthCookie] = useState(false);
  const [possibleServerTimeout, setPossibleServerTimeout] = useState(false);

  const isOnline = useIsOnline();
  const { user, loading } = useUser();
  const { profile, getProfile, fetchingProfile } = useProfileStore((state) => ({
    profile: state.profile,
    getProfile: state.getProfile,
    fetchingProfile: state.fetchingProfile,
  }));

  useEffect(() => {
    // fetch project here
    // fetch permissions here if necessary
    fetchAuthCookie().then(() => {
      setFetchedAuthCookie(true);
    });
    setTimeout(() => {
      setPossibleServerTimeout(true);
    }, 5000);
  }, []);

  useEffect(() => {
    getProfile(user ? user.email : null);
  }, [user]);

  useEffect(() => {
    if (!fetchedAuthCookie && possibleServerTimeout) {
      toast.info("Ooops, looks like the server is down", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }, [fetchedAuthCookie, possibleServerTimeout]);

  // a Switch is here used to only render the first matching route
  // TODO: use render= or component= inside router?
  return (
    <UserProvider value={{ user, profile }}>
      {!fetchedAuthCookie && (
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
            <ClipLoader
              size={70}
              //size={"150px"} this also works
              color={"darkgrey"}
              loading={true}
            />
          </div>
        </div>
      )}
      {fetchedAuthCookie && (
        <div className="App">
          <Router>
            <Invite user={user} />
            <Navbar />
            {!isOnline && <div>Problems with the internet</div>}
            <Switch>
              <Route
                exact
                path="/"
                render={() => <LandingPage />}
                // Info: props containts history-, location- and match-objects
              />
              <Route
                exact
                path="/admin"
                render={() => <AdminPage />}
                // Info: props containts history-, location- and match-objects
              />
              <Route
                exact
                path="/signin"
                render={() => <SignInSignUp />}
                // Info: props containts history-, location- and match-objects
              />
              <Route exact path="/new" render={(props) => <NewProject />} />
              <Route
                exact
                path={`/projects`}
                render={(props) => {
                  return <Projects />;
                }}
              />
              <Route
                path={`/:projectId`}
                render={(props) => {
                  return <Project {...props} />;
                }}
              />
            </Switch>
          </Router>
        </div>
      )}
      <ToastContainer />
    </UserProvider>
  );
};

export default App;
