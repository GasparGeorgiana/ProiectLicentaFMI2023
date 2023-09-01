import React, {useEffect} from 'react';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import {readFileDataAsBase64} from "../utils/ImageToByteArray";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {FormikProvider, useFormik} from "formik";
import {Button, Col, Form, FormGroup} from "reactstrap";
import {FileUploadOutlined} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import { Card } from "react-bootstrap";
import {useAuth} from "../Authentication/Auth";
const validationSchema = yup.object({
    restaurantName: yup
        .string()
        .required('The Name is required'),
});

function AddRestaurantForm() {
    const {bearerToken,navigate,isAuthenticated} = useAuth();
    useEffect(() => {
        if (!isAuthenticated)
            navigate("/home",{ replace: true });
    },[isAuthenticated]);
    const formik = useFormik({
        initialValues: {
            restaurantName:'',
            restaurantPicture:''
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch('https://localhost:7143/Restaurant/AddRestaurant', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+bearerToken
                },
                body: JSON.stringify(
                    {
                        RestaurantName: values.restaurantName,
                        RestaurantPicture: values.restaurantPicture
                    }
                )
            }).then(async res => {
                res = await res.json();
                if(res){
                    navigate('/home')
                }
            });
        },
    });
    function handleChange(e) {
        readFileDataAsBase64(e).then(r => {
            formik.setValues({
                restaurantPicture: r,
                restaurantName: formik.values.restaurantName
            })
        });
    }
    return (
        <>
            <div className="row">
                <Col md={4}>
                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <TextInputLiveFeedback
                                label="Name"
                                required
                                id="restaurantName"
                                name="restaurantName"
                                onChange={formik.handleChange}
                                error={formik.touched.restaurantName && Boolean(formik.errors.restaurantName)}
                                helpertext={formik.touched.restaurantName && formik.errors.restaurantName}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                label="Restaurant Picture"
                                required
                                id="restaurantPicture"
                                name="restaurantPicture"
                                onChange={handleChange}
                                error={formik.touched.restaurantPicture && Boolean(formik.errors.restaurantPicture)}
                                helpertext={formik.touched.restaurantPicture && formik.errors.restaurantPicture}
                                type="text"
                                variant="text"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton component="label">
                                            <FileUploadOutlined/>
                                            <input
                                                style={{display: "none"}}
                                                type="file"
                                                hidden
                                                onChange={handleChange}
                                                name="[licenseFile]"
                                            />
                                        </IconButton>
                                    ),
                                }}
                            />
                            <FormGroup className="form-group">
                                <Card>
                                    <Card.Img src={formik.values.restaurantPicture}/>

                                    <Card.Body>
                                        <Card.Title>{formik.values.restaurantName}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </FormGroup>
                            <div className="buttonHolder">
                                <Button variant="primary" type="submit">
                                    Add Restaurant
                                </Button>
                            </div>
                        </Form>
                    </FormikProvider>
                </Col>
            </div>
        </>
    );
}

export default AddRestaurantForm;