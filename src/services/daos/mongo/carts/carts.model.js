import mongoose from "mongoose";
const CARTS_COLLECTION = "carts";
//mongoose.ObjectId.get((v) => (v == null ? v : v.toString()));
const cartSchema = new mongoose.Schema({
  cart: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        qty: { type: Number, default: 1 },
      },
    ],
    default: [],
  },
  createdAt: { type: Date, expires: 6000 },
});

export const cartModel = mongoose.model(CARTS_COLLECTION, cartSchema);
