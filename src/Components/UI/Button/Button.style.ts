import styled from "styled-components";

interface Props {
  display?: string;
  selected?: boolean;
}

export const Button = styled.button`
  height: 32px;
  padding: 0 8px;
  display: ${(props: Props) => (props.display ? props.display : "flex")};
  align-items: center;
  justify-content: space-between;
  margin: 5px;

  cursor: pointer;
  text-decoration: none !important;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid;

  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  max-width: 170px;

  &:hover {
    background-color: grey;
    color: white;
  }

  &.Blue {
    text-align: center;
    display: flex;
    justify-content: center;
    border: 0px;
    background: white;
    min-width: 70px;
    outline: none;
    color: #0096eb;
    &:hover {
      background: #e4e4e4;
    }
  }

  &.White {
    border: 0px;
    color: white;
    background: transparent;
    margin-right: 20px;
    outline: none;
    &:hover {
      color: #0096eb;
    }
  }

  &.Send {
    border: 0px;
    color: black;
    background: none;
    margin-right: 20px;
    outline: none;
    &:hover {
      color: #0096eb;
    }
  }

  &.BlackWhite {
    border: 0px;
    color: black;
    background: none;
    margin-right: 20px;
    outline: none;
    &:hover {
      color: white;
    }
  }

  &.Red {
    text-align: center;
    display: flex;
    justify-content: center;
    border: 0px;
    background: white;
    min-width: 70px;
    outline: none;
    color: #fd625e;
    &:hover {
      background: #e4e4e4;
    }
  }

  &.Black {
    text-align: center;
    border: 0px;
    display: flex;
    justify-content: center;
    min-width: 70px;
    outline: none;
    background: white;
    color: black;
    &:hover {
      background: #e4e4e4;
    }
  }

  &.BlackLong {
    text-align: center;
    border: 0px;
    display: flex;
    height: 20px;
    justify-content: center;
    min-width: 200px;
    outline: none;
    background: white;
    color: black;
    &:hover {
      background: #e4e4e4;
    }
  }

  &.Grey {
    text-align: center;
    border: 0px;
    display: flex;
    justify-content: center;
    outline: none;
    min-width: 70px;
    background: white;
    color: #9099a2;
    &:hover {
      background: #e4e4e4;
    }
  }

  &.Small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    font-size: 12px;
    padding: 2px;
    background: white;
    border: 0px;
    &:hover {
      background-color: #1e91e2;
    }
  }

  &.SubNavBar {
    border: none;
    background-color: transparent;
    height: 40px;
    color: white;
    font-size: 12px;
    text-transform: capitalize;
  }

  &.Simple {
    border: none;
    background-color: transparent;
    color: ${(props: Props) => (props.selected ? "black" : "lightgrey")};
    &:hover {
      color: black;
    }
    padding: 0px;
    outline: none;
    margin-right: 15px;

    font-size: 12px;
    text-transform: capitalize;
  }

  &.HalfWidth {
    width: 40%;
    text-align: center;
    justify-content: center;
  }

  &.FormButton {
    font-weight: bold;
    border: 1.5px solid #141a21;
    color: #141a21;
    border-radius: 4px;
    &:hover {
      background-color: #dfdfdf;
      cursor: pointer;
      color: #1e91e2;
      border-color: #1e91e2;
    }
  }

  &.ListItem {
    border-radius: none;
    border: none;
    background-color: transparent;
    font-size: 16px;
    text-transform: capitalize;
    padding: 0px;
    margin-left: 0px;

    &:hover {
      color: #1e91e2;
    }
  }

  &.Centered {
    margin: 10px auto;
  }

  &.LandingPage {
    border: 1px solid transparent;
    color: white;
    width: 50%;
    margin: auto;
    margin-bottom: 10px;
    background-color: #548ac1;
    text-align: center;
  }

  &.Big {
    width: 400px;
    height: 55px;
    background: #01aff7;
    border: 10px solid #01aff7;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-transform: uppercase;
    margin: 40px 0px;
    text-align: center;
    font-size: 14px;
    letter-spacing: 1px;
    transition: font-size 0.5s ease;

    &:hover {
      cursor: pointer;
      font-size: 16px;
    }
  }

  &.Long {
    width: 500px;
    height: 45px;
    background: #1e91e2;
    border: 10px solid #1e91e2;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-transform: uppercase;
    margin: 10px 0px;

    text-align: center;
    font-size: 14px;
    transition: font-size 0.5s ease;

    &:hover {
      cursor: pointer;
      font-size: 15px;
    }
  }

  &.MediumBlue {
    width: 500px;
    height: 32px;
    background: #1e91e2;
    border: 10px solid #1e91e2;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin: 10px 0px;

    text-align: center;
    font-size: 12px;
    transition: font-size 0.5s ease;

    &:hover {
      cursor: pointer;
      font-size: 13px;
    }
  }

  &.SignInSignUp {
    width: 100%;
    border-radius: 0px;
    background-color: #1e91e2;
    color: white;
    height: 60px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    border: 0px;
    margin: 0px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: font-size 0.5s ease;

    &:hover {
      cursor: pointer;
      font-size: 16px;
      //background: #065b96;
    }
  }

  &.Accept {
    background-color: green;
    border: 1px solid transparent;
    color: white;
    height: 24px;
    font-size: 10px;
    line-height: 12px;
    margin: 0px;
  }

  &.Decline {
    background-color: red;
    border: 1px solid transparent;
    color: white;
    height: 24px;
    font-size: 10px;
    line-height: 12px;
    margin: 0px;
  }
`;
