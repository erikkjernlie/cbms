import styled from "styled-components";

import WorkingPersonImage from "../../assets/working_person.svg";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const LeftSideBar = styled.div`
  width: 250px;
  height: calc(100vh - 40px);
  background-color: white;
`;
export const Content = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 40px;
  background-color: #f3f4f7;
  height: calc(100vh - 40px);
  overflow-y: scroll;
`;

export const Welcome = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 20px;
  background-color: lightgrey;
  background: linear-gradient(281.08deg, #2963f6 0.2%, #00b5ff 102.9%);
  color: white;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.05);
  border-radius: 15px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 10px;

  &.Black {
    color: black;
  }
`;

export const Margin = styled.div`
  margin: 20px 0px;
`;

export const Description = styled.div``;

export const ProjectDataItem = styled.div`
  width: 250px;
`;
export const Project = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
export const Left = styled.div``;

export const WelcomeContent = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-left: 30px;
`;

export const LeftSideBarTab = styled.div`
  border-bottom: 1px solid lightgrey;
  margin: 20px 10px;
`;
export const LeftSideBarElement = styled.div<{ selectedTab: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0px;
  &:hover {
    cursor: pointer;
    color: darkgrey;
  }

  ${(p) => (p.selectedTab ? "font-weight: 600;" : "")} > * {
    margin-right: 5px;
  }
`;

export const Image = styled.div`
  background-image: url(${WorkingPersonImage});
  background-repeat: no-repeat;
  width: 300px;
  height: 200px;
`;
