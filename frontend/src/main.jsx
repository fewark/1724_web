import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import ChatView from "./pages/ChatView";
import Profile from "./pages/Profile.jsx";
import Welcome from "./pages/Welcome.jsx";

import "@ant-design/v5-patch-for-react-19";
import "./index.css";


const ROUTER = createBrowserRouter([
    {
        path: "/",
        element: <Welcome/>,
    },
    {
        path: "/chatroom/:id",
        element: <ChatView/>,
    },
    {
        path: "/chatroom/",
        element: <ChatView/>,
    },
    {
        path: "/profile",
        element: <Profile/>,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={ROUTER}/>
    </StrictMode>
);
