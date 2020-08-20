function loadMenus(schedule, schedules){

    let fileInput = $('<input type="file" id="upload" accept=".json,.JSON" style="display:none"></input>');
    let openMenu = $("#open_menu");

    let menu = schedule.menu.hide()
        .addMenuButton(PENCIL, " View/Edit Schedule", "menu_edit", "editor menu", function(){
            if (schedule.editor.is(":visible")){
                $("#right").showPanel(schedule.specialSchedules);
                $(".grades_to_remove").remove();
                $("*").off(".edit_grade");
                $("#grade_schedules").off(".block_grade");
                $("#menu_edit").html(BUILD).append(" Build Schedule");
            }
            else {
                schedule.editGradeLevelTables();
                $("#right").showPanel(schedule.editor);
                $("#menu_edit").html(PENCIL).append(" View/Edit Schedule");
            }
        })
        .addMenuButton(PRINT, " Print", "menu_print", "print menu", window.print)
        .addMenuButton(DOWNLOAD, " Download", "menu_download", "download menu", function(){saveText( JSON.stringify(schedule.formatFile()), "schedule.json" );})
        .addMenuButton(UPLOAD, " Upload", "menu_upload", "upload menu", function(){$("#upload").click();})
        .append(fileInput)
        .append('<hr class = "menu">');

    schedules.forEach(function(stored, s){
        menu.addMenuButton(FILE, " " + stored.name, "file" + s.toString(), "file menu", function(){
            deleteSchedule(schedule);
            let newSchedule = new Schedule(stored.json);
            load(newSchedule, schedules);
            $("#menu").click();
            $("#menu_edit").click();
        });
    });

    $("#menu_holder").append(openMenu, menu);

    fileInput.change(function(){
        let file = fileInput.get(0).files[0];
        let reader = new FileReader();
        reader.onload = function(){
            let newSchedule = new Schedule(JSON.parse(reader.result));
            deleteSchedule(schedule);
            load(newSchedule, schedules);
            $("#menu_edit").click();
        };
        reader.readAsText(file);
    });

    mainMenuClick(schedule);

}

$.fn.addMenuButton = function(svg, label, id, cssClass, clickHandler){
    let button = make("button");
    button.attr("class", cssClass)
          .attr("id", id)
          .append(svg, label)
          .data("onclick", clickHandler);
    $(this).append(button);
    return $(this);
}

function deleteSchedule(schedule){
    schedule.specialsDD.remove();
    schedule.blocksDD.remove();
    schedule.paletteDD.remove();
    schedule.gradeSchedules.remove();
    schedule.specialSchedules.remove();
    schedule.menu.remove();
    $("#menu").removeClass("vis").hide();
    $(".topbar_button").remove();
    $("*").off("click");
    $("*").off("keyup");
    $("*").off("contextmenu");
}

Schedule.prototype.loadScheduleEditor = function(){
    let editor = this.editor;
    let schedule = this;

    schedule.editGradeLevelTables();
    editor.append(schedule.editBlocksTable())
          .append("<hr class = 'black'>")
          .append(schedule.editGradesTable())
          .append("<hr class = 'black'>")
          .append(schedule.editSpecialsTable());

    $("#right").showPanel(editor);
};