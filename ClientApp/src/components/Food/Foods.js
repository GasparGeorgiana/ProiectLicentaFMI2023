import React, {useState, useEffect} from "react";
import "./Foods.css";
import {useAuth} from "../Authentication/Auth";
import FoodCard from "./FoodCard";
import PaginationBar from "../utils/Pagination";
import {Grid, InputAdornment, TextField, Container} from "@mui/material";
import Cart from "../Cart/Cart";
import SearchIcon from "@mui/icons-material/Search";
import {FoodDialog} from "./FoodDialog";
import {useParams} from "react-router";
import {useOpenFood} from "../Hooks/useOpenFood";
import {useOrders} from "../Hooks/useOrders";
const Foods = () => {
    let {id} = useParams();
    const openFood = useOpenFood();
    const orders = useOrders();
    const [foods, setFoods] = useState([]);
    const {isAuthenticated,navigate,bearerToken} = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [foodsPerPage] = useState(4);
    const [numberOfFoods, setNumberOfFoods]=useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const headers = { 'Authorization': 'Bearer '+bearerToken };
    const handleChange = async (event) => {
        setSearchTerm(event.target.value);
            
    };
    useEffect(() => {
        async function fetchData() {
            if(bearerToken!=='') {
                const response = await fetch("https://localhost:7143/Cart/GetCartItems", {headers}).then((response) => response.json());
                orders.setOrders(response.orders)
            }
        }
        fetchData();
        
    }, [bearerToken]);
    if (!isAuthenticated) {
        navigate("/login");
    }
    useEffect(() => {
        async function fetchData() {
            if (bearerToken !== '') {
                if(searchTerm!=='') {
                    const response = await fetch("https://localhost:7143/Food/GetFoodsWithSearch?page=1&restaurantId=" + id + "&search=" + searchTerm, {headers}).then((response) => response.json());
                    const responseNumber = await fetch("https://localhost:7143/Food/GetNumberOfFoodsWithSearch?restaurantId=" + id + "&search=" + searchTerm, {headers}).then((response) => response.json());
                    setNumberOfFoods(responseNumber)
                    setFoods(response)
                }
                else{
                    const response = await fetch("https://localhost:7143/Food/GetFoods?page=1&restaurantId=" + id, {headers}).then((response) => response.json());
                    const responseNumber = await fetch("https://localhost:7143/Food/GetNumberOfFoods?restaurantId=" + id, {headers}).then((response) => response.json());
                    setNumberOfFoods(responseNumber)
                    setFoods(response)
                }
            }
        }
        fetchData();

    }, [searchTerm,bearerToken]);
    useEffect(() => {
        if (!isAuthenticated)
            navigate("/home",{ replace: true });
    },[isAuthenticated]);
    const handlePageChange = async (pageNumber) => {
        setCurrentPage(pageNumber);
        if(searchTerm!=='') {
            const response = await fetch("https://localhost:7143/Food/GetFoodsWithSearch?page=" + pageNumber + "&restaurantId=" + id+ "&search=" + searchTerm, {headers}).then((response) => response.json());
            setFoods(response)
        }
        else {
            const response = await fetch("https://localhost:7143/Food/GetFoods?page=" + pageNumber + "&restaurantId=" + id, {headers}).then((response) => response.json());
            setFoods(response)
        }
        
    }
    return (
        <>
            <FoodDialog {...openFood} {...orders} restaurantId={id} />
        <div className="food-table">
            <h1  className="food-results">Mancarea disponibila</h1>
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
                {foods.map(food => (
                    <Grid item xs>
                        <FoodCard food={food} key={food.foodId} {...openFood}/>
                    </Grid>
                ))}
            </Grid>
            <PaginationBar
                elementsPerPage={foodsPerPage}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                elements={foods}
                numberOfPages={Math.ceil(numberOfFoods/foodsPerPage)}
            />
        </div>

    <Cart  {...orders} {...openFood} />
        </>
    );
}

export default Foods;