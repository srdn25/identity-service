-- create test database
DROP DATABASE IF EXISTS identity_service_test_db;
CREATE DATABASE identity_service_test_db;

-- create test user
DROP ROLE IF EXISTS identity_service_test_user;
CREATE ROLE identity_service_test_user LOGIN PASSWORD 'testDbP@ssw0rD';
GRANT ALL PRIVILEGES ON DATABASE identity_service_test_db TO identity_service_test_user;