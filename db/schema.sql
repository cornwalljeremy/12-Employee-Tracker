DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_db;

CREATE TABLE employee(
id INT AUTO_INCREMENT,
employee_id INT,
dept_id INT,
first_name VARCHAR(30),
last_name VARCHAR(30),
manager_id INT,
PRIMARY KEY(id),
FOREIGN KEY(employee_id) REFERENCES employee(id),
FOREIGN KEY(dept_id) REFERENCES dept(id)
);

CREATE TABLE role(
id INT auto_increment,
employee_id INT,
dept_id INT,
title VARCHAR(30),
salary DECIMAL,
PRIMARY KEY(id),
FOREIGN KEY(employee_id) REFERENCES employee(id),
FOREIGN KEY(dept_id) REFERENCES dept(id)
);

CREATE TABLE dept(
id INT AUTO_INCREMENT,
employee_id INT,
dept_id INT,
name VARCHAR(30),
PRIMARY KEY (id),
FOREIGN KEY(employee_id) REFERENCES employee(id),
FOREIGN KEY(dept_id) REFERENCES dept(id)
);