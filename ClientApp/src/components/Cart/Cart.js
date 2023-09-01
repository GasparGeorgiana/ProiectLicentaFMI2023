import React from "react";
import styled from "styled-components";
import { Cookies } from 'react-cookie';
import {ConfirmButton, DialogFooter} from "../Food/FoodDialog";
import {useAuth} from "../Authentication/Auth";
 const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);
};
const StyledCart = styled.div`
  position: fixed;
  right: 0;
  top: 95px;
  width: 19%;
  background: cyan;
  height: calc(100% - 150px);
  z-index: 10;
  display: flex;
  flex-direction: column;
`;

const OrderContent = styled.div`
  padding: 20px;
  height: 100%;
  overflow: auto;
`;

const OrderContainer = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid grey;
`;

const OrderItem = styled.div`
  padding: 10px 0;
  display: grid;
  grid-template-columns: repeat(4, 10% 50% 20% 1fr);
  justify-content: space-between;
`;

const Cart = ({orders, setOrders, setOpenFood }) => {
    const cookies = new Cookies();
    const getOrderTotal = orders.reduce((total, orderItem) => {
        return total + orderItem.foodPrice*orderItem.quantity;
    }, 0);
    const {isAuthenticated,navigate,bearerToken} = useAuth();
    const total = getOrderTotal;

    const deleteItem = (index) => {
        const newOrders = [...orders];
        newOrders.splice(index, 1);
        setOrders(newOrders);
        fetch('https://localhost:7143/Cart/AddToCart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+bearerToken
            },
            body: JSON.stringify(
                {
                    orders: newOrders
                }
            )
        }).then(async res => {
            await res.json();
        });
        
    };
    const handleSubmit = () => {
        fetch('https://localhost:7143/Food/SubmitOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer '+bearerToken
            },
            body: JSON.stringify(
                {
                    orders: orders
                }
            )
        }).then(async res => {
            res = await res.json();
            if(res)
                setOrders([])
        })
        }
    return (
        <StyledCart>
            {orders.length === 0 ? (
                <OrderContent>Your Cart is Empty.</OrderContent>
            ) : (
                <OrderContent>
                    <OrderContainer>Items in Cart: {orders.length}</OrderContainer>
                    {orders.map((item, idx) => (
                        <OrderContainer key={item}>
                            <OrderItem
                                style={{ cursor: "pointer" }}
                                onClick={() => setOpenFood({ ...item, index: idx })}
                            >
                                <div>{idx + 1}</div>
                                <div>
                                    {item.foodName} | x{item.quantity}
                                </div>
                                <div
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(idx);
                                    }}
                                >
                                    <span>❌</span>
                                </div>
                                <div>{formatPrice(item.foodPrice)}</div>
                            </OrderItem>
                        </OrderContainer>
                    ))}
                    <OrderContainer>
                        <OrderItem>
                            <div>Total</div>
                            <div></div>
                            <div></div>
                            <div>{formatPrice(total)}</div>
                        </OrderItem>
                    </OrderContainer>
                </OrderContent>
            )}

            <DialogFooter>
                <ConfirmButton onClick={() => handleSubmit()}>Proceed to Checkout</ConfirmButton>
            </DialogFooter>
        </StyledCart>
    );
};

export default Cart;