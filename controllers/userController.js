const { check, validationResult } = require("express-validator");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.register_get =  (req, res, ) => {
  res.render("pages/register", { active: "reg" });
}

exports.register_post = {
  validation: [
    check("name")
      .isLength({ min: 3, max: 50 })
      .withMessage(
        "Ism 3 ta belgidan kam yoki 50 belgidan ko'p bo'lmasligi kerak"
      )
      .trim(),
    check("email").isEmail().withMessage("Noto'g'ri email").normalizeEmail(),
    check("password")
      .isLength({ min: 8, max: 15 })
      .withMessage("Parol 8-15 belgi oralig'ida bo'lishi kerak")
      .matches(/\d/)
      .withMessage("Your password should have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Parol maxsus @#$%^^% ishtirok etishi kerak"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        console.log(req.body.password, req.body.confirmPassword);
        throw new Error("confirm password does not match");
      }
      return true;
    }),
  ],
  handler: async (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    const hasError = !errors.isEmpty();
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      const errorsTokeys = [
        {
          value: "",
          msg: "Noto'g'ri email",
          param: "email",
          location: "body",
        },
      ];
      console.log(errorsTokeys);
      return res.render("./pages/register", {
        title: "Ro'yxatdan o'tishda hato",
        errors: errorsTokeys,
        name,
        password,
      });
    }

    if (hasError) {
      console.log({ errors: errors.errors });
      return res.render("pages/register", {
        errors: errors.errors,
        name,
        email,
        password,
      });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      console.log(user);
      bcrypt.genSalt(10, (err, pass) => {
        if (err) console.log(err);
        bcrypt.hash(user.password, pass, (err, hash) => {
          user.password = hash;
          user.save((err) => {
            if (err) console.log(err);
            else {
              req.flash("success", "Ro'yxatdan o'tdingiz");
              res.redirect("/login");
            }
          });
        });
      });
    }
  },
};

exports.login_get = (req, res) => {
  res.render("pages/login");

}
exports.login_post = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};
