# P7Groupomania

Projet P7 Openclassroom Groupomania

---

Backend avec base de données mySQL.

Variables d'environnement:
Fichier .env situé dans\P7Groupomania\backend pour mettre les variables d'environnement
relatives à la base de données MySQL et à la clé secrete du hash du passwd.

Tables de mySQL:

Creation de la base de données:
CREATE DATABASE groupomania;

CREATE TABLE users (
userId INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE ,
passwd VARCHAR(100) NOT NULL,
pseudo VARCHAR(100) NOT NULL UNIQUE ,
moderator BOOLEAN DEFAULT false
);

CREATE TABLE posts (
postId INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
userId INTEGER NOT NULL,
post text,
imageUrl VARCHAR(500),
postDate DATETIME,
FOREIGN KEY (userId)
REFERENCES users (userId)
ON DELETE CASCADE
);

CREATE TABLE comments (
commentId INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
userId INTEGER NOT NULL,
postId INTEGER NOT NULL,
comment text,
commentDate DATETIME,
FOREIGN KEY (userId)
REFERENCES users (userId)
ON DELETE CASCADE,
FOREIGN KEY (postId)
REFERENCES posts (postId)
ON DELETE CASCADE
);

// Pour mettre un user moderator:
ex: user dont userId= 5
mysql> UPDATE users SET moderator='1' WHERE userId=5;

#--------------------------------------------------------------------
#--------------------------------------------------------------------

#Tests de l'API

Table users:

signup:
methode: POST
URL: http://localhost:3000/api/auth/signup
Headers:
Authorization: Bearer null
Body:
rows format JSON avec: email, passwd et pseudo
ex: {"email":"titi@test.fr","password":"titi","pseudo":"titi"}

Réponse:
Status: 201
message: utilisateur crée + pseudo

---

login:
methode: POST
URL: http://localhost:3000/api/auth/login
Headers:
Authorization: Bearer null
Body:
JSOn avec: email, passwd
ex: {"email":"titi@test.fr","password":"titi"}

Réponse:
status: 200
token
userId
moderateur: 0/1
pseudo

---

modifyUser:
méthode: PUT
URL=http://localhost:3000/api/auth/id
exemple: http://localhost:3000/api/auth/33
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body; JSOn avec tous les parametres:
ex:
{"email":"toto@test.fr","password":"toto1","pseudo":"toto2"}

Réponse:
status: 201
message: "Utilisateur modifie : " + pseudo

---

deleteUser:
méthode: DELETE
URL=http://localhost:3000/api/auth/id
exemple: http://localhost:3000/api/auth/33
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body: pas de body requis

Réponse:
status: 200
message: "Utilisateur supprimé"

#---------------------------------------------
#---------------------------------------------

Table posts

createPost:
methode: POST
URL: http://localhost:3000/api/post
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body:
{"post":"blabla","imageUrl":""}

Réponse:
status: 201
message: "post créé";

Le post est crée avec le userId déduit du token

#---------------------------------------------
getOnePost:
methode: GET
URL: http://localhost:3000/api/post/:id
où :id est l'id du post dans la table post
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body: none

Réponse:
status: 200
message: "post lu"
post: <post>;

ex:
"message": "post lu",
"post": [
{
"id": 1,
"userId": 6,
"post": "blablanew 2mai",
"imageUrl": ""
}
]

#---------------------------------------------
modifyPost:
methode: PUT
URL: http://localhost:3000/api/post/:id  
 où :id est l'id du post dans la table post
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body: {"post":"blablanew 2mai","imageUrl":""}

Réponse:
status: 200
message: "modif OK"

#---------------------------------------------
deletePost:
methode: DELETE
URL: http://localhost:3000/api/post/:id  
 où :id est l'id du post dans la table post
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body: none

Réponse:
status: 200
"message": "post zigouillé"

#---------------------------------------------
getAllPost:
methode: GET
URL: http://localhost:3000/api/post/

Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body: none

Réponse:
status: 200
"message": "getAllPost: OK"
data: <[posts]>

ex:
{
"message": "getAllPost OK",
"data": [
{
"id": 1,
"userId": 6,
"post": "blablanew 2mai",
"imageUrl": ""
},
{
"id": 2,
"userId": 31,
"post": "blabla",
"imageUrl": ""
},
......
]
}

#------------------------------------------------------------------
#------------------------------------------------------------------
Commentaires
#------------------------------------------------------------------
createComment:

methode: POST
URL: http://localhost:3000/api/postId/comment
postId = post auquel sera associé le commentaire.
Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body:
{"comment":"commentaire sur le post"}}

Réponse:
status: 201
message: "comment créé";

Le post est crée avec le userId déduit du token

#------------------------------------------------------------------
getAllComment:

methode: GET
URL: http://localhost:3000/api/postId/comment/
postId = post dont on veut les commentaires.

Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body:
none

Réponse:
status: 200
"message": "getAllComment OK",
"comment":
Tableau des commentaires du post

#------------------------------------------------------------------
getOneComment:

methode: GET
URL: http://localhost:3000/api/postId/comment/id
postId = post dont on veut les commentaires.
id: commentaire à lire

Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body:
none

Réponse:
status: 200
"message": "getOneComment OK",
"comment": <commentaire>

#------------------------------------------------------------------
modifyComment:

methode: PUT
URL: http://localhost:3000/api/postId/comment/id
postId = post dont on veut le commentaires.
id: commentaire à modifuer

Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body:
none

Réponse:
status: 200
"message": "commentaire modifié",

#------------------------------------------------------------------
deleteComment:

methode: DELETE
URL: http://localhost:3000/api/postId/comment/id
postId = post auquel est associé le commentaire.
id: id du commentaire à détruire

Headers:
KEY: Authorisation
VALUE: Bearer token

    exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE2NTEwNDcyODgsImV4cCI6MTY1MTEzMzY4OH0.dROiXv7xiTIwYNtlC0Ov6pf65HsXsbtzB293Pd2SD_I

body:
none

Réponse:
status: 200
message: "comment supprimé";
