const tokenHelper = require("../helpers/token");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  tokenHelper.getToken(2, (responseToken) => {
    res.json({
      message: "Autenticado com sucesso!",
      token1: responseToken,
    });
  });
});

module.exports = router;
