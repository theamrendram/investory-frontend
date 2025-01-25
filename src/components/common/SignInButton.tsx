// SignInButton.js
import React from "react";
import { signInWithGoogle } from "../../firebase/auth";

const SignInButton = () => {
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};

export default SignInButton;
