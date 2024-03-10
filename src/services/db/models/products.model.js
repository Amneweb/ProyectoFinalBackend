import mongoose from "mongoose";
const PRODUCTS_COLLECTION = "products";
const typeStringRequired = {
  type: String,
  required: true,
};
const typeNumberRequired = {
  type: Number,
  required: true,
};
const productSchema = new mongoose.Schema({
  title: typeStringRequired,
  price: typeNumberRequired,
  code: { type: String, required: true, unique: true },
  stock: typeNumberRequired,
  description: typeStringRequired,
  st: { type: Boolean, required: true, default: true },
  category: Array,
  thumb: Array,
});
const productModel = mongoose.model(PRODUCTS_COLLECTION, productSchema);

export default productModel;
