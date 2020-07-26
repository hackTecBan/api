const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const auth = require("./controllers/auth");
const banco = require("./controllers/banco");
const agencias = require("./controllers/agencias");
const atms = require("./controllers/atm");
const produtos = require("./controllers/produto");

const app = express();
const port = 3000;

app.set("port", process.env.PORT || port);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

/* Controllers da nossa API */
app.use("/auth", auth);
app.use("/banco", banco);
app.use("/agencia", agencias);
app.use("/atm", atms);
app.use("/produto", produtos);

app.listen(port, function () {
  console.log(`API rodando na porta: ${port}`);
});

module.exports = router;
