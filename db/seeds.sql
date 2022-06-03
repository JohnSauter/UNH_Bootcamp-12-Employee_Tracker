insert into department (id, name)
values (1, "Department of the President"),
	(2, "Department of the Vice President"),
	(3, "Department of Human Resources"),
	(4, "Department of Redundency Department");

insert into role (id, title, salary, department_id)
values (1, "President", 1000000.00, 1),
	(2, "Vice President", 900000.00, 2),
	(3, "Recruiter", 500000.00, 3),
	(4, "Terminator", 50000.00, 3),
	(5, "Telephone Sanitizer", 25000.00, 4);

insert into employee (id, first_name, last_name, 
	role_id, manager_id)
values (1, "John", "Sauter", 1, null),
	(2, "Robert", "Sauter", 2, 1),
	(3, "Gypsy Rose", "Lee", 3, 2),
	(4, "Arnold", "Schwarzenegger", 4, 2),
	(5, "Douglas", "Adams", 5, 2);

