// Load empty tables and toggle buttons into the DOM
Schedule.prototype.loadTables = function() {
    this.specials.forEach(function(special) {
        if (special.n != "0") {
            special.table = special.scheduleTable(this.blocks);
            $("#right").append(special.table);
            $("#rightbar").append(special.button);
        }       
    }, this);

    this.grades.forEach(function(grade) {
        if (grade.n != "0") {
            $("#left").append(grade.table);
            $("#leftbar").append(grade.button);    
        }
    }, this);
};

// Returns an HTML string that shows a table of that grade level's Specials schedule
Grade.prototype.scheduleTable = function() {
    let table = document.createElement("div");
    $(table).append(document.createElement("TABLE"));
    $(table).children().attr("class", "grade schedule");
    $(table).children().append(
        `<tr><th>${this.name}</th><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr>`
    );
    this.teachers.forEach( function(teacher, i){
        $(table).find("tbody").append("<tr><td>" + teacher.name + "</td></tr>");
        DAYS.forEach (function(day, d){
            $(table).find("tr:last").append("<td id=\""
                + "g" + this.n + "d" + d + "t" + teacher.n() + "\"></td>");
        }, this);
    }, this);

    return table;
};

// Returns an HTML string that shows a table of each specialist's schedule
Special.prototype.scheduleTable = function(blocks) {
    let table = document.createElement("div");
    $(table).append(this.specialist);
    $(table).append(document.createElement("TABLE"));
    $(table).children().attr("class", "specials schedule");
    $(table).children().append(
        `<tr><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr>`
    );
    blocks.forEach( function(block) {
        $(table).find("tbody").append("<tr>");
        DAYS.forEach (function(day, d){
            $(table).find("tr:last").append("<td id=\""
                + "s" + this.n + "d" + d + "b" + block.n + "\"></td>");
        }, this);
    }, this);

    return table;
};

// Toggle buttons that control the visibilty of the tables
var topbarButton = function(gOrS) {
    let button = document.createElement("BUTTON");
    let cssOn = gOrS.css;
    let cssOff = [{"background": "#eee", "color": "#999"},
                  {"background": "#aaa", "color": "#555"}];

    $(button).attr("class", "topbar_button " + gOrS.cssClass);
    $(button).css(cssOn[0]);
    $(button).append(gOrS.abbr);

    $(button).click( function() {
        if (gOrS.isVisible) {
            $(gOrS.table).slideUp();
            $(this).css(cssOff[1]);
        }
        else {
            $(gOrS.table).slideDown();
            $(this).css(cssOn[1]);
        }
        gOrS.isVisible = !gOrS.isVisible;
        $(button).blur();
    });

    $(button).hover(
        function(){
            if (gOrS.isVisible) {
                $(this).css(cssOn[1]);
            }
            else {
                $(this).css(cssOff[1]);
            }
    }, function(){
            if (gOrS.isVisible) {
                $(this).css(cssOn[0]);
            }
            else {
                $(this).css(cssOff[0]);
            }
    });

    return button;
}