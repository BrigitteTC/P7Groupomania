//groupomania

/*-------------------------------------------------
routes/post.js
Date de création: 20 avril 2022
auteur: BTC

Création d'un routeur pour toutes les routes des élements des forums.
-------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

const authPost = require("../middleware/authPost");
const multer = require("../middleware/multer-config");

//auth dans chaque route permet de vérifier l'authentification et de la protéger

router.post("/", authPost, multer, postCtrl.createPost);
router.put("/:id", authPost, multer, postCtrl.modifyPost);

router.get("/", authPost, postCtrl.getAllPost);
router.get("/:id", authPost, postCtrl.getOnePost);

router.delete("/:id", authPost, multer, postCtrl.deletePost);

//Route pour les commentaires
router.post("/:postId/comment", authPost, postCtrl.createComment);

router.put("/:postId/comment/:id", authPost, postCtrl.modifyComment);

router.get("/:postId/comment", authPost, postCtrl.getAllComment);
router.get("/:postId/comment/:id", authPost, postCtrl.getOneComment);

router.delete("/:postId/comment/:id", authPost, postCtrl.getAllComment);

//export du router
module.exports = router;
