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
    let table = make("div", "special_schedule");
    table.append("<span class = 'specialist'>" + this.specialist + "</span>");
    table.append("<span id='s" + this.n + "count' class = 'count'> (0)</span>");
    table.append(document.createElement("TABLE"));
    table.find("table").attr("class", "special schedule")
         .append(
         `<tbody><tr><td>${DAYS[0]}</td><td>${DAYS[1]}</td><td>${DAYS[2]}</td><td>${DAYS[3]}</td><td>${DAYS[4]}</td></tr></tbody>`
    );
    blocks.forEach( function(block) {
        table.find("tbody").append(this.scheduleTableRow(block));
    }, this);
    return table;
};

Special.prototype.scheduleTableRow = function(block){
    let tr = make("tr");
    DAYS.forEach (function(day, d){
        tr.append("<td id='" + "s" + this.n + "d" + d + "b" + block.n + "'></td>");
    }, this);
    return tr;
}

// Counts the number of classes associated with a given Specialist
Special.prototype.specialistClassCount = function(schedule){
    let count = 0;
    schedule.classes.forEach(function(c){
        if (c.special == this && c.hasGrade()) {count++;}
    }, this);

    $("#s" + this.n + "count").html(" (" + count + ")");
}

// Renumber the Special and all associated buttons to keep it consistent with its index in the array
Special.prototype.renumber = function(n, schedule){
    let special = this;
    // find all the buttons associated with the special and remove the old colorClass from them
    let updateButtons = $("." + special.colorClass).add(special.dropdownButton);
    updateButtons.removeClass(special.colorClass);

    // Update n, update the colorClass, and update the css stylesheet associated with the special
    special.n = n;
    special.colorClass = "specials" + n.toString();
    special.stylesheet.id = special.colorClass;
    writeCSSRules(special, schedule.palette);
    
    // Update all associated buttons with the new colorClass name
    updateButtons.addClass(special.colorClass);
    schedule.specials[n].table.renumberTable("s", n+1, n);
    
}

// Renumbers the table elements from n0 to n
$.fn.renumberTable = function(gstb, n0, n){
    $(this).find('[id*="' + gstb + '"]').changeID(gstb, n0, n);
}

// Changes ID's from n0 to n
$.fn.changeID = function(gstb, n0, n) {
    this.each(function(){
        let id = $(this).attr("id");
        $(this).attr("id", id.replace(gstb + n0.toString(), gstb + n.toString()));
    });
    return this;
}