function do_view_all_employees(db, call_back) {
    const SQL_query =
        "select employee.id as 'employee id', " +
        "employee.first_name as 'first name', " +
        "employee.last_name as 'last name', " +
        "role.title as 'job title', " +
        "department.name as 'department', " +
        "role.salary as salary, " +
        "concat (manager.first_name, space(1), manager.last_name) " +
        " as 'manager name' " +
        "from employee " +
        " left join role on employee.role_id = role.id " +
        " left join department on role.department_id = department.id " +
        " left join employee as manager " +
        "on employee.manager_id = manager.id " +
        "order by employee.id;";
    db.query(SQL_query,
        function (err, results) {
            if (err) { throw err; };
            console.table(results);
            call_back();
        }
    )
};

module.exports = do_view_all_employees;
