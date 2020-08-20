// Called from      Schedule.prototype.loadTables       active_tables.js
//                  load(schedule, schedules)           schedulator

function topbarToggleHandlers(schedule){
    $("#leftbar, #rightbar").on("click", "button.topbar_button:not(.menu)", function(){
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
}

function gradeTeacherNameHandler(schedule){
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
}
//////////////////////////////////////////////////////////////////////////////////////////

// Called from  Schedule.prototype.loadButtons      active_tables
//              load(schedule, schedules)           schedulator
function viewScheduleHandlers(schedule) {
    $("#grade_schedules, #specials_schedules").highlightScheduleButtons();

    schedule.gradeSchedules.on("click.schedule", ".block.dropdown_button", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        let s = schedule.selectedClass[0];
        s.block = button.data("block");
        schedule.updateClasses();
        schedule.blocksDD.slideUp();
        schedule.resetButtons();
    });
    
    $("#body").selectClassListener(schedule);
}

$.fn.highlightScheduleButtons = function(){
    $(this).on("mouseenter", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.addClass("hvr");
    });
    $(this).on("mouseleave", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.removeClass("hvr");
    });    
}

$.fn.selectClassListener = function(schedule){
    $(this).on("click.scheduleActive", "button.schedule", function(e){
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
            $("#grade_schedules, #specials_schedules").swapClassesListener(schedule, switchInSpecial);
        }
        else if (!c.hasSpecial()){
            $("#grade_schedules, #specials_schedules").swapClassesListener(schedule, switchInGrade);
        }
        else {
            $("#grade_schedules").swapClassesListener(schedule, switchInGrade);
            $("#specials_schedules").swapClassesListener(schedule, switchInSpecial);
        }
    });
}

$.fn.swapClassesListener = function(schedule, swapProps) {
    $(this).on("click.scheduleActive", "button.schedule", function(e){
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

////////////////////////////////////////////////////////////////////////////////
// Called from Schedule.prototype.loadSpecialsDD()
function specialsDDClickHandler(schedule){
        // Click handler for each Specials button in the dropdown menu
        schedule.specialsDD.on("click", ".dropdown_button", (function(e){
            let button = $(this);
            let s = schedule.selectedClass[0];
    
            // Deletes buttons and removes a class from the array if the user clicks "No Special"
            if (button.data("special") == schedule.specials[0]){
                let tds = s.buttons.parent();
                schedule.deleteClass(s);
                tds.each(function(){
                    let td = $(this);
                    let list = td.children(".schedule");
                    if (list.length == 0){
                        td.addEmptyClass(schedule);
                    }
                });
                schedule.selectedClass = [];
            }
            else{
                // If we are changing an empty block to a specials block
                // Delete the button, and create new buttons for specials and grade level schedules
                if (!s.hasSpecial()){
                    s.buttons.remove();
                    s.special = button.data("special");
                    s.buttons = s.createScheduleButton($.fn.gradeDisplay, $.fn.specialsDisplay);
                }
                else {
                    s.special = button.data("special");
                }
                schedule.updateClasses();
            }
            schedule.resetButtons();
      }));
}

////////////////////////////////////////////////////////////////////////////////
// Called from Schedule.prototype.loadBlocksDD()
function blocksDDRightClickHandler(schedule){
    schedule.gradeSchedules.on("contextmenu", "button.schedule", function(e){
        e.preventDefault();
        let clicked = $(this);
        let c = clicked.c();
        schedule.resetButtons();
        schedule.selectedClass.push(c);
        clicked.after(schedule.blocksDD);
        schedule.blocksDD.slideDown(200);
        
        clicked.blur();
    });
}

////////////////////////////////////////////////////////////////////////////////
// Called from Schedule.prototype.loadPaletteDD()
function paletteDDClickHandler(schedule, objType){
    schedule.paletteDD.off("click");
        
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
function editBlocksHandlers(schedule){
    let blocksEditor = schedule.blocksEditor;

    blocksEditor.find("#add_block").click(function(e){
        e.stopImmediatePropagation();
        schedule.addDefaultBlock();
    })

    blocksEditor.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).parent().addClass("delete");
    });
    blocksEditor.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).parent().removeClass("delete");
    });
    blocksEditor.on("mouseenter", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("add");
    });
    blocksEditor.on("mouseleave", "button.add.inv", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("add");
    });
    blocksEditor.on("click", "button.delete", function(e){
        e.stopImmediatePropagation();
        let altBlock = $(this).parent().data("block");
        altBlock.deleteAltBlock(schedule);
    });

    blocksEditor.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });

    blocksEditor.on("click", "button.add", function(e){
        e.stopImmediatePropagation();
        $(this).blur().data("block").addAltBlock(schedule);
    });
}

// From         Schedule.prototype.editGradesTable()
function editGradesHandlers(schedule){
    let gradesEditor  = schedule.gradesEditor;

    gradesEditor.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });

    gradesEditor.on("click", ".open_palette", function(e){
        e.stopImmediatePropagation();
        schedule.openPalette($(this), "grade");
    });
 
    gradesEditor.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
    });
    gradesEditor.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
    });
    gradesEditor.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let special = $(this).closest("tr").data("special");
        schedule.deleteSpecial(special);
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

    // Block class switching functionality
    $("#grade_schedules").on("click.edit_grade", ".schedule", function(e){e.stopImmediatePropagation(); $(this).blur()});
    
    // Puts event handler on the Add Teacher button
    $("#grade_schedules").on("click", ".add", function(e){
        e.stopImmediatePropagation();
        $(this).blur();
        $(this).data("grade").addTeacher(schedule);
    });

    $("#grade_schedules").on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
        $(this).closest("tr").find("button.schedule").addClass("delete");
    });
    $("#grade_schedules").on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
        $(this).closest("tr").find("button.schedule").removeClass("delete");
    });
    $("#grade_schedules").on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let teacher = $(this).closest("tr").find("input").data("teacher");

        schedule.deleteTeacher(teacher);
    });
}


// From         Schedule.prototype.editSpecialsTable()
function editSpecialsHandlers(schedule){
    let specialsEditor = schedule.specialsEditor;

    specialsEditor.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });

    specialsEditor.on("click", ".open_palette", function(e){
        e.stopImmediatePropagation();
        schedule.openPalette($(this), "special");
    });
 
    specialsEditor.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
    });
    specialsEditor.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
    });
    specialsEditor.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let special = $(this).closest("tr").data("special");
        schedule.deleteSpecial(special);
    });

    specialsEditor.on("click", ".sel", function(e){
        e.stopImmediatePropagation;
        $(this).data("onclick").call();
        console.log("called");
    });

    specialsEditor.find("#add_special").on("click", function(e){
        e.stopImmediatePropagation();
        console.log("add special");
        schedule.addSpecial();
    });
}


////////////////////////////////////////////////////////////////////////////////
 // Called from function loadMenus(schedule, schedules)      main_menu
//                      load(schedule, schedules)           schedulator
function mainMenuClick(schedule){
    let menu = $("#menu");

    // On the 3 dots
    // Opens the main menu, calls schedule.resetbuttons()
    $("#open_menu").click( function(){
        console.log(menu);
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

    // On the main menu
    // Calls the function stored in the menu button that was clicked
    menu.on("click", ".menu", function(e){
        e.stopImmediatePropagation();
        menu.slideUp();
        menu.toggleClass("vis");
        $(this).data("onclick").call();
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// mainMenuClick(schedule)                  on $("#open_menu").click
// $.fn.swapClassesListener                 on $(this).on("click.scheduleActive", "button.schedule"
// function viewScheduleHandlers(schedule)  schedule.gradeSchedules.on("click", ".block.dropdown_button"

Schedule.prototype.resetButtons = function(){
    if (this.selectedClass.length == 1) {
        this.selectedClass.pop().buttons.updateButton();
    }
    $("#grade_schedules, #specials_schedules").off(".scheduleActive");
    this.specialsDD.off("mouseenter").off("mouseleave").hide();
    this.blocksDD.off("mouseenter").off("mouseleave").hide();
    this.specialsDD.detach();
    this.blocksDD.detach();
    this.paletteDD.detach();
}