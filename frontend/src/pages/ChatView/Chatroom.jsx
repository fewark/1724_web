import {
    useEffect,
    useRef,
    useState,
} from "react";
import {useParams} from "react-router-dom";

import {VerticalAlignBottomOutlined} from "@ant-design/icons";
import {
    Avatar,
    Badge,
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

    const [newMessages, setNewMessages] = useState([]);
    const [historicalMessages, setHistoricalMessages] = useState([]);
    const firstMessageTsRef = useRef(null);
    const [newMessageCount, setNewMessageCount] = useState(0);

    const containerRef = useRef(null);
    const topRef = useRef(null);

    const bottomRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const handleGotoBottomButtonClick = () => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        if (false === isConnected || null === socketRef.current) {
            return () => null;
        }

        socketRef.current.emit("subscribe", {roomId: id});
        socketRef.current.on("message", (message) => {
            setNewMessages((v) => [
                ...v,
                message,
            ]);
            setNewMessageCount((v) => v + 1);
        });
        socketRef.current.on("prependMessage", (message) => {
            setHistoricalMessages((v) => [
                message,
                ...v,
            ]);
        });

        return () => {
            if (null !== socketRef.current) {
                socketRef.current.off("message");
                // eslint-disable-next-line react-hooks/exhaustive-deps
                socketRef.current.emit("unsubscribe", {roomId: id});
            }
        };
    }, [
        isConnected,
        id,
        socketRef,
    ]);

    useEffect(() => {
        const topObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    socketRef.current.emit("getMoreMessages", {
                        roomId: id,
                        earlierThan: firstMessageTsRef.current,
                    });

                    // Scroll down slightly to allow next trigger.
                    topRef.current?.parentElement.scrollBy({
                        top: 1,
                    });
                }
            },
            {
                threshold: 0.1,
            }
        );

        topObserver.observe(topRef.current);

        let debounceSetIsNotAtBottom = null;
        const bottomObserver = new IntersectionObserver(
            ([entry]) => {
                if (debounceSetIsNotAtBottom) {
                    clearTimeout(debounceSetIsNotAtBottom);
                }
                if (entry.isIntersecting) {
                    setIsAtBottom(true);
                } else {
                    debounceSetIsNotAtBottom = setTimeout(() => {
                        if (bottomRef.current.parentElement.scrollTop +
                            bottomRef.current.parentElement.clientHeight ===
                            bottomRef.current.parentElement.scrollHeight) {
                            return;
                        }
                        setIsAtBottom(false);
                        setNewMessageCount(0);
                    }, 1000);
                }
            },
            {
                threshold: 0.1,
            }
        );

        bottomObserver.observe(bottomRef.current);

        return () => {
            clearTimeout(debounceSetIsNotAtBottom);
            topObserver.disconnect();
            bottomObserver.disconnect();
        };
    }, [
        id,
        socketRef,
    ]);

    useEffect(() => {
        if (isAtBottom) {
            requestAnimationFrame(() => {
                // This is a new message.
                bottomRef.current?.scrollIntoView();
            });
        }
    }, [
        isAtBottom,
        newMessages,
    ]);

    useEffect(() => {
        if (0 < historicalMessages.length) {
            firstMessageTsRef.current = historicalMessages[0].createdAt;
        }
    }, [historicalMessages]);

    return (
        <Content
            ref={containerRef}
            style={contentStyle}
        >
            <div ref={topRef}/>
            <List
                locale={{emptyText: "Start a conversation below"}}
                dataSource={[...historicalMessages,
                    ...newMessages]}
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
                    <Badge
                        count={newMessageCount}
                        offset={[
                            -10,
                            0,
                        ]}
                    >
                        <Button
                            shape={"circle"}
                            size={"large"}
                            onClick={handleGotoBottomButtonClick}
                        >
                            <VerticalAlignBottomOutlined/>
                        </Button>
                    </Badge>
                </Tooltip>
            </div>
            <div ref={bottomRef}/>
        </Content>
    );
};


export default Chatroom;
