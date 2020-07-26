const request = require("request");
const req = request.defaults();
const fs = require("fs");
const bancos = require("../helpers/bancos");
const jwt = require("jsonwebtoken");

const privateKeyJWT = "IJBuyfYTGFyitfTYFDtydfYIDFtdFRITUFtu";

const tokenHelper = {
  getToken: async (bancoId, callback) => {
    if (bancos.find((x) => x.id == bancoId)) {
      const urlAuth = `https://as${bancoId}.tecban-sandbox.o3bank.co.uk/token`;
      const keyPath = `./data/banco${bancoId}/certificate/client_private_key.key`;
      const certPath = `./data/banco${bancoId}/certificate/client_certificate.crt`;
      let tokenAuxiliar = "Basic ";

      if (bancoId == 1) {
        tokenAuxiliar +=
          "NmQ2MDc2MGYtMGQ2My00ODBjLTgzYzUtNGE1NzQxN2IzNTBlOjFmZjBmNzM2LWJiYWMtNDU3Zi1iZTUzLTYxNDEyMDM1NWMyZg==";
      } else if (bancoId == 2) {
        tokenAuxiliar +=
          "MjRjZTU4YTEtMDUxYS00MzBhLWE3OTAtMjU2OTM0NGI4ZjJmOjQ4MzQ4M2E3LWM4MjQtNDIxNS1iOGNmLTlkNjI1ZjQ3NjUwNw==";
      }

      req.post(
        {
          uri: urlAuth,
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: tokenAuxiliar,
          },
          form: {
            grant_type: "client_credentials",
            scope: "accounts openid",
          },
          rejectUnauthorized: false,
        },
        (error, response, body) => {
          if (error) {
            console.log("error => ", error);
            callback({
              ok: false,
              message: "Ocorreu um erro ao obter o token.",
            });
          }
          callback({
            ok: true,
            token: JSON.parse(body),
          });
        }
      );
    } else {
      callback({
        ok: false,
        token: null,
      });
    }
  },

  verifyJWT: (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(401)
        .json({ sucesso: false, message: "Por favor, informe o token." });
    jwt.verify(token, privateKeyJWT, function (err, decoded) {
      if (err)
        return res
          .status(401)
          .json({ sucesso: false, message: "Erro ao autenticar o token." });
      req.userId = decoded.id;
      next();
    });
  },
};

module.exports = tokenHelper;
