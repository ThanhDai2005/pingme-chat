import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const PrivateRouter = () => {
  const { accessToken, user, loading, refresh, getDetail } = useAuthStore();
  const [staring, setStaring] = useState(true); // State đổi → render lại → UI đổi theo.

  const init = async () => {
    if (!accessToken) {
      await refresh();
    }

    if (accessToken && !user) {
      await getDetail();
    }

    setStaring(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (staring || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="signin" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRouter;
