import { Form, Input, Button, Checkbox, message, Card, Typography, Space, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const { Title } = Typography;

/**
 * Renders the Login page.
 *
 * @return {React.ReactElement}
 */
const Login = () => {
    const [loading, setLoading] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email: values.email,
                password: values.password,
            });

            const { token } = response.data;
            localStorage.setItem('token', token);
            message.success('Login successful!');
            navigate('/chat');

        } catch (error) {
            const errMsg = error.response?.data?.error || 'Login failed';
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // --- REGISTER handler ---
    const handleRegister = async (values) => {
        setRegisterLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', values);
            console.log("hi there", values)

            const { token } = response.data;
            localStorage.setItem('token', token);
            message.success('Registration successful! You are now logged in.');
            setRegisterModalVisible(false);
            navigate('/chat');
            
        } catch (error) {
            const errMsg = error.response?.data?.error || 'Registration failed';
            message.error(errMsg);
        } finally {
            setRegisterLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#123458' }}>
            <Card
                style={{
                    width: 450,
                    padding: '20px 30px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }} align="center">
                    <Title level={3}>Welcome Back to Chat Room</Title>
                </Space>

                {/* Login form */}
                <Form
                    name="login"
                    layout="vertical"
                    initialValues={{ remember: false }}
                    onFinish={handleLogin}
                    onFinishFailed={handleLoginFailed}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="you@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Log in
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="link"
                            block
                            onClick={() => setRegisterModalVisible(true)}
                        >
                            Don't have an account? Sign up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* SIGN UP MODAL */}
            <Modal
                title="Create an Account"
                open={registerModalVisible}
                onCancel={() => setRegisterModalVisible(false)}
                footer={null}
                centered
            >
                <Form layout="vertical" onFinish={handleRegister}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter a username' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Enter a valid email' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter a password' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please enter your password again' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
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
                            type="primary"
                            htmlType="submit"
                            block
                            loading={registerLoading}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
};

export default Login;