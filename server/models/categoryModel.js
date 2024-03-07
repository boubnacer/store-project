import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    // _id: Object,
    type: String,
    required: true,
    trim: true,
    maxLength: 32,
    unique: true,
  },
});

export default mongoose.model("Category", categorySchema);
