import { signOutUser } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
const SignOutButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const handleLogout = () => {
    try {
      signOutUser();
      router.push("/login");
    } catch (error: any) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <Button onClick={handleLogout} className={className}>
      Logout
    </Button>
  );
};

export default SignOutButton;
