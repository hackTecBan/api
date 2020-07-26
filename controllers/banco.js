const bancos = require("../helpers/bancos");
const express = require("express");
const tokenHelper = require("../helpers/token");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoDB = require("mongodb").MongoClient;

const userNameMongo = process.env.ME_CONFIG_MONGODB_ADMINUSERNAME;
const passwordMongo = process.env.ME_CONFIG_MONGODB_ADMINPASSWORD;
const port = 27017;
const uriHost = `mongo:${port}/?authSource=admin`;
const mongoDBConnectionString = `mongodb://${userNameMongo}:${passwordMongo}@${uriHost}`;

/* Endpoint para listar os bancos que
nossa API oferece suporte */
router.get("/listar", tokenHelper.verifyJWT, async (req, res) => {
  const token = req.headers["x-access-token"];
  const privateKeyJWT = "IJBuyfYTGFyitfTYFDtydfYIDFtdFRITUFtu";
  const user = jwt.verify(token, privateKeyJWT);
  const client = await new mongoDB.connect(mongoDBConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("HackathonTecban");
  const collection = db.collection("UserConsume");
  collection.insertOne({
    user: user,
    request: "LISTAR_BANCO",
    horario: new Date().toLocaleString(),
  });

  const { id } = req.query;

  if (id) {
    const banco = bancos.find((x) => x.id == id);

    if (!banco) {
      res.json({
        sucesso: false,
        message: "Banco não cadastrado",
      });
    } else {
      res.json({
        sucesso: true,
        conteudo: banco,
      });
    }
  } else {
    res.json({
      sucesso: true,
      bancos: bancos,
    });
  }
});

module.exports = router;
