Schedule.prototype.editBlocks = function(){
    let table = $(document.createElement("table"));
    table.append("<tbody id='settings_tbody'><tr><td>Row</td><td>Default Block Time</td><td>Alternate Block Times</td></tbody>");

    let tbody = table.find("tbody");
    return table;
}