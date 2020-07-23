$.fn.showPanel = function(panel){
    let frame = this;
    frame.children().hide();
    frame.append(panel);
    panel.show();
}

Schedule.prototype.specialsSettingsRow = function(special){
    let tr = $(document.createElement('tr'));
    let name = $(document.createElement("input")).val(special.name)
                .attr("class", "settings")
                .data({"special": special,
                        "update": $.fn.changeSpecialName
                });
    tr.append($(document.createElement("td")).append(name));
    
    let specialist = $(document.createElement("input")).val(special.specialist)
            .attr("class", "settings")
            .data({"special": special,
                    "update": $.fn.changeSpecialist
    });
    tr.append($(document.createElement("td")).append(specialist));

    let abbr = $(document.createElement("input")).val(special.abbr)
                .attr("class", "settings")
                .data({"special": special,
                        "update": $.fn.changeAbbr
                });
    tr.append($(document.createElement("td")).append(abbr));
    
    let color = $(document.createElement("button"))
                .attr("class", "topbar_button open_palette specials " + special.colorClass)
                .data({"special": special});
    tr.append($(document.createElement("td")).append(color)).append($(document.createElement("td")));
    
    return tr;
}

Schedule.prototype.loadSettingsPanel = function(){
    let schedule = this;
    let settings = this.settingsPanel;
    let table = $(document.createElement("table"));
    table.attr("class", "settings schedule");

    table.append("<tbody id='settings_tbody'><tr><td>Special Name</td><td>Specialist</td><td>Abbr</td><td>Color</td></tr></tbody>");

    let tbody = table.find("tbody");
    console.log(tbody);

    let newSpecial = new Special("", "", "", [4,0], schedule.specials.length);

    for (let i = 1; i <= schedule.specials.length; i++){
        if (i == schedule.specials.length){
            tbody.append("<tr id='new_special'><td colspan='4'><hr style='border:1px solid #000'></td></tr>");
            tbody.append(schedule.specialsSettingsRow(newSpecial));
        }
        else {
            tbody.append(schedule.specialsSettingsRow(schedule.specials[i]));
        }
    }
    
    let addSpecialButton = $(document.createElement("button")).append("Add").attr("class", "grade topbar_button");
    tbody.append(   $(document.createElement("tr"))
                    .append(    $(document.createElement("td"))
                                .append(addSpecialButton)));


    let settingsButton = $(document.createElement("button"));
    settingsButton.attr("class", "menu").append("*").css("color", "#fff").data("isVisible", true);

    settings.append(table);
    $("#rightbar").append(settingsButton);

    tbody.on("keyup", "input", function(){
        $(this).data("update").call($(this));
    });

    tbody.on("click", ".open_palette", {schedule: schedule}, openPalette);

    settingsButton.on("click", function(e){
        e.stopImmediatePropagation();

        if (settingsButton.data("isVisible")){
            $("#right").showPanel(settings);
            settingsButton.data("isVisible", false);
        }
        else {
            $("#right").showPanel(schedule.specialSchedules);
            settingsButton.data("isVisible", true);
        }

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

    /*
        tbody.off("click");    
        tbody.on("click", ".open_palette", {schedule: schedule}, openPalette);
      */  
    });
    
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