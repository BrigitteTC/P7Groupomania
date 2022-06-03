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
const { stringify } = require("querystring");

//Base de données mysql
// connection database groupomania
const connection = require("../mysqlp7").connection;

//Tables des posts et des commentaires
const postsTable = require("../mysqlp7").postsTable;
const commentsTable = require("../mysqlp7").commentsTable;
const usersTable = require("../mysqlp7").usersTable;

/*-----------------------------------------------------------------------------------
Fonction: createPost

Objet: création d'un post

verbe: POST

INSERT dans mysql avec userId et date d'insertion
-------------------------------------------------------------------------------*/

exports.createPost = (req, res, next) => {
  console.log("DEBUG createPost");
  try {
    let imageUrl = "";
    //Gestion de l'image
    // image dans req.file

    if (req.file) {
      console.log("req.file : " + req.file);
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`; // Url de l'image: protocole, nom du host: = server et Url de l'image
    }
    /*  image dans le body
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.body.imageUrl
    }`; // Url de l'image: protocole, nom du host: = server et Url de l'image
    */
    // Requete sql pour creer le post
    const userId = req.auth.userId; //userId déduit du token du header

    //le post dont on va echapper les ' avec \'
    let newPost = req.body.post;
    const newPostCorrected = newPost.replace(/[']/g, "\\'");
    console.log("newPostCorrected= " + newPostCorrected);
    console.log("imageUrl : " + req.file + imageUrl);

    console.log("DEBUG   req.auth.userId  :  " + userId);
    sql =
      "INSERT INTO " +
      postsTable +
      " (post, imageUrl, userId, PostDate) VALUES ('" +
      newPostCorrected +
      "','" +
      imageUrl +
      "','" +
      userId +
      "' ," +
      "NOW()" +
      ");";

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
    console.log("DEBUG : ft modifyPost req.auth.userId =  " + req.auth.userId);

    let imageUrl = "";
    //Gestion de l'image
    // image dans req.file
    let postSql = ""; //init part sql pour le post
    let imageSql = ""; //init partie SQL pour l'image
    let sql = ""; //requete sql complete pour mise à jour du post
    var oldImageSql = ""; //requete pour récupérer l'ancienne image du post

    //le post dont on va echapper les ' avec \'
    const newPost = req.body.post;
    if (newPost) {
      //on corrige les apostrophes
      const newPostCorrected = newPost.replace(/[']/g, "\\'");
      console.log("newPostCorrected= " + newPostCorrected);

      // partie requete sql correspondant au post
      postSql = "post='" + newPostCorrected + "'";
    }

    // test image avec le post
    if (req.file) {
      console.log("req.file : " + req.file);
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`; // Url de l'image: protocole, nom du host: = server et Url de l'image

      //partie requete sql correspondant à l'image
      imageSql = " imageUrl='" + imageUrl + "'";

      //recherche ancienne image et la détruit

      try {
        // req sql pour récupérer l'image du post
        oldImageSql =
          "SELECT imageUrl from posts WHERE postId = '" +
          req.params.postId +
          "'";
        console.log("oldImageSql : " + oldImageSql);

        // appel de la requete pour trouver l'image puis destruction
        connection.query(oldImageSql, (err, data, fields) => {
          if (err) {
            // Reponse avec code et message d'erreur

            console.log("erreur" + err);
          } else {
            // OK

            //result est un tableau avec 1 seul elt
            const result = Object.values(JSON.parse(JSON.stringify(data)));

            const obj = result[0];
            console.log("retour sql recherche image : " + obj);

            //test une image existe et si oui on zigouille
            if (obj.imageUrl !== "") {
              const imageUrl = obj.imageUrl;

              const filename = imageUrl.split("/images/")[1];
              console.log("filename = " + filename);
              // Desctuction de l'image avec une req synchrone

              fs.unlinkSync(`images/${filename}`);
            }

            // maj requete sql pour modifier le post
            if (newPost) {
              //sql avec post et image
              sql =
                "UPDATE  " +
                postsTable +
                "  SET " +
                postSql +
                "," +
                imageSql +
                " WHERE postId='" +
                req.params.postId +
                "';";
              console.log("sql avec post et image : " + sql);
            } else {
              // sql avec image seulement
              sql =
                "UPDATE  " +
                postsTable +
                "  SET " +
                imageSql +
                " WHERE postId='" +
                req.params.postId +
                "';";
              console.log("sql avec image : " + sql);
            }

            // modification du post
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

                res.status(200).json({ message: "Post modifié" });
              }
            });
          } //fin traitement recherche image existante avant modif
        });
      } catch (err) {
        console.log("erreur: " + err);
      }
    } // fin cas nouveau post avec une image
    else {
      // cas texte seulement

      //sql avec post seulement
      sql =
        "UPDATE  " +
        postsTable +
        "  SET " +
        postSql +
        " WHERE postId='" +
        req.params.postId +
        "';";
      console.log("sql avec post : " + sql);

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

          res.status(200).json({ message: "Post modifié" });
        }
      });
    } // fin cas du texte seulement
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

  Utilisation de fs.unlinkSync(path)
---------------------------------------------------------*/

function delFile(postId) {
  console.log("delFile");
  try {
    // req sql pour récupérer l'image du post
    const sql = "SELECT imageUrl from posts WHERE postId = '" + postId + "'";
    console.log("oldImageSql : " + sql);

    // appel de la requete pour trouver l'image puis destruction
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur

        console.log("erreur" + err);
      } else {
        // OK

        //result est un tableau avec 1 seul elt
        const result = Object.values(JSON.parse(JSON.stringify(data)));

        const obj = result[0];

        //test une image existe et si oui on zigouille
        if (obj !== undefined) {
          const imageUrl = obj.imageUrl;

          const filename = imageUrl.split("/images/")[1];
          console.log("filename = " + filename);
          // Desctuction de l'image avec une req synchrone

          if (filename !== undefined) {
            fs.unlinkSync(`images/${filename}`);
          }
        }
      }
    });
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
    delFile(req.params.postId); //On supprime l'ancien fichier de l'image
    // Requete sql pour detruire le post
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

        //

        //

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
    // Requete sql pour lire tour les post avec le user  correspondant.
    // REquete sur table posts
    // puis  jointure LEFT sur table users par userId pour avoir le pseudo de l'auteur du post
    // et tri par date decroissante: le plus récent en premier
    //
    /* Exemple de requete
    sql: 
    SELECT * FROM  posts 
    LEFT OUTER JOIN users 
    ON  posts.userId=users.userId  
    ORDER by postDate DESC;

    DATE_FORMAT(postDate,'%d/%m/%Y')AS date permet d'avoir la date formatée format français
*/
    sql =
      "SELECT *,DATE_FORMAT(postDate,'%d/%m/%Y  %H:%i:%S')AS date FROM  " +
      postsTable +
      " LEFT OUTER JOIN " +
      usersTable +
      " ON  " +
      postsTable +
      ".userId=" +
      usersTable +
      ".userId ORDER by postDate DESC ;";

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

        // REq SQL pour trouver le pseudo du propriétaire du post

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
  Comment cree avec date d'insertion
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

    //le commentaire dont on va echapper les ' avec \'
    let newComment = req.body.comment;
    const newCommentCorrected = newComment.replace(/[']/g, "\\'");
    console.log("newCommentCorrected= " + newCommentCorrected);

    sql =
      "INSERT INTO  " +
      commentsTable +
      "  (comment, postId, userId,commentDate) VALUES ('" +
      newCommentCorrected +
      "','" +
      postId +
      "','" +
      userId +
      "' ," +
      "NOW()" +
      ");";

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

Req poru lire les commentaires:
sELECT avec jointure sur table des users pour récupérer le pseudo
et sélection sur le post
et tri par date décroissante : du plus récent au plus vieux
ex:
SELECT * FROM  comments   LEFT OUTER JOIN users ON  comments.userId=users.userId  WHERE postId= '15'
ORDER by commentDate DESC;
------------------------------------------------------*/

exports.getAllComment = (req, res, next) => {
  console.log("DEBUG getAllComment");
  try {
    // Requete sql pour lire tour les commentaires
    sql =
      "SELECT *,DATE_FORMAT(commentDate,'%d/%m/%Y')AS date FROM  " +
      commentsTable +
      " LEFT OUTER JOIN " +
      usersTable +
      " ON  " +
      commentsTable +
      ".userId=" +
      usersTable +
      ".userId WHERE postId= '" +
      req.params.postId +
      "'  ORDER by commentDate DESC ;";

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
    sql =
      "SELECT * FROM  " +
      commentsTable +
      "  WHERE commentId = '" +
      req.params.commentId +
      "';";

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
requete mysql SELECT * where  id=id du comment
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

    //le commentaire dont on va echapper les ' avec \'
    let newComment = req.body.comment;
    const newCommentCorrected = newComment.replace(/[']/g, "\\'");
    console.log("newCommentCorrected= " + newCommentCorrected);

    sql =
      "UPDATE  " +
      commentsTable +
      "  SET comment='" +
      newCommentCorrected +
      "' WHERE commentId='" +
      req.params.commentId +
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

    sql =
      "DELETE from  " +
      commentsTable +
      "  where commentId ='" +
      req.params.commentId +
      "';";

    console.log("DEBUG  deleteComment sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("deleteComment erreur req sql" + err);
      } else {
        // OK  comment supprimé
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
