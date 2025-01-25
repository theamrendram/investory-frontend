import { signOutUser } from "@/firebase/auth";
import { useRouter } from "next/navigation";
const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = () => {
    try {
      signOutUser();
      router.push("/login");
    } catch (error:any) {
      console.error("Error during sign-out:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
