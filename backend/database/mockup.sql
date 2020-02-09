USE appliedreseach_vm;

insert into USERS (id, uid, name, email, phone, address) values (1, 'HDAdsadhsadioupomnjJK1', 'Hau Nguyen', 'hau.nguyen@gmail.com', '5656565786', '123 Royal Ave');
insert into USERS (id, uid, name, email, phone, address) values (2, 'udsadjklsadkKJJ987KLJH', 'Quang Le', 'quang.le@gmail.com', '787878879', '789 Douglas Road');
insert into USERS (id, uid, name, email, phone, address) values (3, 'iudfasfnbKiuyIOUYb7asf', 'Quang Le', 'quang.le@gmail.com', '232322413', '344 Kingsway Ave');

insert into CONTRACTS (id, date, user_id, ip, config_details, status) values (1, '2020-01-01 20:00:00', 1, '10.23.45.245', '{"OS": "ubuntu:14.04", "RAM": 2, "CPU": 2, "SSD": 20, "APPS": ["Apache", "MySQL", "Perl", "Wordpress"]}', 'enable');
insert into CONTRACTS (id, date, user_id, ip, config_details, status) values (2, '2020-01-01 20:00:00', 2, '10.23.45.245', '{"OS": "ubuntu:14.04", "RAM": 2, "CPU": 2, "SSD": 20, "APPS": []}', 'enable');
insert into CONTRACTS (id, date, user_id, ip, config_details, status) values (3, '2020-01-01 20:00:00', 3, '10.23.45.245', '{"OS": "ubuntu:14.04", "RAM": 2, "CPU": 2, "SSD": 20, "APPS": ["Apache", "MySQL", "Perl", "Money Exchange App"]}', 'enable');

insert into PRODUCT_COMPONENTS (id, name, description, type) values (1, 'CPU', 'Central Processing Unit', 'Hardware');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (2, 'RAM', 'Random Access Memory', 'Hardware');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (3, 'SSD', 'Solid State Drive', 'Hardware');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (4, 'HDD', 'Hard Disk Drive', 'Hardware');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (5, 'Ubuntu', 'Linux', 'Operating System');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (6, 'Window Server', 'Windows', 'Operating System');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (7, 'MySQL', '', 'Application');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (8, 'Apache', '', 'Application');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (9, 'Nginx', '', 'Application');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (10, 'Perl', '', 'Application');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (11, 'Node', '', 'Application');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (12, 'Money Exchange App', 'Simple application that allow you to calculate exchange money between currencies', 'Application');
insert into PRODUCT_COMPONENTS (id, name, description, type) values (13, 'WordPress', 'Popular CMS application', 'Application');


