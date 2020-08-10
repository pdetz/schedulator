Schedule.prototype.loadMenus = function(){
    let schedule = this;

    let openMenu = $(document.createElement("button"));
    openMenu.attr("class", "open_menu")
    .append(MENU);

    let menu = $(document.createElement("div"));
    menu.attr("class", "dropdown")
        .attr("id", "menu").hide();

    let editButton = $(document.createElement("button"));
    editButton.attr("class", "edit menu")
                .append(PENCIL)
                .append(" Edit Schedule")
                .data("onclick", function(){
                    schedule.loadScheduleEditor();
                });

    let printButton = $(document.createElement("button"));
    printButton.attr("class", "print menu")
                .append(PRINT)
                .append(" Print")
                .data("onclick", window.print);

    let downloadButton = $(document.createElement("button"));
    downloadButton.attr("class", "download menu")
                .append(DOWNLOAD)
                .append(" Download")
                .data("onclick", function(){
                    saveText( JSON.stringify(schedule.formatFile()), "schedule.json" );
                });

    let fileInput = '<input type="file" id="upload" accept=".json,.JSON" style="display:none"></input>';
    let uploadButton = $(document.createElement("button"));
    uploadButton.attr("class", "upload menu")
                .append(UPLOAD)
                .append(" Upload")
                .data("onclick", function(){
                    $("#upload").click();
                });


    menu.append(editButton, printButton, downloadButton, uploadButton, fileInput);

    $("#menu_holder").append(openMenu, menu);

    openMenu.click( function(){
        if (menu.hasClass("vis")) {
            menu.slideUp();
        }
        else {
            menu.slideDown();
        }
        menu.toggleClass("vis");
        this.blur();
    });

    menu.on("click", ".menu", function(e){
        e.stopImmediatePropagation();
        menu.slideUp();
        menu.toggleClass("vis");
        $(this).data("onclick").call();
    });

}