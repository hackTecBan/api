const bancos = require("../helpers/bancos");
const tokenHelper = require("../helpers/token");
const express = require("express");
const router = express.Router();
const request = require("request");
const requestApi = request.defaults();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mongoDB = require("mongodb").MongoClient;

const userNameMongo = process.env.ME_CONFIG_MONGODB_ADMINUSERNAME;
const passwordMongo = process.env.ME_CONFIG_MONGODB_ADMINPASSWORD;
const port = 27017;
const uriHost = `mongo:${port}/?authSource=admin`;
const mongoDBConnectionString = `mongodb://${userNameMongo}:${passwordMongo}@${uriHost}`;

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
    request: "LISTAR_ATM",
    horario: new Date().toLocaleString(),
  });

  const { id } = req.query;

  if (id && bancos.find((x) => x.id == id)) {
    tokenHelper.getToken(id, (tokenResponse) => {
      if (tokenResponse.ok) {
        const { access_token, token_type, expires_in } = tokenResponse.token;
        const tokenAcesso = `${token_type} ${access_token}`;
        requestApi.get(
          {
            uri: `https://rs${id}.tecban-sandbox.o3bank.co.uk/open-banking/v2.3/atms`,
            key: fs.readFileSync(
              `./data/banco${id}/certificate/client_private_key.key`
            ),
            cert: fs.readFileSync(
              `./data/banco${id}/certificate/client_certificate.crt`
            ),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: tokenAcesso,
            },
            form: {
              grant_type: "client_credentials",
              scope: "accounts openid",
            },
            rejectUnauthorized: false,
          },
          function (error, response, body) {
            if (error) {
              res.json({
                sucesso: false,
                message: "Ocorreu um erro ao listar os ATMs.",
              });
            } else {
              res.json({
                sucesso: true,
                atms: JSON.parse(body),
              });
            }
          }
        );
      } else {
        res.json({
          sucesso: false,
          message: "Ocorreu um erro durante a autenticação",
        });
      }
    });
  } else if (id) {
    res.json({ sucesso: false, message: "Id do banco inválido!" });
  } else {
    res.json({ sucesso: false, message: "Id do banco é necessário!" });
  }
});

module.exports = router;
