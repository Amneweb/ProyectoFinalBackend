import mongoose from "mongoose";
const CARTS_COLLECTION = "carts";

/*const cartSchema = new mongoose.Schema({
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
});
export const cartModel = mongoose.model(CARTS_COLLECTION, cartSchema);*/

const cartSchema = new mongoose.Schema({
  cart: {
    type: [
      {
        product: {
          type: String,
          required: true,
        },
        qty: { type: Number, default: 1 },
      },
    ],
    default: [],
  },
});
export const cartModel = mongoose.model(CARTS_COLLECTION, cartSchema);
