/* Make_safe transforms a string into a safe string
 * by quoting its quotation marks.  The result can be
 * safely used in an SQL statement by surrounding it
 * with quotation marks.  */

/* The syntax of prepared statements is clumsy when
 * SQL statements are long, with many variables.
 * You have to count the question marks and in
 * parallel count the variables.  It would be easy
 * to overlook a question mark and put the data
 * items in the wrong place.  A better syntax would
 * be like the JavaScript back tick, where the names
 * of the variables are in-line with the commands.
 * 
 * I have developed a better way to prevent SQL injection
 * attacks, one that does not depend on counting the question
 * marks in a wall of text.  Here are my rules:
 * 
 * 1. Only data items (strings and numbers) are substituted
 *    in the SQL command.
 * 2. The data items are "made safe" by doubling any single 
 *    quotation marks.
 * 3. The safe version of the data item is surrounded by
 *    single quotation marks in the text of the SQL command.
 * 
 * Following these rules ensures that data items cannot escape
 * the quotation marks and be interpreted as SQL commands.
 */

function make_safe(the_string) {
    const quotation_mark = RegExp("'", "g");
    return the_string.replace(quotation_mark, "''");
}

module.exports = make_safe;
