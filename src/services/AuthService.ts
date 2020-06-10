import { User } from "src/types/project";

import { default as authentication } from "../firebase";

export const createUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return authentication.createUserWithEmailAndPassword(email, password);
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return authentication.signInWithEmailAndPassword(email, password);
};

export const signOut = async () => {
  return authentication.signOut();
};

// listen to changes in
export const addListenerToAuthState = async (
  setUser: (user: User | undefined) => any,
  setLoading: (loading: boolean) => void
) => {
  authentication.onAuthStateChanged((user) => {
    if (user) {
      setUser(user as User);
      setLoading(false);
    } else {
      setUser(undefined);
      setLoading(false);
    }
  });
};

export const sendPasswordResetEmail = async (emailAddress: string) => {
  return authentication.sendPasswordResetEmail(emailAddress);
};

export default createUserWithEmailAndPassword;
