const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../model/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {type:"danger", message: "Email noto'g'ri" });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) console.log(err);
            if (isMatch) {
              done(null, user);
            } else {
              done(null, false, {type:"danger", message: "Parol xato" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
