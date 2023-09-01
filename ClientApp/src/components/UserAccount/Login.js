import React from 'react';
import TextInputLiveFeedback from "../utils/TextInputLiveFeedback";
import * as yup from "yup";
import {FormikProvider, useFormik} from "formik";
import {Button, Col, Form} from "reactstrap";
import {InputAdornment, IconButton} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {useAuth} from "../Authentication/Auth";
import {GoogleLogin, useGoogleLogin} from '@react-oauth/google';
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import {Cookies} from "react-cookie";
const validationSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format.')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
});

function Login() {

    const [showPassword, setShowPassword] = React.useState(false);
    const {setIsAuthenticated} = useAuth();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${codeResponse.access_token}`
                }
            }).then(async res => {
                res = await res.json();
                fetch('https://localhost:7143/useraccount/LoginWithGoogle', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            Email: res.email,
                            Name: res.name,
                            UserId: res.id
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
                console.log(res)
            });
        },
        onError: (error) => console.log('Login Failed:', error)
    });
    const {navigate} = useAuth();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            userName: '',
            phoneNumber: ''
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnMount: true,
        onSubmit: (values) => {
            fetch('https://localhost:7143/useraccount/Login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        Email: values.email,
                        Password: values.password
                    }
                )
            }).then(async res => {
                res = await res.json();
                if(res)
                    navigate("/login2factor", {
                        state: {
                            Email: values.email,
                            Password: values.password
                        }
                    })
            });
        },
    });
    return (
        <>
            <h2 style={{textAlign: 'center'}}>Welcome!</h2>
            <hr/>
            <h5 style={{textAlign: 'center'}}>Login</h5>
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
                            <div className="buttonHolder">
                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                                <GoogleLoginButton onClick={() => login()}>Sign in with Google 🚀 </GoogleLoginButton>
                                <LoginSocialFacebook
                                    appId="803685278157942"
                                    autoLoad={false}
                                    fields="name,email"
                                    scope="public_profile,email"
                                    onResolve={(response) => {
                                        fetch('https://localhost:7143/useraccount/LoginWithFacebook', {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(
                                                {
                                                    Email: response.data.email,
                                                    FirstName: response.data.first_name,
                                                    LastName: response.data.last_name,
                                                    UserId: response.data.id
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
                                        console.log(response);
                                       // setProfile(response.data);
                                    }}
                                    onReject={(error) => {
                                        console.log(error);
                                    }}
                                >
                                    <FacebookLoginButton />
                                </LoginSocialFacebook>
                            </div>
                        </Form>
                    </FormikProvider>
                </Col>
            </div>
        </>
    );
}

export default Login;