import React from 'react';
import {Card, Col} from "react-bootstrap";
import "./RestaurantCard.css";
import {CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import {useAuth} from "../Authentication/Auth";

const RestaurantCard = ({restaurant: restaurant, orders:orders, index}) => {
    const {navigate,bearerToken} = useAuth();
    return (
        <Col key={index}   className="col-card">
            <div className="card-container">
                <Card>
                    <CardActionArea onClick={() => {navigate('/food-list/' + restaurant.restaurantId)}}>
                        {restaurant.restaurantPicture === null ? (
                            <CardMedia  component="img" height="140" src="/static/images/cards/contemplative-reptile.jpg" alt={restaurant.restaurantName}/>
                        ) : (
                            <CardMedia component="img" height="250" width="100%" sx={{ objectFit: "cover" }} src={restaurant.restaurantPicture} alt={restaurant.restaurantName}/>
                        )}
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {restaurant.restaurantName}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        </Col>
    );
}
export default RestaurantCard;