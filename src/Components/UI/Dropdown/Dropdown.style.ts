import styled from "styled-components";

export const Select = styled.select`
  width: 90%;
  min-width: 70px;
  height: 35px;
  box-sizing: border-box;
  display: flex;
  max-width: 170px;

  background: white;
  color: #141a21;
  font-size: 14px;
  border: none;

  &:hover {
    background-color: red;
    box-shadow: 0 0 10px 100px #fff inset;
  }

  &.Curve {
    width: 40%;
  }

  option {
    color: #141a21;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 1px;

    &:hover,
    &:focus,
    &:active {
      color: #444645;
      background: #ddd;
      background-color: lightgrey !important;
      box-shadow: lightgrey;
      cursor: pointer;
      box-shadow: 0 0 10px 100px #fff inset;
    }
  }
`;
