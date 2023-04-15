CREATE DATABASE IF NOT EXISTS ListtaVipDB;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  data_nasc DATE,
  telefone TEXT,
  email TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,
  senha TEXT NOT NULL,
  confirm_senha TEXT NOT NULL,
  endereco TEXT,
  creditos INTEGER,
  plano TEXT NOT NULL
);
