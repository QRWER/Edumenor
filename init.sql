create table mentor(
    id serial primary key,
    fullname varchar,
    subject varchar,
    education varchar
);

create table student(
    id serial primary key,
    fullname varchar,
    school varchar
);

create table solution(
    id serial primary key,
    photo bytea,
    time_end timestamp
);

create table homework(
    id serial primary key,
    id_mentor int references mentor(id),
    id_student int references student(id),
    task bytea,
    id_solution int references solution(id),
    review varchar,
    time_start timestamp
);