import mongoose from "mongoose";
import mongoosePagination from "mongoose-paginate-v2";
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
  code: {
    type: String,
    required: [true, "El código de producto es requerido"],
    unique: true,
  },
  stock: typeNumberRequired,
  description: typeStringRequired,
  st: { type: Boolean, required: true, default: true },
  category: Array,
  thumb: Array,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});
productSchema.plugin(mongoosePagination);
const productModel = mongoose.model(PRODUCTS_COLLECTION, productSchema);

export default productModel;
