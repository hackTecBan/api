const express = require("express");
const router = express.Router();
const mongoDB = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");

const userNameMongo = process.env.ME_CONFIG_MONGODB_ADMINUSERNAME;
const passwordMongo = process.env.ME_CONFIG_MONGODB_ADMINPASSWORD;
const port = 27017;
const uriHost = `mongo:${port}/?authSource=admin`;
const mongoDBConnectionString = `mongodb://${userNameMongo}:${passwordMongo}@${uriHost}`;

const privateKeyJWT = "IJBuyfYTGFyitfTYFDtydfYIDFtdFRITUFtu";
const expiresTimeJWT = 86400;

router.get("/login", async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    res.json({
      sucesso: false,
      message: "Necessário informar email e senha",
    });
  } else {
    const client = await new mongoDB.connect(mongoDBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("HackathonTecban");
    const collection = db.collection("User");
    const userDB = await collection.findOne({ email: email });

    if (!userDB) {
      res.json({
        sucesso: false,
        message: "Usuário ou senha incorretos",
      });
    } else {
      if (password == userDB.password) {
        const token = jwt.sign(userDB, privateKeyJWT, {
          expiresIn: expiresTimeJWT,
        });

        res.json({
          sucesso: true,
          token: token,
        });
      } else {
        res.json({
          sucesso: false,
          message: "Usuário ou senha incorretos",
        });
      }
    }
  }
});

module.exports = router;
