import styled from "styled-components";

export const PlotComponent = styled.div`
  width: 100%;
  margin: 20px 0px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  height: 500px;
`;

export const ModelPlotComponent = styled.div`
  width: 100%;
  margin: 20px 0px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  height: 100%;
`;

export const Model = styled.div`
  height: 100%;
`;

export const Error = styled.div`
  padding: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 13px;
  background: #c64f4f;
`;

export const Loading = styled.div`
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PlotNotification = styled.div`
  width: 100%;
  margin: 20px 0px;
  border-radius: 5px;
`;

export const Settings = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  font-size: 11px;
`;
export const HeaderRight = styled.div`
  display: flex;
`;

export const Delay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin-right: 10px;
  font-size: 12px;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  padding: 5px;
  padding: 0 10px;
`;

export const SettingsButtons = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Menu = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  &:hover {
    cursor: pointer;
    color: lightgrey;
  }
`;

export const PlotName = styled.div`
  font-size: 16px;
`;

export const Buttons = styled.div`
  display: flex;
  width: 175px;
  justify-content: space-between;
`;

export const Plot = styled.div`
  display: flex;
  justify-content: center;
`;

export const Video = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
`;

export const StatTable = styled.div`
  display: table;
  width: 100%;
`;

export const Table = styled.table`
  height: 100%;
  width: 100%;
  margin: auto;
  border-collapse: collapse;
`;

export const RowItem = styled.td<{
  size: string;
  color?: string;
}>`
  width: ${(p) => (p.size === "small" ? "90px" : "170px")};
  color: ${(p) => (p.color ? p.color : "black")};
  padding: 6px 2px;
  padding-left: 6px;
  font-size: 12px;
`;

export const ColumnHeader = styled.th<{
  size: string;
}>`
  width: ${(p) => (p.size === "small" ? "90px" : "170px")};
  text-align: left;
  padding: 6px 2px;
  padding-left: 6px;
  font-size: 14px;
  background-color: #ddd;
`;

export const TableRow = styled.tr`
  width: 100%;
`;

export const SelectedChannel = styled.div<{ colorValue: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(p) => (p.colorValue ? p.colorValue : "black")};
  border: 1px solid lightgrey;
  border-left: 4px solid ${(p) => (p.colorValue ? p.colorValue : "black")};
  border-radius: 5px;
  height: 25px;
  padding: 4px 6px;
  &:hover {
    background-color: lightgrey;
    cursor: pointer;
    color: darkgrey;
  }
  &:active {
    background-color: black;
    color: white;
  }
`;

export const Channel = styled.div`
  &:hover {
    background-color: lightgrey;
    cursor: pointer;
    color: darkgrey;
  }
  &:active {
    background-color: black;
    color: white;
  }
`;

export const Handler = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    color: lightgrey;
    cursor: pointer;
  }
  margin-right: 5px;
`;

export const SelectedChannels = styled.div`
  display: flex;
  flex-wrap: wrap;
  > * {
    margin: 5px 5px;
  }
`;

// Used in Modals (TransformData, PlotConfiguration etc)
export const PlotConfig = styled.div`
  align-items: center;
  margin: auto;
`;

export const Center = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RightCorner = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  &:hover {
    color: grey;
    cursor: pointer;
  }
`;

export const FormContainer = styled.div`
  padding: 5px 30px;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 24px;

  font-weight: 500px;
  font-size: 14px;
  height: 36px;
`;

export const ModalMainHeader = styled.h4`
  text-align: center;
`;

export const ModalPartHeader = styled.h3`
  text-align: center;
`;

export const PlotIcon = styled.div<{ selected: boolean }>`
  border-radius: 5px;
  border: 2px 3px solid black;
  height: auto;
  background-color: ${(p) => (p.selected ? "lightgrey" : "white")};

  &:hover {
    background-color: #dfdfdf;
    cursor: pointer;
    color: #1e91e2;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  > * {
    margin: 5px;
  }
`;

export const Flex = styled.div`
  display: flex;
`;

export const PlotSettingsTitle = styled.div`
  font-size: 24px;
  margin-bottom: 18px;
`;
export const PlotSettingsSubTitle = styled.div`
  font-size: 18px;
  margin-bottom: 6px;
`;

export const Content = styled.div`
  margin-bottom: 16px;
  &.Center {
    margin-bottom: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const Align = styled.div`
  margin-bottom: 16px;
  &.Center {
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Copy = styled.div`
  flex-direction: row;
  display: flex;
  margin-top: 12px;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  &:hover {
    cursor: pointer;
    color: darkgrey;
  }
`;
