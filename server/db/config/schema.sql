-- ---
-- Globals
-- ---
-- ---
-- Table 'users'
-- 
-- ---
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS usersCharities;
DROP TABLE IF EXISTS users;
    
CREATE TABLE users (
  id BIGSERIAL   PRIMARY KEY,
  email VARCHAR(64) NOT NULL,
  password VARCHAR(64) NOT NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  phone_number VARCHAR(64) NULL DEFAULT NULL,
  plaid_access_token VARCHAR(256) NULL DEFAULT NULL,
  stripe_bank_account_token VARCHAR(256) NULL DEFAULT NULL,
  pending_balance REAL NULL DEFAULT NULL,
  monthly_total REAL NULL DEFAULT NULL,
  monthly_limit REAL NULL DEFAULT NULL,
  last_transaction_id VARCHAR(64) NULL DEFAULT NULL,
  bank_name VARCHAR(64) NULL DEFAULT NULL,
  bank_digits VARCHAR(4) NULL DEFAULT NULL
);

-- ---
-- Table 'charities'
-- 
-- ---

DROP TABLE IF EXISTS charities;
    
CREATE TABLE charities (
  id BIGSERIAL   PRIMARY KEY,
  name VARCHAR(64) NULL DEFAULT NULL,
  category VARCHAR(64) NULL DEFAULT NULL,
  ein VARCHAR(64) NULL DEFAULT NULL,
  donation_url VARCHAR(200) NULL DEFAULT NULL,
  city VARCHAR(64) NULL DEFAULT NULL,
  state VARCHAR(64) NULL DEFAULT NULL,
  zip VARCHAR(64) NULL DEFAULT NULL,
  balance_owed REAL NULL DEFAULT NULL,
  total_donated REAL NULL DEFAULT NULL,
  mission_statement VARCHAR(600) NULL DEFAULT NULL
);

-- ---
-- Table 'usersCharities'
-- 
-- ---

    
CREATE TABLE usersCharities (
  id BIGSERIAL   PRIMARY KEY,
  percentage REAL NULL DEFAULT NULL,
  id_users BIGSERIAL     references users(id),
  id_charities BIGSERIAL     references charities(id)
);

-- ---
-- Table 'transactions'
-- 
-- ---


    
CREATE TABLE transactions (
  id BIGSERIAL   PRIMARY KEY,
  amount REAL NULL DEFAULT NULL,
  id_users BIGSERIAL     references users(id),
  id_charities BIGSERIAL     references charities(id),
  date_time date      NOT NULL
);



-- ---
-- Table Properties
-- ---

-- ALTER TABLE users ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE charities ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE usersCharities ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE transactions ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO users (id,username,password,plaid_access_token,stripe_bank_account_token,pending_balance,monthly_total,limit,last_transaction_id) VALUES
-- ('','','','','','','','','');
-- INSERT INTO charities (id,name,category,ein,donation_url,city,state,state,zip,balance_owed,mission_statement) VALUES
-- ('','','','','','','','','','','');
-- INSERT INTO usersCharities (id,percentage,id_users,id_charities) VALUES
-- ('','','','');
-- INSERT INTO transactions (id`,`amount`,`id_users`,`id_charities`) VALUES
-- ('','','','');