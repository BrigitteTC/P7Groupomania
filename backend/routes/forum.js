//groupomania

/*-------------------------------------------------
routes/forum.js
Date de création: 20 avril 2022
auteur: BTC

Création d'un routeur pour toutes les routes des élements des forums.
-------------------------------------------------
*/
const express = require("express");
const router = express.Router();

const forumCtrl = require("../controllers/forum");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//auth dans chaque route permet de vérifier l'authentification et de la protéger

router.post("/", auth, multer, forumCtrl.createforumItem);
router.put("/:id", auth, multer, forumCtrl.modifyForumItem);

router.get("/", auth, forumCtrl.getAllForumItem);
router.get("/:id", auth, forumCtrl.getOneForumItem);

router.delete("/:id", auth, forumCtrl.deleteForumItem);

//Route pour les commentaires
router.post("/:id/comment", auth, forumCtrl.createComment);

//export du router
module.exports = router;
