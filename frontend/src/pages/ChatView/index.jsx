import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Divider,
    Layout,
} from "antd";
import {io} from "socket.io-client";

import {getSavedToken} from "../../api/user.js";
import Chatroom from "./Chatroom";
import ChatroomHeader from "./ChatroomHeader.jsx";
import ChatroomList from "./ChatroomList.jsx";
import MessageInput from "./MessageInput.jsx";


const layoutStyle = {
    height: "100vh",
    width: "100vw",
};

/**
 * Renders the Chatroom page.
 *
 * @return {React.ReactElement}
 */
const ChatView = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io({
            auth: {
                token: getSavedToken(),
            },
        });
        setIsConnected(true);

        return () => {
            if (socketRef.current) {
                setIsConnected(false);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <Layout style={layoutStyle}>
            <ChatroomList/>
            <Layout>
                <ChatroomHeader/>
                <Divider style={{margin: 0}}/>
                <Chatroom
                    isConnected={isConnected}
                    socketRef={socketRef}/>
                <Divider style={{margin: 0}}/>
                <MessageInput socketRef={socketRef}/>
            </Layout>
        </Layout>
    );
};

export default ChatView;
