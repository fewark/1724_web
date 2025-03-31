import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";

import "./index.css";


const ROUTER = createBrowserRouter([
    {
        path: "/",
        element: <Login/>,
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
