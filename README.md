# P7Groupomania

Projet P7 Openclassroom Groupomania

Tables de mySQL:

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

signup:

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
