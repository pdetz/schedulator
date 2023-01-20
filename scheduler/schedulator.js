$(document).ready(function(){
    console.log("yeah buddy");
    let schedules = [];
    schedules.push(new Stored_Schedule("Empty Schedule", EMPTY_SCHEDULE));
    schedules.push(new Stored_Schedule("SSES Original", ORIGINAL_SCHEDULE));
    schedules.push(new Stored_Schedule("SSES Return", RETURN_SCHEDULE));
    //schedules.push(new Stored_Schedule("Original Schedule", ORIGINAL_SCHEDULE));

    // Load data into Schedule object
    let schedule = new Schedule(schedules[0]);
    load(schedule, schedules);

    //schedule.menu.find("#menu_edit").click();
});

function Stored_Schedule(name, json){
    this.name = name;
    this.json = json;
}

function load(schedule, schedules){
    schedule.loadTables();
    schedule.loadButtons();
    schedule.loadSpecialsDD();
    schedule.loadBlocksDD();
    schedule.loadPaletteDD();
    schedule.loadScheduleEditor();
    
    attachPermanentListeners(schedule);
    attachEditorListeners(schedule);

    loadMenus(schedule, schedules);

    $("#body").keyup(function(e){
        if (e.which == 27){
            $("input").blur();
            schedule.resetButtons();
            $("#menu").hide();
            $("#modal").hide();
            $("#modal_content").children().remove();
            $(".blur").removeClass("blur");
        }
    });

    $("#close_modal").click(function(e){
        $("#modal").hide();
        $("#modal_content").children().remove();
        $(".blur").removeClass("blur");
    });
}