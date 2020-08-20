$(document).ready(function(){
    console.log("yeah buddy");
    let schedules = [];
    schedules.push(new Stored_Schedule("Empty Schedule", EMPTY_SCHEDULE));
    schedules.push(new Stored_Schedule("Sample Schedule", SAMPLE_SCHEDULE));
    schedules.push(new Stored_Schedule("SSES Schedule", ONLINE_SCHEDULE));
    //schedules.push(new Stored_Schedule("Original Schedule", ORIGINAL_SCHEDULE));

    // Load data into Schedule object
    let schedule = new Schedule(schedules[0].json);
    load(schedule, schedules);
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
    loadMenus(schedule, schedules);

    $("#body").keyup(function(e){
        if (e.which == 27){
            $("input").blur();
            schedule.resetButtons();
            $("#menu").removeClass("vis").hide();
        }
    });
    
}