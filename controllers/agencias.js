const bancos = require("../helpers/bancos");
const tokenHelper = require("../helpers/token");
const express = require("express");
const router = express.Router();
const request = require("request");
const requestApi = request.defaults();
const fs = require("fs");

router.get("/listar", tokenHelper.verifyJWT, (req, res) => {
  const { id } = req.query;

  if (id && bancos.find((x) => x.id == id)) {
    tokenHelper.getToken(id, (tokenResponse) => {
      if (tokenResponse.ok) {
        const { access_token, token_type, expires_in } = tokenResponse.token;
        const tokenAcesso = `${token_type} ${access_token}`;
        requestApi.get(
          {
            uri: `https://rs${id}.tecban-sandbox.o3bank.co.uk/open-banking/v2.3/branches`,
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
                message: "Ocorreu um erro ao listar as agências.",
              });
            } else {
              res.json({
                sucesso: true,
                agencias: JSON.parse(body),
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
