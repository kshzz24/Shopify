const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
// create Product -- Admin

exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
// get all Product

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
  // .pagination(resultPerPage);

  products = await apiFeature.query.clone();
  res.status(201).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(201).json({
    success: true,
    products,
  });
});

// get a single product

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  // console.log(product);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(201).json({
    success: true,
    product,
  });
});

//Admin
exports.updateProduct = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);
  // console.log(product);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  } else {
    //  images start here
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
});

// delete A Product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  let productToBeDeleted = await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product is Deleted",
  });
});

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id, // Assuming req.user._id contains the user ID of the reviewer.
    name: req.user.name, // Assuming req.user.name contains the name of the reviewer.
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  //  console.log(product);
  const isReviewed = product.Reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.Reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.Reviews.push(review);
    product.numOfReviews = product.Reviews.length;
  }

  // Calculate the average rating
  let avg = 0;
  product.Reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.Reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
  });
});

// get all reviews of a single product

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    Reviews: product.Reviews,
  });
});

// Delete a review

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  
  // Filter out the review to be deleted
  const updatedReviews = product.Reviews.filter((rev) => {
    return rev._id.toString() !== req.query.id.toString();
  });

  // Calculate the average rating after the review is deleted
  let avg = 0;
  updatedReviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;

  if (updatedReviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = updatedReviews.length;

  // Update the product with the modified reviews and review-related properties
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      Reviews: updatedReviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
   

  res.status(200).json({
    success: true,
    Reviews: updatedReviews,
  });
});
