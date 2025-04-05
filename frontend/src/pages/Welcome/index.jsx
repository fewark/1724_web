import {
    Card,
    Tabs,
    Typography,
} from "antd";

import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";


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
                    background: "url(\"/launch-screen.png\")",
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
                    background: "url(\"/launch-screen.png\")",
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
                        items={[
                            {
                                label: "Login",
                                key: "login",
                                children: <LoginForm/>,
                            },
                            {
                                label: "Register",
                                key: "register",
                                children: <RegisterForm/>,
                            },
                        ]}/>
                </Card>
            </div>
        </div>
    );
};

export default Welcome;
