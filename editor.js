Schedule.prototype.loadScheduleEditor = function(){
    let editor = this.editor;
    let schedule = this;

    editor.append(schedule.editSpecialsTable());

    schedule.editGradeLevelTables();
    $("#right").showPanel(editor);
}

Schedule.prototype.editGradeLevelTables = function(){
    $("#grade_schedules div").each(function(){
        let grade = $(this);
        let table = grade.find("table");
        let tr = $(document.createElement("tr"));
        let addTeacher = $(document.createElement("button")).append("Add Teacher");
        tr.append(addTeacher);
        table.append(tr);
    });
}

Schedule.prototype.editSpecialsTable = function(){
    let schedule = this;
    let table = $(document.createElement("table"));
    table.attr("class", "settings schedule");

    table.append("<tbody id='settings_tbody'><tr><td>Special Name</td><td>Specialist</td><td>Abbr</td><td>Color</td></tr></tbody>");

    let tbody = table.find("tbody");

    let newSpecial = new Special("", "", "", [4,0], schedule.specials.length);

    for (let i = 1; i <= schedule.specials.length; i++){
        if (i == schedule.specials.length){
            tbody.append("<tr id='new_special'><td colspan='4'><hr style='border:1px solid #000'></td></tr>");
            tbody.append(newSpecial.editSpecialRow(schedule));
        }
        else {
            console.log(schedule.specials[i]);
            tbody.append(schedule.specials[i].editSpecialRow(schedule));
        }
    }
    
    let addSpecialButton = $(document.createElement("button")).append("Add").attr("class", "grade topbar_button");
    tbody.append(   $(document.createElement("tr"))
                    .append(    $(document.createElement("td"))
                                .append(addSpecialButton)));


    tbody.on("keyup", "input", function(){
        $(this).data("update").call($(this));
    });

    tbody.on("click", ".open_palette", {schedule: schedule}, openPalette);

    tbody.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let special = $(this).closest("tr").data("special");
        schedule.deleteSpecial(special);
    });

    addSpecialButton.on("click", function(e){
        e.stopImmediatePropagation();
        schedule.specials.push(newSpecial);

        let addedSpecial = schedule.specials[schedule.specials.length - 1];

        schedule.specials[schedule.specials.length - 2].button.after(addedSpecial.button);
        addedSpecial.button.append(addedSpecial.abbr);

        schedule.specialsDD.find(".dropdown_button." + schedule.specials[0].colorClass)
                            .before(dropdownButton(addedSpecial, "special"));

        addedSpecial.table = addedSpecial.scheduleTable(schedule.blocks);
        schedule.specialSchedules.append(addedSpecial.table);
        addedSpecial.table.find("td:empty").addEmptyClass(schedule);

        $("#new_special").before(schedule.specialsSettingsRow(addedSpecial));

        newSpecial = new Special("", "", "", [4,0], schedule.specials.length);

        $("#new_special").next().find("input").val("").data("special", newSpecial);
        $("#new_special").next().find("button.open_palette")
                                .attr("class", "topbar_button open_palette specials " + newSpecial.colorClass)
                                .data({"special": newSpecial});
        schedule.paletteDD.data("special", newSpecial);

    });
    return table;
    
}

Schedule.prototype.editBlocks = function(){
    let table = $(document.createElement("table"));
    table.append("<tbody id='settings_tbody'><tr><td>Row</td><td>Default Block Time</td><td>Alternate Block Times</td></tbody>");

    let tbody = table.find("tbody");
    return table;
}

function openPalette(e){
    e.stopImmediatePropagation();
    let schedule = e.data.schedule;
    let button = $(this);
    schedule.paletteDD.data("special", button.data("special"));
    button.parent().next().append(schedule.paletteDD);
    schedule.paletteDD.slideDown(200);
    button.blur();
}

$.fn.changeSpecialName = function() {
    let input = this;
    let special = input.data("special");
    special.name = input.val();
    $(".schedule." + special.colorClass).each(function(){
        $(this).gradeDisplay();
    });
    $(".dropdown_button." + special.colorClass).html(special.name);
}

$.fn.changeSpecialist = function() {
    let input = this;
    let special = input.data("special");
    special.specialist = input.val();
    $(special.table).children(".specialist").html(special.specialist);
}

$.fn.changeAbbr = function() {
    let input = this;
    let special = input.data("special");
    special.abbr = input.val();
    $("#rightbar").children("." + special.colorClass).html(special.abbr);
}