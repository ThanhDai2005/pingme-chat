import { RouterProvider } from "react-router-dom";
import router from "./routers/routers";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
