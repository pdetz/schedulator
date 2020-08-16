// Creates the table that allows users to add/remove/edit Specials from the schedule
Schedule.prototype.editSpecialsTable = function(){
    let schedule = this;
    let n = schedule.specials.length;
    let table = $(document.createElement("table"));
    table.attr("class", "edit schedule");

    table.append("<tbody><tr><td>Special Name</td><td>Specialist</td><td>Abbr</td><td>Color</td></tr></tbody>");

    let tbody = table.find("tbody");

    schedule.newSpecial = new Special("", "", "", [4,0], n, schedule.palette);
    let newSpecial = schedule.newSpecial;

    for (let i = 1; i <= n; i++){
        if (i == n){
            tbody.append("<tr id='new_special'><td colspan='4'><hr style='border:1px solid #000'></td></tr>");
            tbody.append(newSpecial.editSpecialRow(schedule));
        }
        else {
            tbody.append(schedule.specials[i].editSpecialRow(schedule));
        }
    }
    
    let addSpecialButton = $(document.createElement("button")).append("Add").attr("class", "add grade topbar_button");
    tbody.append(   $(document.createElement("tr"))
                    .append(    $(document.createElement("td"))
                                .append(addSpecialButton)));

    tbody.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });

    tbody.on("click", ".open_palette", {schedule: schedule}, openPalette);

    tbody.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let special = $(this).closest("tr").data("special");
        schedule.deleteSpecial(special);
    });

    addSpecialButton.on("click", function(e){
        e.stopImmediatePropagation();
        schedule.addSpecial();
    });
    return table;
}

// Opens/toggles the palette in the correct area in the editing space
function openPalette(e){
    e.stopImmediatePropagation();
    let schedule = e.data.schedule;
    let button = $(this);
    schedule.paletteDD.data("special", button.data("special"));
    let tr = button.closest("tr");

    if (tr.has(schedule.paletteDD).length){
        schedule.paletteDD.slideUp(200, function(){schedule.paletteDD.detach()});
    }
    else {
        schedule.paletteDD.hide();
        button.parent().next().append(schedule.paletteDD);
        schedule.paletteDD.slideDown(200);
    }
    button.blur();
}

// Updates the name of the Special throughout the schedule
// Both on the schedule itself and in the dropdown menu
$.fn.changeSpecialName = function(schedule) {
    let input = this;
    let special = input.data("special");
    special.name = input.val();
    $(".schedule." + special.colorClass).each(function(){
        $(this).gradeDisplay();
    });
    special.dropdownButton.html(special.name);
}

// Updates the Specialist's name on their individual table
$.fn.changeSpecialist = function() {
    let input = this;
    let special = input.data("special");
    special.specialist = input.val();
    $(special.table).children(".specialist").html(special.specialist);
}

// Updates the abbreviation used in the toggle button up top
$.fn.changeAbbr = function() {
    let input = this;
    let special = input.data("special");
    special.abbr = input.val();
    special.button.html(special.abbr);
}

// Adds a special to the schedule document
Schedule.prototype.addSpecial = function(){

    // Adds it to the list of specials
    let schedule = this;
    schedule.specials.push(schedule.newSpecial);
    let n = schedule.specials.length;

    let addedSpecial = schedule.specials[n - 1];
    
    // Adds the topbar toggle button
    addedSpecial.button.html(addedSpecial.abbr);
    $("#menu_bar").append(addedSpecial.button);
    
    // Adds the specials selector dropdown button
    schedule.specialsDD.children(".dropdown_button").last()
                        .before(addedSpecial.dropdownButton);
    
    // Adds the specials schedule table for the new special
    // And populates it with empty classes
    addedSpecial.table = addedSpecial.scheduleTable(schedule.blocks);
    schedule.specialSchedules.append(addedSpecial.table);
    addedSpecial.table.find("td:empty").addEmptyClass(schedule);
    
    // Adds the edit special row for the new special to the editor
    $("#new_special").before(addedSpecial.editSpecialRow(schedule));
    
    // Creates a new "newSpecial" for the user
    schedule.newSpecial = new Special("", "", "", [4,0], n, schedule.palette);
    newSpecial = schedule.newSpecial;

    // Slides up the palette box
    // Gets rid of the old newSpecial row and puts in a new one
    schedule.paletteDD.slideUp(200, function(){
        schedule.paletteDD.detach();
        $("#new_special").next().remove();
        $("#new_special").after(newSpecial.editSpecialRow(schedule));
    });
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