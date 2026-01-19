import { createBrowserRouter } from "react-router-dom";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import ChatAppPage from "../pages/ChatAppPage";
import PrivateRouter from "@/components/auth/PrivateRouter";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    element: <PrivateRouter />,
    children: [
      {
        path: "/",
        element: <ChatAppPage />,
      },
    ],
  },
]);

export default router;
