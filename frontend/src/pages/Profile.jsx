import {useMemo} from "react";
import {useNavigate} from "react-router-dom";

import {
    Flex,
    Form,
    Input,
    message,
    Typography,
} from "antd";

import {
    getUser,
    reqUpdateUserProfile,
} from "../api/user.js";
import {ValidatedSubmitButton} from "../components/ValidatedSubmitButton.jsx";


/**
 * Renders the Profile page for viewing / editing user profile.
 *
 * @return {React.ReactElement}
 */
const Profile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const user = useMemo(() => {
        const u = getUser();
        if (null === u) {
            navigate("/");
        }

        return u;
    }, [navigate]);

    const handleProfileUpdate = async ({username}) => {
        const updateUserProfileResp = await reqUpdateUserProfile({
            username: username,
            id: user?.id,
        });

        if (null === updateUserProfileResp) {
            navigate("/");
        } else {
            message.error(`Profile update failed: ${updateUserProfileResp}`);
        }
    };

    const handleInputKeyPress = (ev) => {
        if ("Enter" === ev.key) {
            form.submit();
        }
    };

    return (
        <Flex
            align={"center"}
            justify={"center"}
            style={{height: "100vh", backgroundColor: "#fbfcfe"}}
        >
            <Typography.Title
                level={1}
                style={{
                    position: "absolute",
                    top: "20px",
                }}
            >
                ChatUI
            </Typography.Title>
            <Form
                form={form}
                onFinish={handleProfileUpdate}
            >
                <Typography.Title level={2}>Tell us about you</Typography.Title>
                <Form.Item
                    initialValue={user?.username}
                    name={"username"}
                    rules={[{required: true, message: "Please input your username"}]}
                >
                    <Input
                        placeholder={"Username"}
                        size={"large"}
                        onKeyPress={handleInputKeyPress}/>
                </Form.Item>
                <Form.Item>
                    <ValidatedSubmitButton
                        block={true}
                        form={form}/>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default Profile;
