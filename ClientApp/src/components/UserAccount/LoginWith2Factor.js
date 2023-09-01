import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {FormikProvider, useFormik} from "formik";
import {Button, Col, Form, FormGroup} from "reactstrap";
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import {Box, FormControl} from "@mui/material";
import * as yup from "yup";
import {useAuth} from "../Authentication/Auth";
import { Cookies } from 'react-cookie';
const validationSchema = yup.object({
    inputCode: yup
        .string()
        .required('The Input Code is required')
});

function LoginWith2Factor() {
    const {setIsAuthenticated} = useAuth();
    const {state} = useLocation();
    const {Email, Password} = state;
    const [img, setImg] = useState('');
    const [key, setKey] = useState('');
    useEffect(() => {
        async function fetchImage() {
            const res = await fetch('https://localhost:7143/useraccount/GetImage?Email=' + Email);
            const imageModel = await res.json();
            setImg(imageModel.barcodeImageUrl);
            setKey(imageModel.key)
        }

        fetchImage();
    }, [Email]);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            inputCode: ''
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        enableReinitialize: true,
        onSubmit: (values) => {
            fetch('https://localhost:7143/useraccount/Login2FactorPost', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        Email: Email,
                        Password: Password,
                        Key: key,
                        InputCode: values.inputCode
                    }
                )
            }).then(async res => {
                res= await res.json();
                if(res) {
                    const cookie = new Cookies();
                    cookie.set('RestaurantCookie', res);
                    setIsAuthenticated(true);
                    navigate("/home")
                }
            });
        },
    });
    return (
        <div className="row">
            <Col md={4}>
                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>
                        <FormGroup className="form-group">
                            <FormControl fullWidth>
                                <Box
                                    component="img"
                                    sx={{
                                        width: '300px',
                                        height: '300px',
                                        justifyContent: 'center',
                                    }}
                                    alt="Cod QR Smecher."
                                    src={img}
                                />
                            </FormControl>
                        </FormGroup>
                        <TextInputLiveFeedback
                            label="InputCode"
                            id="inputCode"
                            name="inputCode"
                            onChange={formik.handleChange}
                            error={formik.touched.inputCode && Boolean(formik.errors.inputCode)}
                            helpertext={formik.touched.inputCode && formik.errors.inputCode}
                            type="text"
                            variant="text"
                        />
                        <div className="buttonHolder">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </FormikProvider>
            </Col>
        </div>
    );
}

export default LoginWith2Factor;