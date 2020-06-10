import styled from "styled-components";

export const Message = styled.div<{ ownMessage: boolean }>`
  width: 100%;
  background-color: ${(p) => (p.ownMessage ? "#0084ff" : "#f1f0f0")};
  color: ${(p) => (p.ownMessage ? "white" : "black")};
  padding: 3px 10px;
  border-radius: 10px;
`;

export const Chat = styled.div`
  width: 100%;
  background-color: white;
  height: 280px;

  position: relative;
`;

export const CreatedBy = styled.div`
  font-size: 10px;
  margin-left: 10px;
  color: grey;
`;
export const CreatedAt = styled.div`
  font-size: 10px;
  color: black;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
`;

export const MessageContent = styled.div`
  font-size: 16px;
`;

export const MessageWrapper = styled.div`
  margin: 2px 0px;
`;

export const Content = styled.div`
  overflow-y: scroll;
  height: 240px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
`;

export const ButtonsWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
