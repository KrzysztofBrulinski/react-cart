import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { fetchFromApi } from "../../api_utils/api.utils";

const apiUrl = "/api/product/check";

const QuantityChanger = ({ min, max, isBlocked, pid }) => {
  const [quantity, setQuantity] = useState(1);
  const [minusDisabled, setMinusDisabled] = useState(false);
  const [plusDisabled, setPlusDisabled] = useState(false);
  const [apiCheck, setApiCheck] = useState();

  const incrementQuantity = () => {
    if (quantity < max || !max) {
      if (minusDisabled) setMinusDisabled(false);
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > min || !min) {
      if (plusDisabled) setPlusDisabled(false);
      setQuantity(quantity - 1);
    }
  };

  const checkQuantity = (quantity) => {
    const postObject = {
      method: "POST",
      body: JSON.stringify({
        pid: pid,
        quantity: quantity,
      }),
    };
    fetchFromApi(apiUrl, setApiCheck, postObject);
  };

  const debaunceApiCall = useCallback(
    debounce((quantity) => checkQuantity(quantity), 1000),
    []
  );

  useEffect(() => {
    // call API
    debaunceApiCall(quantity);
    // check if min or max limit has been reached
    if (quantity === max) setPlusDisabled(true);
    else if (quantity === min || quantity === 0) setMinusDisabled(true);
  }, [quantity]);

  useEffect(() => {
    // if api quantity error occurs and min exist, set quantity to min value
    const isQuantityError =
      apiCheck?.status === 406 && apiCheck?.statusText === "Not Acceptable";
    if (isQuantityError && min) setQuantity(min);
  }, [apiCheck]);

  return (
    <div className="quantity-changer">
      <span className="quantity-changer__status">
        Obecnie masz {quantity} sztuk produktu
      </span>
      <div className="quantity-changer__buttons">
        <button
          disabled={isBlocked || minusDisabled}
          className="buttons__minus"
          onClick={decrementQuantity}
        >
          -
        </button>
        <button
          disabled={isBlocked || plusDisabled}
          className="buttons__plus"
          onClick={incrementQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityChanger;
