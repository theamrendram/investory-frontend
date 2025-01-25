import { GoogleAuthProvider } from "firebase/auth";

export const firebaseUiConfig = {
  signInFlow: "popup",
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false, // Avoid redirect after sign-in
  },
};
