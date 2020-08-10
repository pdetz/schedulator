$(document).ready(function(){


    // Load data into Schedule object
    let schedule = new Schedule(LOADED_FILE);

    schedule.loadTables();
    schedule.loadButtons();
    schedule.loadSpecialsDD();
    schedule.loadBlocksDD();
    schedule.loadPaletteDD();
    schedule.loadMenus();

    $("#body").keyup(function(e){
        if (e.which == 27){
            $("input").blur();
            schedule.resetButtons();
        }
    });
});