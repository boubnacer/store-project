import asyncHandler from "../middlewares/asyncHandler.js";
import Category from "../models/categoryModel.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name.trim()) {
      return res.json({ error: "Name is required" });
    }

    const existCate = await Category.findOne({ name });

    if (existCate) return res.json({ error: "Category already exists" });

    const newCategory = await new Category({ name }).save();

    res.json(newCategory);
  } catch (error) {
    return res.status(400).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) return res.status(404).json({ error: "Category not found" });

    category.name = name;

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const existCate = await Category.findOne({ _id: categoryId });

    if (!existCate)
      return res.status(404).json({ error: "Category not found" });

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    if (!categories)
      return res.status(404).json({ message: "Categories list empty" });

    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  readCategory,
};
