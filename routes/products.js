const express = require("express");
const Product = require("../model/Product");
const router = express.Router();
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

// Upload functions

const image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/products/");
  },
  filename: function (req, file, cb) {
    const image_fileName = Date.now() + file.originalname.split(" ").join("-");
    cb(null, `${image_fileName}`);
  },
});

const upload = multer({ storage: image_storage });
const multiUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "image5", maxCount: 1 },
  { name: "image6", maxCount: 1 },
  { name: "image7", maxCount: 1 },
]);

router.get("/products", async (req, res) => {
  res.render("products");
});

router.get("/products/add", async (req, res) => {
  res.render("pages/add-product");
});

router.post(
  "/products/add",
  multiUpload,
  [
    check("nameuz")
      .isLength({ min: 3, max: 150 })
      .withMessage("Nomini kiriting."),
    check("fulltextuz")
      .isLength({ min: 3, max: 150 })
      .withMessage("Ma'lumot kiriting."),
    check("price")
      .isNumeric({ min: 0, max: 150 })
      .withMessage("Narxini kiriting."),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    let hasError = !errors.isEmpty();
    /////Images upload
    const imagesArr = [];
    if (req.files["image1"]) imagesArr.push(req.files["image1"]["0"]);
    if (req.files["image2"]) imagesArr.push(req.files["image2"]["0"]);
    if (req.files["image3"]) imagesArr.push(req.files["image3"]["0"]);
    if (req.files["image4"]) imagesArr.push(req.files["image4"]["0"]);
    if (req.files["image5"]) imagesArr.push(req.files["image5"]["0"]);
    if (req.files["image6"]) imagesArr.push(req.files["image6"]["0"]);
    if (req.files["image7"]) imagesArr.push(req.files["image7"]["0"]);
    if (imagesArr.length === 0) {
      let imgError = {
        value: "",
        msg: "Rasm Yuklanmadi",
        param: "image1",
        location: "body",
      };
      errors.errors.push(imgError);
      console.log("Array is empty");
    }

    if (hasError) {
      // / Images delete
      if (imagesArr) {
        for (let i = 0; i < imagesArr.length; i++) {
          let pathh = path.join(
            __dirname,
            `../public/images/products/${imagesArr[i].filename}`
          );
          if (fs.existsSync(pathh)) {
            fs.unlink(path.join(pathh), (err) => {
              if (err) console.log(err);
              console.log("Fotosurat o'chirildi");
            });
          }
        }
      }
      console.log({ errors: errors.errors });
      return res.render("pages/add-product", {
        errors: errors.errors,
      });


    }else{

    }
    const {
      nameuz,
      nameru,
      nameen,
      fulltextuz,
      fulltextru,
      fulltexten,
      price,
    } = req.body;

    const product = new Product({
      name: {
        uz: nameuz,
        ru: nameru ? nameru : nameuz,
        en: nameen ? nameen : nameuz,
      },
      image: imagesArr,
      fulltext: {
        uz: fulltextuz,
        ru: fulltextru ? fulltextru : fulltextuz,
        en: fulltexten ? fulltexten : fulltextuz,
      },
      price: price,
    });
    console.log(product);
    product.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Mahsulot qo'shildi.");
        req.flash("success", "Mahsulot yaratildi");
        res.redirect("/admin/products");
      }
    });
  }
);

router.get("/products/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("./pages/add-product", { product, edit: true });
});

//Edit function
router.post(
  "/products/edit/:id",
  multiUpload,
  [
    check("nameuz")
      .isLength({ min: 3, max: 150 })
      .withMessage("Nomini kiriting."),
    check("fulltextuz")
      .isLength({ min: 3, max: 150 })
      .withMessage("Ma'lumot kiriting."),
    check("price")
      .isNumeric({ min: 0, max: 150 })
      .withMessage("Narxini kiriting."),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    let hasError = !errors.isEmpty();
    /////Images upload

    if (hasError) {

      console.log({ errors: errors.errors });
      return res.render("pages/add-product", {
        errors: errors.errors,
        edit: true,
      });
    }
    const products = await Product.findById(req.params.id);
    console.log({ productsImage: products["image"] });
    const imagesArr = [...products["image"]];
    console.log(imagesArr);
    // req.files["image1"]["0"] kerak bo'ladi
    for (let i = 0; i < 7; i++) {
            /// Images delete
      if (req.files[`image${i + 1}`]) {
        if (imagesArr.length >= i) {
          imagesArr[i] = req.files[`image${i + 1}`]["0"];
          let pathh = path.join(
            __dirname,
            `../public/images/products/${products["image"][i]}`
          );

          if (fs.existsSync(pathh)) {
            fs.unlink(path.join(pathh), (err) => {
              if (err) console.log(err);
              console.log("Fotosurat o'chirildi");
            });
          }
          console.log(pathh + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasasasasasaaaaaaaaaaaaaaaaa");
        } else {
          imagesArr.push(req.files[`image${i + 1}`]["0"]);
        }
      }
    }
    
    const product = {};
    product.image = imagesArr;
    const {
      nameuz,
      nameru,
      nameen,
      fulltextuz,
      fulltextru,
      fulltexten,
      price,
    } = req.body;

    try {
      product.name = {
        uz: nameuz,
        ru: nameru,
        en: nameen,
      };
      product.fulltext = {
        uz: fulltextuz,
        ru: fulltextru,
        en: fulltexten,
      };
      product.price = price;

      await Product.findByIdAndUpdate(req.params.id, product);
      req.flash("success", "Mahsulot yangilandi");
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  }
);

/////delete function
router.get("/products/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await Product.findByIdAndDelete(req.params.id);
    if (product.image) {
      for (let i = 0; i < product.image.length; i++) {
        let pathh = path.join(
          __dirname,
          `../public/images/products/${product.image[i]}`
        );
      
        if (fs.existsSync(pathh)) {
          fs.unlink(path.join(pathh), (err) => {
            if (err) console.log(err);
            console.log("Fotosurat o'chirildi");
          });
        }
      }

      req.flash("success", "Mahsulot o'chirildi");
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/products/:id", async (req, res) => {
  res.render("product-id");
});

module.exports = router;
