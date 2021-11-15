set search_path to glaze;



drop table if exists glaze_user;

create table glaze_user
(
    id         bigserial primary key,
    username   varchar not null unique,
    phone      varchar not null unique,
    password   varchar not null,
    avatar     varchar,
    nickname   varchar,
    intro      varchar,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
)


