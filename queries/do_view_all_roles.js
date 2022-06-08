function do_view_all_roles(db, call_back) {
    const SQL_query = "select title as 'job title', " +
        "role.id as 'role id', " +
        "department.name as 'department name', " +
        "salary from role " +
        "join department on role.department_id = department.id" +
        " order by role.id;"
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.table(results);
            call_back();
        }
    )
}

module.exports = do_view_all_roles;
