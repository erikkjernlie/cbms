import styled from "styled-components";

export const ModelOptions = styled.div`
  position: absolute;
  left: 6px;
  top: 145px;
  max-width: 200px;
  padding: 5px;
  box-sizing: border-box;
  background-color: white;
  font-size: 12px;
  font-weight: 400;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 0.5px solid black;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    color: grey;
  }
`;

export const Model = styled.div`
  height: 100%;
  width: 100%;
`;

export const SideBar = styled.div`
  width: 300px;
  min-height: calc(100vh - 150px);
  position: absolute;
  background: white;
  zindex: 100;
  padding-left: 30px;
  padding-top: 30px;
`;

export const SideBarTitle = styled.div`
  margin-left: 15px;
  font-weight: 600;
`;

export const SideBarTitleClose = styled.div`
  margin-left: 15px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
    color: grey;
  }
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin: 15px;
`;
export const SideBarTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SideBarItem = styled.div<{
  disabled?: boolean;
  selected?: boolean;
}>`
  margin: 5px;
  margin-left: 32px;

  ${(p) => p.selected && "color: #0096eb;"}
  &:hover {
    cursor: pointer;
    color: #e4e4e4;
  }

  font-size: 12px;
`;

export const SensorSettings = styled.div`
  display: flex;
`;

export const AddingSensor = styled.div`
  position: absolute;
  background: white;
  padding: 10px;
  right: 0px;
  min-width: 350px;
  z-index: 200;
`;

export const SideBarRow = styled.div`
  margin: 10px 0px;
`;

export const SelectDatasource = styled.div`
  position: absolute;
  right: 0.5%;
  top: 35%;
  max-width: 200px;
  padding: 5px;
  box-sizing: border-box;
  background-color: white;

  font-weight: 500;
  text-transform: capitalize;

  border: 0.5px solid black;
  border-radius: 4px;
`;

export const CheckBoxWrapper = styled.div`
  position: absolute;
  right: 0.5%;
  top: 35%;
  max-width: 200px;
  padding: 5px;
  box-sizing: border-box;
  background-color: white;

  font-weight: 500;
  text-transform: capitalize;

  border: 0.5px solid black;
  border-radius: 4px;
`;
export const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
export const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;
