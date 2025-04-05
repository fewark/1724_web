import {
    useEffect,
    useState,
} from "react";
import {useParams} from "react-router-dom";

import {
    Button,
    Flex,
    Form,
    Input,
    Layout,
} from "antd";

import {reqSendMessage} from "../../api/chatroom.js";


const {Footer} = Layout;

const MAX_MESSAGE_LENGTH = 4096;

const footerStyle = {
    backgroundColor: "#f3f3f3",
    paddingInline: "4px",
    paddingBlock: "4px",
};

/**
 * Renders a button to submit the message if validation passes.
 *
 * @param {object} props
 * @param {import("antd").FormInstance} props.form
 * @return {React.ReactNode}
 */
const MessageSubmitButton = ({form}) => {
    const [submittable, setSubmittable] = useState(false);

    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({validateOnly: true})
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [
        form,
        values,
    ]);

    return (
        <Button
            color={"green"}
            disabled={!submittable}
            htmlType={"submit"}
            style={{fontWeight: 500}}
            variant={"solid"}
        >
            Send
        </Button>
    );
};

/**
 * Renders a message input component as a footer.
 *
 * @param {object} props
 * @param {React.RefObject<import('socket.io-client').Socket>} props.socketRef
 * @return {React.ReactNode}
 */
const MessageInput = ({socketRef}) => {
    const {id} = useParams();

    const [form] = Form.useForm();

    const handleTextAreaKeyPress = (ev) => {
        if ("Enter" === ev.key && false === ev.shiftKey) {
            ev.preventDefault();
            form.submit();
        }
    };

    const handleMessageFormSubmit = ({msg}) => {
        reqSendMessage(socketRef.current, id, msg);
    };

    return (
        <Footer style={footerStyle}>
            <Form
                autoComplete={"off"}
                form={form}
                onFinish={handleMessageFormSubmit}
            >
                <Flex
                    justify={"end"}
                    style={{marginBottom: "2px"}}
                >
                    <Form.Item
                        name={"send"}
                        style={{marginBottom: 0}}
                    >
                        <MessageSubmitButton form={form}/>
                    </Form.Item>
                </Flex>

                <Form.Item
                    name={"msg"}
                    rules={[{required: true, message: <div/>}]}
                    style={{margin: 0}}
                >
                    <Input.TextArea
                        allowClear={true}
                        autoSize={{minRows: 1, maxRows: 5}}
                        placeholder={"Type a message..."}
                        size={"large"}
                        count={{
                            max: MAX_MESSAGE_LENGTH,
                            exceedFormatter: (txt, {max}) => txt.slice(0, max),
                        }}
                        onKeyPress={handleTextAreaKeyPress}/>
                </Form.Item>
            </Form>
        </Footer>
    );
};


export default MessageInput;
