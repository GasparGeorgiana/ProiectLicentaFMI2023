import React from 'react';
import {Link} from "react-router-dom";
import {Card, Col} from "react-bootstrap";
import "./FoodCard.css";
import {CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";

const FoodCard = ({food: food, index, setOpenFood: setOpenFood}) => {
    return (
        <Col key={index}   className="col-card">
            <div className="card-container">
                    <Card>
                        <CardActionArea onClick={() => setOpenFood(food)}>
                        {food.foodPicture === null ? (
                            <CardMedia  component="img" height="140" src="/static/images/cards/contemplative-reptile.jpg" alt={food.foodName}/>
                        ) : (
                            <CardMedia component="img" height="250" width="100%" sx={{ objectFit: "cover" }} src={food.foodPicture} alt={food.foodName}/>
                        )}
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {food.foodName}
                            </Typography>
                        </CardContent>
                            </CardActionArea>
                    </Card>
            </div>
        </Col>
    );
}
export default FoodCard;