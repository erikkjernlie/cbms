const errors = {
  "auth/email-already-in-use": "Email already in use.",
  "auth/invalid-email": "Invalid email format.",
  "auth/weak-password": "The password must consist of at least 6 characters.",
  "auth/user-disabled": "User deactivated.",
  "auth/user-not-found": "No user exists with this email.",
  "auth/wrong-password": "Wrong password.",
} as { [errorCode: string]: string };

export const errorFromErrorCode = (errorCode: string) => {
  return errors[errorCode] as string;
};
