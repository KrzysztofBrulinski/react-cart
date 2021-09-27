import React, { useState, useEffect } from "react";
import "./App.css";
import QuantityChanger from "../QuantityChanger/QuantityChanger";
import { fetchFromApi } from "../../api_utils/api.utils";

const apiUrl = "/api/cart";
const currency = "zł";

const formatPrice = (price) => `${price.replace(".", ",")}${currency}`;

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFromApi(apiUrl, setProducts);
  }, []);

  return (
    <div className="container">
      <h3>Lista produktów</h3>
      <ul>
        {products?.map(({ pid, name, price, min, max, isBlocked }) => (
          <li key={pid} className="row">
            {name}, cena: {formatPrice(price)}
            <QuantityChanger {...{pid, min, max, isBlocked }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { App };
