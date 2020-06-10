import styled from "styled-components";

export const BackgroundWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 40px);
  background: radial-gradient(#40404b, #111118) rgba(34, 34, 40, 0.94);
  position: fixed;
  top: 40px;
  bottom: 0;
  right: 0;
  left: 0;
  -webkit-transition: opacity 0.2s ease-in 0.4s;
  transition: opacity 0.2s ease-in 0.4s;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginContainer = styled.div`
  background: white;
  width: 340px;
  box-shadow: 0 0 40px 4px #111118;
`;

export const Register = styled.div`
  text-align: center;
  font-size: 24px;
  margin: 24px 0px;
`;

export const Switch = styled.div`
  margin: 18px 0px;
  font-size: 11px;
  text-align: center;
  &:hover {
    cursor: pointer;
    color: darkgrey;
  }
`;

export const Error = styled.div`
  padding: 18px;
  text-align: center;
  color: white;
  font-size: 13px;
  margin: 12px 0px;
  background: #c64f4f;
`;

export const NoError = styled.div`
  padding: 18px 0px;
  text-align: center;
  color: white;
  font-size: 13px;
  margin: 12px 0px;
  background: green;
`;
