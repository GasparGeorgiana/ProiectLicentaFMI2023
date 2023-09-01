import React, {useState, useEffect} from "react";
import "./Restaurants.css";
import {useAuth} from "../Authentication/Auth";
import RestaurantCard from "./RestaurantCard";
import PaginationBar from "../utils/Pagination";
import {Grid, InputAdornment, TextField, Container} from "@mui/material";
import Cart from "../Cart/Cart";
import { useOrders } from "../Hooks/useOrders";
import SearchIcon from "@mui/icons-material/Search";
import {useParams} from "react-router";
import {useOpenFood} from "../Hooks/useOpenFood";
import {useLocation} from "react-router-dom";
const Restaurants = () => {
    const openFood = useOpenFood();
    const orders = useOrders();
    const [restaurants, setRestaurants] = useState([]);
    const {isAuthenticated,navigate,bearerToken} = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurantsPerPage] = useState(4);
    const [numberOfRestaurants, setNumberOfRestaurants]=useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const headers = { 'Authorization': 'Bearer '+bearerToken };
    const handleChange = async (event) => {
        setSearchTerm(event.target.value);
        if(event.target.value!=="") {
            const response = await fetch(
                "https://localhost:7143/Restaurant/SearchRestaurant?search=" + event.target.value, {headers}).then((response) => response.json());
            setRestaurants(response);
        }
        else {
            const response = await fetch("https://localhost:7143/Restaurant/GetRestaurants?page=1",{headers}).then((response) => response.json());
            setRestaurants(response);
        }

    };
    useEffect(() => {
        if (!isAuthenticated)
            navigate("/home",{ replace: true });
    },[isAuthenticated]);
    useEffect(() => {
        async function fetchData() {
            if(bearerToken!=='') {
                const response = await fetch("https://localhost:7143/Restaurant/GetRestaurants?page=1", {headers}).then((response) => response.json());
                const responseNumber = await fetch("https://localhost:7143/Restaurant/GetNumberOfRestaurants", {headers}).then((response) => response.json());
                const response2 = await fetch("https://localhost:7143/Cart/GetCartItems", {headers}).then((response) => response.json());
                orders.setOrders(response2.orders)
                setNumberOfRestaurants(responseNumber)
                setRestaurants(response)
            }
        }
        fetchData();
    }, [bearerToken]);
    if (!isAuthenticated) {
        navigate("/login");
    }

    const handlePageChange = async (pageNumber) => {
        setCurrentPage(pageNumber);
        const response = await fetch("https://localhost:7143/Restaurant/GetRestaurants?page="+pageNumber,{headers}).then((response) => response.json());
        setRestaurants(response)
    }


    return (
        <>
            <div className="restaurant-table">
                <h1  className="restaurant-results">Restaurante Disponibile</h1>
                <Container    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TextField
                        id="search"
                        type="search"
                        label="Search"
                        value={searchTerm}
                        onChange={handleChange}
                        sx={{ width: 600 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Container>
                <Grid container alignItems="stretch">
                    {restaurants.map(restaurant => (
                        <Grid item xs>
                            <RestaurantCard restaurant={restaurant}  key={restaurant.restaurantId} orders={orders.orders}/>
                        </Grid>
                    ))}
                </Grid>
                <PaginationBar
                    elementsPerPage={restaurantsPerPage}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    elements={restaurants}
                    numberOfPages={Math.ceil(numberOfRestaurants/restaurantsPerPage)}
                />
            </div>

            <Cart {...orders} {...openFood} />
        </>
    );
}

export default Restaurants;