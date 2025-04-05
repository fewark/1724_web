import {
    useEffect,
    useState,
} from "react";
import {useNavigate} from "react-router-dom";

import {
    Button,
    Card,
    Checkbox,
    Divider,
    Form,
    Input,
    message,
    Tabs,
    Typography,
} from "antd";

import {reqGetChatroomList} from "../api/chatroom.js";
import {
    reqUserLogin,
    reqUserRegister,
} from "../api/user.js";


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

    const goToLatestChatroom = async () => {
        const chatroomList = await reqGetChatroomList();
        if (Array.isArray(chatroomList)) {
            message.success("You are already logged in");
            navigate(`/chatroom/${chatroomList[0].id}`);
        }
    };

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

/**
 * Renders the registration form.
 *
 * @return {React.ReactNode}
 */
const RegisterForm = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async ({username, email, password, profilePicture}) => {
        setIsLoading(true);
        const registrationError = await reqUserRegister(username, email, password, profilePicture);
        if (null !== registrationError) {
            message.error(registrationError);
        } else {
            message.success("Registration successful! You are now logged in.");
            navigate("/chat");
        }
        setIsLoading(false);
    };

    const handleRegisterFormValidationFailure = (errorInfo) => {
        errorInfo.errorFields.forEach(({errors}) => {
            message.warning(errors[0]);
        });
    };

    return (
        <Form
            layout={"vertical"}
            onFinish={handleRegister}
            onFinishFailed={handleRegisterFormValidationFailure}
        >
            <Form.Item
                label={<Typography.Title level={5}>Username</Typography.Title>}
                name={"username"}
                rules={[{required: true, message: "Please enter a username"}]}
            >
                <Input placeholder={"username"}/>
            </Form.Item>

            <Form.Item
                label={<Typography.Title level={5}>Email</Typography.Title>}
                name={"email"}
                rules={[
                    {required: true, message: "Please enter your email"},
                    {type: "email", message: "Enter a valid email"},
                ]}
            >
                <Input placeholder={"example@example.com"}/>
            </Form.Item>

            <Form.Item
                label={<Typography.Title level={5}>Password</Typography.Title>}
                name={"password"}
                rules={[{required: true, message: "Please enter a password"}]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item
                dependencies={["password"]}
                label={<Typography.Title level={5}>Confirm Password</Typography.Title>}
                name={"confirmPassword"}
                rules={[
                    {required: true, message: "Please enter your password again"},
                    ({getFieldValue}) => ({
                        // eslint-disable-next-line require-await
                        validator: async (_, value) => {
                            if ("undefined" === typeof value ||
                                getFieldValue("password") === value) {
                                return;
                            }

                            throw new Error("Passwords do not match");
                        },
                    }),
                ]}
            >
                <Input.Password/>
            </Form.Item>

            {/* <Form.Item
                        label="Profile Picture URL"
                        name="profilePicture"
                        rules={[{ type: 'url', message: 'Enter a valid URL' }]}
                    >
                        <Input placeholder="Optional" />
                    </Form.Item> */}
            <Divider/>
            <Form.Item>
                <Button
                    block={true}
                    htmlType={"submit"}
                    loading={isLoading}
                    type={"primary"}
                >
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};


/**
 * Renders the Welcome page.
 *
 * @return {React.ReactElement}
 */
const Welcome = () => {
    return (
        <div
            style={{
                position: "relative",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    background: 'url("/launch-screen.png")',
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat",
                    backgroundSize: "100% auto",
                    filter: "blur(12px)",
                    inset: 0,
                    position: "absolute",
                    zIndex: 0,
                }}/>
            <div
                style={{
                    alignItems: "center",
                    background: 'url("/launch-screen.png")',
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% auto",
                    display: "flex",
                    height: "100vh",
                    justifyContent: "end",
                    paddingInline: "12vw",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Card
                    style={{
                        paddingInline: "24px",
                        paddingBlock: "16px",
                    }}
                >
                    <Typography.Title
                        level={2}
                        style={{justifySelf: "center"}}
                    >
                        Welcome to ChatUI
                    </Typography.Title>

                    <Tabs
                        centered={true}
                        defaultActiveKey={"login"}
                        size={"large"}
                        style={{width: "320px", height: "540px"}}
                        items={[{
                            label: "Login",
                            key: "login",
                            children: <LoginForm/>,
                        },
                        {
                            label: "Register",
                            key: "register",
                            children: <RegisterForm/>,
                        }]}/>
                </Card>
            </div>

        </div>
    );
};

export default Welcome;
