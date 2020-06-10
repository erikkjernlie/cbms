import styled from "styled-components";

export const Input = styled.input`
  width: 90%;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
  max-width: 170px;

  background: inherit;
  color: inherit;
  font-size: 14px;

  border-radius: 3px;
  letter-spacing: 0.25px;

  margin: 4px 0px;
  padding: 0px 2px;

  &.Curve {
    width: 40%;
  }
`;

export const InputWrapper = styled.div`
  border-radius: 3px;
  border: 1px solid #f1f1f1;
  position: relative;
  background: #f1f1f1;
  display: flex;
  -webkit-transition: border-color 0.8s;
  transition: border-color 0.8s;
  margin-bottom: 5px;
  margin-left: 15px;
  margin-right: 15px;
`;

export const InputsWrapper = styled.div`
  margin-bottom: 14px;
`;

export const InputIcon = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginInput = styled.input`
  border: 0;
  padding: 0 14px;
  right: 0;
  height: 40px;
  font-size: 13px;
  width: 100%;
  border-radius: 0 2px 2px 0;
  box-sizing: border-box;
  position: relative;
  color: rgba(0, 0, 0, 0.87);
  &.Grey {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const LandingPageInput = styled.input`
  font-size: 14px;
  border: 0.1px solid #cfcfcf;
  height: 20px;
  background: white;
  color: inherit;
  margin: 7px auto;
  padding: 5px;
  border-radius: 2px;
  box-shadow: 1px 2px #dddddd;
  letter-spacing: 0.25px;
  display: flex;
  justify-content: space-between;
`;
