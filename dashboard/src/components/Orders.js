import React, { useEffect, useState } from "react";
import authAxios from "../utils/auth";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authAxios.get("/allOrders");
        setAllOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Unable to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>
      {allOrders.length === 0 ? (
        <div className="orders">
          <div className="no-orders">
            <p>You haven't placed any orders yet</p>
          </div>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Value</th>
                <th>Realized P&L</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => {
                const orderValue = Number(order.qty) * Number(order.price);
                const realizedPnl = Number(order.realizedPnl) || 0;

                return (
                  <tr key={order._id}>
                    <td>
                      <span className={order.mode === "BUY" ? "profit" : "loss"}>
                        {order.mode}
                      </span>
                    </td>
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>₹{Number(order.price).toFixed(2)}</td>
                    <td>₹{orderValue.toFixed(2)}</td>
                    <td className={realizedPnl >= 0 ? "profit" : "loss"}>
                      {order.mode === "SELL" ? `₹${realizedPnl.toFixed(2)}` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Orders;
