/* Employee Tracker */

// Include the packages needed for this application.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const console_table = require("console.table");

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
        case "view_all_roles":
            do_view_all_roles();
            break;
        case "view_all_employees":
            do_view_all_employees();
            break;
        case "add a department":
            do_add_a_department();
            break;
        case "add a role":
            do_add_a_role();
            break;
        case "add an employee":
            do_add_an_employees();
            break;
        case "update an employee role":
            do_update_an_employee_role();
            break;
        case "exit":
            break;
        default:
            break;
    }
    db.end();
}

/* Respond to the user's choice of procedure.  */
function do_view_all_departments() {
    top_level_choice();
}

function do_view_all_roles () {
    top_level_choice();
}

function do_view_all_employees () {
    top_level_choice();
}

function do_add_a_department () {
    top_level_choice();
}

function do_add_a_role () {
    top_level_choice();
}

function do_add_an_employee () {
    top_level_choice();
}

function do_update_an_employee_role () {
    top_level_choice();
}
top_level_choice();
