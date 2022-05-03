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
// connection database groupomania
const connection = require("../mysqlp7").connection;

//Tables des posts et des commentaires
const postsTable = require("../mysqlp7").postsTable;
const commentsTable = require("../mysqlp7").commentsTable;

/*-----------------------------------------------------------
function: getPostOwner

Objet: donne le proprietaire d'un post

Parametres:
  entrée: id du post
  sortie: userId du post

Algorithme
  requete sql sur table post
    recherche userId correspondant à l'Id du post
----------------------------------------------------------------------
*/
function getPostOwner(postId) {
  console.log("DEBUG : getPostOwner");
  var postUserId = "";

  try {
    // Requete sql pour lire tour les post
    sql = "SELECT userId FROM post WHERE id ='" + postId + "';";

    console.log("DEBUG  1 : getPostOwner sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur

        console.log("erreur getPostOwner  " + err);
      } else {
        // OK

        console.log(
          "DEBUG: ft getPostOwner: retour de la query sql: data=  " + data
        );
        //const result = Object.values(JSON.parse(JSON.stringify(data)));
        //const result = JSON.parse(JSON.stringify(data));
        const result = Object.values(JSON.parse(JSON.stringify(data)));
        const obj = result[0];
        postUserId = obj.userId;
        console.log("DEBUG: getPostOwner postUserId= " + postUserId);
      }
    });
  } catch (err) {
    console.log("getPostOwner erreur: " + err);
  }
  console.log(
    "DEBUG: ft getPostOwner: retour de getPostOwner: postUserId=  " + postUserId
  );
  return postUserId;
}

/*------------------------------------------------------------------------

function: isModerator

Objet: Vérifie si un utilisateur est moderateur 

Parametres:
  Entrée: token
  Sortie: 


Algorithme:

----------------------------------------------------------------------------
*/
function isModerator(userId) {
  console.log("DEBUG : ft isModerator");
  var isModeratorReturn = false;

  try {
    // Requete sql pour verifier moderateur oui/non
    sql = "SELECT moderator FROM user WHERE id ='" + userId + "';";

    console.log("DEBUG  ft isModerator sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur

        console.log("erreur isModerator  " + err);
      } else {
        // OK

        const result = Object.values(JSON.parse(JSON.stringify(data)));
        const obj = result[0];
        isModeratorReturn = obj.moderator;
        console.log(
          "DEBUG: ft isModerator: isModeratorReturn = " + isModeratorReturn
        );
      }
    });
  } catch (err) {
    console.log("isModerator erreur: " + err);
  }

  console.log(
    "DEBUG:  ft isModerator: retour de isModerator : isModeratorReturn=  " +
      isModeratorReturn
  );
  return isModeratorReturn;
}

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

Objet: création d'un post

verbe: POST

-------------------------------------------------------------------------------*/

exports.createPost = (req, res, next) => {
  console.log("DEBUG createPost");
  try {
    //const userId = getUserId(req);

    let imageUrl = req.body.imageUrl;
    /* on verra plus tard pour recuperer l'image rentree par le user
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`; // Url de l'image: protocole, nom du host: = server et Url de l'image
*/
    // Requete sql pour creer le post
    let userId = req.auth.userId; //userId déduit du token du header
    console.log("DEBUG   req.auth.userId  :  " + userId);
    sql =
      "INSERT INTO " +
      postsTable +
      " (post, imageUrl, userId) VALUES ('" +
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
  console.log("DEBUG getOnePost");
  try {
    // Requete sql pour lire le post
    sql =
      "SELECT * FROM  " +
      postsTable +
      "   WHERE postId = '" +
      req.params.postId +
      "';";

    console.log("DEBUG  getOnePost sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: getOnepost OK");

        res.status(200).json({ message: "post lu", post: data });
      }
    });
  } catch (err) {
    console.log("getOnePost erreur: " + err);
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
  
         // verif userId de la requete correspond à celui du token
      // test à faire plus tard
      // verifier user = moderateur
      // ou user = proprietaire du post ou du comment
      //       cad: il faut req.auth.userId = req.boby.userId si req.boby.userId existe

remarque:
    L'opérateur spread ... est utilisé pour faire une copie 
    de tous les éléments de req.body . 
-------------------------------------------------------------------------------*/
exports.modifyPost = (req, res, next) => {
  console.log("DEBUG ft  modifyPost");
  try {
    //REcherche propriétaire du post
    //const postUserId = getPostOwner(req.params.id);

    //console.log("DEBUG ft modifyPost postUserId =  " + postUserId);

    //const moderator = isModerator(req.auth.userId);
    //console.log("DEBUG ft modifyPost moderator = " + moderator);

    console.log("DEBUG ft modifyPost req.auth.userId =  " + req.auth.userId);

    // verifie user moderateur ou proprietaire du post
    //req.auth.userId = user qui a lancé la requete identifié par son token
    //let userAuth = false; //sera a true su user autorisé à passer la requete
    //if (postUserId == req.auth.userId) {
    //  userAuth = true;
    //}

    //if (moderator == true) {
    //  userAuth = true;
    //}
    //console.log("DEBUG : ft modifyPost: userAuth = " + userAuth);

    //userAuth = true; //DEBUG: force a true en attendant les then en cascade.
    //if (postUserId == req.auth.userId || moderator == true) {
    //if (userAuth == true) {
    console.log("DEBUG : fonction modifyPost: moderateur ou proprio : OK");

    sql =
      "UPDATE  " +
      postsTable +
      "  SET post='" +
      req.body.post +
      "' WHERE postId='" +
      req.params.postId +
      "';";

    console.log("DEBUG modifyPost sql=  " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: modifyPost OK");
        console.log(data);

        res.status(200).json("modif OK");
      }
    });
    //}
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
  console.log("DEBUG deletePost");
  try {
    // Requete sql pour detruirele post
    sql =
      "DELETE FROM  " +
      postsTable +
      "   WHERE postId = '" +
      req.params.postId +
      "';";

    console.log("DEBUG  deletePost sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: deletepost OK");

        res.status(200).json({ message: "post zigouillé" });
      }
    });
  } catch (err) {
    console.log("deletePost erreur: " + err);
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
  console.log("DEBUG getAllPost");
  try {
    // Requete sql pour lire tour les post
    sql = "SELECT * FROM  " + postsTable + "  ;";

    console.log("DEBUG  getAllPost sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: getAllPost OK");
        console.log(data);

        res.status(200).json({ message: "getAllPost OK", posts: data });
      }
    });
  } catch (err) {
    console.log("getAllPost erreur: " + err);
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
requete mysql INSERT INTO avec les parametres du comment
table: comment

Parametres:
userId: déduit du token donné dans le header
postId: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId
comment: param du body

Réponse:
  Comment cree
  ou
  message d'erreur si pb
-------------------------------------------------------------------------------*/

exports.createComment = (req, res, next) => {
  console.log("DEBUG createComment");
  try {
    //const userId = getUserId(req);

    // Requete sql pour creer le commentaire
    const userId = req.auth.userId; //userId déduit du token du header
    const postId = req.params.postId; //id du post dans l'adresse URL
    console.log("DEBUG   req.auth.userId  :  " + userId);
    sql =
      "INSERT INTO comment (comment, postId, userId) VALUES ('" +
      req.body.comment +
      "','" +
      postId +
      "','" +
      userId +
      "');";

    console.log("DEBUG  createComment sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("CreateComment erreur req sql" + err);
      } else {
        // OK  comment cree
        console.log("commentaire cree");

        res.status(201).json({ message: "comment créé" });
      }
    });
  } catch (err) {
    console.log("createComment  erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: getAllComment

Objet: lecture de tous les commentaires d'un post

verbe= GET

algo:
requete mysql SELECT * where postId= postId
table: comment

Parametres:

postId: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId/comment/


Réponse:
  Tableau avec tous les commentaires du post
  ou
  message d'erreur si pb
------------------------------------------------------*/

exports.getAllComment = (req, res, next) => {
  console.log("DEBUG getAllComment");
  try {
    // Requete sql pour lire tour les commentaires
    sql = "SELECT * FROM comment WHERE postId= '" + req.params.postId + "';";

    console.log("DEBUG  getAllComment sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: getAllComment OK");
        console.log(data);

        res.status(200).json({ message: "getAllComment OK", comment: data });
      }
    });
  } catch (err) {
    console.log("getAllComment erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: getOneComment

Objet: lecture d'uncommentaires d'un post

verbe= GET

algo:
requete mysql SELECT * where postId= postId and id=id
table: comment

Parametres:

postId: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId/comment/

  id: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId/comment/id

Réponse:
  commentaire
  ou
  message d'erreur si pb
------------------------------------------------------*/

exports.getOneComment = (req, res, next) => {
  console.log("DEBUG getOneComment");
  try {
    // Requete sql pour lire le commentaire
    sql = "SELECT * FROM comment WHERE Id= '" + req.params.id + "';";

    console.log("DEBUG  getOneComment sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: getOneComment OK");
        console.log(data);

        res.status(200).json({ message: "getOneComment OK", comment: data });
      }
    });
  } catch (err) {
    console.log("getOneComment erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: modifyComment

Objet: modification du  commentaire d'un post

verbe= PUT

algo:
requete mysql SELECT * where  id=id
table: comment

Parametres:

postId: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId/comment/

  id: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId/comment/id

Réponse:
  commentaire modifié
  ou
  message d'erreur si pb
------------------------------------------------------*/

exports.modifyComment = (req, res, next) => {
  console.log("DEBUG modifyComment");
  try {
    // Requete sql pour modifier le commentaire

    sql =
      "UPDATE comment SET comment='" +
      req.body.comment +
      "' WHERE id='" +
      req.params.id +
      "';";

    console.log("DEBUG  modifyComment sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // OK
        console.log("DEBUG: modifyComment OK");
        console.log(data);

        res.status(200).json({ message: "commentaire modifié" });
      }
    });
  } catch (err) {
    console.log("modifyComment erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*-----------------------------------------------------------------------------------
Fonction: deleteComment

Objet: Suppression d'un commentaire sur un post

verbe: DELETE

Algo:
requete mysql DELETE avec les parametres du comment
table: comment

Parametres:

id: déduit de l'adresse URL:
  http://localhost:3000/api/post/postId/comment/id


Réponse:
  Comment supprimé
  ou
  message d'erreur si pb
-------------------------------------------------------------------------------*/

exports.deleteComment = (req, res, next) => {
  console.log("DEBUG deleteComment");
  try {
    //const userId = getUserId(req);

    // Requete sql pour detruire le commentaire

    sql = "DELETE from comment where id ='" + req.params.id + "';";

    console.log("DEBUG  deleteComment sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("deleteComment erreur req sql" + err);
      } else {
        // OK  comment cree
        console.log("commentaire supprimé");

        res.status(200).json({ message: "comment supprimé" });
      }
    });
  } catch (err) {
    console.log("deleteComment  erreur: " + err);
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};
