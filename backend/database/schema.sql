-- email match with firebase authentication 
DROP DATABASE IF EXISTS appliedreseach_vm;

CREATE DATABASE appliedreseach_vm;
USE appliedreseach_vm;

CREATE TABLE USERS (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(200) NOT NULL,   
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE PRODUCTS (
     id INTEGER AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     description TEXT,
     `version` VARCHAR(255)
);

CREATE TABLE VMS(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    products JSON, -- JSON array of products
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);

CREATE TABLE ACTIONS (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vm_id  INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- create/power-on/power-off/install/uninstall/initial
    product JSON, -- mysql/lamp/ {instance-of-product-table}
    status VARCHAR(20) NOT NULL, -- in-progress/errored/completed
    FOREIGN KEY (vm_id) REFERENCES VMS(id)
);