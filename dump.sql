create table users(
    id serial primary key,
    name text not null,
    email text not null unique,
    password text not null,
    category text not null
);

create table buildings(
    id serial primary key,
	owner_id int references users(id) not null,
  	owner_name text not null,
    building_name text unique not null,
    address text not null,
    description text
);

create table apartments(
    id serial primary key,
    available boolean not null,
    building_name text references buildings(building_name) not null,
    owner_id int references users(id) not null,
    renter_id int references users(id),
  	renter_email text references users(email),
  	renter_name text,
    apartment_number int not null,
    place_level int not null,
    value_rent int not null,
    description text
);

create table contracts(
    id serial primary key,
    renter_id int references users(id) not null,
    renter_name text not null,
    renter_email text references users(email) not null,
    renter_phone text not null,
    owner_id int references users(id) not null,
    building_name text references buildings(building_name) not null,
    apartment_number int not null,
    value_rent int not null,
    date_start text not null,
    month_number int not null,
    status boolean,
  	required boolean
);