/* Delete employee requests the name of the employee.  */

let call_back = null;
let db = null;
const make_safe = require ("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_delete_employee(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

    const employee_questions = [
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee to be deleted?",
            default: "none"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee to be deleted?",
            default: "none"
        }
    ];
    inquirer.prompt(employee_questions)
        .then(process_delete_employee_answers_1);
}

function process_delete_employee_answers_1(answers) {
    const first_name = answers.first_name;
    const safe_first_name = make_safe(first_name);
    const last_name = answers.last_name;
    const safe_last_name = make_safe(last_name);

    /* Find the employee's id and add it to answers.  */
    const SQL_query = "select id from employee where " +
        "employee.first_name = '" + safe_first_name + "' and " +
        "employee.last_name = '" + safe_last_name + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no employee named " +
                    first_name + " " + last_name + ".");
                call_back();
                return;
            }
            const employee_id = results[0].id;
            answers["employee_id"] = employee_id;
            process_delete_employee_answer_2(answers);
        }
    )
}

function process_delete_employee_answer_2(answers) {
    const first_name = answers.first_name;
    const last_name = answers.last_name;
    const employee_id = answers.employee_id;

    const SQL_query = "delete from employee " +
        "where employee.id = '" + employee_id + "';"
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Employee " + first_name + " " +
                last_name + " deleted.");
            call_back();
        }
    )
};

module.exports = do_delete_employee;
