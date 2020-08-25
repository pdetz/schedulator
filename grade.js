// Constructor function for GRADES object
function Grade(name, abbr, color, block, t, n, palette) {
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
    writeCSSRules(this, palette);
}

// Removes a Grade object and associated DOM elements
Schedule.prototype.deleteGrade = function(grade){
    let schedule = this;
    schedule.classes.forEach(c => {
        if (c.grade == grade) {
            schedule.deleteClass(c);
        }
    });
    schedule.resetButtons();

    grade.table.remove();
    grade.button.remove();
    grade.stylesheet.remove();

    //$(".schedule.specials td:empty").addEmptyClass(schedule);

    let index = schedule.grades.indexOf(grade);
    schedule.grades.splice(index,1);

    grade = "";
}

function Teacher(name, grade) {
    this.name = name;
    this.grade = grade; 
    this.n = function() {
        return this.grade.teachers.indexOf(this);
    }
}

Grade.prototype.removeTeacher = function(n){
    let grade = this;
    let teacher = grade.teachers[n];
    $("#trt" + n.toString() + "g" + grade.n.toString()).remove();
    schedule.classes.forEach(c => {
        if (c.teacher == teacher) {
            schedule.deleteClass(c);
        }
    });
}

// Returns an $() object that shows a table of that grade level's Specials schedule
Grade.prototype.scheduleTable = function() {
    let table = make("div", "grade_schedule");
    table.append(make("table", "grade schedule"));
    table.data("grade", this);
    table.children().append(
        `<tbody><tr><th class="name">${this.name}</th><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr></tbody>`
    );
    this.teachers.forEach( function(teacher){
        table.find("tbody").append(teacher.teacherRow());
    });
    return table;
};

Teacher.prototype.teacherRow = function(){
    let teacher = this;
    let grade = teacher.grade;
    let input = $(document.createElement("input"))
                    .attr("type", "text")
                    .attr("class", "teacher_name")
                    .val(teacher.name);
    let tr = make("tr", "#trt" + teacher.n().toString() + "g" + grade.n.toString())
                .data("obj", teacher)
                .append( make("td").append(input));
    DAYS.forEach (function(day, d){
        tr.append( $(document.createElement("td"))
                    .attr("id", "g" + grade.n + "d" + d + "t" + teacher.n()));
    });
    teacher.tr = tr;
    return tr;
}

Grade.prototype.defaultBlockButton = function(){
    let grade = this;
    let button = make("button", "arrow block")
                    .append(grade.defaultBlock.name).append(ARROW_DOWN);
    grade.defaultBlockButton = button;
    return button;
}

// Renumber the Special and all associated buttons to keep it consistent with its index in the array
Grade.prototype.renumber = function(n, schedule){
    let grade = this;
    // find all the buttons associated with the special and remove the old colorClass from them
    let updateButtons = schedule.specialSchedules.find("." + grade.colorClass).add($("." + grade.colorClass));
    updateButtons.removeClass(grade.colorClass);

    // Update n, update the colorClass, and update the css stylesheet associated with the special
    grade.n = n;
    grade.colorClass = "grade" + n.toString();
    grade.stylesheet.id = grade.colorClass;
    writeCSSRules(grade, schedule.palette);
    
    // Update all associated buttons with the new colorClass name
    updateButtons.addClass(grade.colorClass);
    schedule.grades[n].table.renumberTable("g", n+1, n);
    
}