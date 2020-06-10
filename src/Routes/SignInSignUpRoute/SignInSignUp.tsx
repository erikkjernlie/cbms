import React, { useState } from "react";
import {
  AiOutlineLock,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlinePhone,
} from "react-icons/ai";
import { FiBriefcase } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Button from "src/Components/UI/Button/Button";
import * as I from "src/Components/UI/TextInput/TextInput.style";
import {
  useRegister,
  useResetPassword,
  useSignIn,
} from "src/hooks/authentication/authentication";

import * as S from "./SignInSignUp.style";

const SignInSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [userInformationError, setUserInformationError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [error, setError] = useState("");

  const { signingIn, signInUser, signInError } = useSignIn();
  const { registerUser, registering, registerError } = useRegister();
  const { resetPassword, resettingError, resetting } = useResetPassword();

  const login = async () => {
    if (!signingIn) {
      try {
        await signInUser(email, password);
      } catch (error) {
        setError(error.text);
      }
    }
  };

  const checkIfDataIsValid = () => {
    setUserInformationError("");
    if (firstName.length === 0) {
      setUserInformationError("First name is empty");
      return false;
    } else if (lastName.length === 0) {
      setUserInformationError("Last name is empty");
      return false;
    } else if (occupation.length === 0) {
      setUserInformationError("Occupation is empty");
      return false;
    } else if (phoneNumber.length !== 8) {
      setUserInformationError("Phone number is not correct");
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async () => {
    checkIfDataIsValid();
    if (!registering && checkIfDataIsValid()) {
      try {
        await registerUser(
          email,
          password,
          firstName,
          lastName,
          occupation,
          phoneNumber
        );
      } catch (error) {
        setError(error.text);
      }
    }
  };

  return (
    <S.BackgroundWrapper>
      <S.Container>
        {error &&
          toast.error(
            () => (
              <div>
                <div>{error}</div>
                <Button onClick={() => setError("")}>OK</Button>
              </div>
            ),
            {
              position: toast.POSITION.BOTTOM_CENTER,
            }
          )}
        {signIn && (
          <S.LoginContainer>
            <S.Register>Log in</S.Register>
            {(registerError ||
              signInError ||
              userInformationError ||
              resettingError) && (
              <React.Fragment>
                {resettingError ===
                "An e-mail is sent to the requested mail address." ? (
                  <S.NoError>{resettingError}</S.NoError>
                ) :(
                  <S.Error>
                    {registerError ||
                      signInError ||
                      userInformationError ||
                      resettingError}
                  </S.Error>
                )}
              </React.Fragment>
            )}
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                login();
              }}
            >
              <I.InputsWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlineMail />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Your e-mail"
                  />
                </I.InputWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlineLock />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Your password"
                    type="password"
                  />
                </I.InputWrapper>
                <S.Switch onClick={() => resetPassword(email)}>
                  Reset password
                  {resetting && (
                    <ClipLoader size={15} color={"#123abc"} loading={true} />
                  )}
                </S.Switch>
              </I.InputsWrapper>
              <S.Switch onClick={() => setSignIn(!signIn)}>
                Don't have an account? Click here to sign up.
              </S.Switch>
              <Button
                className="SignInSignUp"
                onClick={login}
                loading={signingIn}
              >
                LOG IN >
              </Button>
            </form>
          </S.LoginContainer>
        )}
        {!signIn && (
          <S.LoginContainer>
            <S.Register>Register</S.Register>
            {(registerError || signInError || userInformationError) && (
              <S.Error>
                {registerError || signInError || userInformationError}
              </S.Error>
            )}
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                handleRegisterSubmit();
              }}
            >
              <I.InputsWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlineMail />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Your e-mail"
                  />
                </I.InputWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlineLock />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Your password"
                    type="password"
                  />
                </I.InputWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlineUser />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setFirstName(e.target.value)}
                    value={firstName}
                    placeholder="First name"
                  />
                </I.InputWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlineUser />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setLastName(e.target.value)}
                    value={lastName}
                    placeholder="Last name"
                  />
                </I.InputWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <FiBriefcase />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setOccupation(e.target.value)}
                    value={occupation}
                    placeholder="Profession"
                  />
                </I.InputWrapper>
                <I.InputWrapper>
                  <I.InputIcon>
                    <AiOutlinePhone />
                  </I.InputIcon>
                  <I.LoginInput
                    onChange={(e: any) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                    type="number"
                    placeholder="Phone number"
                  />
                </I.InputWrapper>
              </I.InputsWrapper>
              <S.Switch onClick={() => setSignIn(!signIn)}>
                Already have an account? Click here to sign in.
              </S.Switch>
              <Button
                className="SignInSignUp"
                onClick={() => handleRegisterSubmit()}
                loading={registering}
              >
                REGISTER >
              </Button>
            </form>
          </S.LoginContainer>
        )}
      </S.Container>
    </S.BackgroundWrapper>
  );
};

export default SignInSignUp;
