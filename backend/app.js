//P7 Groupomania

//----------------------------------------------------------------
//app.js
// date de création: 21/04/2022
// auteur: BTC
//
// Appliction app.js pour placer l'applisation express
// se connecter à mySQL
//-------------------------------------------

// import de express
// express facilite le codage du server node.
const express = require("Express");

//routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// Acces au path du server
const path = require("path");

// application
const app = express();

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//connexion a mySQL
/*DEBUG 28/04/2à22
const user = process.env.USER;
const passwd = process.env.USER_PASSWD;
const database = process.env.DATABASE;
Fin DEBUG 28/04/2022
*/

//*DEBUG 28/04/2022const connection = require("./mysql");

const connection = require("./mysqlp7").connection;

connection.connect(() => {
  try {
    console.log("Connecté mySQL groupomania");
  } catch (err) {
    console.log("connect" + err);
  }
});

/*DEBUG 28/04/2à22
const connection = mysql.createConnection({
  host: "localhost",
  user: user,
  password: passwd,
  database: database,
});
Fin DEBUG 28/04/2022
*/
/*
connection.connect((err) => {
  if (err) throw err;
  console.log("Connecté mySQL groupomania!");
});
*/
/* DEBUG 28/04/2à22
connection.connect(() => {
  try {
    console.log("Connecté mySQL groupomania!");
  } catch (err) {
    console.log(err);
  }
});
Fin DEBUG 28/04/2022
*/

//gestion des images:
/*indique à Express qu'il faut gérer la ressource images de manière statique 
(un sous-répertoire de notre répertoire de base, __dirname ) 
à chaque fois qu'elle reçoit une requête vers la route /images . 
*/

https: app.use("/images", express.static(path.join(__dirname, "images")));

// ajout du middleware général
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Utilisation de EXPRESS:
//Ajout use express.json pour capturer les objets json

app.use(express.json());

//app.use pour enregistrer les routes

//Route pour les elts du forum:
app.use("/api/post", postRoutes);

///api/auth = route attendue par le front end pour authentification
app.use("/api/auth", userRoutes);

/* DEBUG 28/04/2022
//Fermeture de la connexion:
connection.end((err) => {
  // La connexion se termine normalement
  // Garantit que toutes les requêtes restantes sont exécutées
  // Envoie ensuite un paquet de sortie au serveur MySQL.
});

Fin DEBUG 28/04/2022
*/

//export de la fonction pour qu'on puisse y acceder depuis les autres fichiers du projet
// dont le server node.
module.exports = app;
