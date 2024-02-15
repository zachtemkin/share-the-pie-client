import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Description = styled.p`
  font-weight: 580;
  margin-right: auto;
`;
const Price = styled.p``;

const ItemWrapper = styled.li`
  display: flex;
  flex-flow: row nowrap;
  font-size: 18px;
  align-items: center;
  line-height: 122%;
  justify-content: space-between;
  gap: 1rem;
  width: calc(100% - 2rem);
  margin-bottom: 0.75rem;
  width: 100%;
  padding: ${(props) => props.theme.surfacePadding};
  border-radius: ${(props) => props.theme.surfaceBorderRadius};
  background-color: ${(props) => props.theme.darkSurfaceColor};

  &.isChecked {
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 1);
  }

  &.isNotCheckedByMe {
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CheckBoxUnchecked = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <rect
        x='1'
        y='1'
        width='22'
        height='22'
        rx='5'
        stroke='rgba(255,255,255,0.4)'
        strokeWidth='2'
      />
    </svg>
  );
};

const CheckBoxChecked = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M0 6C0 2.68629 2.68629 0 6 0H18C21.3137 0 24 2.68629 24 6V18C24 21.3137 21.3137 24 18 24H6C2.68629 24 0 21.3137 0 18V6Z'
        fill='black'
      />
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M19.3224 7.1578C18.7031 6.53855 17.6991 6.53855 17.0799 7.1578L10.0371 14.2006L7.10479 11.2683C6.48554 10.649 5.48152 10.649 4.86227 11.2683C4.24301 11.8876 4.24301 12.8916 4.86227 13.5108L8.90736 17.5559C8.96581 17.6144 9.02768 17.6673 9.09233 17.7147C9.71324 18.1774 10.5959 18.1269 11.1596 17.5631L19.3224 9.40033C19.9416 8.78107 19.9416 7.77706 19.3224 7.1578Z'
        fill='white'
      />
    </svg>
  );
};

const Item = ({ item, handleClick }) => {
  const priceUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.price);

  return (
    <ItemWrapper
      onClick={handleClick}
      className={`${item.isChecked && "isChecked"} ${
        item.isChecked && !item.isCheckedByMe && "isNotCheckedByMe"
      }`}>
      {item.isChecked ? <CheckBoxChecked /> : <CheckBoxUnchecked />}

      <Description>{item.description}</Description>
      <Price>{priceUSD}</Price>
    </ItemWrapper>
  );
};

export default Item;
