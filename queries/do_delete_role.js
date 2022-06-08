/* Delete role requests the name of the role.
 */

let call_back = null;
let db = null;
const make_safe = require ("../utilities/make_safe.js");
const inquirer = require("inquirer");

function do_delete_role(the_db, the_call_back) {
    db = the_db;
    call_back = the_call_back;

    const role_question = [
        {
            type: "input",
            name: "title",
            message: "Which role (title) would you like to delete?",
            default: "none"
        }
    ];
    inquirer.prompt(role_question)
        .then(process_delete_role_answer_1);
}

function process_delete_role_answer_1(answers) {
    const title = answers.title;
    const safe_title = make_safe(title);

    /* Find the role's id and add it to answers.  */
    const SQL_query = "select id from role where " +
        "role.title = '" + safe_title + "';";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            if (results.length == 0) {
                console.log("There is no role (title) named " +
                    title + ".");
                call_back();
                return;
            }
            const role_id = results[0].id;
            answers["role_id"] = role_id;
            process_delete_role_answer_2(answers);
        }
    )
}

function process_delete_role_answer_2(answers) {
    const title = answers.title;
    const role_id = String(answers.role_id);
    const safe_role_id = make_safe(role_id);

    const SQL_query = "delete from role " +
        "where role.id = '" + safe_role_id + "';"
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.log("Role (title) " + title +
                " deleted.");
            call_back();
        }
    )
}

module.exports = do_delete_role;
