import React, { useState, useEffect } from "react";
import "./App.css";
import QuantityChanger from "../QuantityChanger/QuantityChanger";
import { fetchFromApi } from "../../api_utils/api.utils";

// Set const api url and currency
const apiUrl = "/api/cart";
const currency = "zł";

// Format price => change dot to comma, set always 2 decimal places after comma, add currency at the end
const formatPrice = (price) => {
  if (typeof price === "number") price = price.toFixed(2).toString();
  return `${price.replace(".", ",")}${currency}`;
};
// Round to dafault 2 decimal places. I used exponential notation to handle all cases.
const roundToDecimalPlaces = (num, decimalPlaces = 2) =>
  Number(Math.round(num + "e" + decimalPlaces) + "e-" + decimalPlaces);

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState(0);

  const updateCart = (pid, quantity, price) => {
    // Check if product exist in cart
    const productExist = cart.find((product) => product.pid === pid);

    // If product exist, update summary else set products in cart
    if (productExist) {
      setCart(
        cart.map((product) => {
          if (product.pid === pid)
            product.summary = roundToDecimalPlaces(quantity * price);
          return product;
        })
      );
    } else {
      const product = {
        pid: pid,
        summary: roundToDecimalPlaces(quantity * price),
      };
      setCart((oldCart) => [...oldCart, product]);
    }
  };

  // Update summary if cart products exist
  const updateSummary = () => {
    let summary = 0;
    if (cart?.length > 0)
      cart.forEach((product) => (summary = summary + product.summary));
    setSummary(roundToDecimalPlaces(summary));

    return summary;
  };

  // Fetch products list onMount
  useEffect(() => {
    fetchFromApi(apiUrl, setProducts);
  }, []);

  // If cart list change, update summary
  useEffect(() => {
    updateSummary();
  }, [cart]);

  return (
    <div className="container">
      <h3>Lista produktów</h3>
      <ul>
        {products?.map(({ pid, name, price, min, max, isBlocked }) => (
          <li key={pid} className="row">
            <span>
              {name}, cena: {formatPrice(price)}
            </span>
            <QuantityChanger
              {...{ pid, min, max, isBlocked, price, updateCart }}
            />
          </li>
        ))}
      </ul>
      <div>
        <h3>Suma: {formatPrice(summary)}</h3>
      </div>
    </div>
  );
};

export { App };
