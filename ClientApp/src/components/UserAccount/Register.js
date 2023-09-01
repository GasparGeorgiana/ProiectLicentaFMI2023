import React, {useEffect, useMemo} from "react";
import {Button, Col, Form} from 'reactstrap';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {FormikProvider, useFormik} from 'formik';
import * as yup from 'yup';
import {InputAdornment,IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import debounce from 'lodash/debounce';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";



const validationSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format.')
        .required('Email is required')
        .test('checkEmailUnique', 'This email is already registered',
            function (value) {
                return fetch('https://localhost:7143/useraccount/emailAvailability?email=' + value).then(async res => {
                    return await res.json();
                })
            }
        ),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*0-9]{10,}$/, "The Password must have at least one noumeric, one special character, one uppercase letter and have a length of at least 10.")
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .when('password', (password, schema) => {
            return schema.test({
                test: confirmPassword => password[0] === confirmPassword,
                message: "The passwords must match"
            })
        }),
    firstName: yup
        .string()
        .matches(/^[a-zA-Z]*( [a-zA-Z]+)*$/, "Given names must have letters and be delimited by only one space.")
        .required(),
    lastName: yup
        .string()
        .matches(/^[a-zA-Z]*$/, "Last name must have only letters.")
        .required()
});

function Register() {
   
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch('https://localhost:7143/useraccount/Register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        Email: values.email,
                        Password: values.password,
                        ConfirmPassword: values.confirmPassword,
                        FirstName: values.firstName,
                        LastName: values.lastName
                    }
                )
            }).then(async res => {
                res = await res.json();
                if(res)
                    navigate("/home")
            });
        },
    });
    const debouncedValidate = useMemo(
        () => debounce(formik.validateForm, 500),
        [formik.validateForm],
    );

    useEffect(
        () => {
            console.log('calling deboucedValidate');
            debouncedValidate(formik.values);
        },
        [formik.values, debouncedValidate],
    );
    return (
        <>
            <h2 style={{textAlign: 'center'}}>Welcome!</h2>
            <hr/>
            <h5 style={{textAlign: 'center'}}>Create an account</h5>
            <div className="row">
                <Col md={4}>
                    <FormikProvider value={formik}>
                        <Form onSubmit={formik.handleSubmit}>
                            <TextInputLiveFeedback
                                label="Email"
                                id="email"
                                name="email"
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helpertext={formik.touched.email && formik.errors.email}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                label="Password"
                                required
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                inputName="Password"
                                name="password"
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helpertext={formik.touched.password && formik.errors.password}
                                variant="outlined"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <TextInputLiveFeedback
                                required
                                label="Confirm Password"
                                id="confirmPassword"
                                inputName="Confirm Password"
                                variant="outlined"
                                name="confirmPassword"
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helpertext={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <TextInputLiveFeedback
                                required
                                id="firstName"
                                name="firstName"
                                label="First name"
                                onChange={formik.handleChange}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helpertext={formik.touched.firstName && formik.errors.firstName}
                                type="text"
                                variant="text"
                            />
                            <TextInputLiveFeedback
                                required
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                onChange={formik.handleChange}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helpertext={formik.touched.lastName && formik.errors.lastName}
                                type="text"
                                variant="text"
                            />
                            <div className="buttonHolder">
                                <Button variant="primary" type="submit">
                                    Sign Up
                                </Button>
                            </div>
                        </Form>
                    </FormikProvider>
                </Col>
            </div>
        </>
    );
}

export default Register;