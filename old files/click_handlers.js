function mainMenuClick(){
    let menu = $("#menu");

    $("#open_menu").click( function(){
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
}