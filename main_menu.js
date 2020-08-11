$.fn.addMenuButton = function(svg, label, cssClass, clickHandler){
    let button = $(document.createElement("button"));
    button.attr("class", cssClass)
          .append(svg, label)
          .data("onclick", clickHandler);
    $(this).append(button);
    return $(this);
}

function loadMenus(schedule, schedules){

    let fileInput = $('<input type="file" id="upload" accept=".json,.JSON" style="display:none"></input>');
    let openMenu = $("#open_menu");

    let menu = schedule.menu;
    menu.attr("class", "dropdown")
        .attr("id", "menu").hide();

  
    menu.addMenuButton(PENCIL, " Edit Schedule", "edit menu", function(){
            schedule.loadScheduleEditor();
        })
        .addMenuButton(PRINT, " Print", "print menu", window.print)
        .addMenuButton(DOWNLOAD, " Download", "download menu", function(){
            saveText( JSON.stringify(schedule.formatFile()), "schedule.json" );
        })
        .addMenuButton(UPLOAD, " Upload", "upload menu", function(){
            $("#upload").click();
        })
        .append(fileInput)
        .append('<hr class = "menu">');

    schedules.forEach(function(stored){
        menu.addMenuButton(FILE, " " + stored.name, "file menu", function(){
            deleteSchedule(schedule);
            let newSchedule = new Schedule(stored.json);
            load(newSchedule, schedules);
        });
    });

        
    $("#menu_holder").append(openMenu, menu);

    openMenu.click( function(){
        if (menu.hasClass("vis")) {
            menu.slideUp();
        }
        else {
            menu.slideDown();
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
            load(newSchedule);
        };
        reader.readAsText(file);
    });

}
