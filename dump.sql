create database BDBP

create table usuarios(
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null,
    atributo text not null
);

create table edificios(
    id serial primary key,
  	proprietario_id int references usuarios(id) not null,
  	proprietario_nome text not null,
    edificio_nome text unique not null,
    endereco text not null,
    descricao text
);

create table apartamentos(
    id serial primary key,
    disponibilidade boolean not null,
    edificio_nome text references edificios(edificio_nome) not null,
    locatario_id int references usuarios(id) not null,
    locador_id int references usuarios(id),
    numero int not null,
    andar int not null,
    valor int not null,
    descricao text
);

create table contratosFindados(
    id serial primary key,
    locador_id int references usuarios(id) not null,
    locador_nome text not null,
    locador_email text references usuarios(email) not null,
    locador_telefone text not null,
    locatario_id int references usuarios(id) not null,
    edificio_nome text references edificios(edificio_nome) not null,
    apartamento_numero int not null,
    valor_aluguel int not null,
    data_inicio text not null,
    vigencia int not null,
    status boolean
);