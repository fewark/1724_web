import {useParams} from "react-router-dom";


/**
 * Renders the Chat page.
 *
 * @return {React.ReactElement}
 */
const Chat = () => {
    const {id} = useParams();

    return (
        <div>
            {"We are in the Chatroom "}
            {id}
        </div>
    );
};

export default Chat;
