// Creates the table that allows users to add/remove/edit Specials from the schedule
Schedule.prototype.editSpecialsTable = function(){
    let schedule = this;
    let n = schedule.specials.length;
    let table = schedule.specialsEditor;
    
    table.append("<tbody><tr><td></td><td>Special Name</td><td>Specialist</td><td>Abbr</td><td>Color</td><td></td><td></td></tr></tbody>");

    let tbody = table.find("tbody");

    for (let i = 1; i < n; i++){
        tbody.append(schedule.specials[i].editSpecialRow(schedule));
    }
    
    let controlRow = ctrlRow("Special", 4, 1, schedule.addSpecial, schedule);

    tbody.append(controlRow.prepend(make("td")));

    table.data({"objType": "special"});
    return table;
}

Special.prototype.editSpecialRow = function(schedule){
    let special = this;
    special.editRow = make('tr').data("obj", special);
    let tr = special.editRow;

    tr.append( make("td")
                .append(special.selectButton()));

    let name = make("input", "edit").val(special.name)
                .data("update", $.fn.changeSpecialName);
    tr.append(make("td").append(name));
    
    let specialist = make("input","edit").val(special.specialist)
            .data("update", $.fn.changeSpecialist);
    tr.append(make("td").append(specialist));

    let abbr = make("input", "abbr edit").val(special.abbr)
                .data("update", $.fn.changeAbbr);
    tr.append(make("td").append(abbr));
    
    let color = make("button")
                .attr("class", "topbar_button open_palette specials " + special.colorClass)
                .data({"special": special});
    
    tr.append(make("td").append(color)).append(make("td")).append(make("td").append(make("div", "ctrl")));
    return tr;
}

// Updates the name of the Special throughout the schedule
// Both on the schedule itself and in the dropdown menu
$.fn.changeSpecialName = function(schedule) {
    let input = this;
    let special = input.obj();
    special.name = input.val();
    schedule.gradeSchedules.find(".schedule." + special.colorClass).each(function(){
        $(this).gradeDisplay();
    });
    special.dropdownButton.html(special.name);
}

// Updates the Specialist's name on their individual table
$.fn.changeSpecialist = function() {
    let input = this;
    let special = input.obj();
    special.specialist = input.val();
    $(special.table).children(".specialist").html(special.specialist);
}

// Updates the abbreviation used in the toggle button up top
$.fn.changeAbbr = function() {
    let input = this;
    let gOrS = input.obj();
    gOrS.abbr = input.val();
    gOrS.button.html(gOrS.abbr);
}

// Adds a special to the schedule document  
Schedule.prototype.addSpecial = function(){
    // Adds it to the list of specials
    let schedule = this;
    let addedSpecial = new Special("Special", "", "", [4,0], schedule.specials.length, schedule.palette);
    schedule.specials.push(addedSpecial);
    let n = schedule.specials.length;
    
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
    schedule.specialsEditor.find(".ctrl_row").before(addedSpecial.editSpecialRow(schedule));
    schedule.specialsEditor.find("button.ctrl.on").click().click();
}

Special.prototype.selectButton = function() {
    let special = this;
    let button = make("button", "inv sel " + special.colorClass)
                    .append(PAINT);
    special.superpaintButton = button;
    return button;
}