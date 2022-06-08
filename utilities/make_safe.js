/* Make_safe transforms a string into a safe string
 * by quoting its quotation marks.  The result can be
 * safely used in an SQL statement by surrounding it
 * with quotation marks.  */

function make_safe(the_string) {
    const quotation_mark = RegExp("'", "g");
    return the_string.replace(quotation_mark, "''");
}

module.exports = make_safe;
