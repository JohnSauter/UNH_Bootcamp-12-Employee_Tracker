/* Add a role requests the name, salary and department
 * of the new department.  */

let call_back = null;
let db = null;
const make_safe = require ("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_add_a_role(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

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
    const safe_department_name = make_safe(department_name);
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
                call_back();
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
    const safe_role_name = make_safe(role_name);
    const salary = answers.salary;
    const safe_salary = make_safe(salary);
    const department_id = String(answers.department_id);
    const safe_department_id = make_safe(department_id);
    const SQL_query = "insert into role " +
        "(title, salary, department_id) " +
        " values ('" + safe_role_name + "', " +
        "'" + safe_salary + "', " +
        "'" + safe_department_id + "');";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Role " + role_name + " added.");
            call_back();
        }
    )
}

module.exports = do_add_a_role;
