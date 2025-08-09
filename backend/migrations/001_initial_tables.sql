
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

create table if not exists event(

     id serial primary key,
	 user_id int references users(id),
	 name varchar(500) not null,
	 type varchar(30) not null check(type in('online', 'offline')),
	 date date not null,
	 time time not null,
	 location text,
	 description text,
	 is_paid boolean not null default false,
	 price numeric(10,2) default 0,
	 created_at timestamp default now()
	 
)

create table if not exists event_registration_form(
        id serial primary key,
		event_id int not null references event(id) on delete cascade,
		name varchar(255) not null,
		label varchar(255) not null,
		type varchar(50) not null check (type in('text','email','number','textarea')),
		required boolean not null default false,
		created_at timestamp default now()
)

create table if not exists event_registration_response(
    id serial primary key,
	event_id int references event(id) on delete cascade,
	user_id int references users(id) on delete set null,
	created_at timestamp default now()
)

create table if not exists event_registration_response_data(
    id serial primary key,
	response_id int references event_registration_response(id) on delete cascade,
	field_name varchar(255),
	field_value text
)

CREATE TABLE if not exists event_feedback (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE if not exists event_query (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE if not exists event_query_reply (
  id SERIAL PRIMARY KEY,
  query_id INTEGER NOT NULL REFERENCES event_query(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



--jerin
CREATE TABLE university_programs (
    "SCHOOL" TEXT,                   -- Changed to TEXT
    "STATE" TEXT,                    -- Changed to TEXT
    "CITY" TEXT,                     -- Changed to TEXT
    "NOC" TEXT,                      -- Changed to TEXT
    "PROGRAM" TEXT,
    "TYPE" TEXT,                     -- Changed to TEXT
    "DEPARTMENT" TEXT,               -- Changed to TEXT
    "DELIVERY" TEXT,                 -- Changed to TEXT
    "DURATION" TEXT,                 -- Changed to TEXT
    "PREREQ" TEXT,
    "LINK" TEXT,
    "LOC_LAT" NUMERIC(10, 7),
    "LOC_LONG" NUMERIC(10, 7),
    "WORLD_RANK" TEXT,               -- Stays TEXT
    "COUNTRY" TEXT,                  -- Changed to TEXT
    "TEACHING" TEXT,                 -- Stays TEXT
    "INTERNATIONAL" TEXT,            -- Stays TEXT
    "RESEARCH" TEXT,                 -- Stays TEXT
    "CITATIONS" TEXT,                -- Stays TEXT
    "INCOME" TEXT,                   -- Stays TEXT
    "TOTAL_SCORE" TEXT,              -- Stays TEXT
    "NUM_STUDENTS" TEXT,             -- Stays TEXT
    "STUDENT_STAFF_RATIO" TEXT,      -- Stays TEXT
    "INTERNATIONAL_STUDENTS" TEXT,   -- Stays TEXT
    "F_M_RATIO" TEXT,                -- Stays TEXT
    "YEAR" TEXT,                     -- Stays TEXT
    "timesData" TEXT
);


CREATE TABLE if not exists reviews (
    id SERIAL PRIMARY KEY,
    firm VARCHAR(255) NOT NULL,
    date_review DATE,
    job_title VARCHAR(255),
    current_status VARCHAR(255), -- Renamed from 'current' to avoid SQL keyword conflict
    location VARCHAR(255),
    overall_rating INTEGER,
    work_life_balance NUMERIC(2,1),
    culture_values NUMERIC(2,1),
    diversity_inclusion NUMERIC(2,1),
    career_opp NUMERIC(2,1),
    comp_benefits NUMERIC(2,1),
    senior_mgmt NUMERIC(2,1),
    recommend CHAR(1), -- 'o', 'x', 'v'
    ceo_approv CHAR(1), -- 'o', 'x', 'v'
    outlook CHAR(1), -- 'o', 'x', 'v', 'r' (assuming 'r' is neutral for outlook)
    headline TEXT,
    pros TEXT,
    cons TEXT
);



-- Add index for faster searches
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_name ON universities(name);

COMMIT;

CREATE TABLE event_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP,
    bank_transaction_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- We'll also create an index to speed up lookups by transaction ID.
CREATE INDEX idx_transaction_id ON event_transactions (transaction_id);

-- Optional: Add foreign key constraints to link to your other tables
-- ALTER TABLE event_transactions ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);
-- ALTER TABLE event_transactions ADD CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES event(id);