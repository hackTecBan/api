const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const auth = require("./controllers/auth");
const banco = require("./controllers/banco");
const agencias = require("./controllers/agencias");

const app = express();
const port = 3000;

app.set("port", process.env.PORT || port);

app.use(bodyParser.json());

app.listen(port, function () {
  console.log(`API rodando na porta: ${port}`);
});

app.use("/auth", auth);
app.use("/banco", banco);
app.use("/agencias", agencias);

module.exports = router;

// var request = require("request");
// var req = request.defaults();
// var fs = require("fs");

// req.post(
//   {
//     uri: "https://as1.tecban-sandbox.o3bank.co.uk/token",
//     key: fs.readFileSync("../TPP223/Banco_1/certs/client_private_key.key"),
//     cert: fs.readFileSync("../TPP223/Banco_1/certs/client_certificate.crt"),
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization:
//         "Basic YWMyY2M2ZDctY2RiOC00NjZhLTg0ZmEtNzRmMTRkNDFiYzEyOjYwZmM3MjE5LTQ3MGYtNGVhZS04YzAxLTJkNTU4NWUxNzM2MQ==",
//     },
//     form: {
//       grant_type: "client_credentials",
//       scope: "accounts openid",
//     },
//     rejectUnauthorized: false,
//   },
//   function (error, response, body) {
//     body = JSON.parse(body);

//     const { access_token, token_type, expires_in } = body;

//     req.get(
//       {
//         uri:
//           "https://rs1.tecban-sandbox.o3bank.co.uk/open-banking/v2.3/branches",
//         key: fs.readFileSync("../TPP223/Banco_1/certs/client_private_key.key"),
//         cert: fs.readFileSync("../TPP223/Banco_1/certs/client_certificate.crt"),
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `${token_type} ${access_token}`,
//         },
//         form: {
//           grant_type: "client_credentials",
//           scope: "accounts openid",
//         },
//         rejectUnauthorized: false,
//       },
//       function (error, response, body) {
//         // console.log("error => ", error);
//         // console.log("response => ", response);
//         console.log("body => ", body);
//       }
//     );
//   }
// );
