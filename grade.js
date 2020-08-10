// Constructor function for GRADES object
function Grade(name, abbr, color, block, t, n) {
    this.name = name;
    this.abbr = abbr;
    this.defaultBlock = block;
    this.n = n;
    this.color = color;

    this.teachers = new Array(t); // an array of Teachers
    for (let i = 0; i < t; i++){
        this.teachers[i] = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + i), this);
    }

    this.isVisible = true;
    this.topbarClass = "grade";
    this.colorClass = "grade" + n.toString();
    
    this.table = "";
    this.button = topbarButton(this);

    this.stylesheet = createStylesheet(this.colorClass);
}

function Teacher(name, grade) {
    this.name = name;
    this.grade = grade; 
    this.n = function() {
        return this.grade.teachers.indexOf(this);
    }
}

// Returns an $() object that shows a table of that grade level's Specials schedule
Grade.prototype.scheduleTable = function() {
    let table = $(document.createElement("div"));
    table.append(document.createElement("TABLE"));
    table.children().attr("class", "grade schedule");
    table.data("grade", this);
    table.children().append(
        `<tbody><tr><th>${this.name}</th><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr></tbody>`
    );
    this.teachers.forEach( function(teacher){
        table.find("tbody").append("<tr><td>" + "</td></tr>");
        table.find("td:last").append('<input type=\'text\' class=\'teacher_name\' value="' + teacher.name + '"></input>');
        table.find("input:last").data("teacher", teacher);
        DAYS.forEach (function(day, d){
            table.find("tr:last").append("<td id=\""
                + "g" + this.n + "d" + d + "t" + teacher.n() + "\"></td>");
        }, this);
    }, this);

    return table;
};