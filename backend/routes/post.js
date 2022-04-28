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

const auth = require("../middleware/auth");
const authPost = require("../middleware/authPost");
const multer = require("../middleware/multer-config");

//auth dans chaque route permet de vérifier l'authentification et de la protéger

router.post("/", authPost, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.modifyPost);

router.get("/", auth, postCtrl.getAllPost);
router.get("/:id", authPost, postCtrl.getOnePost);

router.delete("/:id", auth, postCtrl.deletePost);

//Route pour les commentaires
router.post("/:id/comment", auth, postCtrl.createComment);

//export du router
module.exports = router;
