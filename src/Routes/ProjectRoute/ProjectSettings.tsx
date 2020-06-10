import React, { useContext, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Chat from "src/Components/Chat/Chat";
import * as S from "src/Components/Navigation/Navbar/Navbar.style";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";
import UserContext from "src/context/UserContext";
import useInvitesStore from "src/stores/listeners/invitesStore";

Modal.setAppElement("body");

interface Props {
  projectId: string;
}
const ProjectSettings = React.memo((props: Props) => {
  const { projectId } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showChat, setShowChat] = useState(true);

  const { user } = useContext(UserContext);

  const { sendUserInvite, sendingInvite } = useInvitesStore((state) => ({
    sendUserInvite: state.sendUserInvite,
    sendingInvite: state.sendingInvite,
  }));

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const sendInvite = async () => {
    if (email !== "") {
      sendUserInvite(projectId, email).then(() => {
        toast.info("Invite sent to " + email, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setEmail("");
      });
    } else {
      toast.info("Plise write in an email", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div id="element">
      <S.ProjectSettings onClick={openModal}>
        <IoIosChatboxes size={"18px"} />
      </S.ProjectSettings>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="UserModal"
        contentLabel="User Modal"
      >
        <S.UserHeader>
          <S.SimpleFlex>
            <S.NumberCircle>{projectId[0]}</S.NumberCircle> Project settings:{" "}
            {projectId}
          </S.SimpleFlex>
          <S.Close onClick={closeModal}>Close</S.Close>
        </S.UserHeader>
        <S.UserBody>
          <S.Title>Invites</S.Title>
          <S.SubTitle>
            Invite a user to this project by typing in an email.
          </S.SubTitle>
          <S.Left>
            <TextInput
              onChange={(e: any) => setEmail(e.target.value)}
              value={email}
              placeholder="Invite with email..."
            />
            <Button
              loading={sendingInvite}
              className="Blue"
              onClick={() => sendInvite()}
            >
              Send invite
            </Button>
          </S.Left>
          <S.Title>Chat</S.Title>
          <S.SubTitle>
            Here you can chat with other users of the project.
          </S.SubTitle>
          {/*} <Button className="Black" onClick={() => toggleChat()}>
            {showChat ? "Hide " : "Show "}
            chat
  </Button>*/}

          {showChat && <Chat projectId={projectId} user={user} />}
        </S.UserBody>
      </Modal>
    </div>
  );
});

export default ProjectSettings;
