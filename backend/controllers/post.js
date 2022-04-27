//P7 Groupomania

/*----------------------------------------
controllers/post.js
creation: 27/04/2022
auteur BTC

Controllers pour gérer les posts du forum
POST, PUT, GET et DELETE
-------------------------------------------
*/

const fs = require("fs"); //acces à la gestion des fichiers de Node

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

//Base de données mysql
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.USER_PASSWD,
  database: process.env.DATABASE,
});

/*----------------------------------------------------------------------------------
Fonction: getUserId

Objet: donne l'id d'un utilisateur en ft du token

Parametres:
  Parametre entrée: req avec le header
  Paremetre de sortie: id

Algorithme
  Décode l'id à l'aide de jwt.verify
-------------------------------------------------------
*/
function getUserId(req) {
  var userId; //L'ID du user qui sera extrait du token
  try {
    //on récupère le token dans le header = 2ieme elt du header apres le bearer
    const token = req.headers.authorization.split(" ")[1];
    console.log(
      "DEBUG : fonction getUserId: req.headers.authorization : " +
        req.headers.authorization
    );
    console.log("DEBUG : fonction getUserId: token : " + token);
    const secretKey = process.env.SECRET_KEY;

    // on décode le token avec verify et clé secrete
    const decodedToken = jwt.verify(token, secretKey);

    userId = decodedToken.userId;
    console.log("DEBUG : fonction getUserId: userId : " + userId);
  } catch (err) {
    console.log("getUserId  erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
  console.log("DEBUG : fonction getUserId: retour  userId : " + userId);
  return userId;
}
/*-----------------------------------------------------------------------------------
Fonction: createPost

Objet: création d'une sauce

verbe: POST

-------------------------------------------------------------------------------*/

exports.createPost = (req, res, next) => {
  console.log("DEBUG createPost");
  try {
    const userId = getUserId(req);

    let imageUrl = "";
    /* on verra plus tard pour recuperer l'image rentree par le user
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`; // Url de l'image: protocole, nom du host: = server et Url de l'image
*/
    // Requete sql pour creer le post
    sql =
      "INSERT INTO post (post, imageURL, userId) VALUES ('" +
      req.body.post +
      "','" +
      imageUrl +
      "','" +
      userId +
      "');";

    console.log("DEBUG  createPost sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK post cree
        console.log("post cree");

        res.status(201).json({ message: "post créé" });
      }
    });
  } catch (err) {
    console.log("createPost  erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: getOnePost

Objet: récupération d'un post

verbe: GET

-------------------------------------------------------------------------------*/

exports.getOnePost = (req, res, next) => {
  try {
  } catch (err) {
    console.log("erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: modifyPost

Objet: modification d'un post

Modification d'un objet = PUT

Algo:
  Vérification que l'utilisateur est authentifié en allent chercher le 
  userID du propriétaire .

  Si l'utilisateur est auth

    2 cas:
      1: L'utilisateur modifie seulement les infos
      2: l'utilisateur modifie l'image = nouvelle image à traiter..
      on supprime l'ancienne image dans le dossier image
  
   

remarque:
    L'opérateur spread ... est utilisé pour faire une copie 
    de tous les éléments de req.body . 
-------------------------------------------------------------------------------*/
exports.modifyPost = (req, res, next) => {
  try {
  } catch (err) {
    console.log("erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*------------------------------------------------------------
Fonction: delFile

Objet: Supprimer le fichier de l'image d'un post

Parametres: entrée: postId: Id du post

Algo:
  Trouve le post
  Calcule le chemin du fichier
  Supprime le fichier de l'image
---------------------------------------------------------*/

function delFile(postId) {
  try {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {});
      })
      .catch((error) => res.status(500).json({ error }));
  } catch (err) {
    console.log("erreur: " + err);
  }
}

/*-----------------------------------------------------------------------------------
Fonction: deletePost

Objet: suppression d'un post

Suppression d'un objet = DELETE

DELETE avec suppression du dossier image
  vérifie si il y a une image à supprimer du dossier image
  et la supprime avec unlink

  Vérifie le user avant de supprimer le post
-------------------------------------------------------------------------------*/

exports.deletePost = (req, res, next) => {
  try {
  } catch (err) {
    console.log("erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: getAllPost

Objet: chargement de tous les posts

verbe= GET
------------------------------------------------------*/

exports.getAllPost = (req, res, next) => {
  try {
  } catch (err) {
    console.log("erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: createComment

Objet: Creation d'un commentaire sur un post

verbe: POST

Algo:



-------------------------------------------------------------------------------*/

exports.createComment = (req, res, next) => {
  try {
  } catch (err) {
    console.log("erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};
