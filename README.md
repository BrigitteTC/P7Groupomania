# P7Groupomania

Projet P7 Openclassroom Groupomania

---

Tables de mySQL:

Creation de la base de données:
CREATE DATABASE groupomania;

CREATE TABLE user (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE ,
email VARCHAR(100) NOT NULL,
pseudo VARCHAR(100), NOT NULL UNIQUE ,
moderator BOOLEAN DEFAULT false
);

CREATE TABLE post (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
userId INTEGER NOT NULL,
post text,
imageUrl VARCHAR(500)
);

CREATE TABLE comment (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
userId INTEGER NOT NULL,
postId INTEGER NOT NULL,
comment text
);

mysql> DESCRIBE user;
+-----------+--------------+------+-----+---------+----------------+
| Field | Type | Null | Key | Default | Extra |
+-----------+--------------+------+-----+---------+----------------+
| id | int | NO | PRI | NULL | auto_increment |
| email | varchar(255) | NO | UNI | NULL | |
| passwd | varchar(100) | NO | | NULL | |
| pseudo | varchar(100) | NO | UNI | NULL | |
| moderator | tinyint(1) | NO | | 0 | |
+-----------+--------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

#DEBUG:

Table user:

signup:
methode: POST
URL: http://localhost:3000/api/auth/signup
Headers:
Authorization: Bearer null
Body:
JSON avec: email, passwd et pseudo
ex: {"email":"titi@test.fr","password":"titi","pseudo":"titi"}

---

login:
methode: POST
URL: http://localhost:3000/api/auth/login
Headers:
Authorization: Bearer null
Body:
JSOn avec: email, passwd
ex: {"email":"titi@test.fr","password":"titi"}

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
