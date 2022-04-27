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

/*-----------------------------------------------------------------------------------
Fonction: createPost

Objet: création d'une sauce

verbe: POST

-------------------------------------------------------------------------------*/

exports.createPost = (req, res, next) => {
  try {
    const postObject = JSON.parse(req.body.post);

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`; // Url de l'image: protocole, nom du host: = server et Url de l'image

    res.status(201).json({ message: "Objet enregistré !" });
  } catch {
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
