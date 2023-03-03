create table usuarios(
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null,
    atributo text not null
);

create table edificios(
    id serial primary key,
  	usuario_id int references usuarios(id) not null,
  	proprietario int not null,
    nome text unique not null,
    endereco text not null,
    descricao text
);

create table apartamentos(
    id serial primary key,
    disponibilidade boolean not null,
    edificio_nome int references edificios(nome) not null,
    numero int not null,
    andar int not null,
    valor int not null,
    descricao text,
);