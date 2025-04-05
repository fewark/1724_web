import {
    useEffect,
    useRef,
    useState,
} from "react";
import {useParams} from "react-router-dom";

import {VerticalAlignBottomOutlined} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Layout,
    List,
    Tooltip,
} from "antd";


const {Content} = Layout;

const contentStyle = {
    backgroundColor: "#f3f3f3",
    wordBreak: "break-word",
    paddingInline: "12px",
    overflowY: "auto",

};

/**
 * Renders a chat view for a specific chatroom.
 *
 * @param {object} props
 * @param {boolean} props.isConnected
 * @param {React.RefObject<import('socket.io-client').Socket>} props.socketRef
 * @return {React.ReactNode}
 */
const Chatroom = ({isConnected, socketRef}) => {
    const {id} = useParams();
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const isAtBottomRef = useRef(true);
    const isAtBottomChangeDebounceRef = useRef(null);

    const changeIsAtBottom = (value) => {
        if (isAtBottomChangeDebounceRef.current) {
            clearTimeout(isAtBottomChangeDebounceRef.current);
        }
        isAtBottomChangeDebounceRef.current = setTimeout(() => {
            isAtBottomRef.current = value;
            setIsAtBottom(value);
        }, 100);
    };

    const handleGotoBottomButtonClick = () => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        if (false === isConnected || null === socketRef.current) {
            return;
        }

        socketRef.current.emit("subscribe", {roomId: id});
        socketRef.current.on("message", (message) => {
            setMessages((v) => [
                ...v,
                message,
            ]);
        });
    }, [
        isConnected,
        id,
        socketRef,
    ]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            if (isAtBottomRef.current) {
                bottomRef.current?.scrollIntoView();
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [messages]);

    useEffect(() => {
        const bottomObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    changeIsAtBottom(true);
                } else {
                    changeIsAtBottom(false);
                }
            },
            {
                threshold: 0.1,
            }
        );

        bottomObserver.observe(bottomRef.current);

        return () => {
            bottomObserver.disconnect();
        };
    }, []);

    return (
        <Content
            ref={containerRef}
            style={contentStyle}
        >
            <List
                dataSource={messages}
                locale={{emptyText: "Start a conversation below"}}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.senderId}`}/>}
                            description={item.message}
                            title={item.senderUsername}/>
                    </List.Item>
                )}/>
            <div
                style={{
                    bottom: "12px",
                    display: "flex",
                    justifyContent: "end",
                    position: "sticky",
                    visibility: isAtBottom ?
                        "hidden" :
                        "visible",
                }}
            >
                <Tooltip
                    placement={"left"}
                    title={"Scroll to bottom"}
                >
                    <Button
                        shape={"circle"}
                        size={"large"}
                        onClick={handleGotoBottomButtonClick}
                    >
                        <VerticalAlignBottomOutlined/>
                    </Button>
                </Tooltip>
            </div>
            <div ref={bottomRef}/>
        </Content>
    );
};


export default Chatroom;
