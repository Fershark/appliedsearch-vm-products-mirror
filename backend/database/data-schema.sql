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
     'version' VARCHAR(255)
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
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '4.2');
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '4.0');
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '3.6');
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '3.4');
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '3.2');
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '3.0');
insert into PRODUCTS (name, description, version) values ('MongoDB', 'A document database with the scalability and flexibility that you want with the querying and indexing that you need', '2.6');
insert into PRODUCTS (name, description, version) values ('Apache', 'A free and open-source cross-platform web server software, released under the terms of Apache License 2.0. Apache is developed and maintained by an open community of developers under the auspices of the Apache Software Foundation.', '2.4');
insert into PRODUCTS (name, description, version) values ('Apache', 'A free and open-source cross-platform web server software, released under the terms of Apache License 2.0. Apache is developed and maintained by an open community of developers under the auspices of the Apache Software Foundation.', '2.2');
insert into PRODUCTS (name, description, version) values ('Apache', 'A free and open-source cross-platform web server software, released under the terms of Apache License 2.0. Apache is developed and maintained by an open community of developers under the auspices of the Apache Software Foundation.', '2.0');
insert into PRODUCTS (name, description, version) values ('Nginx', 'A web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.', '1.16.1');
insert into PRODUCTS (name, description, version) values ('Nginx', 'A web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.', '1.14.2');
insert into PRODUCTS (name, description, version) values ('Nginx', 'A web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.', '1.12.2');
insert into PRODUCTS (name, description, version) values ('Nginx', 'A web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.', '1.10.3');
insert into PRODUCTS (name, description, version) values ('Nginx', 'A web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.', '1.8.1');
insert into PRODUCTS (name, description, version) values ('Nginx', 'A web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.', '1.6.3');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '13.11.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '13.10.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '13.9.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '13.8.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '12.16.1');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '12.16.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '12.15.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '12.14.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '12.13.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '11.15.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '10.19.0');
insert into PRODUCTS (name, description, version) values ('Node.js', 'A JavaScript runtime built on Chrome''s V8 JavaScript engine.', '9.11.2');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '3.8.2');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '3.7.7');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '3.6.10');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '3.5.9');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '3.4.10');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '3.3.7');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '2.7.16');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '2.7.6');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '2.7.2');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '2.6.7');
insert into PRODUCTS (name, description, version) values ('Python', 'An interpreted, high-level, general-purpose programming language.', '2.5.6');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '5.3');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '5.2');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '5.1');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '4.9');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '4.5');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '4.0');
insert into PRODUCTS (name, description, version) values ('WordPress', 'A free and open-source content management system (CMS) written in PHP[4] and paired with a MySQL or MariaDB database.', '3.9');