/* Update an employee role requests the employee's name and new role.
 */

let call_back = null;
let db = null;
const make_safe = require("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_update_an_employee_role(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

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
        .then(process_employee_update_role_answers_1);
}

function process_employee_update_role_answers_1(answers) {
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
            process_employee_update_role_answers_2(answers);
        }
    )
}

function process_employee_update_role_answers_2(answers) {
    const employee_first_name = answers.employee_first_name;
    const safe_employee_first_name = make_safe(employee_first_name);
    const employee_last_name = answers.employee_last_name;
    const safe_employee_last_name = make_safe(employee_last_name);
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
                call_back();
                return;
            }
            const manager_id = results[0].id;
            answers["manager_id"] = manager_id;
            process_employee_update_role_answers_3(answers);
        }
    )
}

function process_employee_update_role_answers_3(answers) {
    const first_name = answers.employee_first_name;
    const safe_first_name = make_safe(first_name);
    const last_name = answers.employee_last_name;
    const safe_last_name = make_safe(last_name);
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
            call_back();
        }
    )
}

module.exports = do_update_an_employee_role;
