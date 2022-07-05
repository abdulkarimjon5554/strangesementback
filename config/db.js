const mongoose = require("mongoose");
exports.connectDB = async () => {
  await mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB bazasiga ulandi");
  })
  .catch((error) => {
      console.log("Ma'lumot bazasiga ulanishda hatolik bor.");
      console.log(error);
      process.exit(1)
  })
};
