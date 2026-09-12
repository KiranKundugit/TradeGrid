require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const authMiddleware = require("./middleware/auth");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// AUTH: SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Account created",
      token,
      userId: savedUser._id,
      username: savedUser.username,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({
      message: "Error creating account",
      error: error.message,
    });
  }
});

// AUTH: LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

// AUTH: CURRENT USER (used to keep the dashboard's displayed username in sync / verify the token)
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select(
      "username email"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({
      message: "Error fetching current user",
      error: error.message,
    });
  }
});

// DATA ROUTES — all scoped to req.userId via authMiddleware
app.get("/allHoldings", authMiddleware, async (req, res) => {
  let allHoldings = await HoldingsModel.find({ userId: req.userId });
  res.json(allHoldings);
});

app.get("/allPositions", authMiddleware, async (req, res) => {
  let allPositions = await PositionsModel.find({ userId: req.userId });
  res.json(allPositions);
});

app.get("/allOrders", authMiddleware, async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({ userId: req.userId }).sort({
      _id: -1,
    });
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const quantity = Number(qty);
    const orderPrice = Number(price);

    // Validate order
    if (!name) {
      return res.status(400).json({
        message: "Stock name is required",
      });
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }
    if (!Number.isFinite(orderPrice) || orderPrice <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
      });
    }
    if (mode !== "BUY" && mode !== "SELL") {
      return res.status(400).json({
        message: "Mode must be either BUY or SELL",
      });
    }

    // Find existing holding for THIS user only
    const existingHolding = await HoldingsModel.findOne({
      name,
      userId: req.userId,
    });

    // Find existing position for THIS user only — positions mirror
    // holdings here since this app doesn't distinguish intraday vs
    // delivery order types.
    const existingPosition = await PositionsModel.findOne({
      name,
      userId: req.userId,
    });

    // BUY ORDER
    if (mode === "BUY") {
      let updatedHolding;

      if (existingHolding) {
        // Existing holding
        const oldQty = existingHolding.qty;
        const oldAvg = existingHolding.avg;
        const newQty = oldQty + quantity;

        // Weighted average price
        const newAvg = (oldQty * oldAvg + quantity * orderPrice) / newQty;

        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        // Current/latest traded price
        existingHolding.price = orderPrice;

        updatedHolding = await existingHolding.save();
      } else {
        // No existing holding -> create new holding for this user
        const newHolding = new HoldingsModel({
          userId: req.userId,
          name: name,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });
        updatedHolding = await newHolding.save();
      }

      // Mirror the same BUY into this user's Positions
      if (existingPosition) {
        const oldQty = existingPosition.qty;
        const oldAvg = existingPosition.avg;
        const newQty = oldQty + quantity;
        const newAvg = (oldQty * oldAvg + quantity * orderPrice) / newQty;

        existingPosition.qty = newQty;
        existingPosition.avg = newAvg;
        existingPosition.price = orderPrice;
        await existingPosition.save();
      } else {
        const newPosition = new PositionsModel({
          userId: req.userId,
          product: "CNC",
          name: name,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });
        await newPosition.save();
      }

      // Save BUY order
      const newOrder = new OrdersModel({
        userId: req.userId,
        name: name,
        qty: quantity,
        price: orderPrice,
        mode: "BUY",
        realizedPnl: 0,
      });
      const savedOrder = await newOrder.save();

      return res.status(201).json({
        message: "BUY order saved and holding updated",
        order: savedOrder,
        holding: updatedHolding,
      });
    }

    // SELL ORDER
    if (mode === "SELL") {
      // No holding found
      if (!existingHolding) {
        return res.status(400).json({
          message: `You do not own any ${name} shares`,
        });
      }

      // Cannot sell more than owned
      if (quantity > existingHolding.qty) {
        return res.status(400).json({
          message: `Cannot sell ${quantity} shares. You only own ${existingHolding.qty} shares.`,
        });
      }

      // Calculate realized P&L
      const realizedPnl = (orderPrice - existingHolding.avg) * quantity;

      // Calculate remaining quantity
      const remainingQty = existingHolding.qty - quantity;
      let updatedHolding = null;

      // If all shares are sold
      if (remainingQty === 0) {
        await HoldingsModel.deleteOne({
          _id: existingHolding._id,
        });
      } else {
        // Some shares are still remaining
        existingHolding.qty = remainingQty;
        existingHolding.price = orderPrice;
        updatedHolding = await existingHolding.save();
      }

      // Mirror the same SELL into this user's Positions
      if (existingPosition) {
        if (remainingQty === 0) {
          await PositionsModel.deleteOne({ _id: existingPosition._id });
        } else {
          existingPosition.qty = remainingQty;
          existingPosition.price = orderPrice;
          await existingPosition.save();
        }
      }

      // Save SELL order
      const newOrder = new OrdersModel({
        userId: req.userId,
        name: name,
        qty: quantity,
        price: orderPrice,
        mode: "SELL",
        realizedPnl: realizedPnl,
      });
      const savedOrder = await newOrder.save();

      return res.status(201).json({
        message: "SELL order saved and holding updated",
        order: savedOrder,
        realizedPnl: realizedPnl,
        remainingQty: remainingQty,
        holding: updatedHolding,
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.get("/holding/:name", authMiddleware, async (req, res) => {
  try {
    const { name } = req.params;
    const holding = await HoldingsModel.findOne({
      name,
      userId: req.userId,
    });
    if (!holding) {
      return res.json({
        name: name,
        qty: 0,
        avg: 0,
        price: 0,
      });
    }
    res.json(holding);
  } catch (error) {
    console.error("Error fetching holding:", error);
    res.status(500).json({
      message: "Error fetching holding",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB connected!");
});
