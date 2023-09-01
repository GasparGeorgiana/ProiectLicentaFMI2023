import React from "react";
import styled from "styled-components";
import {useQuantity} from "../Hooks/useQuantity";
import QuantityInput from "./utils/QuantityInput";
import {useAuth} from "../Authentication/Auth";

const Title = styled.div`
  font-family: "Exo", sans-serif;
`;
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);
};

const FoodLabel = styled(Title)`
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
`;
const DialogShadow = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  background-color: black;
  opacity: 0.7;
  z-index: 4;
`;

const Dialog = styled.div`
  width: 500px;
  background-color: cyan;
  position: fixed;
  top: 75px;
  z-index: 5;
  max-height: calc(100% - 100px);
  left: calc(50% - 250px);
  display: flex;
  flex-direction: column;
`;

const DialogBanner = styled.div`
  min-height: 200px;
  margin-bottom: 20px;
  background: ${(p) => `url(${p.src})`};
  background-size: cover;
`;

export const ConfirmButton = styled.div`
  margin: 10px;
  color: #000;
  height: 20px;
  padding: 10px;
  text-align: center;
  width: 200px;
  cursor: pointer;
  background-color: transparent;
`;

const DialogBannerName = styled(FoodLabel)`
  top: 100px;
  font-size: 30px;
  padding: 5px 40px;
`;

const DialogContent = styled.div`
  min-height: 100px;
  padding: 0 40px 80px;
  overflow: auto;
`;

export const DialogFooter = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  background: #ffca33;
  box-shadow: 0 2px 20px 0 grey;
`;

const FoodDialogContainer = ({ openFood, setOpenFood, orders, setOrders, restaurantId }) => {
    const quantity = useQuantity(openFood && openFood.quantity);
    const isEditMode = openFood.index > -1;
    const {isAuthenticated,navigate,bearerToken} = useAuth();
    const closeDialog = () => {
        setOpenFood();
    };

    const order = {
        ...openFood,
        quantity: quantity.value,
        restaurantId: restaurantId
    };

    const addToOrder = () => {
        setOrders([...orders, order]);
        fetch('https://localhost:7143/Cart/AddToCart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+bearerToken
            },
            body: JSON.stringify(
                {
                    orders: [...orders, order]
                }
            )
        }).then(async res => {
            await res.json();
            closeDialog();
            
        });
    };

    const editOrder = () => {
        const newOrder = [...orders];
        newOrder[openFood.index] = order;
        setOrders(newOrder);
        fetch('https://localhost:7143/Cart/AddToCart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+bearerToken
            },
            body: JSON.stringify(
                {
                    orders: newOrder
                }
            )
        }).then(async res => {
            await res.json();
            closeDialog();

        });
    };
    

    return (
        <>
            <DialogShadow onClick={closeDialog} />
            <Dialog>
                <DialogBanner src={openFood.foodPicture}>
                    <DialogBannerName>{openFood.foodName}</DialogBannerName>
                </DialogBanner>
                <DialogContent>
                    <QuantityInput quantity={quantity} />
                </DialogContent>
                <DialogFooter>
                    <ConfirmButton onClick={isEditMode ? editOrder : addToOrder}>
                        {isEditMode ? `Update Cart` : `Add to Order`} |{" "}
                        {formatPrice(openFood.foodPrice)}
                    </ConfirmButton>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export const FoodDialog = (props) => {
    if (!props.openFood) return null;
    else return <FoodDialogContainer {...props} />;
};