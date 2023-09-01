import React, {useEffect, useRef, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import "mapbox-gl/dist/mapbox-gl.css";
import FoodDataTable from "./FoodDataTable";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Authentication/Auth";


function EditFood() {
    const queryClient = new QueryClient();
    const {isAuthenticated,bearerToken,role} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [foods, setFoods] = useState([]);
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <FoodDataTable setFoods={setFoods} foodsLink={"GetFoodsForRestaurant"} bearerToken={bearerToken}/>
            </QueryClientProvider>
            
        </div>
    );
}

export default EditFood;