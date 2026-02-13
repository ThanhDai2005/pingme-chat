import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";

const LogOut = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const res = await signOut();
    navigate("/signin");
  };

  return (
    <>
      <Button variant="completeGhost" onClick={handleLogOut}>
        <LogOutIcon className="text-destructive" />
        LogOut
      </Button>
    </>
  );
};

export default LogOut;
