function attachPermanentListeners(schedule){
// Topbar button toggle handler
    console.log("permanent listeners attached", schedule.name);
    $("#body").on("click", "button.topbar_button", function(){
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
        let teacher = input.data("teacher");
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
    $("#body").on("contextmenu", "button.schedule", function(e){
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
    $("#body").on("click", ".block.dropdown_button", function(e){
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
    console.log("active listeners attached", schedule.name);
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
    console.log("select class listeners attached", schedule.name);
    $(this).on("click.active", "button.schedule", function(e){
        e.stopImmediatePropagation();
        schedule.blocksDD.detach();

        console.log("select class clidked");

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
    console.log("swap class listeners attached", schedule.name);
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
function paletteDDClickHandler(schedule, objType){
    schedule.paletteDD.on("click", ".palette", function(e){
        e.stopImmediatePropagation();
        let button = $(this);

        let gOrS = schedule.paletteDD.data(objType);
        gOrS.color[0] = button.data("color");
        writeCSSRules(gOrS, schedule.palette);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Called from Schedule.prototype.loadScheduleEditor()

// From         Schedule.prototype.editBlocks()
function attachEditorListeners(schedule){
    console.log("editor listeners attached", schedule.name);
    let blocksEditor = schedule.blocksEditor;
    let gradesEditor  = schedule.gradesEditor;
    let specialsEditor = schedule.specialsEditor;
    let gradeSchedules = schedule.gradeSchedules;

    let phantomBlock = make("div", "alt_block add")
                            .append(make("input", "edit_blocks"))
                            .append("–")
                            .append(make("input", "edit_blocks"))
                            .append(deleteButton());
    blocksEditor.on("mouseenter", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        $(this).parent().prev().append(phantomBlock);
    });
    blocksEditor.on("mouseleave", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        phantomBlock.remove();
    });
    blocksEditor.on("click", "button.add", function(e){
        e.stopImmediatePropagation();
        $(this).blur().data("block").addAltBlock(schedule);
    });
    blocksEditor.find("#add_block").click(function(e){
        e.stopImmediatePropagation();
        schedule.addDefaultBlock();
    })
    // Puts event handler on the Add Teacher button
    gradeSchedules.on("click", ".add", function(e){
        e.stopImmediatePropagation();
        $(this).blur();
        $(this).data("grade").addTeacher(schedule);
    });
    specialsEditor.find("#add_special").on("click", function(e){
        e.stopImmediatePropagation();
        console.log("add special");
        schedule.addSpecial();
    });


    blocksEditor.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).parent().addClass("delete");
    });
    gradeSchedules.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
        $(this).closest("tr").find("button.schedule").addClass("delete");
    });
    gradesEditor.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
    });
    specialsEditor.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
    });

    blocksEditor.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).parent().removeClass("delete");
    });
    gradesEditor.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
    });
    gradeSchedules.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
        $(this).closest("tr").find("button.schedule").removeClass("delete");
    });
    specialsEditor.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
    });

    blocksEditor.on("click", "button.delete", function(e){
        e.stopImmediatePropagation();
        let altBlock = $(this).parent().data("block");
        altBlock.deleteAltBlock(schedule);
    });

    gradesEditor.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let grade = $(this).closest("tr").data("grade");
        schedule.deleteGrade(grade);
    });
    gradeSchedules.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let teacher = $(this).closest("tr").find("input").data("teacher");
        schedule.deleteTeacher(teacher);
    });
    specialsEditor.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let special = $(this).closest("tr").data("special");
        schedule.deleteSpecial(special);
    });

    schedule.editor.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });
    schedule.editor.on("click", ".open_palette", function(e){
        e.stopImmediatePropagation();
        schedule.openPalette($(this));
    });

    let selectedGrade = "";

    gradesEditor.on("click", "button.arrow", function(e){
        e.stopImmediatePropagation();
        schedule.blocksDD.hide();
        $(this).parent().append(schedule.blocksDD);
        schedule.blocksDD.slideDown();
        selectedGrade = $(this).data("grade");
    });

    gradesEditor.on("click", ".block.dropdown_button", function(e){
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
        let special = button.data("special");

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
        console.log(menu);
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
        console.log(this.selectedClass);
        this.selectedClass.pop().buttons.updateButton();
    }
    this.bothSchedules.off(".swap");
    this.specialsDD.off("mouseenter").off("mouseleave").hide();
    this.blocksDD.off("mouseenter").off("mouseleave").hide();
    this.specialsDD.detach();
    this.blocksDD.detach();
    this.paletteDD.detach();
}