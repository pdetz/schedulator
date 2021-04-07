function loadMenus(schedule, schedules){

    let fileInput = $('<input type="file" id="upload" accept=".json,.JSON" style="display:none"></input>');
    let openMenu = $("#open_menu");

    let menu = schedule.menu.hide()
        .addMenuButton(PENCIL, " View/Edit Schedule", "menu_edit", "editor menu", function(){
            if (schedule.editor.is(":visible")){
                $("button.ctrl.on").click();
                $("*").off(".editor");
                schedule.gradeSchedules.find(".grades_to_remove").remove();

                $("#right").showPanel(schedule.specialSchedules);
                attachActiveScheduleListeners(schedule);
                $("#menu_edit").html(BUILD).append(" Build Mode");
            }
            else {
                $("*").off(".active");
                for (i = 1; i < schedule.grades.length; i++){
                    schedule.grades[i].addGradeEditControls(schedule);
                }
                $("#right").showPanel(schedule.editor);
                attachEditorListeners(schedule);
                $("#menu_edit").html(PENCIL).append(" Schedule Mode");
            }
        })
        .addMenuButton(PRINT, " Print", "menu_print", "print menu", window.print)
        .addMenuButton(DOWNLOAD, " Download", "menu_download", "download menu", function(){saveText( JSON.stringify(schedule.formatFile()), "schedule.json" );})
        .addMenuButton(UPLOAD, " Upload", "menu_upload", "upload menu", function(){$("#upload").click();})
        .addMenuButton(SHEETS, " Google Sheets", "menu_sheets", "upload menu", function(){
            $("#modal").show();
            let about = $("#modal_content");
            about.html("Google Sheeeeets");
        })
        .addMenuButton(ABOUT, " About / Contact Me", "menu_about", "about menu", function(){
            console.log("about");
            $("#modal").show();
            let about = $("#modal_content");
            about.html(
                "Schedulator is an app designed to make it quick, easy, and fun to make your school's specials schedule. "+
                "Check out the video for a tutorial on how to use it:<br>"+
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/d3yqK3GWJ8A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                "<br><br>If you have any feedback, suggestions, or requests for features to be added, please do not hesitate to contact me at "+
                "<a href='mailto:patrick.detzner+schedulator@gmail.com?subject=Schedulator Feedback' target='_blank'>patrick.detzner+schedulator@gmail.com</a>"
            );
            $(".column").addClass("blur");
        })
        .append(fileInput)
        .append('<hr class = "menu">');

    schedules.forEach(function(stored, s){
        menu.addMenuButton(FILE, " " + stored.name, "file" + s.toString(), "file menu", function(){
            deleteSchedule(schedule);
            let newSchedule = new Schedule(stored);
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
            let uploadedFile = new Stored_Schedule("uploaded", JSON.parse(reader.result));
            let newSchedule = new Schedule(uploadedFile);
            deleteSchedule(schedule);
            load(newSchedule, schedules);
            $("#menu").click();
            $("#menu_edit").click();
        };
        reader.readAsText(file);
    });
    attachMenuListeners(schedule);
}

$.fn.addMenuButton = function(svg, label, id, cssClass, clickHandler){
    let button = make("button", "#" + id, cssClass);
    button.append(svg, label)
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
    schedule.editor.remove();
    schedule.menu.remove();
    $(".topbar_button").remove();
    $("*").off();
}

Schedule.prototype.loadScheduleEditor = function(){
    let editor = this.editor;
    let schedule = this;

    for (i = 1; i < schedule.grades.length; i++){
        schedule.grades[i].addGradeEditControls(schedule);
    }
    editor.append(schedule.editBlocksTable())
          .append("<hr class = 'black'>")
          .append(schedule.editGradesTable())
          .append("<hr class = 'black'>")
          .append(schedule.editSpecialsTable());

    $("#right").showPanel(editor);
};