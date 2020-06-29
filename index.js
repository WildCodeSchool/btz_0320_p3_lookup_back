require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const sequelize = require("./sequelize");
const carousel = require("./routes/carousel.route");
const product = require("./routes/product.route");
const lookup = require("./routes/lookup.route");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(express.json());

app.use("/carousels", carousel);
app.use("/products", product);
app.use("/admin", lookup);

app.get("/", (req, res) => {
  res.status(200).send("Here is our API!");
});

async function main() {
  try {
    await sequelize.sync({force:true});
    await sequelize.authenticate();
    console.log("Database succesfully joined");
    app.listen(PORT, (err) => {
      if (err) throw new Error(err.message);
      console.log(`Server is running on htpp://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Unable to join database", err.message);
  }
}

if (process.env.NODE_ENV !== "test") {
  main();
}

module.exports = app;
