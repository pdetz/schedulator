// Constructor function for GRADES object
function Grade(name, abbr, color, block, n) {
    this.name = name;
    this.abbr = abbr;
    this.color = color;
    this.isVisible = true;
    this.css = "grade";
    this.defaultBlock = block;
    this.teachers = new Array(n); // an array of Teachers
    for (let i = 0; i < n; i++){
        this.teachers[i] = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + i), this);
        for (let d = 0; d < 5; d++){
            this.teachers[i].classes[d] =
                new Class(this.defaultBlock, d, this.teachers[i]);
        }
    }

    this.tableID = "#table" + this.abbr;
    this.buttonID = "#button" + this.abbr;
}

Grade.prototype.tempInitializer = function(specials) {
    this.teachers.forEach(function(teacher, i) {
        for (let c = 0; c < 5; c++){
            teacher.classes[c].special = specials[(2 * (c + i) + 1) % specials.length];
        }
    });
};

// Returns an HTML string that shows a table of that grade level's Specials schedule
Grade.prototype.scheduleTable = function() {
    let table = "<div id= \"" + this.tableID.slice(1, this.tableID.length) + "\">";
    table += "<table class=\"grade schedule\">"
            + "<tr><th>" + this.name + "</th>";
    for (let i = 0; i < 5; i++) {
        table += "<td>" + DAYS[i] + "</td>";
    }
    table += "</tr>";

    for (let i = 0; i < this.teachers.length; i++) {
        table += "<tr><td>" + this.teachers[i].name + "</td>";
        for (let d = 0; d < 5; d++) {
            table += "<td>" + this.teachers[i].classes[d].gradeLevelButton() + "</td>";
        }
        table += "</tr>";
    }

    table += "</th></table></div>";

    return table;
};