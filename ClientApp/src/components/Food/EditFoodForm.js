import React, {useEffect} from 'react';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import {readFileDataAsBase64} from "../utils/ImageToByteArray";
import * as yup from "yup";
import {FormikProvider, useFormik} from "formik";
import {Button, Col, Form, FormGroup} from "reactstrap";
import {FileUploadOutlined} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import { Card } from "react-bootstrap";
import {useAuth} from "../Authentication/Auth";
const validationSchema = yup.object({
    foodName: yup
        .string()
        .required('The Name is required'),
    foodPrice: yup
        .number()
        .required('The Price is required')
});

function EditFoodForm({handleClose,tableData,setTableData,row}) {
    const {bearerToken,isAuthenticated,navigate} = useAuth();
    const food = row.original;
    useEffect(() => {
        if (!isAuthenticated)
            navigate("/home",{ replace: true });
    },[isAuthenticated]);
    const formik = useFormik({
        initialValues: {
            foodName:food.foodName,
            foodPrice: food.foodPrice,
            foodPicture:food.foodPicture,
            foodId: food.foodId
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch('https://localhost:7143/Food/EditFood', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+bearerToken
                },
                body: JSON.stringify(
                    {
                        FoodName: values.foodName,
                        FoodPrice: values.foodPrice,
                        FoodPicture: values.foodPicture,
                        FoodId: values.foodId,
                        RestaurantId: food.restaurantId
                    }
                )
            }).then(async res => {
                res = await res.json();
                if(res){
                    tableData[row.index] = res;
                    setTableData([...tableData]);
                    handleClose();
                }
            });
        },
    });
    function handleChange(e) {
        readFileDataAsBase64(e).then(r => {
            formik.setValues({
                foodPicture: r,
                foodPrice: formik.values.foodPrice,
                foodName: formik.values.foodName
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
                                id="foodName"
                                name="foodName"
                                onChange={formik.handleChange}
                                error={formik.touched.foodName && Boolean(formik.errors.foodName)}
                                helpertext={formik.touched.foodName && formik.errors.foodName}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                label="Price"
                                required
                                id="foodPrice"
                                name="foodPrice"
                                onChange={formik.handleChange}
                                error={formik.touched.foodPrice && Boolean(formik.errors.foodPrice)}
                                helpertext={formik.touched.foodPrice && formik.errors.foodPrice}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                label="Food Picture"
                                required
                                id="foodPicture"
                                name="foodPicture"
                                onChange={handleChange}
                                error={formik.touched.foodPrice && Boolean(formik.errors.foodPrice)}
                                helpertext={formik.touched.foodPrice && formik.errors.foodPrice}
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
                                    <Card.Img src={formik.values.foodPicture}/>

                                    <Card.Body>
                                        <Card.Title>{formik.values.foodName+" "+formik.values.foodPrice+"Lei"}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </FormGroup>
                            <div className="buttonHolder">
                                <Button variant="primary" type="submit">
                                    Edit Food
                                </Button>
                            </div>
                        </Form>
                    </FormikProvider>
                </Col>
            </div>
        </>
    );
}

export default EditFoodForm;