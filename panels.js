$.fn.showPanel = function(panel){
    let frame = this;
    frame.children().hide();
    frame.append(panel);
    panel.show();
}

Schedule.prototype.loadSettingsPanel = function(){
    let schedule = this;
    let settings = this.settingsPanel;
    let table = $(document.createElement("table"));
    table.attr("class", "settings schedule");

    table.append("<tbody><tr><td>Special Name</td><td>Specialist</td><td>Abbr</td><td>Color</td></tr></tbody>");

// Add an input box for the special.specialist and special.abbr lines. Don't worry about schedule.palette[special.color[0]]
// Add css styling for tables with class "settings"
// You should add this in the file tablesandbuttons.css
// You might need or want to add specific styling information for specific tds or trs within that table
// Bigger font, more spacing between table rows, etc. 
// Just make it look good

    let tbody = table.find("tbody");

    for (let i = 1; i < schedule.specials.length; i++){
        let special = schedule.specials[i];
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
        
        /*
        tr.append()
             .append('<tr><td><input type=\'text\' class=\'teacher_name\' value="' + special.name + '"></input></td>' +
                     '<td><input type=\'text\' class=\'teacher_name\' value="' + special.specialist + '"></input></td>' +
                     '<td><input type=\'text\' class=\'teacher_name\' value="' + special.abbr + '"></input></td>' + 
                     '<td><button class="' + special.colorClass + ' specials topbar_button">' + special.abbr + '</button></td></tr>');
        */
        tbody.append(tr);
    }

    $(tbody).on("keyup", "input", function(){
        $(this).data("update").call($(this));
    });

    $(tbody).on("click", ".open_palette", function(e){
        e.stopImmediatePropagation();
        let button = $(this);

        button.parent().next().append(schedule.paletteDD);
        schedule.paletteDD.slideDown(200);
        button.blur();
    });

    settings.append(table);

    let settingsButton = $(document.createElement("button"));
    settingsButton.attr("class", "menu").append("*").css("color", "#fff").data("isVisible", true);

    $("#rightbar").append(settingsButton);

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