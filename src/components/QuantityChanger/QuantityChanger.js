import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { fetchFromApi } from "../../api_utils/api.utils";
import Button from "../Button/Button";

// Set const API url
const apiUrl = "/api/product/check";

const QuantityChanger = ({ min, max, isBlocked, pid, price, updateCart }) => {
  const [quantity, setQuantity] = useState(min || 1);
  const [minusDisabled, setMinusDisabled] = useState(false);
  const [plusDisabled, setPlusDisabled] = useState(false);
  const [apiStatus, setApiStatus] = useState({});

  // Increment product quantity. Unlock opposite button if it's blocked
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
    if (minusDisabled) setMinusDisabled(false);
  };
  // Decrement product quantity. Unlock opposite button if it's blocked
  const decrementQuantity = () => {
    setQuantity(quantity - 1);
    if (plusDisabled) setPlusDisabled(false);
  };
  // Set object to post API. Fetch to check if quantity is correct
  const checkQuantity = (quantity) => {
    const postObject = {
      method: "POST",
      body: JSON.stringify({
        pid: pid,
        quantity: quantity,
      }),
    };
    fetchFromApi(apiUrl, setApiStatus, postObject);
  };
  // Debounce function to reduce API calls
  const debaunceApiCall = useCallback(
    debounce((quantity) => checkQuantity(quantity), 1000),
    []
  );

  useEffect(() => {
    // Call API to check if quantity is correct
    debaunceApiCall(quantity);
    // Update products in cart
    updateCart(pid, quantity, price);

    // Check if min or max limit has been reached -> if yes, disable button
    if (quantity === max) setPlusDisabled(true);
    else if (quantity === min || quantity === 0) setMinusDisabled(true);
  }, [quantity]);

  useEffect(() => {
    // If API quantity error occurs and min exist, set quantity to min value
    if (
      apiStatus?.isError &&
      apiStatus?.errorType === "INCORRECT_QUANTITY" &&
      min
    )
      setQuantity(min);
  }, [apiStatus]);

  return (
    <div className="quantity-changer">
      <span className="quantity-changer__status">
        Obecnie masz {quantity} sztuk produktu
      </span>
      <div className="quantity-changer__buttons">
        <Button
          slot="-"
          cssClass={`buttons__minus ${
            isBlocked || minusDisabled ? "disabled" : ""
          }`}
          isDisabled={isBlocked || minusDisabled}
          handleClick={decrementQuantity}
        />

        <Button
          slot="+"
          cssClass={`buttons__minus ${
            isBlocked || plusDisabled ? "disabled" : ""
          }`}
          isDisabled={isBlocked || plusDisabled}
          handleClick={incrementQuantity}
        />
      </div>
    </div>
  );
};

export default QuantityChanger;
