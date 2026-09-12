const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  mode: { type: String, required: true, enum: ["BUY", "SELL"] },
  realizedPnl: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };