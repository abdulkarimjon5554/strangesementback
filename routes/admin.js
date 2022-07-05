var express = require("express");
const Product = require("../model/Product");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.render("./admin/index", { title: "Panel" });
});
router.get("/products", async function (req, res) {
  const products = await Product.find();
  console.log(products);
  res.render("./admin/pages/products", {
    title: "Panel",
    active: "products",
    products,
  });
});
router.get("/news", function (req, res) {
  res.render("./admin/pages/news", { title: "Panel", active: "news" });
});
router.get("/categories", function (req, res) {
  res.render("./admin/pages/categories", {
    title: "Panel",
    active: "categories",
  });
});
router.get("/partners", function (req, res) {
  res.render("./admin/pages/partners", { title: "Panel", active: "partners" });
});

module.exports = router;
