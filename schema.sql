create database if not exists viplist;

create table if not exists users (
  id serial primary key,
  create_at bigint not null,
  name text not null,
  email text not null unique,
  password text not null,
  cpf text unique,
  phone text

);