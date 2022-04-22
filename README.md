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
| pseudo | varchar(100) | NO | | NULL | |
| moderator | tinyint(1) | NO | | 0 | |
+-----------+--------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)
