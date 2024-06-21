import mongoose from "mongoose";
const DOCUMENTATION_COLLECTION = "documentation";

const documentationSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  obligatorio: { type: Boolean, required: true, default: true },
});
const documentationModel = mongoose.model(
  DOCUMENTATION_COLLECTION,
  documentationSchema
);

export default documentationModel;
