import styled from "styled-components";

export const Navbar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #141a21;
  color: white;
  height: 40px;
  font-size: 12px;
`;

export const Header = styled.div`
  margin: auto;
  color: white;
  width: 300px;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const HeaderTitleContainer = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  &:hover {
    cursor: pointer;
  }
`;

export const HeaderTitle = styled.div`
  font-size: 14px;
`;

export const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 25px;
  width: 50px;
`;

export const NumberCircle = styled.div`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  padding-bottom: 3px;
  background: none;
  border: 3px solid white;
  color: white;
  text-align: center;

  font: 14px;
`;
export const UserHeader = styled.div`
  width: 100%;
  padding: 10px 20px;
  color: white;
  background: linear-gradient(135deg, #141a21, #141a21 60%, #1e91e2);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SimpleFlex = styled.div`
  display: flex;
  align-items: center;
`;

export const Close = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

export const UserBody = styled.div`
  padding: 20px;
`;

export const Loading = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const User = styled.div`
  font-size: 12px;
  display: flex;
`;

export const Info = styled.div`
  margin-bottom: 10px;
`;

export const Title = styled.div`
  font-size: 24px;
  margin-bottom: 15px;
`;

export const SubTitle = styled.div`
  font-size: 14 px;
  margin-bottom: 10px;
`;

export const Label = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

export const Content = styled.div``;

export const UserIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
`;

export const FlexTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover * {
    cursor: pointer;
    color: lightgrey;
  }
`;

export const BackButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 200px;
  le &:hover {
    cursor: pointer;
    background-color: #28313c;
  }
`;

export const Flex = styled.div`
  display: flex;
  height: 100%;
  width: 400px;
`;

export const NavbarItem = styled.div`
  width: 300px;
`;

export const Icon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NavbarItemRight = styled.div`
  width: 300px;
  display: flex;
  justify-content: flex-end;
`;

export const SubNavbarItemRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ProjectSettings = styled.div`
  color: #9099a2;
  &:hover {
    color: white;
    cursor: pointer;
  }
`;

export const SubNavbar = styled.div`
  padding: 32px 9px 0px 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #141a21;
  color: white;
  align-items: center;
  border-bottom: 1px solid #9099a2;
`;

export const SubSubNavbar = styled.div`
  height: 40px;
  padding: 0 32px;
  background-color: #141a21;
`;

export const Bar = styled.div`
  display: flex;
  height: 40px;
`;

export const Route = styled.div<{ selectedRoute: boolean }>`
  border-bottom: ${(p) =>
    p.selectedRoute ? "1px solid white" : "transparent"};
  margin-bottom: -1px;
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    color: white;
  }
  padding: 4px;
  padding 4px 25px;
  text-align: center;
  font-size: 15px;
  min-width: 140px;
  width: 140px;
`;

export const SubRoute = styled.div<{ selectedRoute: boolean }>`
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    color: white;
  }
  text-align: center;

  width: 140px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  font-size: 12px;
`;

export const AddSubRoute = styled.div<{ selectedRoute: boolean }>`
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    color: white;
  }
  text-align: center;

  width: 140px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  > * {
    margin: 0 5px;
  }

  box-sizing: border-box;
  font-size: 12px;
`;

export const StaticSubRoute = styled.div<{ selectedRoute: boolean }>`
  background-color: ${(p) => (p.selectedRoute ? "#1E91E2" : "#141a21")};
  color: ${(p) => (p.selectedRoute ? "white" : "#9099A2")};
  &:hover {
    cursor: pointer;
    background-color: #1e91e2;
  }
  text-align: center;

  width: 60px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  font-size: 16px;
`;

export const SubRoutes = styled.div`
  width: 100%;

  display: flex;
  align-items: flex-end;

  flex-wrap: nowrap;
  overflow-x: auto;

  background-color: #141a21;
  color: white;
`;

export const ArrowStyling = styled.i`
  border: solid white;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;

  &.Left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const End = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
