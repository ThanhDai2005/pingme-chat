import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const LogOut = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const res = await signOut();
    navigate("/signin");
    console.log(res);
  };

  return (
    <>
      <Button onClick={handleLogOut}>LogOut</Button>
    </>
  );
};

export default LogOut;
