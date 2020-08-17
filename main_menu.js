function loadMenus(schedule, schedules){

    let fileInput = $('<input type="file" id="upload" accept=".json,.JSON" style="display:none"></input>');
    let openMenu = $("#open_menu");

    let menu = schedule.menu;
    menu.attr("class", "dropdown")
        .attr("id", "menu").hide()
        .addMenuButton(PENCIL, " View/Edit Schedule", "editor menu switch", function(){
            if (schedule.editor.is(":visible")){
                $("#right").showPanel(schedule.specialSchedules);
                $(".edit_grade").remove();
                $("*").off(".edit_grade");
                $("#grade_schedules").off(".block_grade");
                $("button.editor.menu.switch").html(BUILD).append(" Build Schedule");
            }
            else {
                schedule.editGradeLevelTables();
                $("#right").showPanel(schedule.editor);
                $("#menu button.editor.menu.switch").html(PENCIL).append(" View/Edit Schedule");
            }
        })
        .addMenuButton(PRINT, " Print", "print menu", window.print)
        .addMenuButton(DOWNLOAD, " Download", "download menu", function(){saveText( JSON.stringify(schedule.formatFile()), "schedule.json" );})
        .addMenuButton(UPLOAD, " Upload", "upload menu", function(){$("#upload").click();})
        .append(fileInput)
        .append('<hr class = "menu">');

    schedules.forEach(function(stored){
        menu.addMenuButton(FILE, " " + stored.name, "file menu", function(){
            deleteSchedule(schedule);
            let newSchedule = new Schedule(stored.json);
            load(newSchedule, schedules);
            $("#menu").click();
            $("#menu button.editor.menu.switch").click();
        });
    });

    $("#menu_holder").append(openMenu, menu);

    openMenu.click( function(){
        if (menu.hasClass("vis")) {
            menu.slideUp();
            $("#grade_schedules").off(".block_grade");
        }
        else {
            menu.slideDown();
            // Block class switching functionality
            $("#grade_schedules").on("click.block_grade", ".schedule", function(e){
                e.stopImmediatePropagation();
                $(this).blur()
            });
        }
        menu.toggleClass("vis");
        schedule.resetButtons();
        this.blur();
    });

    menu.on("click", ".menu", function(e){
        e.stopImmediatePropagation();
        menu.slideUp();
        menu.toggleClass("vis");
        $(this).data("onclick").call();
    });

    fileInput.change(function(){
        let file = fileInput.get(0).files[0];
        let reader = new FileReader();
        reader.onload = function(){
            let newSchedule = new Schedule(JSON.parse(reader.result));
            deleteSchedule(schedule);
            load(newSchedule, schedules);
            $("#menu button.editor.menu.switch").click();
        };
        reader.readAsText(file);
    });

}

$.fn.addMenuButton = function(svg, label, cssClass, clickHandler){
    let button = $(document.createElement("button"));
    button.attr("class", cssClass)
          .append(svg, label)
          .data("onclick", clickHandler);
    $(this).append(button);
    return $(this);
}

Schedule.prototype.loadScheduleEditor = function(){
    let editor = this.editor;
    let schedule = this;

    editor.append(schedule.editBlocks())
          .append("<hr class = 'black'>")
          .append(schedule.editGradesTable())
          .append("<hr class = 'black'>")
          .append(schedule.editSpecialsTable());

    schedule.editGradeLevelTables();
    $("#right").showPanel(editor);
};