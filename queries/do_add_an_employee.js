/* Add a role requests the name, role and manager
 * of the new employee.  */

let call_back = null;
let db = null;
const make_safe = require ("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_add_an_employee(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

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
    const safe_title = make_safe(title);
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
                call_back();
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
    const safe_manager_name = make_safe(manager_name);
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
                call_back();
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
    const safe_first_name = make_safe(first_name);
    const last_name = answers.last_name;
    const safe_last_name = make_safe(last_name);
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
            call_back();
        }
    )
}

module.exports = do_add_an_employee;
