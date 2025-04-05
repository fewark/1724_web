import {VerticalAlignBottomOutlined} from "@ant-design/icons";
import {
    Badge,
    Button,
    Tooltip,
} from "antd";


const BADGE_OFFSET_HORIZONTAL = -10;

/**
 * Renders a button that scrolls to the bottom of the chat and shows the number of new messages.
 *
 * @param {object} props
 * @param {boolean} props.isAtBottom
 * @param {number} props.newMessageCount
 * @param {Function} props.onGotoBottomButtonClick
 * @return {React.ReactNode}
 */
const GoToBottomButton = ({isAtBottom, newMessageCount, onGotoBottomButtonClick}) => {
    return (
        <div
            style={{
                bottom: "12px",
                display: "flex",
                justifyContent: "end",
                position: "sticky",
                visibility: isAtBottom ?
                    "hidden" :
                    "visible",
            }}
        >
            <Tooltip
                placement={"left"}
                title={"Scroll to bottom"}
            >
                <Badge
                    count={newMessageCount}
                    offset={[
                        BADGE_OFFSET_HORIZONTAL,
                        0,
                    ]}
                >
                    <Button
                        shape={"circle"}
                        size={"large"}
                        onClick={onGotoBottomButtonClick}
                    >
                        <VerticalAlignBottomOutlined/>
                    </Button>
                </Badge>
            </Tooltip>
        </div>
    );
};

export default GoToBottomButton;
