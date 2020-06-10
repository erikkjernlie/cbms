import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  addListenerToAuthState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as signOutUser,
} from "src/services/AuthService";
import useProfileStore from "src/stores/profile/profileStore";
import useProjectStore from "src/stores/project/projectStore";
import { User } from "src/types/project";

import { errorFromErrorCode } from "../../services/ErrorService";

export const useRegister = () => {
  const [registering, setRegistering] = useState(false);
  const [registerError, setError] = useState("");

  const { createProfile, getProfile } = useProfileStore((state) => ({
    createProfile: state.createProfile,
    getProfile: state.getProfile,
  }));

  const history = useHistory();

  const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    occupation: string,
    phoneNumber: string
  ) => {
    setRegistering(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(email, password);
      await createProfile(email, {
        firstName,
        lastName,
        occupation,
        phoneNumber,
      });

      setError("");
    } catch (registerError) {
      setError(errorFromErrorCode(registerError.code));
      setRegistering(false);
    } finally {
      await getProfile(email);

      setRegistering(false);
      history.push("/projects");
    }
  };

  return {
    registering,
    registerError,
    registerUser,
  };
};

export const useSignIn = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setError] = useState("");

  const { getProfile } = useProfileStore((state) => ({
    getProfile: state.getProfile,
  }));

  const history = useHistory();

  const signInUser = async (email: string, password: string) => {
    setSigningIn(true);
    setError("");
    try {
      await signInWithEmailAndPassword(email, password);
      await getProfile(email);
      history.push("/projects");
    } catch (error) {
      setError(errorFromErrorCode(error.code));
      setSigningIn(false);
    } finally {
      setSigningIn(false);
    }
  };

  return {
    signingIn,
    signInError,
    signInUser,
  };
};

//TODO: Use errorFromErrorCode to get norwegian errors
export const useSignOut = () => {
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const history = useHistory();

  const { resetProfile } = useProfileStore((state) => ({
    resetProfile: state.resetProfile,
  }));

  const { setProjects, resetProjectInfo } = useProjectStore((state) => ({
    setProjects: state.setProjects,
    resetProjectInfo: state.resetProjectInfo,
  }));

  const signOut = async () => {
    setSigningOut(true);
    try {
      await signOutUser();
      history.push("/");
    } catch (error) {
      setError(error);
      setSigningOut(false);
    } finally {
      setSigningOut(false);
      resetProfile();
      resetProjectInfo();
      setProjects([]);
    }
  };

  return {
    signOut,
    signingOut,
    error,
  };
};

export const useResetPassword = () => {
  const [resetting, setResetting] = useState(false);
  const [resettingError, setError] = useState("");

  const resetPassword = async (email: string) => {
    if (email.length === 0) {
      setError("Write in an email.");
    } else {
      setResetting(true);
      try {
        await sendPasswordResetEmail(email);
        setError("An e-mail is sent to the requested email.");
      } catch (error) {
        setError(error.toString());
        setResetting(false);
      } finally {
        setResetting(false);
      }
    }
  };

  return {
    resetPassword,
    resetting,
    resettingError,
  };
};

export const useUser = () => {
  const [user, setUser] = useState({} as User | undefined);
  const [loading, setLoading] = useState(true);

  const subscribeToAuthState = () => {
    addListenerToAuthState(setUser, setLoading);
  };

  useEffect(() => {
    subscribeToAuthState();
  }, []);

  return { user, loading };
};
