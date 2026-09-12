import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import authAxios from "../utils/auth";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const { closeBuyWindow } = useContext(GeneralContext);

  const handleBuyClick = async () => {
    if (stockQuantity <= 0 || stockPrice <= 0) {
      alert("Please enter a valid quantity and price.");
      return;
    }

    try {
      setIsLoading(true);
      await authAxios.post("/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
      });
      alert(`BUY order placed for ${uid}`);
      closeBuyWindow();
    } catch (error) {
      console.error("Error placing buy order:", error);
      alert(error.response?.data?.message || "Failed to place BUY order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>
      <div className="buttons">
        <span>
          Margin required ₹{(Number(stockQuantity) * Number(stockPrice)).toFixed(2)}
        </span>
        <div>
          <Link className="btn btn-blue" onClick={isLoading ? undefined : handleBuyClick}>
            {isLoading ? "Buying..." : "Buy"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
