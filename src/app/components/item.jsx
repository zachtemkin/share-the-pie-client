import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Description = styled.p``;
const Price = styled.p``;

const ItemWrapper = styled.li`
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);

  &.isChecked {
    color: rgba(0, 0, 0, 1);
    background: rgba(255, 255, 255, 0.5);
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
        x='1.89948'
        y='1'
        width='22'
        height='22'
        rx='5'
        stroke='white'
        strokeWidth='2'
      />
    </svg>
  );
};

const CheckBoxChecked = () => {
  return (
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.899475 6C0.899475 2.68629 3.58577 0 6.89948 0H18.8995C22.2132 0 24.8995 2.68629 24.8995 6V18C24.8995 21.3137 22.2132 24 18.8995 24H6.89948C3.58577 24 0.899475 21.3137 0.899475 18V6ZM5.76172 13.5107C5.14247 12.8914 5.14247 11.8874 5.76172 11.2682C6.38098 10.6489 7.38499 10.6489 8.00425 11.2682L10.9366 14.2006L17.9793 7.15788C18.5986 6.53863 19.6026 6.53863 20.2219 7.15788C20.8411 7.77714 20.8411 8.78115 20.2219 9.40041L12.0591 17.5632C11.4896 18.1327 10.5947 18.1784 9.97296 17.7005C9.9151 17.6568 9.85956 17.6085 9.80682 17.5558L5.76172 13.5107Z'
        fill='white'
      />
    </svg>
  );
};

const Item = ({ item, handleClick }) => {
  return (
    <ItemWrapper
      onClick={handleClick}
      className={`${item.isChecked && "isChecked"} ${
        item.isChecked && !item.isCheckedByMe && "isNotCheckedByMe"
      }`}>
      {item.isChecked ? <CheckBoxChecked /> : <CheckBoxUnchecked />}

      <Description>{item.description}</Description>
      <Price>{item.price}</Price>
    </ItemWrapper>
  );
};

export default Item;
