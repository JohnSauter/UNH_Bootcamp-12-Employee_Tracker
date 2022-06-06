/* Employee Tracker */

// Include the packages needed for this application.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const console_table = require("console.table");
const quotation_mark = RegExp("'", "g");

let connection_open = 0;
/* Connect to the database.  */
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'John_',
        // MySQL password
        password: '',
        database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
);
connection_open = 1;

/* Ask the user which procedure he wishes to follow.  
 * We come back here after each procedure.  */

function top_level_choice() {

    /* Ask the user what he would like to do.  */
    const choice_questions = [
        {
            type: "list",
            name: "choice",
            message: "Which of the following actions would you" +
                " like to perform?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "exit"
            ],
            default: "exit"
        }
    ];
    inquirer.prompt(choice_questions)
        .then(process_choice_answer);
}

/* Process the response to the choice question.  */
function process_choice_answer(answer) {

    /* All of the cases are asynchronous and call
     * top_level_choice when they are done, except
     * exit, which does not and therefore just 
     * closes the database connection and exits.
     */
    switch (answer.choice) {
        case "view all departments":
            do_view_all_departments();
            break;
        case "view all roles":
            do_view_all_roles();
            break;
        case "view all employees":
            do_view_all_employees();
            break;
        case "add a department":
            do_add_a_department();
            break;
        case "add a role":
            do_add_a_role();
            break;
        case "add an employee":
            do_add_an_employee();
            break;
        case "update an employee role":
            do_update_an_employee_role();
            break;
        case "exit":
            if (connection_open == 1) {
                db.end();
                db.destroy();
                connection_open = 0;
            }
            break;
        default:
            break;
    }
}

/* Respond to the user's choice of procedure.  */
function do_view_all_departments() {
    const SQL_statement = "select * from department " +
        "order by id;";
    db.query(SQL_statement,
        function (err, results) {
            if (err) { throw err; };
            console.table(results);
            top_level_choice();
        }
    )
}

function do_view_all_roles() {
    /* select title as "job title", role.id as "role id", 
     * department.name as "department name", salary from role 
     * join department on role.department_id = department.id;
     */
    const SQL_query = "select title as 'job title', " +
        "role.id as 'role id', " +
        "department.name as 'department name', " +
        "salary from role " +
        "join department on role.department_id = department.id;"
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.table(results);
            top_level_choice();
        }
    )
}

function do_view_all_employees() {
    const SQL_query =
        "select employee.id as 'employee id', " +
        "employee.first_name as 'first name', " +
        "employee.last_name as 'last name', " +
        "role.title as 'job title', " +
        "department.name as 'department', " +
        "role.salary as salary, " +
        "concat (manager.first_name, space(1), manager.last_name) " +
        " as 'manager name' " +
        "from employee " +
        "join role on employee.role_id = role.id " +
        " join department on role.department_id = department.id " +
        " left join employee as manager " +
        "on employee.manager_id = manager.id;";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.table(results);
            top_level_choice();
        }
    )
};

function do_add_a_department() {
    /* Ask the user for the name of the department  */
    const department_name_question = [
        {
            type: "input",
            name: "department_name",
            message: "What is the name of the department?",
            default: "none"
        }
    ];
    inquirer.prompt(department_name_question)
        .then(process_department_name_answer);
}

function process_department_name_answer(answer) {
    const department_name = answer.department_name;
    /* insert into department (name) 
     * values ("<department_name>"); */
    const safe_department_name = department_name.replace(quotation_mark, "''");
    const SQL_query = "insert into department (name)" +
        " values ('" + safe_department_name + "');";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Department " + department_name +
                " added.");
            const SQL_query = "select id from department " +
                "where name = '" + safe_department_name + "';";
            db.query(SQL_query,
                function (err, results) {
                    if (err) { throw err; };
                    console.log("Id of department " +
                        department_name + " is " + results[0].id +
                        ".");
                    top_level_choice();
                }
            )
        }
    )
};

function do_add_a_role() {
    /* Ask the user for the name, salary and title
     * of the role  */
    const role_questions = [
        {
            type: "input",
            name: "role_name",
            message: "What is the name of the role?",
            default: "none"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for the role?",
            default: "0"
        },
        {
            type: "input",
            name: "department_name",
            message: "In what department is the role?",
            default: "none"
        }
    ];
    inquirer.prompt(role_questions)
        .then(process_role_answers_1);
}

function process_role_answers_1(answers) {
    const department_name = answers.department_name;
    const safe_department_name = department_name.replace(quotation_mark, "''");
    /* Convert department name into department id
     * and add it to answers.  */
    const SQL_query = "select id from department where " +
        "department.name = '" + safe_department_name + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no department named " +
                    department_name + ".");
                top_level_choice();
                return;
            }
            const department_id = results[0].id;
            answers["department_id"] = department_id;
            process_role_answers_2(answers);
        }
    )
}

function process_role_answers_2(answers) {
    const role_name = answers.role_name;
    const safe_role_name = role_name.replace(quotation_mark, "''");
    const salary = answers.salary;
    const safe_salary = salary.replace(quotation_mark, "''");
    const department_id = answers.department_id;
    const SQL_query = "insert into role " +
        "(title, salary, department_id) " +
        " values ('" + safe_role_name + "', " +
        "'" + safe_salary + "', " +
        "'" + department_id + "');";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Role " + role_name + " added.");
            top_level_choice();
        }
    )
}

function do_add_an_employee() {
    /* Ask the user for the first name, last name, role and
     * manager of the new employee.  */
    const employee_questions = [
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee?",
            default: "none"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee?",
            default: "none"
        },
        {
            type: "input",
            name: "title",
            message: "What is the role (title) of the employee?",
            default: "none"
        },
        {
            type: "input",
            name: "manager_name",
            message: "Who is the employee's manager?",
            default: "none"
        }
    ];
    inquirer.prompt(employee_questions)
        .then(process_employee_answers_1);
}

function process_employee_answers_1(answers) {
    const title = answers.title;
    const safe_title = title.replace(quotation_mark, "''");
    /* Convert title into role id
     * and add it to answers.  */
    const SQL_query = "select id from role where " +
        "role.title = '" + safe_title + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no role entitled " +
                    title + ".");
                top_level_choice();
                return;
            }
            const role_id = results[0].id;
            answers["role_id"] = role_id;
            process_employee_answers_2(answers);
        }
    )
}

function process_employee_answers_2(answers) {
    const manager_name = answers.manager_name;
    const safe_manager_name = manager_name.replace(quotation_mark, "''");
    /* Convert manager name into employee id
     * and add it to answers.  */
    const SQL_query = "select id from employee where " +
        "concat(employee.first_name, space(1), employee.last_name) " +
        " = '" + safe_manager_name + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no manager named " +
                    manager_name + ".");
                top_level_choice();
                return;
            }
            const manager_id = results[0].id;
            answers["manager_id"] = manager_id;
            process_employee_answers_3(answers);
        }
    )
}

function process_employee_answers_3(answers) {
    const first_name = answers.first_name;
    const safe_first_name = first_name.replace(quotation_mark, "''");
    const last_name = answers.last_name;
    const safe_last_name = last_name.replace(quotation_mark, "''");
    const role_id = answers.role_id;
    const manager_id = answers.manager_id;

    const SQL_query = "insert into employee " +
        "(first_name, last_name, role_id, manager_id) " +
        " values ('" + safe_first_name + "', " +
        "'" + safe_last_name + "', " +
        "'" + role_id + "', " +
        "'" + manager_id + "');";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Employee " + first_name +
                " " + last_name + " added.");
            top_level_choice();
        }
    )
}

function do_update_an_employee_role() {
    const employee_update_questions = [
        {
            type: "input",
            name: "employee_first_name",
            message: "What is the first name of the employee?",
            default: "none"
        },
        {
            type: "input",
            name: "employee_last_name",
            message: "What is the last name of the employee?",
            default: "none"
        },
        {
            type: "input",
            name: "title",
            message: "What is the new role (new title) of the employee?",
            default: "none"
        }
    ];
    inquirer.prompt(employee_update_questions)
        .then(process_employee_update_answers_1);
}
function process_employee_update_answers_1(answers) {
    const title = answers.title;
    const safe_title = title.replace(quotation_mark, "''");
    /* Convert title into role id
     * and add it to answers.  */
    const SQL_query = "select id from role where " +
        "role.title = '" + safe_title + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no role entitled " +
                    title + ".");
                top_level_choice();
                return;
            }
            const role_id = results[0].id;
            answers["role_id"] = role_id;
            process_employee_update_answers_2(answers);
        }
    )
}

function process_employee_update_answers_2(answers) {
    const employee_first_name = answers.employee_first_name;
    const safe_employee_first_name = employee_first_name.replace(quotation_mark, "''");
    const employee_last_name = answers.employee_last_name;
    const safe_employee_last_name = employee_last_name.replace(quotation_mark, "''");
    /* Convert employee name into employee id
     * and add it to answers.  */
    const SQL_query = "select id from employee where " +
        "employee.first_name = '" + safe_employee_first_name +
        "' and employee.last_name = '" + safe_employee_last_name +
        "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no employee named " +
                    employee_first_name + " " +
                    employee_last_name + ".");
                top_level_choice();
                return;
            }
            const manager_id = results[0].id;
            answers["manager_id"] = manager_id;
            process_employee_update_answers_3(answers);
        }
    )
}

function process_employee_update_answers_3(answers) {
    const first_name = answers.employee_first_name;
    const safe_first_name = first_name.replace(quotation_mark, "''");
    const last_name = answers.employee_last_name;
    const safe_last_name = last_name.replace(quotation_mark, "''");
    const role_id = answers.role_id;

    const SQL_query = "update employee " +
        "set role_id = '" + role_id + "' " +
        "where employee.first_name = '" + safe_first_name + "'" +
        " and employee.last_name = '" + safe_last_name + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Employee " + first_name +
                " " + last_name + " updated.");
            top_level_choice();
        }
    )
}


/* We start by asking the user what he wants to do.  */
top_level_choice();
