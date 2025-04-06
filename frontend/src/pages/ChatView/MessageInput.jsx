import {
    useRef,
    useState,
} from "react";
import {useParams} from "react-router-dom";

import {
    SmileOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import Picker from "@emoji-mart/react";
import {
    Button,
    Flex,
    Form,
    Input,
    Layout,
    message,
    Popover,
    Upload,
} from "antd";

import {
    reqSendFileMessage,
    reqSendMessage,
} from "../../api/chatroom.js";
import {
    getUploadPresignedUrl,
    uploadFileToStorage,
} from "../../api/file.js";
import {getUser} from "../../api/user.js";
import {ValidatedSubmitButton} from "../../components/ValidatedSubmitButton.jsx";


const {Footer} = Layout;

const MAX_MESSAGE_LENGTH = 4096;
const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * KILOBYTE;
const MAX_FILE_SIZE = 10 * MEGABYTE;

const footerStyle = {
    backgroundColor: "#f3f3f3",
    paddingInline: "4px",
    paddingBlock: "4px",
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
    const [uploading, setUploading] = useState(false);

    const [form] = Form.useForm();
    const cursorPositionRef = useRef(0);

    const handleEmojiSelect = (emoji) => {
        const currentValue = form.getFieldValue("msg") ?? "";
        form.setFieldsValue({
            msg: currentValue.slice(0, cursorPositionRef.current) +
                emoji.native + currentValue.slice(cursorPositionRef.current),
        });
        cursorPositionRef.current += emoji.native.length;
    };

    const handleTextAreaSelect = (ev) => {
        cursorPositionRef.current = ev.target.selectionStart;
    };

    const handleTextAreaKeyPress = (ev) => {
        if ("Enter" === ev.key && false === ev.shiftKey) {
            ev.preventDefault();
            form.submit();
        }
    };

    const handleMessageFormSubmit = ({msg}) => {
        reqSendMessage(socketRef.current, id, msg);
        form.resetFields(["msg"]);
    };

    const handleFileUpload = async (options) => {
        const {file, onSuccess, onError} = options;

        if (file.size > MAX_FILE_SIZE) {
            message.error(`File too large. Maximum size is ${MAX_FILE_SIZE / MEGABYTE}MB`);
            onError(new Error("File too large"));

            return;
        }

        try {
            setUploading(true);

            // Get the current user ID from localStorage
            const user = getUser();
            const userId = user ?
                user.id :
                null;

            if (!userId) {
                message.error("User not authenticated");
                onError(new Error("User not authenticated"));

                return;
            }

            // Get a presigned URL for upload
            const result = await getUploadPresignedUrl(id, userId, file.name);

            if ("string" === typeof result) {
                // Error returned as string
                message.error(result);
                onError(new Error(result));

                return;
            }

            if (!result.presignedUrl) {
                message.error("Failed to get upload URL: No presigned URL returned");
                onError(new Error("No presigned URL returned"));

                return;
            }

            // Upload the file directly to MinIO using the presigned URL
            const uploadError = await uploadFileToStorage(result.presignedUrl, file);

            if (uploadError) {
                message.error(uploadError);
                onError(new Error(uploadError));

                return;
            }

            // Send file message to the chat after successful upload
            reqSendFileMessage(socketRef.current, id, {
                fileId: result.fileId,
                fileType: file.type,
                fileUrl: result.fileUrl,
                filename: file.name,
                presignedUrl: result.presignedUrl,
            });

            message.success(`${file.name} uploaded successfully`);
            onSuccess(null, file);
        } catch (error) {
            console.error("Upload failed:", error);
            message.error(`${file.name} upload failed: ${error.message}`);
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Footer style={footerStyle}>
            <Form
                autoComplete={"off"}
                disabled={"undefined" === typeof id}
                form={form}
                onFinish={handleMessageFormSubmit}
            >
                <Flex
                    justify={"space-between"}
                    style={{marginBottom: "4px"}}
                >
                    <Flex>
                        <Form.Item style={{marginBottom: 0, marginRight: 8}}>
                            <Popover
                                placement={"topLeft"}
                                trigger={"click"}
                                content={<Picker
                                    noCountryFlags={false}
                                    set={"apple"}
                                    onEmojiSelect={handleEmojiSelect}/>}
                            >
                                <Button
                                    shape={"circle"}
                                >
                                    <SmileOutlined/>
                                </Button>
                            </Popover>
                        </Form.Item>
                        <Form.Item style={{marginBottom: 0}}>
                            <Upload
                                accept={"image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
                                customRequest={handleFileUpload}
                                showUploadList={false}
                            >
                                <Button
                                    loading={uploading}
                                    shape={"circle"}
                                    title={"Upload file"}
                                >
                                    <UploadOutlined/>
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Flex>
                    <Form.Item
                        name={"send"}
                        style={{marginBottom: 0}}
                    >
                        <ValidatedSubmitButton
                            color={"green"}
                            form={form}/>
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
                        onKeyPress={handleTextAreaKeyPress}
                        onSelect={handleTextAreaSelect}/>
                </Form.Item>
            </Form>
        </Footer>
    );
};


export default MessageInput;
