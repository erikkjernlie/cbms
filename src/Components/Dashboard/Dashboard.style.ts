import styled from "styled-components";

export const DashboardNavbar = styled.div`
  padding-left: 16px;
  display: flex;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  background-color: grey;
  background-color: #141a21;
  border-bottom: 1px solid #9099a2;
`;

export const Content = styled.div`
  width: 100%;
`;

export const Error = styled.div`
  padding: 12px;
  text-align: center;
  color: white;
  font-size: 13px;
  background: #c64f4f;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const InnerContent = styled.div`
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Channel = styled.div<{ selected?: boolean }>`
  background-color: lightgrey;
  background-color: white;
  width: 300px;
  margin: 3px 0px;
  padding: 3px;
  height: 20px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid ${(p) => (p.selected ? "#1e91e2" : "#ae8282")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export const HeaderItem = styled.div<{ selectedRoute: boolean }>`
  width: 150px;
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    color: white;
  }
  text-align: center;
`;

export const Left = styled.div``;

export const Right = styled.div``;

export const LeftRight = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AddNewHeaderItem = styled.div<{ selectedRoute: boolean }>`
  width: 250px;
  height: 50px;
  display: flex;
  justify-content: center;
  border-bottom: ${(p) => (p.selectedRoute ? "1px solid white" : "none")};
  margin-bottom: -1px;
  align-items: center;
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    color: white;
  }
  text-align: center;
`;

export const ComponentHeader = styled.div`
  display: flex;
  background-color: #141a21;
  padding: 8px 0px;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
`;

export const ComponentTitle = styled.div`
  font-size: 15px;
`;

export const ComponentHeaderItem = styled.div<{ selectedRoute: boolean }>`
  width: 150px;
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    color: white;
  }
  text-align: center;
`;

export const AddNewComponentContainer = styled.div``;
