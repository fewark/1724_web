import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {useParams} from "react-router-dom";

import {MenuOutlined} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Drawer,
    Flex,
    Layout,
    List,
    message,
} from "antd";

import {reqGetChatroomInfo} from "../../api/chatroom.js";


const {Header} = Layout;

const headerStyle = {
    backgroundColor: "#f3f3f3",
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "64px",
    paddingInline: "24px",
};


/**
 * Display the chatroom name and a menu button.
 *
 * @return {React.ReactNode}
 */
const ChatroomHeader = () => {
    const {id} = useParams();

    const [chatroomInfo, setChatroomInfo] = useState({
        name: id,
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuDrawerButtonClick = () => {
        setIsMenuOpen(true);
    };

    const handleMenuDrawerClose = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        (async () => {
            const getChatroomInfoResp = await reqGetChatroomInfo(id);
            if ("string" === typeof getChatroomInfoResp) {
                message.error(getChatroomInfoResp);

                return;
            }
            setChatroomInfo(getChatroomInfoResp);
        })();
    }, [id]);

    return (
        <Header style={headerStyle}>
            <Flex
                align={"center"}
                justify={"space-between"}
            >
                {chatroomInfo.name}
                <Button
                    size={"large"}
                    type={"text"}
                    onClick={handleMenuDrawerButtonClick}
                >
                    <MenuOutlined/>
                </Button>
            </Flex>
            <Drawer
                open={isMenuOpen}
                title={chatroomInfo.name}
                onClose={handleMenuDrawerClose}
            >
                <List
                    bordered={true}
                    dataSource={chatroomInfo.members}
                    locale={{emptyText: "Unexpected empty memebers list"}}
                    renderItem={(user) => (
                        <List.Item>
                            <List.Item.Meta
                                title={user.username}
                                avatar={<Avatar
                                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${user.id}`}/>}/>
                        </List.Item>
                    )}/>
            </Drawer>
        </Header>
    );
};


export default ChatroomHeader;
