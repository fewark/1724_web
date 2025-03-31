import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    message,
    Modal,
    Space,
    Typography,
} from "antd";

import {
    reqUserLogin,
    reqUserRegister,
} from "../api/auth";


const {Title} = Typography;

/**
 * Renders the Login page.
 *
 * @return {React.ReactElement}
 */
const Login = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            await reqUserLogin(values.email, values.password);
            message.success("Login successful!");
            navigate("/chat");
        } catch (error) {
            const errMsg = error.response?.data?.error || "Login failed";
            message.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginFormValidationFailure = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    // --- REGISTER handler ---
    const handleRegister = async (values) => {
        setIsRegisterLoading(true);
        try {
            await reqUserRegister(values.username, values.email, values.password, values.profilePicture);
            message.success("Registration successful! You are now logged in.");
            setIsRegisterModalVisible(false);
            navigate("/chat");
        } catch (error) {
            const errMsg = error.response?.data?.error || "Registration failed";
            message.error(errMsg);
        } finally {
            setIsRegisterLoading(false);
        }
    };

    return (
        <div style={{display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#123458"}}>
            <Card
                style={{
                    width: 450,
                    padding: "20px 30px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                }}
            >
                <Space
                    align={"center"}
                    direction={"vertical"}
                    style={{width: "100%"}}
                >
                    <Title level={3}>Welcome Back to Chat Room</Title>
                </Space>

                {/* Login form */}
                <Form
                    initialValues={{remember: false}}
                    layout={"vertical"}
                    name={"login"}
                    onFinish={handleLogin}
                    onFinishFailed={handleLoginFormValidationFailure}
                >
                    <Form.Item
                        label={"Email"}
                        name={"email"}
                        rules={[
                            {required: true, message: "Please input your email!"},
                            {type: "email", message: "Enter a valid email!"},
                        ]}
                    >
                        <Input placeholder={"you@example.com"}/>
                    </Form.Item>

                    <Form.Item
                        label={"Password"}
                        name={"password"}
                        rules={[{required: true, message: "Please input your password!"}]}
                    >
                        <Input.Password placeholder={"••••••••"}/>
                    </Form.Item>

                    <Form.Item
                        name={"remember"}
                        valuePropName={"checked"}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block={true}
                            htmlType={"submit"}
                            loading={isLoading}
                            type={"primary"}
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0}}>
                        <Button
                            block={true}
                            type={"link"}
                            onClick={() => setIsRegisterModalVisible(true)}
                        >
                            Don&apos;t have an account? Sign up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* SIGN UP MODAL */}
            <Modal
                centered={true}
                footer={null}
                open={isRegisterModalVisible}
                title={"Create an Account"}
                onCancel={() => setIsRegisterModalVisible(false)}
            >
                <Form
                    layout={"vertical"}
                    onFinish={handleRegister}
                >
                    <Form.Item
                        label={"Username"}
                        name={"username"}
                        rules={[{required: true, message: "Please enter a username"}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"Email"}
                        name={"email"}
                        rules={[
                            {required: true, message: "Please enter your email"},
                            {type: "email", message: "Enter a valid email"},
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={"Password"}
                        name={"password"}
                        rules={[{required: true, message: "Please enter a password"}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        dependencies={["password"]}
                        label={"Confirm Password"}
                        name={"confirm_password"}
                        rules={[
                            {required: true, message: "Please enter your password again"},
                            ({getFieldValue}) => ({
                                /**
                                 * Validates that the confirm password
                                 *
                                 * @param {*} _ Unused parameter
                                 * @param {string} value
                                 * @return {Promise<void>}
                                 */
                                validator (_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error("Passwords do not match"));
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

                    <Form.Item>
                        <Button
                            block={true}
                            htmlType={"submit"}
                            loading={isRegisterLoading}
                            type={"primary"}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Login;
