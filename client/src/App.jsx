import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Contact from "./pages/Contact";
import Auth from "./pages/Auth";

function App() {
  const isLoggedIn = localStorage.getItem("token");
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Contact /> : <Auth />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
