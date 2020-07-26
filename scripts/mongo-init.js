/* Create HackathonTecban database */
db = db.getSiblingDB("HackathonTecban");

/* Create the collections */
db.createCollection("User");
db.createCollection("UserConsume");

/* Create index for email and guid column */
db.getCollection("User").createIndex({ email: -1 }, { unique: true });
db.getCollection("User").createIndex({ guid: -1 }, { unique: true });

/* Insert initial data */
db.getCollection("User").insert({
  guid: "433d4fd2-409f-4688-8ade-75e03b4f494b",
  email: "teste@teste.com",
  password: "9ac20922b054316be23842a5bca7d69f29f69d77",
});
