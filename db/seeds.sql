INSERT INTO dept(name)
values('Management'), ('Band Member');

INSERT INTO role( title, salary, dept_id) 
VALUES ( 'Manager', '175000', 1),('Assistant Manager', '100000', 1),( 'Drums/VOX', '500000', 2),('Lead Guitar/VOX', '750000', 2),('Bass/Guitar/Piano/VOX', '1200000', 2),('Guitar/VOX', '1000000', 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
values('Jeremy', 'Cornwall', 1, 1),('George', 'Cornwall', 2,1),('Ringo', 'Starr', 3, 2),('George', 'Harrison', 4,2),('Paul', 'McCartney', '5', 2),('John', 'Lennon', '6',2);






