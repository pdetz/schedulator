// Constructor function for SPECIAL object
function Special(name, abbr, specialist, color, n) {
    this.name = name;
    this.abbr = abbr;
    this.specialist = specialist;
    this.color = color;
    this.n = n;

    this.isVisible = true;
    this.topbarClass = "specials";
    this.colorClass = "specials" + n.toString();
    this.table = ""; // this table is created in Schedule.prototype.loadTables
    this.button = topbarButton(this);
    this.dropdownButton = dropdownButton(this, "special");
    this.editRow = $(document.createElement('tr')).data("special", this);

    this.stylesheet = createStylesheet(this.colorClass);
}

// Removes a SPECIAL object and associated DOM elements
Schedule.prototype.deleteSpecial = function(special){
    let schedule = this;
    schedule.classes.forEach(c => {
        if (c.special == special) {
            schedule.deleteClass(c);
        }
    });
    schedule.resetButtons();

    special.table.remove();
    special.button.remove();
    special.dropdownButton.remove();
    special.editRow.remove();
    special.stylesheet.remove();

    $("#grade_schedules td:empty").addEmptyClass(schedule);

    let index = schedule.specials.indexOf(special);
    schedule.specials.splice(index,1);
}

// Returns an $() object that shows a table of each specialist's schedule
Special.prototype.scheduleTable = function(blocks) {
    let table = $(document.createElement("div"));
    table.append("<span class = 'specialist'>" + this.specialist + "</span>");
    table.append("<span id='s" + this.n + "count' class = 'count'> (0)</span>");
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

// Counts the number of classes associated with a given Specialist
Special.prototype.specialistClassCount = function(schedule){
    let count = 0;
    schedule.classes.forEach(function(c){
        if (c.special == this && c.hasGrade()) {count++;}
    }, this);

    $("#s" + this.n + "count").html(" (" + count + ")");
}

Special.prototype.editSpecialRow = function(schedule){
    let special = this;
    let tr = special.editRow;
    let name = $(document.createElement("input")).val(special.name)
                .attr("class", "edit")
                .data({"special": special,
                        "update": $.fn.changeSpecialName
                });
    tr.append($(document.createElement("td")).append(name));
    
    let specialist = $(document.createElement("input")).val(special.specialist)
            .attr("class", "edit")
            .data({"special": special, "update": $.fn.changeSpecialist});
    tr.append($(document.createElement("td")).append(specialist));

    let abbr = $(document.createElement("input")).val(special.abbr)
                .attr("class", "edit")
                .data({"special": special,
                        "update": $.fn.changeAbbr
                });
    tr.append($(document.createElement("td")).append(abbr));
    
    let color = $(document.createElement("button"))
                .attr("class", "topbar_button open_palette specials " + special.colorClass)
                .data({"special": special});
    tr.append($(document.createElement("td")).append(color));

    if (special.n < schedule.specials.length){
        tr.append($(document.createElement("td")))
          .append($(document.createElement("td")).append(special.deleteButton())); 
    }
    return tr;
}

Special.prototype.deleteButton = function(){
    let button = $(document.createElement("button")).attr("class", "inv delete")
                .append(DELETE_ICON);

    button.hover(function(){
        button.closest("tr").children().addClass("delete");
    }, function(){
        button.closest("tr").children().removeClass("delete");
    });

    return button;
}