import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { ChatPage } from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/chat",
    Component: ChatPage,
  },
]);
