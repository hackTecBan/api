const bancos = require("../helpers/bancos");
const express = require("express");
const tokenHelper = require("../helpers/token");
const router = express.Router();

/* Endpoint para listar os bancos que
nossa API oferece suporte */
router.get("/listar", tokenHelper.verifyJWT, (req, res) => {
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
