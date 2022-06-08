/* Employee Tracker */

// Include the packages needed for this application.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const console_table_object = require("console.table");

const make_safe = require ("./utilities/make_safe.js");

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
                "update an employee manager",
                "view employees by manager",
                "view employees by department",
                "delete department",
                "delete role",
                "delete employee",
                "view department budget",
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
            do_view_all_departments(db, top_level_choice);
            break;

        case "view all roles":
            do_view_all_roles(db, top_level_choice);
            break;

        case "view all employees":
            do_view_all_employees(db, top_level_choice);
            break;

        case "add a department":
            do_add_a_department(db, top_level_choice);
            break;

        case "add a role":
            do_add_a_role(db, top_level_choice);
            break;

        case "add an employee":
            do_add_an_employee(db, top_level_choice);
            break;

        case "update an employee role":
            do_update_an_employee_role(db, top_level_choice);
            break;

        case "update an employee manager":
            do_update_an_employee_manager(db, top_level_choice);
            break;

        case "view employees by manager":
            do_view_employees_by_manager(db, top_level_choice);
            break;

        case "view employees by department":
            do_view_employees_by_department(db, top_level_choice);
            break;

        case "delete department":
            do_delete_department(db, top_level_choice);
            break;

        case "delete role":
            do_delete_role(db, top_level_choice);
            break;

        case "delete employee":
            do_delete_employee(db, top_level_choice);
            break;

        case "view department budget":
            do_view_department_budget(db, top_level_choice);
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

const do_view_all_departments = require("./queries/do_view_all_departments.js");
const do_view_all_roles = require ("./queries/do_view_all_roles.js");
const do_view_all_employees = require ("./queries/do_view_all_employees.js");
const do_add_a_department = require ("./queries/do_add_a_department.js");
const do_add_a_role = require ("./queries/do_add_a_role.js");
const do_add_an_employee = require ("./queries/do_add_an_employee.js");
const do_update_an_employee_role = require("./queries/do_update_an_employee_role.js");
const do_update_an_employee_manager = require("./queries/do_update_an_employee_manager.js");
const do_view_employees_by_manager = require("./queries/do_view_employees_by_manager.js");
const do_view_employees_by_department = require("./queries/do_view_employees_by_department.js");
const do_delete_department = require("./queries/do_delete_department.js");
const do_delete_role = require("./queries/do_delete_role.js");
const do_delete_employee = require("./queries/do_delete_employee.js");
const do_view_department_budget = require("./queries/do_view_department_budget.js");

/* We start by asking the user what he wants to do.  */
top_level_choice();
