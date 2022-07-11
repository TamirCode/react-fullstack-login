DROP DATABASE IF EXISTS newproject123;
CREATE DATABASE newproject123;
USE newproject123;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(45) UNIQUE,
	password VARCHAR(45),
	role VARCHAR(20) DEFAULT "user",
	date_created INT DEFAULT (UNIX_TIMESTAMP())
);

INSERT INTO users
(username, password, role)
VALUES
('admin', 'pass', 'admin'),
('123', '123', 'user');