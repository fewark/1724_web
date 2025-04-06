import {
    useEffect,
    useRef,
    useState,
} from "react";
import {useParams} from "react-router-dom";

import {
    Avatar,
    Button,
    Layout,
    List,
    Space,
    Typography,
    message,
} from "antd";
import {
    FileOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    FileImageOutlined,
    FileWordOutlined,
    FileTextOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {getDownloadPresignedUrl} from "../../../api/file.js";
import GoToBottomButton from "./GoToBottomButton.jsx";


const {Content} = Layout;

const contentStyle = {
    backgroundColor: "#f3f3f3",
    wordBreak: "break-word",
    paddingInline: "12px",
    overflowY: "auto",

};

const SET_IS_NOT_AT_BOTTOM_DEBOUNCE_TIMEOUT_MILLIS = 1000;

/**
 * Renders a file icon based on file type
 * 
 * @param {string} fileType - MIME type of the file
 * @return {React.ReactNode}
 */
const FileTypeIcon = ({ fileType }) => {
    if (!fileType) return <FileOutlined />;
    
    if (fileType.startsWith('image/')) {
        return <FileImageOutlined style={{ color: '#36c' }} />;
    } else if (fileType === 'application/pdf') {
        return <FilePdfOutlined style={{ color: '#e53' }} />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
        return <FileWordOutlined style={{ color: '#44a' }} />;
    } else if (fileType === 'text/plain') {
        return <FileTextOutlined style={{ color: '#666' }} />;
    }
    
    return <FileOutlined />;
};

/**
 * Renders a message list item.
 *
 * @param {object} props
 * @param {string} props.createdAt
 * @param {string} props.message
 * @param {string} props.senderId
 * @param {string} props.senderUsername
 * @return {React.ReactNode}
 */
const MessageListItem = ({createdAt, message, senderId, senderUsername}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    
    const handleFileDownload = async (fileData) => {
        setDownloading(true);
        try {
            let fileId = fileData.fileId;
            
            // 如果没有 fileId，尝试从 fileUrl 解析
            if (!fileId && fileData.fileUrl) {
                const parts = fileData.fileUrl.split("/");
                fileId = parts[parts.length - 1];
            }
    
            let downloadUrl;
    
            // 尝试获取新的 Presigned URL
            if (fileId) {
                const freshData = await getDownloadPresignedUrl(fileId);
                if (freshData?.presignedUrl) {
                    downloadUrl = freshData.presignedUrl;
                }
            }
    
            // 回退到原始 URL
            if (!downloadUrl && fileData.presignedUrl) {
                downloadUrl = fileData.presignedUrl;
            }
    
            if (!downloadUrl) {
                throw new Error("No valid download URL found");
            }
        
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
    
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileData.filename || "file"; 
            document.body.appendChild(a);
            a.click();
    
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
            message.error("Failed to download file: " + (error.message || "Unknown error"));
        } finally {
            setDownloading(false);
        }
    };
    
    // Check if the message is a file message (JSON string)
    let messageContent;
    let isFileMessage = false;
    let fileData = null;
    
    try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'file') {
            isFileMessage = true;
            console.log("File data:", parsedMessage);
            fileData = parsedMessage;
        }
    } catch (e) {
        // Not a JSON message, treat as regular text
        isFileMessage = false;
    }
    
    if (isFileMessage && fileData) {
        messageContent = (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                    <FileTypeIcon fileType={fileData.fileType} />
                    <Typography.Text strong>{fileData.filename}</Typography.Text>
                </Space>
                <Button 
                    type="primary" 
                    size="small" 
                    icon={downloading ? <LoadingOutlined /> : <DownloadOutlined />}
                    onClick={() => handleFileDownload(fileData)}
                    loading={downloading}
                >
                    Download
                </Button>
            </Space>
        );
    } else {
        messageContent = (
            <Typography.Text style={{whiteSpace: "pre-wrap"}}>
                {message}
            </Typography.Text>
        );
    }

    return (
        <List.Item
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${senderId}`}/>}
                description={messageContent}
                title={
                    <Space align={"baseline"}>
                        <Typography.Title level={5}>
                            {senderUsername}
                        </Typography.Title>
                        <Typography.Text
                            style={{color: "grey", fontWeight: 400}}
                        >
                            {dayjs(createdAt).format(isHovered ?
                                "HH:mm:ss MM/DD/YYYY" :
                                "HH:mm:ss")}
                        </Typography.Text>
                    </Space>
                }/>
        </List.Item>
    );
};

/**
 * Renders a chat view for a specific chatroom.
 *
 * @param {object} props
 * @param {boolean} props.isConnected
 * @param {React.RefObject<import('socket.io-client').Socket>} props.socketRef
 * @return {React.ReactNode}
 */
// eslint-disable-next-line max-lines-per-function
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
        setHistoricalMessages([]);
        setNewMessages([]);
        firstMessageTsRef.current = null;
    }, [id]);

    useEffect(() => {
        if (0 < historicalMessages.length) {
            firstMessageTsRef.current = historicalMessages[0].createdAt;
        }
        if (null === firstMessageTsRef.current && 0 < newMessages.length) {
            firstMessageTsRef.current = newMessages[0].createdAt;
        }
    }, [
        historicalMessages,
        newMessages,
    ]);

    useEffect(() => {
        if (false === isConnected || null === socketRef.current || "undefined" === typeof id) {
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
                socketRef.current.off("prependMessage");
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
                if (entry.isIntersecting && null !== firstMessageTsRef.current) {
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
                    }, SET_IS_NOT_AT_BOTTOM_DEBOUNCE_TIMEOUT_MILLIS);
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

    return (
        <Content
            ref={containerRef}
            style={contentStyle}
        >
            <div ref={topRef}/>
            <List
                dataSource={[
                    ...historicalMessages,
                    ...newMessages,
                ]}
                locale={{emptyText: "undefined" === typeof id ?
                    "Start a new chat with the + button" :
                    "Start a conversation below"}}
                renderItem={({message, senderId, senderUsername, createdAt}) => (
                    <MessageListItem
                        createdAt={createdAt}
                        message={message}
                        senderId={senderId}
                        senderUsername={senderUsername}/>
                )}/>
            <GoToBottomButton
                isAtBottom={isAtBottom}
                newMessageCount={newMessageCount}
                onGotoBottomButtonClick={handleGotoBottomButtonClick}/>
            <div ref={bottomRef}/>
        </Content>
    );
};


export default Chatroom;
