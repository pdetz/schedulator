// Load empty tables and toggle buttons into the DOM
Schedule.prototype.loadTables = function() {
    for (let i = 1; i < this.specials.length; i++){
        this.specials[i].table = this.specials[i].scheduleTable(this.blocks);
        $("#right").append(this.specials[i].table);
        $("#rightbar").append(this.specials[i].button);
    }
    for (let i = 1; i < this.grades.length; i++){
        $("#left").append(this.grades[i].table);
        $("#leftbar").append(this.grades[i].button); 
    }

    // Visibility toggles
    // Click events delegated to the menu bars

    let cssOff = [{"background": "#eee", "color": "#999"},
                  {"background": "#aaa", "color": "#555"}];

    $("#leftbar, #rightbar").on("click", "button.topbar_button", function(){
        let button = $(this);
        let gOrS = button.c();
        let cssOn = gOrS.css;
        if (gOrS.isVisible) {
            gOrS.table.slideUp();
            button.css(cssOff[1]);
        }
        else {
            gOrS.table.slideDown();
            button.css(cssOn[1]);
        }
        gOrS.isVisible = !gOrS.isVisible;
        button.blur();
    });
    
    $("#leftbar, #rightbar").on("mouseenter", "button.topbar_button", function(){
        let button = $(this);
        let gOrS = button.c();
        let cssOn = gOrS.css;
        if (gOrS.isVisible) {
            button.css(cssOn[1]);
        }
        else {
            button.css(cssOff[1]);
        }
    });
    
    $("#leftbar, #rightbar").on("mouseleave", "button.topbar_button", function(){
        let button = $(this);
        let gOrS = button.c();
        console.log(button);
        let cssOn = gOrS.css;
        if (gOrS.isVisible) {
            button.css(cssOn[0]);
        }
        else {
            button.css(cssOff[0]);
        }
    });


};

// Returns an HTML string that shows a table of that grade level's Specials schedule
Grade.prototype.scheduleTable = function() {
    let table = $(document.createElement("div"));
    table.append(document.createElement("TABLE"));
    table.children().attr("class", "grade schedule");
    table.children().append(
        `<tbody><tr><th>${this.name}</th><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr></tbody>`
    );
    this.teachers.forEach( function(teacher, i){
        table.find("tbody").append("<tr><td>" + teacher.name + "</td></tr>");
        DAYS.forEach (function(day, d){
            table.find("tr:last").append("<td id=\""
                + "g" + this.n + "d" + d + "t" + teacher.n() + "\"></td>");
        }, this);
    }, this);

    return table;
};

// Returns an HTML string that shows a table of each specialist's schedule
Special.prototype.scheduleTable = function(blocks) {
    let table = $(document.createElement("div"));
    table.append(this.specialist);
    table.append("<div id='s" + this.n + "count' class = 'count'>Count</div>");
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

    button.attr("class", "topbar_button " + gOrS.cssClass)
          .css(gOrS.css[0])
          .append(gOrS.abbr)
          .data("c", gOrS);

    return button;
}

Special.prototype.specialistClassCount = function(schedule){

    let count = 0;
    schedule.classes.forEach(function(c){
        if (c.special == this && c.teacher.grade != schedule.grades[0]) {count++;}
    }, this);

    $("#s" + this.n + "count").html(" (" + count + ")");
}