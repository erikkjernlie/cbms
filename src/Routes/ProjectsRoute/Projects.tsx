import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Button from "src/Components/UI/Button/Button";
import useInvitesStore from "src/stores/listeners/invitesStore";
import useProfileStore from "src/stores/profile/profileStore";
import useProjectStore from "src/stores/project/projectStore";
import { ProjectInfo } from "src/types/project";
import shallow from "zustand/shallow";

import { useUser } from "../../hooks/authentication/authentication";
import * as S from "./Projects.style";

import "src/utils/styles/styles.css";

const Projects = () => {
  const [deletingProject, setDeletingProject] = useState("");
  const [maximumProjectsReached, setMaximumProjectsReached] = useState(false);
  const [currentInvite, setCurrentInvite] = useState("");

  const history = useHistory();
  const { user, loading } = useUser();

  const setProject = useProjectStore((state) => state.setProject);

  const {
    projects,
    projectInfo,
    getProjectInfo,
    setProjects,
    fetching,
    project,
  } = useProjectStore(
    (state) => ({
      getProjectInfo: state.getProjectInfo,
      setProjects: state.setProjects,
      projectInfo: state.projectInfo,
      projects: state.projects,
      fetching: state.fetching,
      project: state.project,
    }),
    shallow
  );

  const {
    acceptInvite,
    removeInvite,
    invites,
    loadingInvite,
  } = useInvitesStore(
    (state) => ({
      acceptInvite: state.acceptInvite,
      removeInvite: state.removeInvite,
      invites: state.invites,
      loadingInvite: state.loadingInvite,
    }),
    shallow
  );

  const {
    removeProjectFromProfile,
    fetchingProfile,
    profile,
  } = useProfileStore((state) => ({
    removeProjectFromProfile: state.removeProjectFromProfile,
    fetchingProfile: state.fetchingProfile,
    profile: state.profile,
  }));

  useEffect(() => {
    setProject("");
  }, []);

  useEffect(() => {
    if (Object.keys(profile).length === 0) {
      setProjects([]);
    } else if (profile) {
      setProjects(profile.projects);
    }
  }, [profile]);

  useEffect(() => {
    if (projects && projects.length && projects.length > 0) {
      getProjectInfo();
    }
  }, [projects]);

  useEffect(() => {
    if (profile && profile.projects && profile.projects.length >= 10) {
      setMaximumProjectsReached(true);
    } else {
      setMaximumProjectsReached(false);
    }
  }, [profile]);

  const navigateToNewProject = () => {
    if (!maximumProjectsReached) {
      history.push("new");
    }
  };

  return (
    <div>
      <S.Background></S.Background>
      <div className="rest">
        {user && !loading && (
          <S.ProjectsContainer>
            <S.MyProjectsBox>
              <S.NewProject>
                <Button
                  className="Long"
                  onClick={() => navigateToNewProject()}
                  disabled={maximumProjectsReached}
                >
                  new project
                </Button>
                {maximumProjectsReached && (
                  <S.MaximumProjectsReached>
                    You have reached the max. number of projects, so in order to
                    create a new one, you have to delete one.
                  </S.MaximumProjectsReached>
                )}
              </S.NewProject>
              <hr
                style={{
                  margin: "auto",
                  width: "1px",
                  height: "200px",
                  color: "#cdcdcd",
                  marginRight: "80px",
                  marginLeft: "80px",
                }}
              />
              <div
                style={{
                  margin: "auto",
                  width: "100%",
                }}
              >
                <S.Title>Your Projects</S.Title>
                {fetching && (
                  <div>
                    <ClipLoader
                      size={40}
                      //size={"150px"} this also works
                      color={"white"}
                      loading={true}
                    />
                  </div>
                )}
                {project && (
                  <S.SubTitle>Last active project: {project}</S.SubTitle>
                )}
                {!(projects && projects.length !== 0) && (
                  <div>
                    <div>You do not have any projects yet.</div>
                  </div>
                )}
                {projects && projects.length !== 0 && (
                  <S.ProjectData>
                    <tbody>
                      <tr key="headers">
                        <S.ProjectDataHeader>Project</S.ProjectDataHeader>
                        <S.ProjectDataHeader>Created</S.ProjectDataHeader>
                        <S.ProjectDataHeader>Users</S.ProjectDataHeader>
                        <S.ProjectDataHeader>Remove</S.ProjectDataHeader>
                      </tr>
                      {projectInfo &&
                        projectInfo.map((pjct: ProjectInfo, index: number) => {
                          return (
                            <S.TableRow key={index}>
                              <S.ProjectDataItem
                                style={{ textTransform: "capitalize" }}
                                onClick={() => {
                                  localStorage.setItem("project", pjct.name);
                                  history.push(pjct.name);
                                }}
                              >
                                {pjct.name}
                              </S.ProjectDataItem>
                              <S.ProjectDataItem>
                                {moment(new Date(pjct.createdAt)).fromNow()}
                              </S.ProjectDataItem>
                              <S.ProjectDataItem>
                                {pjct.users.map(
                                  (usr: string, index: number) => {
                                    return <div key={index}>{usr}</div>;
                                  }
                                )}
                              </S.ProjectDataItem>
                              <S.ProjectDataItem
                                onClick={() => {
                                  if (user && user.email) {
                                    setDeletingProject(pjct.name);
                                    removeProjectFromProfile(
                                      user.email,
                                      pjct.name
                                    );
                                  }
                                }}
                              >
                                {fetchingProfile &&
                                deletingProject === pjct.name ? (
                                  <S.Left>
                                    <ClipLoader
                                      size={15}
                                      color={"grey"}
                                      loading={true}
                                    />
                                  </S.Left>
                                ) : (
                                  <Button className="Black">Delete</Button>
                                )}
                              </S.ProjectDataItem>
                            </S.TableRow>
                          );
                        })}
                    </tbody>
                  </S.ProjectData>
                )}
                {invites && invites.length !== 0 && (
                  <S.ProjectData>
                    <tbody>
                      <tr key="headers">
                        <S.ProjectDataHeader>
                          Invite to project:
                        </S.ProjectDataHeader>
                        <S.ProjectDataHeader>Accept invite</S.ProjectDataHeader>
                        <S.ProjectDataHeader>
                          Decline invite
                        </S.ProjectDataHeader>
                      </tr>

                      {invites &&
                        invites.map((invite: string, index: number) => (
                          <S.TableRow key={index}>
                            <S.ProjectDataItem>{invite}</S.ProjectDataItem>

                            <S.ProjectDataItem>
                              <Button
                                className="Accept"
                                onClick={() => {
                                  acceptInvite(invite, user, history);
                                  setCurrentInvite("accept" + invite);
                                }}
                                loading={currentInvite === "accept" + invite}
                              >
                                Accept
                              </Button>
                            </S.ProjectDataItem>
                            <S.ProjectDataItem>
                              <Button
                                className="Decline"
                                onClick={() => {
                                  removeInvite(invite, user, history);
                                  setCurrentInvite("decline" + invite);
                                }}
                                loading={currentInvite === "decline" + invite}
                              >
                                Decline
                              </Button>
                            </S.ProjectDataItem>
                          </S.TableRow>
                        ))}
                    </tbody>
                  </S.ProjectData>
                )}
              </div>

              {/* Can have project components here and based on where listening on data <Project ... /> */}
            </S.MyProjectsBox>
          </S.ProjectsContainer>
        )}
      </div>
    </div>
  );
};

export default Projects;
