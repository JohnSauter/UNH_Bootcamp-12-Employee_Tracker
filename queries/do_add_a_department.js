/* Add a department requests the name of the new department.
 */
let call_back = null;
let db = null;
const make_safe = require ("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_add_a_department(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

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
    const safe_department_name = make_safe(department_name);
    const SQL_query = "insert into department (name)" +
        " values ('" + safe_department_name + "');";
    db.query(SQL_query,
        function (err, results) {
            if (err) {
                console.log("There is already a department " +
                    " named " + department_name + ".");
                call_back();
                return;
            }
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
                    call_back();
                }
            )
        }
    )
};

module.exports = do_add_a_department;
