CREATE TABLE user_table (
    id SERIAL PRIMARY KEY UNIQUE ,
    username VARCHAR NOT NULl UNIQUE,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL
);

create table mentor(
    id serial references user_table(id) UNIQUE ,
    fullname varchar NOT NULL,
    subject varchar NOT NULL,
    education varchar
);

create table student(
    id serial references user_table(id) UNIQUE,
    fullname varchar NOT NULL ,
    school varchar
);

create table homework(
     id serial primary key,
     id_mentor int references mentor(id) NOT NULL ,
     id_student int references student(id) NOT NULL ,
     task bytea NOT NULL ,
     time_create timestamp NOT NULL
);

create table solution(
    id serial references homework(id),
    photo bytea NOT NULL ,
    time_create timestamp NOT NULL
);

CREATE TABLE review(
    id serial references homework(id),
    body_review varchar NOT NULL,
    time_create timestamp NOT NULL
);