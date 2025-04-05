import {
    useEffect,
    useState,
} from "react";
import {useNavigate} from "react-router-dom";

import {PlusOutlined} from "@ant-design/icons";
import {
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
    reqJoinChatroom,
} from "../../api/chatroom.js";


const {Sider} = Layout;

const siderStyle = {
    color: "#fff",
    backgroundColor: "#f7f7f7",
};
const listStyle = {
    height: "100%",
};


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
        <Flex
            justify={"space-between"}
        >
            <Spin
                fullscreen={true}
                spinning={isLoading}/>
            <Typography.Title level={4}>Chat History</Typography.Title>
            <Tooltip title={"Start a new chat"}>
                <Popconfirm
                    icon={null}
                    open={isPopConfirmOpen}
                    title={""}
                    description={
                        <Space direction={"vertical"}>
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
 * Renders a list of chatroom and the last message.
 *
 * @return {React.ReactNode}
 */
const ChatroomList = () => {
    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        // eslint-disable-next-line no-warning-comments
        // FIXME: fetch the list of past chats.
        setRoomList([]);
    }, []);

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
                renderItem={(item) => (
                    <List.Item>
                        <Typography.Text mark={true}>[ITEM]</Typography.Text>
                        {" "}
                        {item}
                    </List.Item>
                )}/>
        </Sider>
    );
};

export default ChatroomList;
