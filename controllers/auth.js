const express = require("express");
const router = express.Router();
const mongoDB = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");
const sha1 = require("sha1");

const privateKeyJWT = "IJBuyfYTGFyitfTYFDtydfYIDFtdFRITUFtu";
const expiresTimeJWT = 86400;

const mongoDBConnectionString =
  "mongodb://root:root@localhost:27017?retryWrites=true&w=majority";

router.get("/login", async (req, res) => {
  const { email, password } = req.query;
  const sha1Password = sha1(password);

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
      if (sha1Password == userDB.password) {
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
