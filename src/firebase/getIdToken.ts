import { auth } from "@/firebase/firebase";

const getIdToken = async () => {
  const user = auth.currentUser;

  try {
    if (user) {
      const idToken = await user.getIdToken(true);
      return idToken;
    } else {
      // No user is signed in. Handle this case.
      return null;
    }
  } catch (error: any) {
    console.error("Error getting ID token:", error.message);
    return null;
  }
};

export default getIdToken;