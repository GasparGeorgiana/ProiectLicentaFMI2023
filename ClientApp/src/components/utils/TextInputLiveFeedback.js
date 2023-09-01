import {useField} from "formik";
import {FormControl, InputLabel, Select, TextField, OutlinedInput, Alert} from "@mui/material";
import {FormGroup} from "reactstrap";
import React from "react";
import { DatePicker } from '@mui/x-date-pickers';

const TextInputLiveFeedback = ({label, helpText, variant = 'text', id = null, inputName = null, ...props}) => {
    const [field, meta] = useField(props);

    const renderSwitch = (param) => {
        // eslint-disable-next-line default-case
        switch (param) {
            case 'text':
                return TextField;
            case 'outlined':
                return OutlinedInput;
            case 'select':
                return Select;
            case 'date':
                return DatePicker;
        }
    }
    const showFeedback = (param) => {
        switch (param) {
            case 'date':
                return (field.value > 2) || meta.touched;
            default:
                return (field.value.trim().length > 2) || meta.touched;
        }

    }


    const FormComponent = renderSwitch(variant);
    return (
        <FormGroup className="form-group">
            <FormControl fullWidth>
                {(id && inputName) ? <InputLabel htmlFor={id}>{inputName}</InputLabel> : null}
                <FormComponent
                    label={label}
                    {...props}
                    {...field}/>
                {
                    (showFeedback && meta.error) ? (
                        <Alert severity="warning">{meta.error}</Alert>
                    ) : null}
            </FormControl>
        </FormGroup>
    );
};
export default TextInputLiveFeedback;