-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE latencySlayer;

USE latencySlayer;


CREATE TABLE endereco(
	idEndereco INT PRIMARY KEY AUTO_INCREMENT,
	CEP CHAR(8),
	numero INT,
	rua VARCHAR(100)
);

CREATE TABLE empresa (
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(45),
	codigo char(9),
	empresaMatriz INT,
	fkEndereco INT,
	FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
);

CREATE TABLE usuarios (
	idUsuarios INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50),
	cpf CHAR(11),
	cargo VARCHAR(50),
	senha VARCHAR(50),
	fkempresa INT,
	FOREIGN KEY (fkempresa) REFERENCES empresa(idEmpresa)
);

INSERT INTO endereco (CEP, numero, rua) VALUES
(05668791, 78, 'Rua Augusta');

INSERT INTO empresa VALUES
(DEFAULT, 'Gamestech', '10E98WD45', NULL, 1);

INSERT INTO usuarios VALUES
(DEFAULT, 'Gabriel Atlântico','gabriel.oceano@gmail.com', 'Biel08_', 1);


SELECT idEmpresa, nome, codigo from empresa;

SELECT nome, email, cargo, senha, fkempresa from usuarios;
SELECT nome, email, cargo, senha, fkempresa from usuarios WHERE email = 'maria@mail.com';

INSERT INTO usuarios (nome, email, cpf, cargo, senha, fkEmpresa) VALUES
('Juliana Silva','juliana.silva@gmail.com', 12343256789,'Gestor' ,'julia20_', 1);


INSERT INTO usuarios (nome, email, cpf, cargo, senha, fkEmpresa) VALUES ('maria', 'eduarda@gmail.com', '34543445678', 'Suporte', '12
drop table usuarios;