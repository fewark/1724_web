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
    Spin,
    Tooltip,
    Typography,
} from "antd";

import {reqCreateChatroom} from "../../api/chatroom.js";


const {Sider} = Layout;

const siderStyle = {
    color: "#fff",
    backgroundColor: "#f7f7f7",
};
const listStyle = {
    height: "100%",
};


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

    const handleNewChatroomButtonClick = () => {
        setIsPopConfirmOpen(true);
    };

    const handleNewChatroomCancel = () => {
        setIsPopConfirmOpen(false);
    };

    const handleNewChatroomConfirm = async (ev) => {
        try {
            await form.validateFields();
        } catch (e) {
            console.error("New room validation failed:", e);

            return;
        }

        setIsLoading(true);
        const newChatroomName = form.getFieldValue("newChatroomName");
        const createResp = await reqCreateChatroom(newChatroomName);
        if ("string" === typeof createResp) {
            message.error(createResp);
        } else {
            message.success(`Chatroom created with Room ID: ${createResp.roomId}`);
            form.resetFields();
            setIsPopConfirmOpen(false);
            navigate(`/chatroom/${createResp.roomId}`);
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
                    okText={"Create"}
                    open={isPopConfirmOpen}
                    title={""}
                    description={
                        <Form form={form}>
                            <Form.Item
                                name={"newChatroomName"}
                                rules={[
                                    {required: true, message: "Please enter a chatroom name"},
                                ]}
                            >
                                <Input placeholder={"New Chatroom Name"}/>
                            </Form.Item>
                        </Form>
                    }
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
