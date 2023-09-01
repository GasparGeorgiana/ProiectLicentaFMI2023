import React from "react";
import styled from "styled-components";
const NavbarColor = "#2E4354";
const Title = styled.div`
  font-family: "Exo", sans-serif;
`;
const StyledQuantityInput = styled.input`
  font-size: 18px;
  width: 24px;
  text-align: center;
  border: none;
  outline: none;
`;

const IncrementContainer = styled(Title)`
  display: flex;
  height: 24px;
`;

const IncrementButton = styled.div`
  width: 23px;
  color: ${NavbarColor};
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  line-height: 23px;
  margin: 0 10px;
  border: 1px solid #f44336;
  ${({ disabled }) =>
    disabled &&
    `
  opacity: 0.5;
  pointer-events: none;
  `}
  &:hover {
    background-color: #ffe3e3;
  }
`;

const QuantityInput = ({ quantity }) => {
    return (
        <IncrementContainer>
            <div>Quantity:</div>
            <IncrementButton
                onClick={() => quantity.setValue(quantity.value - 1)}
                disabled={quantity.value === 1}
            >
                -
            </IncrementButton>
            <StyledQuantityInput {...quantity}></StyledQuantityInput>
            <IncrementButton onClick={() => quantity.setValue(quantity.value + 1)}>
                +
            </IncrementButton>
        </IncrementContainer>
    );
};

export default QuantityInput;