CREATE DATABASE foodgo
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE foodgo;

CREATE TABLE felhasznalo(
	id int AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefonszam VARCHAR(20) NOT NULL,
    jelszo VARCHAR(255) NOT NULL,
    admine BOOLEAN NOT NULL DEFAULT FALSE
)

INSERT INTO felhasznalo (nev, email, telefonszam, jelszo, admine) VALUES
('Admin',
'czegledimate06@gmail.com',
'06203735053',
'Admin1234', 
TRUE);