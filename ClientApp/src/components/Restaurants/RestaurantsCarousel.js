import React from 'react';
import { Carousel, Card, Row, Col } from 'react-bootstrap';
import './RestaurantsCarousel.css';
import {Link} from "react-router-dom";

const RestaurantsCarousel = ({ restaurants }) => {
    const restaurantsChunks = chunkArray(restaurants, 3); 

    return (
        <Carousel interval={null} indicators={false} variant="dark">
            {restaurantsChunks.map((chunk, index) => (
                <Carousel.Item key={index}>
                    <Row>
                        {chunk.map((restaurant, innerIndex) => (
                            <Col key={innerIndex} sm={4}>
                                <Link className="link-to-restaurant" to={`/food-list/${restaurant.restaurantId}`}>
                                    <Card className="restaurant-card-carousel bg-transparent">
                                        {restaurant.restaurantPicture === null ? (
                                            <Card.Img variant="top"  alt={restaurant.restaurantName}/>
                                        ) : (
                                            <Card.Img variant="top" src={restaurant.restaurantPicture} alt={restaurant.restaurantName}/>
                                        )}
                                        <Card.Body className="restaurant-card-carousel-body">
                                            <Card.Title className="restaurant-card-carousel-title">{restaurant.restaurantName}</Card.Title>
                                            <Card.Text className="restaurant-card-carousel-text">
                                                <p>{restaurant.restaurantName}</p>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

// Helper function to split array into chunks
function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export default RestaurantsCarousel;
