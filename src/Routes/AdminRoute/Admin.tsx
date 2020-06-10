import moment from "moment";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { AiFillProject } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import WorkingPersonImage from "src/assets/working_person.svg";
import { getAllProjects } from "src/backendAPI/project";
import Morph from "src/Components/Animations/Morph";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";
import { useUser } from "src/hooks/authentication/authentication";
import useProfileStore from "src/stores/profile/profileStore";
import useProjectStore from "src/stores/project/projectStore";

import * as S from "./Admin.style";

export default function AdminPage() {
  const { user, loading } = useUser();

  const {
    removeProjectFromProfile,
    fetchingProfile,
    profile,
  } = useProfileStore((state) => ({
    removeProjectFromProfile: state.removeProjectFromProfile,
    fetchingProfile: state.fetchingProfile,
    profile: state.profile,
  }));

  const [deletingProject, setDeletingProject] = useState("");

  const [selectedTab, setSelectedTab] = useState("dashboard");

  const [query, setQuery] = useState("");

  const [projects, setProjects] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    async function getProjects() {
      const p = await getAllProjects("none");
      setProjects(p);
    }
    // Execute the created function directly
    getProjects();
  }, []);

  const Next = async () => {
    const more = await getAllProjects(projects[projects.length - 1].name);
    setProjects(projects.concat(more));
    setCurrent(current + 1);
  };

  const NextUsers = async () => {
    // const more = await getAllUsers(users[users.length - 1].name);
    // setProjects(projects.concat(more));
    // setCurrent(current + 1);
  };

  const Back = () => {
    if (current > 0) {
      setCurrent(current - 0);
    }
  };

  const [current, setCurrent] = useState(0);

  const compare = (a: any, b: any) => {
    if (a.attr < b.attr) return -1;
    if (a.attr > b.attr) return 1;
    return 0;
  };

  if (!user || !profile) {
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

  if (!profile || (profile && !profile.admin)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        You are not an admin
      </div>
    );
  }

  return (
    <S.Container>
      <S.LeftSideBar>
        <S.LeftSideBarTab>
          <S.LeftSideBarElement
            onClick={() => setSelectedTab("dashboard")}
            selectedTab={selectedTab === "dashboard"}
          >
            <MdDashboard size={"18px"} />
            Dashboard
          </S.LeftSideBarElement>
        </S.LeftSideBarTab>
        <S.LeftSideBarTab>
          <S.LeftSideBarElement
            onClick={() => setSelectedTab("users")}
            selectedTab={selectedTab === "users"}
          >
            <FaUsers size={"18px"} />
            Users
          </S.LeftSideBarElement>
          <S.LeftSideBarElement
            onClick={() => setSelectedTab("projects")}
            selectedTab={selectedTab === "projects"}
          >
            <AiFillProject size={"18px"} />
            Projects
          </S.LeftSideBarElement>
        </S.LeftSideBarTab>
      </S.LeftSideBar>
      <S.Content>
        {selectedTab === "dashboard" && (
          <S.Wrapper>
            <S.Welcome>
              <S.WelcomeContent>
                <div>
                  <S.Title>
                    Welcome to the admin board for the Cloud-Based Monitoring
                    System
                  </S.Title>
                  <S.Description>
                    Choose between viewing the main dashboard, manage users or
                    projects in the sidebar.
                  </S.Description>
                </div>

                <S.Image></S.Image>
              </S.WelcomeContent>
            </S.Welcome>
            <div>
              {" "}
              <S.Margin>
                <S.Title className="Black">Projects</S.Title>
                <TextInput
                  onChange={(e: any) => setQuery(e.target.value)}
                  value={query}
                  placeholder="Search projects"
                />
              </S.Margin>
              <div>
                {projects &&
                  projects.length > 0 &&
                  projects
                    .filter((project) => {
                      if (query === "") {
                        return true;
                      } else {
                        if (
                          project.name
                            .toLowerCase()
                            .includes(query.toLowerCase())
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    })
                    .map((project: any) => {
                      return (
                        <S.Project>
                          <S.ProjectDataItem>{project.name}</S.ProjectDataItem>
                          <S.ProjectDataItem>
                            {moment(new Date(project.createdAt)).fromNow()}
                          </S.ProjectDataItem>
                          <S.ProjectDataItem>
                            {project.users.map((usr: string, index: number) => {
                              return <div key={index}>{usr}</div>;
                            })}
                          </S.ProjectDataItem>
                          <S.ProjectDataItem
                            onClick={() => {
                              if (user && user.email) {
                                setDeletingProject(project.name);
                                removeProjectFromProfile(
                                  user.email,
                                  project.name
                                );
                              }
                            }}
                          >
                            {fetchingProfile &&
                            deletingProject === project.name ? (
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
                        </S.Project>
                      );
                    })}
              </div>
              <Button onClick={() => Next()}>Load more</Button>
            </div>
          </S.Wrapper>
        )}
        {selectedTab === "users" && (
          <div>
            <S.Title className="Black">Users</S.Title>
          </div>
        )}
        {selectedTab === "projects" && (
          <div>
            {" "}
            <S.Title className="Black">Projects</S.Title>
            <TextInput
              onChange={(e: any) => setQuery(e.target.value)}
              value={query}
              placeholder="Search projects"
            />
            <div>
              {projects &&
                projects.length > 0 &&
                projects
                  .filter((project) => {
                    if (query === "") {
                      return true;
                    } else {
                      if (
                        project.name.toLowerCase().includes(query.toLowerCase())
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  })
                  .map((project: any) => {
                    return (
                      <S.Project>
                        <S.ProjectDataItem>{project.name}</S.ProjectDataItem>
                        <S.ProjectDataItem>
                          {moment(new Date(project.createdAt)).fromNow()}
                        </S.ProjectDataItem>
                        <S.ProjectDataItem>
                          {project.users.map((usr: string, index: number) => {
                            return <div key={index}>{usr}</div>;
                          })}
                        </S.ProjectDataItem>
                        <S.ProjectDataItem
                          onClick={() => {
                            if (user && user.email) {
                              setDeletingProject(project.name);
                              removeProjectFromProfile(
                                user.email,
                                project.name
                              );
                            }
                          }}
                        >
                          {fetchingProfile &&
                          deletingProject === project.name ? (
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
                      </S.Project>
                    );
                  })}
            </div>
            <Button onClick={() => Next()}>Load more</Button>
          </div>
        )}
      </S.Content>
    </S.Container>
  );
}
