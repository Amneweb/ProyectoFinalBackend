import mongoose from "mongoose";
const CARTS_COLLECTION = "carts";

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
});

cartSchema.pre("find", function () {
  this.populate("cart.product", "title");
});
cartSchema.pre("findOne", function () {
  this.populate("cart.product", ["title", "thumb"]);
});
export const cartModel = mongoose.model(CARTS_COLLECTION, cartSchema);
