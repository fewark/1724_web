import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {useNavigate} from "react-router-dom";

import {
    Button,
    Checkbox,
    Divider,
    Form,
    Input,
    message,
    Typography,
} from "antd";

import {reqGetChatroomList} from "../../../api/chatroom.js";
import {reqUserLogin} from "../../../api/user.js";


/**
 * Renders the login form.
 *
 * @return {React.ReactNode}
 */
const LoginForm = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleLoginFormValidationFailure = (errorInfo) => {
        errorInfo.errorFields.forEach(({errors}) => {
            message.warning(errors[0]);
        });
    };

    const goToLatestChatroom = useCallback(async () => {
        const chatroomList = await reqGetChatroomList();
        if (Array.isArray(chatroomList)) {
            message.success("You are already logged in");
            const lastChatroom = chatroomList[0]?.id;
            if ("undefined" === typeof lastChatroom) {
                navigate("/chatroom/");
            } else {
                navigate(`/chatroom/${chatroomList[0].id}`);
            }
        }
    }, [navigate]);

    const handleLogin = async ({email, password, remember}) => {
        setIsLoading(true);
        const loginError = await reqUserLogin(email, password, remember);
        if (null !== loginError) {
            message.error(loginError);
        } else {
            message.success("Login successful!");
            await goToLatestChatroom();
        }
        setIsLoading(false);
    };

    useEffect(() => {
        (async () => {
            await goToLatestChatroom();
        })();
    }, [
        goToLatestChatroom,
        navigate,
    ]);

    return (
        <Form
            initialValues={{remember: false}}
            layout={"vertical"}
            name={"login"}
            onFinish={handleLogin}
            onFinishFailed={handleLoginFormValidationFailure}
        >
            <div style={{flexGrow: 1}}>
                <Form.Item
                    label={<Typography.Title level={5}>Email</Typography.Title>}
                    name={"email"}
                    rules={[
                        {required: true, message: "Please input your email"},
                        {type: "email", message: "Enter a valid email"},
                    ]}
                >
                    <Input placeholder={"example@example.com"}/>
                </Form.Item>

                <Form.Item
                    label={<Typography.Title level={5}>Password</Typography.Title>}
                    name={"password"}
                    rules={[{required: true, message: "Please input your password"}]}
                >
                    <Input.Password placeholder={"••••••••"}/>
                </Form.Item>

                <Form.Item
                    name={"remember"}
                    valuePropName={"checked"}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
            </div>

            <Divider/>

            <Form.Item>
                <Button
                    block={true}
                    htmlType={"submit"}
                    loading={isLoading}
                    type={"primary"}
                >
                    Sign in
                </Button>
            </Form.Item>
        </Form>
    );
};


export default LoginForm;
