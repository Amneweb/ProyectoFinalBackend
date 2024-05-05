import mongoose from "mongoose";
const TICKETS_COLLECTION = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    order: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          qty: { type: Number, default: 1 },
        },
      ],
      required: true,
    },
  },
  { timestamps: { createdAt: "purchase_datetime" } }
);
ticketSchema.pre("find", function () {
  this.populate("order.product", ["title", "price"]);
});
export const ticketModel = mongoose.model(TICKETS_COLLECTION, ticketSchema);
