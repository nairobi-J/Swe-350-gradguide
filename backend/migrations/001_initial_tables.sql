
BEGIN;

-- Creates a 'users' table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  --hashed
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(20),
    agree_terms BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domains TEXT[],
    web_pages TEXT[],
    country VARCHAR(100) NOT NULL,
    alpha_two_code CHAR(2),
    state_province VARCHAR(100),
    is_verified BOOLEAN DEFAULT TRUE
);


create table if not exists program(
    program_id  serial primary key,
	university_id INT not null,
	name varchar(100) not null,
	degree_type varchar(20) CHECK (degree_type in('bachelor','masters','phd','diploma','certificate')),
	field_of_study varchar(50),
	duration varchar(30),
	tuition_fee DECIMAL(10,2),
	deadline DATE,
	foreign key (university_id) references universities(id)
);

create table IF NOT EXISTS post(
    post_id serial primary key,
	program_id INT not null,
	title varchar(300) not null,
	content text not null,
	post_type varchar(50) check (post_type in('deadline','news','event','alert')),
	created_at timestamp default current_timestamp,
	is_important BOOlEAN default FALSE,
	foreign key (program_id) references program(program_id)
);

create table if not exists notification(
   notification_id serial primary key,
   user_id int not null,
   post_id int not null,
   is_read boolean default false,
   notified_at timestamp default current_timestamp,
   foreign key (user_id) references users(id) on delete cascade,
   foreign key (post_id) references post(post_id) on delete cascade
)




create table if not exists favorites(
     favorite_id serial primary key,
	 user_id int not null,
	 program_id int not null,
	 favorited_at timestamp default current_timestamp,
	 unique(user_id, program_id),
	 foreign key (user_id) references users(id) on delete cascade,
	 foreign key (program_id) references program(program_id) on delete cascade
)

-- Add index for faster searches
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_name ON universities(name);

COMMIT;

