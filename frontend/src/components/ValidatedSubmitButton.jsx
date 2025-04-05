import {
    useEffect,
    useState,
} from "react";

import {
    Button,
    Form,
} from "antd";


/**
 * Renders a button to submit the message if validation passes.
 *
 * @param {object} props
 * @param {import("antd").FormInstance} props.form
 * @param {object} props.rest
 * @return {React.ReactNode}
 */
const ValidatedSubmitButton = ({form, ...rest}) => {
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
            {...rest}
            disabled={!submittable}
            htmlType={"submit"}
            style={{fontWeight: 500}}
            variant={"solid"}
        >
            Send
        </Button>
    );
};


export {ValidatedSubmitButton};
