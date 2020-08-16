// Constructor function for SPECIAL object
function Special(name, abbr, specialist, color, n, palette) {
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
    this.editRow = "";

    this.stylesheet = createStylesheet(this.colorClass);
    writeCSSRules(this, palette);
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
            table.find("tr:last").append("<td id='" + "s" + this.n + "d" + d + "b" + block.n + "'></td>");
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
    special.editRow = $(document.createElement('tr')).data("special", special);
    let tr = special.editRow;

    let name = $(document.createElement("input")).val(special.name)
                .attr("class", "edit")
                .data({"special": special, "update": $.fn.changeSpecialName});
    tr.append($(document.createElement("td")).append(name));
    
    let specialist = $(document.createElement("input")).val(special.specialist)
            .attr("class", "edit")
            .data({"special": special, "update": $.fn.changeSpecialist});
    tr.append($(document.createElement("td")).append(specialist));

    let abbr = $(document.createElement("input")).val(special.abbr)
                .attr("class", "edit")
                .data({"special": special, "update": $.fn.changeAbbr});
    tr.append($(document.createElement("td")).append(abbr));
    
    let color = $(document.createElement("button"))
                .attr("class", "topbar_button open_palette specials " + special.colorClass)
                .data({"special": special});
    tr.append($(document.createElement("td")).append(color)).append($(document.createElement("td")));

    if (special.n < schedule.specials.length){
        tr.append($(document.createElement("td")).append(special.deleteButton()));
    }
    return tr;
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

    //let index = schedule.specials.indexOf(special);
    let index = special.n;
    schedule.specials.splice(index,1);
    for (let i = index; i < schedule.specials.length; i++){
        schedule.specials[i].renumber(i, schedule);
        schedule.specials[i].table.renumberTable("s", i+1, i);
    }
    schedule.newSpecial.renumber(schedule.specials.length, schedule);

    
console.log(schedule.specials);
}

// Renumber the Special and all associated buttons to keep it consistent with its index in the array
Special.prototype.renumber = function(n, schedule){
    let special = this;
    // find all the buttons associated with the special and remove the old colorClass from them
    let updateButtons = $("." + special.colorClass).add(special.button).add(special.dropdownButton);
    updateButtons.removeClass(special.colorClass);

    // Update n, update the colorClass, and update the css stylesheet associated with the special
    special.n = n;
    special.colorClass = "specials" + n.toString();
    special.stylesheet.id = special.colorClass;
    writeCSSRules(special, schedule.palette);
    
    // Update all associated buttons with the new colorClass name
    updateButtons.addClass(special.colorClass);
    
}

// Renumbers the table elements from n0 to n
$.fn.renumberTable = function(gst, n0, n){
    $(this).find('[id*="' + gst + '"]').changeID(gst, n0, n);
}

// Changes ID's from n0 to n
$.fn.changeID = function(gst, n0, n) {
    this.each(function(){
        let id = $(this).attr("id");
        $(this).attr("id", id.replace(gst + n0.toString(), gst + n.toString()));
    });
    return this;
}