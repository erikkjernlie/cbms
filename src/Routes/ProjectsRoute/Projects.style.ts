import styled from "styled-components";

import img from "../../assets/background.jpg";

export const ProjectsContainer = styled.div`
  width: 100%;
  padding-top: 50px;
`;

export const LoginBox = styled.div`
  border: 1px solid #dddddd;
  border-radius: 3px;
  box-shadow: 2px 3px #cccccc;

  padding: 10px 5px;
  width: 40%;
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

export const InviteBox = styled.div`
  border: 1px solid #dddddd;
  border-radius: 3px;
  box-shadow: 2px 3px #cccccc;
  margin: 20px auto;
  padding: 20px;
  max-width: 500px;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

export const MyProjectsBox = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: row;
`;

export const RegisterBox = styled.div`
  border: 1px solid #dddddd;
  border-radius: 3px;
  box-shadow: 2px 3px #cccccc;
  margin: auto;
  height: 300px;
  padding: 10px 5px;
  width: 40%;
`;

export const PageHeader = styled.h2`
  color: #141a21;
  margin: 10px;
  margin-bottom: 50px;
  text-align: center;
`;

export const BoxHeader = styled.div`
  width: 70%;
  margin: auto;
  padding: 20px;
  padding-bottom: 3px;
  margin-bottom: 20px;
  text-align: center;
  color: #141a21;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #141a21;
`;

export const ProjectData = styled.table`
  margin: auto;
  width: 100%;
  margin-top: 10px;
`;

export const TableRow = styled.tr`
  &:hover {
    border: 1px solid blue;
    cursor: pointer;
  }
`;

export const TableRowInformation = styled.tr`
  height: 80px;
`;

export const ProjectDataHeader = styled.th`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  text-align: left;
  color: #a5a5a5;
`;

export const ProjectDataItem = styled.td`
  text-align: left;
  padding: 3px 0px;

  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #000000;
`;

export const MaximumProjectsReached = styled.div`
  max-width: 500px;
  text-align: center;
  font-size: 11px;
`;

export const NewProject = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  margin-top: 40px;
  font-size: 22px;
  font-weight: 600;
`;

export const SubTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

export const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
`;
