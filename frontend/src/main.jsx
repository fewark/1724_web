import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Chat from "./pages/Chat.jsx";
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
        path: "/chat",
        element: <Chat/>,
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
