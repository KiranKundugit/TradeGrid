import React, { useState, useEffect, useContext } from "react";
import authAxios from "../utils/auth";
import { getUsername } from "../utils/auth";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnutChart";
import { watchlist } from "../data/data";
import "./AnalyticsOverlay.css";


const STARTING_BALANCE = 100000;

const analyticsChartLabels = watchlist.map((stock) => stock.name);
const analyticsChartData = {
  labels: analyticsChartLabels,
  datasets: [
    {
      label: "Price",
      data: watchlist.map((stock) => stock.price),
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
        "rgba(255, 159, 64, 0.5)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const formatAmount = (num) => {
  const isNegative = num < 0;
  const abs = Math.abs(num);
  const formatted =
    abs >= 1000
      ? abs.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : abs.toFixed(2);
  return (isNegative ? "-" : "") + formatted;
};

const Summary = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = getUsername();
  const { isAnalyticsOpen, closeAnalytics } = useContext(GeneralContext);

  useEffect(() => {
    authAxios
      .get("/allHoldings")
      .then((res) => {
        setAllHoldings(res.data);
      })
      .catch((error) => {
        console.error("Error fetching holdings for summary:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const totalPnl = currentValue - totalInvestment;
  const totalPnlPercent =
    totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

  const marginsUsed = totalInvestment;
  const marginAvailable = STARTING_BALANCE - marginsUsed;

  return (
    <div style={{ position: "relative" }}>
      {isAnalyticsOpen && (
        <div className="analytics-overlay">
          <div className="analytics-overlay-header">
            <p>Watchlist Analytics</p>
            <span onClick={closeAnalytics}>✕</span>
          </div>
          <div className="analytics-overlay-chart">
            <DoughnutChart data={analyticsChartData} />
          </div>
        </div>
      )}

      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>{formatAmount(marginAvailable)}</h3>
            <p>Margin available</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Margins used <span>{formatAmount(marginsUsed)}</span>{" "}
            </p>
            <p>
              Opening balance <span>{formatAmount(STARTING_BALANCE)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({loading ? "..." : allHoldings.length})</p>
        </span>
        <div className="data">
          <div className="first">
            <h3 className={totalPnl >= 0 ? "profit" : "loss"}>
              {formatAmount(totalPnl)}{" "}
              <small>
                {totalPnl >= 0 ? "+" : ""}
                {totalPnlPercent.toFixed(2)}%
              </small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Current Value <span>{formatAmount(currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{formatAmount(totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </div>
  );
};

export default Summary;
