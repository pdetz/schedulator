// Returns an HTML string that shows a table of that grade level's Specials schedule
Grade.prototype.scheduleTable = function() {
    let table = document.createElement("div");
    $(table).append(document.createElement("TABLE"));
    $(table).children().attr("class", "grade schedule");
    $(table).children().append(
        "<tr>" +
            "<th>" + this.name + "</th>" +
            "<td>" + DAYS[0] + "</td>" +
            "<td>" + DAYS[1] + "</td>" +
            "<td>" + DAYS[2] + "</td>" +
            "<td>" + DAYS[3] + "</td>" +
            "<td>" + DAYS[4] + "</td>" +
        "</tr>"
    );
    this.teachers.forEach( function(teacher, i){
        $(table).find("tbody").append(
            "<tr>" +
                "<td>" + teacher.name + "</td>" +
                "<td></td><td></td><td></td><td></td><td></td>" +
            "</tr>"
        );
    });

    return table;
};

// Returns an HTML string that shows a table of each specialist's schedule
Special.prototype.scheduleTable = function(blocks, grades) {
    let table = document.createElement("div");
    $(table).append(this.specialist);
    $(table).append(document.createElement("TABLE"));
    $(table).children().attr("class", "specials schedule");
    $(table).children().append(
        "<tr>" +
            "<td>" + DAYS[0] + "</td>" +
            "<td>" + DAYS[1] + "</td>" +
            "<td>" + DAYS[2] + "</td>" +
            "<td>" + DAYS[3] + "</td>" +
            "<td>" + DAYS[4] + "</td>" +
        "</tr>"
    );
    blocks.forEach( function(block, b) {
        $(table).find("tbody").append("<tr>");
        DAYS.forEach (function(day, d){
            $(table).find("tr:last").append("<td id=\""
                + "s" + this.n + "d" + d + "b" + block.n + "\"></td>");
        }, this);
    }, this);

    return table;
};