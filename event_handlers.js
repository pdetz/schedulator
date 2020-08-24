function attachPermanentListeners(schedule){
// Topbar button toggle handler
    let body = $("#body");

    body.on("click", "button.topbar_button", function(){
        let button = $(this);
        let gOrS = button.c();
        if (gOrS.isVisible) {
            gOrS.table.slideUp();
        }
        else {
            gOrS.table.slideDown();
        }
        button.toggleClass(gOrS.colorClass).toggleClass(schedule.grades[0].colorClass);
        gOrS.isVisible = !gOrS.isVisible;
        button.blur();
    });
// Keyup event listener to update Teachers' names
    $("#left").on("keyup", "input.teacher_name", function(e){
        let input = $(this);
        let teacher = input.obj();
        teacher.name = input.val();
        input.closest("tr").find("button.schedule").each(function(){
            let c = $(this).c();
            if (c.hasSpecial()) {
                $(c.buttons[1]).specialsDisplay();
            }
        });
        if (e.which == 13){
            input.blur();
        }
    });
// Block drop down right-click listener
body.on("contextmenu", "button.schedule", function(e){
        e.preventDefault();
        let clicked = $(this);
        let c = clicked.c();
        if (clicked.siblings("#blocksDD").length == 0){
            schedule.resetButtons();
            clicked.after(schedule.blocksDD);
            schedule.blocksDD.slideDown(200);
        }
        else {
            schedule.blocksDD.slideUp(200, function(){
                schedule.blocksDD.detach();
            });
        }
        clicked.blur();
    });
// Block dropdown listeners
body.on("click", ".block.dropdown_button", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        let s = schedule.blocksDD.prev().c();
        schedule.selectedClass.push(s);

        s.block = button.data("block");
        schedule.updateClasses();
        schedule.blocksDD.slideUp();
        schedule.resetButtons();
    });
}
///////////////          Active Schedule Listeners        ///////////////
function attachActiveScheduleListeners(schedule) {
    $("#body").selectClassListener(schedule);
    $("#body").highlightScheduleButtons();
    
    // Click handler for each Specials button in the dropdown menu
    schedule.specialsDD.on("click.active", ".dropdown_button", (function(e){
        e.stopImmediatePropagation();
        let special = $(this).data("special");
        let s = schedule.selectedClass[0];
        s.changeSpecial(special, schedule);
    }));
}

$.fn.selectClassListener = function(schedule){
    $(this).on("click.active", "button.schedule", function(e){
        e.stopImmediatePropagation();
        schedule.blocksDD.detach();

        let clicked = $(this);
        let c = clicked.c();
        schedule.selectedClass.push(c);
    // set the selected class
        c.buttons.addClass("selected");
        if (c.hasGrade()){
            clicked.after(schedule.specialsDD);
            schedule.specialsDD.slideDown(200);
            c.buttons.dropdownMenu(schedule.specialsDD);
        }
        clicked.blur();
    // Adds logically consistent swapping algorithms to the buttons
    // taking into account empty classes
        let switchInGrade = ["teacher", "block", "day"];
        let switchInSpecial = ["special", "block", "day"];
        if (!c.hasGrade()){
            schedule.bothSchedules.swapClassesListener(schedule, switchInSpecial);
        }
        else if (!c.hasSpecial()){
            schedule.bothSchedules.swapClassesListener(schedule, switchInGrade);
        }
        else {
            schedule.gradeSchedules.swapClassesListener(schedule, switchInGrade);
            schedule.specialSchedules.swapClassesListener(schedule, switchInSpecial);
        }
    });
}

$.fn.swapClassesListener = function(schedule, swapProps) {
    $(this).on("click.active.swap", "button.schedule", function(e){
        e.stopImmediatePropagation();
        let c = $(this).c();
        let s = schedule.selectedClass[0];
        if (c != s){
            schedule.selectedClass.push(c);
            if (c.hasGrade() && c.hasSpecial() || s.hasGrade() && s.hasSpecial()){
                swapProps.forEach(function(swapProp){
                    let swap = c[swapProp];
                    c[swapProp] = s[swapProp];
                    s[swapProp] = swap;
                });
            }
        }
        schedule.updateClasses();
        schedule.resetButtons();
    });
}

$.fn.highlightScheduleButtons = function(){
    $(this).on("mouseenter.active", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.addClass("hvr");
    });
    $(this).on("mouseleave.active", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.removeClass("hvr");
    });    
}

////////////////////////////////////////////////////////////////////////////////
// Called from Schedule.prototype.loadPaletteDD()
function paletteDDClickHandler(schedule){
    schedule.paletteDD.on("click.editor", ".palette", function(e){
        e.stopImmediatePropagation();
        let button = $(this);

        let gOrS = schedule.paletteDD.obj();
        gOrS.color[0] = button.data("color");
        writeCSSRules(gOrS, schedule.palette);
    });
}

//////////// Editor Listeners
function attachEditorListeners(schedule){
    let blocksEditor = schedule.blocksEditor;
    let gradesEditor  = schedule.gradesEditor;
    let specialsEditor = schedule.specialsEditor;
    let gradeSchedules = schedule.gradeSchedules;
    let body = $("#body");

/////////// Add a new Alternate Time Block
    blocksEditor.on("mouseenter.editor", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        $(this).parent().next().addClass("add");
    });
    blocksEditor.on("mouseenter.editor", "button.delete.inv.alt", function(e){
        e.stopImmediatePropagation();
        $(this).parent().addClass("delete");
    });


    blocksEditor.on("mouseleave.editor", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        $(this).parent().next().removeClass("add");
    });
    blocksEditor.on("mouseleave.editor", "button.delete.inv.alt", function(e){
        e.stopImmediatePropagation();
        $(this).parent().removeClass("delete");
    });
    
    blocksEditor.on("click.editor", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        $(this).blur().obj().addAltBlock(schedule);
    });
    blocksEditor.on("click.editor", "button.delete.inv.alt", function(e){
        e.stopImmediatePropagation();
        let altBlock = $(this).parent().data("block");
        altBlock.deleteAltBlock(schedule);
    });

//////////////////////////// Add, Reorder, and Delete Controls

    body.on("click.editor", "button.ctrl", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        button.blur();
        button.data("onclick").call(button.data("callFrom"), button.data("args"));
    });

    body.on("click.editor", "button.inv.delete", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        button.blur();
        button.data("onclick").call(button, schedule);
    })


////////////// Inputs trigger renaming, palette opening buttons
    schedule.editor.on("keyup.editor", "input", function(){
        $(this).data("update").call($(this), schedule);
        console.log(this);
    });
    schedule.editor.on("click.editor", ".open_palette", function(e){
        e.stopImmediatePropagation();
        schedule.openPalette($(this));
    });

//////// Grade Level Choose Default Time Dropdown Buttons
    let selectedGrade = "";
    gradesEditor.on("click.editor", "button.arrow", function(e){
        e.stopImmediatePropagation();
        schedule.blocksDD.hide();
        $(this).parent().append(schedule.blocksDD);
        schedule.blocksDD.slideDown();
        selectedGrade = $(this).obj();
    });

    gradesEditor.on("click.editor", ".block.dropdown_button", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        let block = button.data("block");

        selectedGrade.defaultBlock = block;
        selectedGrade.defaultBlockButton.html(block.name).append(DOWN);
        selectedGrade.teachers.forEach(teacher => {
            teacher.tr.find("button.schedule")
                .each(function(){
                    let button = $(this);
                    let c = button.c();
                    c.block = block;
                    c.buttons.updateButton();
                });
        });
        schedule.blocksDD.slideUp();
        schedule.resetButtons();
    });

//////////////  Loads the super paint
    specialsEditor.on("click.editor", "button.inv.sel", function(e){
        e.stopImmediatePropagation;
        let button = $(this);
        let special = button.obj();

        $("button.inv.sel").removeAttr("style");
        $("button.inv.sel").find("svg").removeAttr("style");

        if (schedule.selectedSpecial != special){

            schedule.selectedSpecial = special;
            button.css("background", schedule.palette[schedule.selectedSpecial.color[0]]);
            button.find("svg").css("fill", "#000");

            schedule.gradeSchedules.on("mouseenter.editor.superpaint", "button.schedule", function(e){
                e.stopImmediatePropagation();
                $(this).css("background", schedule.palette[schedule.selectedSpecial.color[0]]);
            });
            schedule.gradeSchedules.on("mouseleave.editor.superpaint", "button.schedule", function(e){
                e.stopImmediatePropagation();
                $(this).removeAttr("style");
            });
            schedule.gradeSchedules.on("contextmenu.editor.superpaint", "button.schedule", function(e){
                e.stopImmediatePropagation();
                e.preventDefault();
                let s = $(this).c();
                schedule.selectedClass.push(s);
                s.changeSpecial(schedule.specials[0], schedule);
            });
        }
        else {
            schedule.gradeSchedules.off(".superpaint");
            schedule.selectedSpecial = "";
        }
        button.blur();
    });
// Blocks specialsDD / Super Paints
    gradeSchedules.on("click.editor", "button.schedule", function(e){
        e.stopImmediatePropagation();
        this.blur();
        if (schedule.selectedSpecial != "") {
            let s = $(this).c();
            schedule.selectedClass.push(s);
            s.changeSpecial(schedule.selectedSpecial, schedule);
        }
    });
    
    if (schedule.selectedSpecial != "") {
        schedule.selectedSpecial.superpaintButton.click().click();
    }
}

////////////////////////////////////////////////////////////////////////////////
 // Called from function loadMenus(schedule, schedules)      main_menu
//                      load(schedule, schedules)           schedulator
function attachMenuListeners(schedule){
    let menu = $("#menu");

    // On the 3 dots
    // Opens the main menu, calls schedule.resetbuttons()
    $("#open_menu").click( function(){
        if (menu.is(":visible")) {
            menu.slideUp();
            schedule.gradeSchedules.off(".block_grade");
        }
        else {
            menu.slideDown();
            // Block class switching functionality
            schedule.gradeSchedules.on("click.block_grade", ".schedule", function(e){
                e.stopImmediatePropagation();
                $(this).blur()
            });
        }
        schedule.resetButtons();
        this.blur();
    });

    // On the main menu
    // Calls the function stored in the menu button that was clicked
    menu.on("click", ".menu", function(e){
        e.stopImmediatePropagation();
        menu.slideUp();
        schedule.gradeSchedules.off(".block_grade");
        $(this).data("onclick").call();
    });
}

Schedule.prototype.resetButtons = function(){
    if (this.selectedClass.length == 1) {
        this.selectedClass.pop().buttons.updateButton();
    }
    this.bothSchedules.off(".swap");
    this.specialsDD.off("mouseenter").off("mouseleave").hide();
    this.blocksDD.off("mouseenter").off("mouseleave").hide();
    this.specialsDD.detach();
    this.blocksDD.detach();
    this.paletteDD.detach();
}