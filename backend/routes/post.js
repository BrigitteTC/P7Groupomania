//groupomania

/*-------------------------------------------------
routes/post.js
Date de création: 20 avril 2022
auteur: BTC

Création d'un routeur pour toutes les routes des élements des forums.
-------------------------------------------------

Middlewares d'authentifications:

posts:
POST et GET:
  authPost: vérifie que celui qui passe la requete est authentifié.

PUT et DELETE:
  authPost: vérifie que celui qui passe la requete est authentifié.
  authPostOwner: Vérifie que celui qui passe la requete est moderateur ou propriétaire


comments:
POST et GET:
  authPost: vérifie que celui qui passe la requete est authentifié.

PUT et DELETE:
  authPost: vérifie que celui qui passe la requete est authentifié.
  authCommentOwner: Vérifie que celui qui passe la requete est moderateur ou propriétaire



*/
const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

const authPost = require("../middleware/authPost");
const authPostOwner = require("../middleware/authPostOwner");
const authCommentOwner = require("../middleware/authCommentOwner");

//auth dans chaque route permet de vérifier l'authentification et de la protéger

router.post("/", authPost, multer, postCtrl.createPost);

router.get("/", authPost, postCtrl.getAllPost);
router.get("/:postId", authPost, postCtrl.getOnePost);

router.put("/:postId", authPost, authPostOwner, multer, postCtrl.modifyPost);

router.delete("/:postId", authPost, authPostOwner, postCtrl.deletePost);

//Routes pour les commentaires
router.post("/:postId/comment", authPost, postCtrl.createComment);

router.get("/:postId/comment", authPost, postCtrl.getAllComment);
router.get("/:postId/comment/:commentId", authPost, postCtrl.getOneComment);

router.put(
  "/:postId/comment/:commentId",
  authPost,
  authCommentOwner,
  postCtrl.modifyComment
);

router.delete(
  "/:postId/comment/:commentId",
  authPost,
  authCommentOwner,
  postCtrl.deleteComment
);

//export du router
module.exports = router;
