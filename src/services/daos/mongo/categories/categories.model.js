import mongoose from "mongoose";
const CATEGORIES_COLLECTION = "categories";

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
});
const categoriesModel = mongoose.model(CATEGORIES_COLLECTION, categorySchema);

export default categoriesModel;
