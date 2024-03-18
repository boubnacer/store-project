import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, image } =
      req.fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      !image ||
      !quantity
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newProduct = new Product({ ...req.fields });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, quantity, brand, image } =
      req.fields;

    const existProduct = await Product.findById({ _id: id });

    if (!existProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !brand ||
      !image ||
      !quantity
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await updatedProduct.save(); // i guess we don't need this

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const existProduct = await Product.findById(req.params.id);

    if (!existProduct)
      return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? {
          name: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    if (!products.length)
      return res.status(404).json({ message: "No product found" });

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category") // category details not just id
      .limit(12)
      .sort({ createdAt: -1 });

    if (!products.length)
      return res.status(404).json({ message: "No product found" });

    res.json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(400).json({ message: "Not authorized" });

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "product not found" });

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed)
      return res.status(400).json({ message: "Product already reviewed" });

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const getFilteredProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log({ checked, radio });
    let args = {};

    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);

    console.log(products);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  getAllProducts,
  getSingleProduct,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  getFilteredProducts,
};
