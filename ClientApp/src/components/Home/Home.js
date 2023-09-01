import React, {useEffect, useState} from 'react';
import {useAuth} from "../Authentication/Auth";
import RestaurantsCarousel from "../Restaurants/RestaurantsCarousel";
import {NavItem, NavLink} from "reactstrap";
import {Link} from "react-router-dom";
function Home() {
    const {isAuthenticated,bearerToken,role} = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const headers = { 'Authorization': 'Bearer '+bearerToken };
    function HomePage() {
        if(isAuthenticated){
            if(role===1){
                return (
                    <div>
                        <div className="popular-foods">
                            <RestaurantsCarousel restaurants={restaurants}/>
                        </div>
                    </div>
                );
            }
        }
        else{
            return (
            <>
                <div className="text-center">
                    <h1></h1>
                    <p style={{fontSize: 18 }}>Pentru a putea accesa lista de oferte, va trebui sa va inregistrati.</p>
                </div>
            </>
             
            )
        }
    }
    useEffect(() => {
        async function fetchData() {
            if(isAuthenticated && bearerToken!=='') {
                const response = await fetch("https://localhost:7143/Restaurant/GetRestaurantsForShow", {headers}).then((response) => response.json());
                setRestaurants(response)
            }
        }
        fetchData();
    }, [isAuthenticated,bearerToken]);
    return (
        <main role="main" className="pb-3">
            <h1 className="display-4">Bine ati venit!</h1>
            {HomePage()}
        </main>
    );
}


export default Home;