// Load empty tables and toggle buttons into the DOM
Schedule.prototype.loadTables = function() {
    let schedule = this;

    for (let i = 1; i < this.specials.length; i++){
        this.specials[i].table = this.specials[i].scheduleTable(this.blocks);
        this.specialSchedules.append(this.specials[i].table);
        $("#rightbar").append(this.specials[i].button);
    }
    for (let i = 1; i < this.grades.length; i++){
        this.grades[i].table = this.grades[i].scheduleTable();
        this.gradeSchedules.append(this.grades[i].table);
        $("#leftbar").append(this.grades[i].button); 
    }

    $("#left").showPanel(schedule.gradeSchedules);
    $("#right").showPanel(schedule.specialSchedules);

    $("#leftbar, #rightbar").on("click", "button.topbar_button", function(){
        let button = $(this);
        let gOrS = button.c();
        if (gOrS.isVisible) {
            gOrS.table.slideUp();
        }
        else {
            gOrS.table.slideDown();
        }
        button.toggleClass(gOrS.colorClass).toggleClass(schedule.grades[0].colorClass);
        gOrS.isVisible = !gOrS.isVisible;
        button.blur();
    });

    // Keyup event listener to update Teachers' names
    $("#left").on("keyup", "input.teacher_name", function(e){
        let input = $(this);
        let teacher = input.data("teacher");
        teacher.name = input.val();
        input.parent().siblings().children(".schedule").each(function(){
            let c = $(this).c();
            if (c.hasSpecial()) {
                $(c.buttons[1]).specialsDisplay();
            }
        });
        if (e.which == 27 || e.which == 13){
            input.blur();
        }
    });
};

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

// Returns an $() objecy that shows a table of each specialist's schedule
Special.prototype.scheduleTable = function(blocks) {
    let table = $(document.createElement("div"));
    table.append(this.specialist);
    table.append("<span id='s" + this.n + "count' class = 'count'>Count</span>");
    table.append(document.createElement("TABLE"));
    table.find("table").attr("class", "specials schedule")
         .append(
         `<tbody><tr><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr></tbody>`
    );
    blocks.forEach( function(block) {
        table.find("tbody").append("<tr>");
        DAYS.forEach (function(day, d){
            table.find("tr:last").append("<td id=\""
                + "s" + this.n + "d" + d + "b" + block.n + "\"></td>");
        }, this);
    }, this);

    return table;
};

// Toggle buttons that control the visibilty of the tables
var topbarButton = function(gOrS) {
    let button = $(document.createElement("BUTTON"));

    button.attr("class", "topbar_button " + gOrS.topbarClass + " " + gOrS.colorClass)
          .append(gOrS.abbr)
          .data("c", gOrS);

    return button;
}

Special.prototype.specialistClassCount = function(schedule){
    let count = 0;
    schedule.classes.forEach(function(c){
        if (c.special == this && c.hasGrade()) {count++;}
    }, this);

    $("#s" + this.n + "count").html(" (" + count + ")");
}