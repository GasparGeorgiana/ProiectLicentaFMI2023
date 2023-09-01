import React, {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {useAuth} from "../Authentication/Auth";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
const ConfirmedOrders = () => {
    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState([]);
    const [hasMore,setHasMore]=useState(true);
    const {isAuthenticated,navigate,bearerToken} = useAuth();
    const headers = { 'Authorization': 'Bearer '+bearerToken };
    useEffect(() => {
        if (!isAuthenticated)
            navigate("/home",{ replace: true });
    },[isAuthenticated]);
    useEffect(() => {
        async function fetchData() {
            if(bearerToken!=='') {
                const response = await fetch("https://localhost:7143/Order/GetConfirmedOrders?page=1", {headers}).then((response) => response.json());
                if (response.length>0)
                    setOrders(response)
                else
                    setHasMore(false)
            }
        }
        fetchData();
    }, [bearerToken]);
    const fetchMoreData = async () => {
        if (bearerToken !== '') {
            const response = await fetch(
                "https://localhost:7143/Order/GetConfirmedOrders?page=" + (page + 1), {headers}).then((response) => response.json())
            if (response.length>0)
                setOrders(current => [...current, ...response])
            else
                setHasMore(false)

        }
        setPage(page + 1);
    };
    async function finalizeOrder(orderId) {
        const response = await fetch(
            "https://localhost:7143/Order/FinalizeOrder?orderId=" + orderId, {headers}).then((response) => response.json())
        if(response)
            window.location.reload()
    }
    return (
        <div>
            <h1>Confirmed Orders</h1>
            <hr />
            <InfiniteScroll
                dataLength={orders.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            >
                {orders.map(order => (
                    <Card>
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            height="140"
                            src={order.restaurantPicture}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {order.restaurantName}
                            </Typography>
                            {order.foods.map(food => (
                                <Typography variant="body2" color="text.secondary">
                                    {food.foodName}  {food.foodPrice} Lei x {food.quantity}
                                </Typography>
                            ))}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => {finalizeOrder(order.orderId)}}>Finalizeaza Comanda</Button>
                        </CardActions>
                    </Card>
                ))}
            </InfiniteScroll>
        </div>
    );
}
export default ConfirmedOrders;