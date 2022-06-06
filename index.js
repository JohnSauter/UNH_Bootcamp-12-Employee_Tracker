/* Employee Tracker */

// Include the packages needed for this application.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const console_table = require("console.table");

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
    const quotation_mark = RegExp("'", "g");
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
    top_level_choice();
}

function do_add_an_employee() {
    top_level_choice();
}

function do_update_an_employee_role() {
    top_level_choice();
}
top_level_choice();
