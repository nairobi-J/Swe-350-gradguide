
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

-- Add index for faster searches
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_name ON universities(name);

COMMIT;

