import {createContext, useContext, useEffect, useState} from 'react';
import { Cookies } from 'react-cookie';
import {useNavigate} from "react-router-dom";

const AuthContext = createContext({
    isAuthenticated: false,
    role : 1,
    currentUser: null,
    bearerToken: '',
    setBearerToken: () => {
    },
    setCurrentUser: () => {
    },
    setIsAuthenticated : () => {
        
    },
    navigate: null
});

export let useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [role, setRole] = useState(true);
    const [bearerToken, setBearerToken] = useState('')
    const [currentUser, setCurrentUser] = useState(null);
    const cookies = new Cookies();
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchUser() {
            try {
                if (cookies.get("RestaurantCookie") !== undefined) {
                    const headers = { 'Authorization': 'Bearer '+cookies.get("RestaurantCookie") };
                    setBearerToken(cookies.get("RestaurantCookie"))
                    fetch('https://localhost:7143/useraccount/currentUser',{headers}).then(async res => {
                        res = await res.json();
                        if (res) {
                            setCurrentUser(res)
                            setIsAuthenticated(res.isAuthenticated)
                            setRole(res.role)
                        }
                    })
                } else {
                    setBearerToken("")
                    fetch('https://localhost:7143/useraccount/currentUser').then(async res => {
                        res = await res.json();
                        if (res) {
                            setCurrentUser(res)
                            setIsAuthenticated(res.isAuthenticated)
                            setRole(res.role)
                        }
                    })
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchUser();
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{isAuthenticated,role, currentUser,bearerToken,setCurrentUser,setIsAuthenticated, setBearerToken,navigate}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;