import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import useChatStore from "src/stores/listeners/chatStore";
import { ChatMessage, User } from "src/types/project";

import Button from "../UI/Button/Button";
import { LoginInput } from "../UI/TextInput/TextInput.style";
import * as S from "./Chat.style";

interface Props {
  user: User | undefined;
  projectId: string;
}

export default function Chat(props: Props) {
  const { projectId, user } = props;

  const [message, setMessage] = useState("");

  const { initializeChat, sendMessage, messages } = useChatStore((state) => ({
    sendMessage: state.sendMessage,
    messages: state.messages,
    initializeChat: state.initializeChat,
  }));

  // NB: MESSAGES FOR THE CHAT SHOULD ONLY BE LOADED ONCE, THIS CAN BE A PROBLEM WITH THE INCOMING DATA
  useEffect(() => {
    initializeChat(projectId);
  }, []);

  useEffect(() => {
    var element = document.getElementById("chatLogs");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (message.length > 0 && user !== undefined) {
      sendMessage(projectId, user.email, message);
      setMessage("");
    }
  };

  return (
    <S.Chat>
      <S.Content id="chatLogs">
        {messages &&
          messages.map((chatMessage: ChatMessage) => {
            return (
              <S.MessageWrapper>
                <S.CreatedBy>{chatMessage.createdBy}</S.CreatedBy>

                <S.Message
                  key={chatMessage.id}
                  ownMessage={
                    user !== undefined && user.email === chatMessage.createdBy
                  }
                >
                  <S.MessageContent>{chatMessage.message}</S.MessageContent>
                </S.Message>
                <S.CreatedAt>
                  {moment(chatMessage.createdAt.toDate()).fromNow()}
                </S.CreatedAt>
              </S.MessageWrapper>
            );
          })}
      </S.Content>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          if (message.length > 0) {
            send();
          }
        }}
      >
        <S.ButtonsWrapper>
          <LoginInput
            className="Grey"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write message"
            value={message}
          />
          <Button className="Send" onClick={() => send()}>
            <IoMdSend size={"1.6em"} />
          </Button>
        </S.ButtonsWrapper>
      </form>
    </S.Chat>
  );
}
