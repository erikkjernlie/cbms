import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import logo from "src/assets/logo_icon.png";
import Button from "src/Components/UI/Button/Button";
import { useSignOut, useUser } from "src/hooks/authentication/authentication";
import useProfileStore from "src/stores/profile/profileStore";
import useDataStore from "src/stores/project/dataStore";
import useProjectStore from "src/stores/project/projectStore";
import { Profile, User } from "src/types/project";

import * as S from "./Navbar.style";

import "src/utils/styles/styles.css";

Modal.setAppElement("body");

const Navbar = React.memo(() => {
  const { user, loading } = useUser();
  const { profile } = useProfileStore((state) => ({
    profile: state.profile,
  }));


  const [modalIsOpen, setModalIsOpen] = useState(false);

  const history = useHistory();

  const { signOut, signingOut, error } = useSignOut();

  /*
  const { closeWebSocketConnection } = useDataStore((state) => ({
    closeWebSocketConnection: state.closeWebSocketConnection,
  }));
  */

  const { project } = useProjectStore((state) => ({
    project: state.project,
  }));

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSignOut = () => {
    closeModal();
    signOut();
  };


  return (
    <S.Navbar>
      {/* Set project name and back button */}
      <S.Header
        onClick={() => {
          // closeWebSocketConnection();
          if (user && profile) {
            history.push("/projects");
          } else {
            history.push("/");
          }
        }}
      >
        {project && (
          <S.BackButtonWrapper>
            <IoIosArrowBack size={"15px"} />
            <Button className="SubNavBar">{project}</Button>
          </S.BackButtonWrapper>
        )}
      </S.Header>
      <S.HeaderTitleContainer
        onClick={() => {
          if (user && profile) {
            history.push("/projects");
          } else {
            history.push("/");
          }
        }}
      >
        <S.Icon>
          <img src={logo} className="Logo" alt="logo" />
        </S.Icon>

        <S.HeaderTitle>Cloud-Based Monitoring System</S.HeaderTitle>
      </S.HeaderTitleContainer>
      <S.NavbarItemRight>
        {loading && (
          <S.Loading>
            <ClipLoader
              size={15}
              //size={"150px"} this also works
              color={"white"}
              loading={true}
            />
          </S.Loading>
        )}
        {user && !loading && profile && (
          <div>
            <S.FlexTop
              onClick={() => {
                if (user) {
                  setModalIsOpen(true);
                }
              }}
            >
              <S.User>
                {profile.firstName} {profile.lastName}
              </S.User>
              <S.UserIcon>
                <FaUserCircle size={"1.5em"} />
              </S.UserIcon>
            </S.FlexTop>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className="UserModal"
              contentLabel="User settings"
            >
              {profile && profile.firstName && (
                <S.UserHeader>
                  <S.SimpleFlex>
                    <S.NumberCircle>S</S.NumberCircle> Settings
                  </S.SimpleFlex>
                  <S.Close onClick={closeModal}>Close</S.Close>
                </S.UserHeader>
              )}
              <S.UserBody>
                <S.Title>User settings</S.Title>
                <S.Info>
                  <S.Label>Name: </S.Label>
                  <S.Content>
                    {profile.firstName} {profile.lastName}
                  </S.Content>
                </S.Info>
                <S.Info>
                  <S.Label>Email: </S.Label>
                  <S.Content>{user.email}</S.Content>
                </S.Info>

                <S.Info>
                  <S.Label>Projects: </S.Label>
                  <S.Content>
                    {profile &&
                      profile.projects &&
                      profile.projects.map((project: string, index: number) => {
                        if (index < profile.projects.length - 1) {
                          return project + ", ";
                        } else {
                          return project;
                        }
                      })}
                  </S.Content>
                </S.Info>

                <S.Info>
                  <S.Label>Occupation: </S.Label>
                  <S.Content>{profile.occupation}</S.Content>
                </S.Info>
                <S.Info>
                  <S.Label>Phone number: </S.Label>
                  <S.Content>{profile.phoneNumber}</S.Content>
                </S.Info>

                {profile.invites && profile.invites.length !== 0 && (
                  <S.Info>
                    <S.Label>Invites: </S.Label>
                    <S.Content>
                      {profile.invites.map((invite: string, index: number) => {
                        if (index < profile.invites.length - 1) {
                          return invite + ", ";
                        } else {
                          return invite;
                        }
                      })}
                    </S.Content>
                  </S.Info>
                )}
                <S.End>
                  <Button
                    className="Grey"
                    onClick={handleSignOut}
                    loading={signingOut}
                  >
                    Log out
                  </Button>
                </S.End>
              </S.UserBody>
            </Modal>
          </div>
        )}
        {!user && !loading && (
          <div>
            <Button className="White" onClick={() => history.push("/signin")}>
              Sign in
            </Button>
          </div>
        )}
      </S.NavbarItemRight>
    </S.Navbar>
  );
});

export default Navbar;
