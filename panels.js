$.fn.showPanel = function(panel){
    let frame = $(this);
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

    for (let i = 1; i < schedule.specials.length; i++){
        let special = schedule.specials[i];
        table.find("tbody").append("<tr>")
             .append('<td><input type=\'text\' class=\'teacher_name\' value="' + special.name + '"></input></td>' +
                     '<td><input type=\'text\' class=\'teacher_name\' value="' + special.specialist + '"></input></td>' +
                     '<td><input type=\'text\' class=\'teacher_name\' value="' + special.abbr + '"></input></td>' +
                     "<td>" + schedule.palette[special.color[0]] + "</td>")
             .append("</tr>");

    }


    settings.append(table);

    let settingsButton = $(document.createElement("button"));
    settingsButton.attr("class", "menu").append("*").css("color", "#fff");

    $("#rightbar").append(settingsButton);

    settingsButton.on("click", function(){
        $("#right").showPanel(schedule
            .settingsPanel);
    });

}