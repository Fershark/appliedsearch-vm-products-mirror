-- email match with firebase authentication 
DROP DATABASE IF EXISTS appliedreseach_vm;

CREATE DATABASE appliedreseach_vm;
USE appliedreseach_vm;

CREATE TABLE USERS (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(200),   
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE CONTRACTS(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    date DATETIME,
    user_id INTEGER,
    ip  VARCHAR(50),
    config_details TEXT, -- JSON config of the vm with ip
    status VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);

CREATE TABLE PRODUCT_COMPONENTS (
     id INTEGER AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     description TEXT,
     type VARCHAR(255)
);

CREATE TABLE ACTIONS(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vm_id  INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, 
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (vm_id) REFERENCES VMS(id)
);

CREATE TABLE VMS(
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    config_details TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);