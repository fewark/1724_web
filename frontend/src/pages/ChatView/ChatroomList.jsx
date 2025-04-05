import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {useNavigate} from "react-router-dom";

import {PlusOutlined} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Flex,
    Form,
    Input,
    Layout,
    List,
    message,
    Popconfirm,
    Segmented,
    Space,
    Spin,
    Tooltip,
    Typography,
} from "antd";

import {
    reqCreateChatroom,
    reqGetChatroomList,
    reqJoinChatroom,
} from "../../api/chatroom.js";
import {getUser} from "../../api/user.js";


const {Sider} = Layout;

const siderStyle = {
    color: "#fff",
    backgroundColor: "#f7f7f7",
};
const listStyle = {
    height: "100%",
};

const MAX_USERNAME_VIEW_LENGTH = 14;
const MAX_CHATROOM_MESSAGE_PREVIEW_LENGTH = 20;


/**
 * Enum for the new chatroom mode.
 */
const NEW_CHATROOM_MODE = Object.freeze({
    CREATE: "Create",
    JOIN: "Join",
});

/**
 * Renders a chatroom list header that includes the user profile and a creation / join room button.
 *
 * @return {React.ReactNode}
 */
const ChatroomListHeader = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [isPopConfirmOpen, setIsPopConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(NEW_CHATROOM_MODE.CREATE);

    const user = useMemo(() => {
        const u = getUser();
        if (null === u) {
            navigate("/");
        }

        return u;
    }, [navigate]);

    const handleProfileButtonClick = () => {
        navigate("/profile");
    };

    const handleNewChatroomButtonClick = () => {
        setIsPopConfirmOpen(true);
    };

    const handleNewChatroomCancel = () => {
        setIsPopConfirmOpen(false);
    };

    const handleModeChange = (value) => {
        setMode(value);
    };

    const handleNewChatroomConfirm = async () => {
        try {
            await form.validateFields();
        } catch (e) {
            console.error("New room validation failed:", e);

            return;
        }

        setIsLoading(true);
        const newChatroomName = form.getFieldValue("newChatroomName");

        const reqFunc = mode === NEW_CHATROOM_MODE.CREATE ?
            reqCreateChatroom :
            reqJoinChatroom;
        const resp = await reqFunc(newChatroomName);
        if ("string" === typeof resp) {
            message.error(resp);
        } else {
            message.success(`Chatroom ${mode === NEW_CHATROOM_MODE.CREATE ?
                "created" :
                "joined"} with Room ID: ${resp.roomId}`);
            form.resetFields();
            setIsPopConfirmOpen(false);
            navigate(`/chatroom/${resp.roomId}`);
        }

        setIsLoading(false);
    };

    return (
        <Flex justify={"space-between"}>
            <Spin
                fullscreen={true}
                spinning={isLoading}/>
            <Button onClick={handleProfileButtonClick}>
                <Avatar
                    shape={"square"}
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${user?.id}`}/>
                <Typography.Title level={4}>
                    {user?.username?.substring(0, MAX_USERNAME_VIEW_LENGTH)}
                </Typography.Title>
            </Button>
            <Tooltip title={"Start a new chat"}>
                <Popconfirm
                    icon={null}
                    open={isPopConfirmOpen}
                    title={""}
                    description={
                        <Space
                            direction={"vertical"}
                            style={{width: "300px"}}
                        >
                            <Segmented
                                block={true}
                                color={"blue"}
                                options={Object.values(NEW_CHATROOM_MODE)}
                                onChange={handleModeChange}/>
                            <Form form={form}>
                                <Form.Item
                                    name={"newChatroomName"}
                                    rules={[
                                        {required: true, message: "Please enter a chatroom name"},
                                    ]}
                                >
                                    <Input
                                        placeholder={mode === NEW_CHATROOM_MODE.CREATE ?
                                            "New Chatroom Name" :
                                            "Chatroom Name"}/>
                                </Form.Item>
                            </Form>
                        </Space>
                    }
                    okText={mode === NEW_CHATROOM_MODE.CREATE ?
                        "Create" :
                        "Join"}
                    onCancel={handleNewChatroomCancel}
                    onConfirm={handleNewChatroomConfirm}
                >
                    <Button onClick={handleNewChatroomButtonClick}>
                        <PlusOutlined/>
                    </Button>
                </Popconfirm>
            </Tooltip>
        </Flex>
    );
};

/**
 * Renders a chatroom list item.
 *
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.lastMessage
 * @param {string} props.id
 * @return {React.ReactNode}
 */
const ChatroomListItem = ({id, name, lastMessage}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleChatroomClick = () => {
        navigate(`/chatroom/${id}`);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <List.Item
            style={{backgroundColor: isHovered ?
                "#eaeaea" :
                "inherit"}}
            onClick={handleChatroomClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <List.Item.Meta
                description={lastMessage.substring(0, MAX_CHATROOM_MESSAGE_PREVIEW_LENGTH)}
                title={name}/>
        </List.Item>
    );
};

/**
 * Renders a list of chatroom and the last message.
 *
 * @return {React.ReactNode}
 */
const ChatroomList = () => {
    const navigate = useNavigate();
    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        (async () => {
            const chatroomList = await reqGetChatroomList();
            if ("string" === typeof chatroomList) {
                message.error(chatroomList);
                navigate("/");

                return;
            }
            setRoomList(chatroomList);
        })();
    }, [navigate]);

    return (
        <Sider
            style={siderStyle}
            width={"25%"}
        >
            <List
                bordered={true}
                dataSource={roomList}
                header={<ChatroomListHeader/>}
                locale={{emptyText: <Typography.Text>No chat history</Typography.Text>}}
                style={listStyle}
                renderItem={({id, name, messages}) => (
                    <ChatroomListItem
                        id={id}
                        lastMessage={messages[0]?.content ?? ""}
                        name={name}/>
                )}/>
        </Sider>
    );
};

export default ChatroomList;
