import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getUsername, logout } from "../utils/auth";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);

  const username = getUsername();
  const initials =
    username
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropDownOpen(!isProfileDropDownOpen);
  };

  const menuClass = "menu";
  const activateMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="/media/images/TradeGridLogo.png" style={{ width: "160px" }} alt="TradeGrid logo" />
      <div className="menus">
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/" onClick={() => handleMenuClick(0)}>
              <p className={selectedMenu === 0 ? activateMenuClass : menuClass}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/orders" onClick={() => handleMenuClick(1)}>
              <p className={selectedMenu === 1 ? activateMenuClass : menuClass}>Orders</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings" onClick={() => handleMenuClick(2)}>
              <p className={selectedMenu === 2 ? activateMenuClass : menuClass}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/positions" onClick={() => handleMenuClick(3)}>
              <p className={selectedMenu === 3 ? activateMenuClass : menuClass}>Positions</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/funds" onClick={() => handleMenuClick(4)}>
              <p className={selectedMenu === 4 ? activateMenuClass : menuClass}>Funds</p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick} style={{ position: "relative" }}>
          <div className="avatar">{initials}</div>
          <p className="username">{username}</p>
          {isProfileDropDownOpen && (
            <div
              className="profile-dropdown"
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                background: "#fff",
                boxShadow: "0px 0px 6px 1px rgba(0,0,0,0.15)",
                borderRadius: "4px",
                padding: "10px 16px",
                zIndex: 10,
                whiteSpace: "nowrap",
              }}
            >
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
                style={{ margin: 0, cursor: "pointer", fontSize: "0.85rem" }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
