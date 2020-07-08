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

    table.append("<tbody><tr><td>Special Name</td><td>Specialist</td><td>Abbreviation</td><td>Color</td></tr></tbody>");

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
                    .attr("class", "teacher_name")
                    .data({"special": special,
                            "update": $.fn.changeSpecialName
                    });
        tr.append($(document.createElement("td")).append(name));
        
        let specialist = $(document.createElement("input")).val(special.specialist)
                .attr("class", "teacher_name")
                .data({"special": special,
                        "update": $.fn.changeSpecialist
        });
        tr.append($(document.createElement("td")).append(specialist));
        
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
    let input = $(this);
    let special = input.data("special");
    special.name = input.val();
    $(".schedule." + special.colorClass).each(function(){
        $(this).gradeDisplay();
        console.log(this);
    });
    console.log($(".dropdown_button." + special.colorClass));
    $(".dropdown_button." + special.colorClass).html(special.name);
}

$.fn.changeSpecialist = function() {
    let input = $(this);
    let special = input.data("special");
    special.specialist = input.val();
    $(special.table).children(".specialist").html(special.specialist);
    console.log("changeSpecialist");
}