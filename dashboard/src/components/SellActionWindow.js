import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import authAxios from "../utils/auth";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [isLoadingHolding, setIsLoadingHolding] = useState(true);
  const [isSelling, setIsSelling] = useState(false);
  const { closeSellWindow } = useContext(GeneralContext);

  // Get user's available holding quantity
  useEffect(() => {
    const fetchHolding = async () => {
      try {
        setIsLoadingHolding(true);
        const response = await authAxios.get(`/holding/${uid}`);
        const qty = Number(response.data.qty) || 0;
        setAvailableQuantity(qty);

        // If user owns something, default sell quantity to 1.
        // If user owns nothing, set quantity to 0.
        if (qty > 0) {
          setStockQuantity(1);
        } else {
          setStockQuantity(0);
        }
      } catch (error) {
        console.error("Error fetching holding:", error);
        setAvailableQuantity(0);
        setStockQuantity(0);
      } finally {
        setIsLoadingHolding(false);
      }
    };

    fetchHolding();
  }, [uid]);

  // Quantity change
  const handleQuantityChange = (e) => {
    let quantity = Number(e.target.value);
    if (quantity < 0) {
      quantity = 0;
    }
    // Don't allow quantity greater than available
    if (quantity > availableQuantity) {
      quantity = availableQuantity;
    }
    setStockQuantity(quantity);
  };

  // SELL
  const handleSellClick = async () => {
    if (availableQuantity <= 0) {
      alert(`You don't own any ${uid} shares.`);
      return;
    }
    if (stockQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (stockQuantity > availableQuantity) {
      alert(`You can sell a maximum of ${availableQuantity} shares.`);
      return;
    }
    if (stockPrice <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setIsSelling(true);
      const response = await authAxios.post("/newOrder", {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "SELL",
      });

      const realizedPnl = Number(response.data.realizedPnl || 0);
      alert(`SELL order placed for ${uid}\nRealized P&L: ₹${realizedPnl.toFixed(2)}`);
      closeSellWindow();
    } catch (error) {
      console.error("Error placing sell order:", error);
      alert(error.response?.data?.message || "Failed to place SELL order");
    } finally {
      setIsSelling(false);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  // UI
  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="header">
          <h3>{uid}</h3>
          <div className="market-options">SELL Order</div>
        </div>
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="0"
              max={availableQuantity}
              value={stockQuantity}
              disabled={isLoadingHolding || availableQuantity === 0}
              onChange={handleQuantityChange}
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

        {/* Available quantity */}
        <div className="options">
          {isLoadingHolding ? (
            <span>Checking holdings...</span>
          ) : (
            <span>Available: {availableQuantity}</span>
          )}
        </div>
        {availableQuantity === 0 && !isLoadingHolding && (
          <p className="loss">You don't own any {uid} shares.</p>
        )}
      </div>
      <div className="buttons">
        <span>
          Margin required ₹{(Number(stockQuantity) * Number(stockPrice)).toFixed(2)}
        </span>
        <div>
          <Link
            className="btn btn-red"
            onClick={isSelling || availableQuantity === 0 ? undefined : handleSellClick}
          >
            {isSelling ? "Selling..." : "Sell"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
