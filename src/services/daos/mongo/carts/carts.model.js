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
});
/*
cartSchema.pre("find", function () {
  this.populate("cart.product", "title");
});
cartSchema.pre("findOne", function () {
  this.populate("cart.product", ["title", "thumb"]);
}); 

cartSchema.virtual("cart.productID").get(function () {
  return this.cart.product.toString();
});*/
//mongoose.ObjectId.get((v) => v.toString());

export const cartModel = mongoose.model(CARTS_COLLECTION, cartSchema);
