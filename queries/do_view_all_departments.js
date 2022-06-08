function do_view_all_departments(db, call_back) {
    const SQL_statement = "select id, name from department " +
        "order by id;";
    db.query(SQL_statement,
        function (err, results) {
            if (err) { throw err; };
            console.table(results);
            call_back();
        }
    )
}

module.exports = do_view_all_departments;
