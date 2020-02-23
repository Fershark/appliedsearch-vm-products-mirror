-- email match with firebase authentication 
DROP DATABASE IF EXISTS appliedreseach_vm;

CREATE DATABASE appliedreseach_vm;
USE appliedreseach_vm;

CREATE TABLE USERS (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
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
    ipV4 VARCHAR(100),
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
    FOREIGN KEY (vm_id) REFERENCES VMS(id) ON DELETE CASCADE
);

-- INITIALIZE DATA
insert into PRODUCTS (name, description, version) values ('MySQL', 'Relational Datatabase Management System', '5.5');
insert into PRODUCTS (name, description, version) values ('MySQL', 'Relational Datatabase Management System', '5.6');
insert into PRODUCTS (name, description, version) values ('MySQL', 'Relational Datatabase Management System', '5.7');
insert into PRODUCTS (name, description, version) values ('MySQL', 'Relational Datatabase Management System', '8.0');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '5.4');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '5.5');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '5.6');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '7.0');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '7.1');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '7.2');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '7.3');
insert into PRODUCTS (name, description, version) values ('PHP', 'HTML-embedded scripting language', '7.4');