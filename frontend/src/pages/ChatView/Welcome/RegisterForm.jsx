import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    Button,
    Divider,
    Form,
    Input,
    message,
    Typography,
} from "antd";

import {reqUserRegister} from "../../../api/user.js";


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
            navigate("/chatroom/");
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


export default RegisterForm;
