/* Delete department requires the name of the department.  */
let call_back = null;
let db = null;
const make_safe = require ("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_delete_department(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

    const department_question = [
        {
            type: "input",
            name: "department_name",
            message: "Which department would you like to delete?",
            default: "none"
        }
    ];
    inquirer.prompt(department_question)
        .then(process_delete_department_answer_1);
}

function process_delete_department_answer_1(answers) {
    const department_name = answers.department_name;
    const safe_department_name = make_safe(department_name);

    /* Find the department's id and add it to answers.  */
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
            process_delete_department_answer_2(answers);
        }
    )
}

function process_delete_department_answer_2(answers) {
    const department_name = answers.department_name;
    const department_id = String(answers.department_id);
    const safe_department_id = make_safe(department_id);

    const SQL_query = "delete from department " +
        "where department.id = '" + safe_department_id + "';"
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Department " + department_name +
                " deleted.");
            call_back();
        }
    )
}

module.exports = do_delete_department;
