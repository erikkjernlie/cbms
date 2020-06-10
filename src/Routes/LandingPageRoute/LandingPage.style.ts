import styled from "styled-components";

import img from "../../assets/background.jpg";

export const SectionLight = styled.div`
  background: white;
  display: flex;
  width: 100%;

  justify-content: center;
  color: black;
`;

export const Background = styled.div`
  background-image: url(${img});
  height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 40px;
`;

export const SectionDark = styled.div`
  background: #141a21;
  display: flex;
  width: 100%;
  color: white;

  justify-content: center;
`;

export const Content = styled.div`
  margin: 60px 0px 80px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Video = styled.div`
  min-width: 1000px;
`;

export const Title = styled.h2`
  text-align: center;
`;

export const Description = styled.div`
  border-left: 1px solid black;
  padding: 0 10px;
  width: 600px;
`;
