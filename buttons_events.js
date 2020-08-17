Schedule.prototype.loadButtons = function(){
    let schedule = this;
    schedule.classes.forEach( function(c){
        c.createScheduleButton($.fn.gradeDisplay, $.fn.specialsDisplay);
        c.buttons.updateButton();
    });
    schedule.specials.forEach(function(special){
        special.specialistClassCount(schedule);
    });
    
    $("td:empty").addEmptyClass(schedule);
    
    $("#grade_schedules, #specials_schedules").highlightScheduleButtons(schedule);

    schedule.gradeSchedules.on("click", ".block.dropdown_button", function(e){
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

Schedule.prototype.updateClasses = function(){
    let schedule = this;
    let tds = $();

    // Add to the list of tds that need to be checked for empties
    // Also, update buttons to their new locations
    schedule.selectedClass.forEach( function(c){
        tds = tds.add(c.buttons.parent());
        c.buttons.updateButton();
        tds = tds.add(c.buttons.parent());
    });
    schedule.selectedClass = [];
    // Check the tds for empties
    tds.each(function(){
        let td = $(this);
        let list = td.children(".schedule");

        // If there is more than 1 button in a td:
        if (list.length > 1){
            list.each(function(){
                let c = $(this).c();
                
                // Then check each button to see if it's an empty, if it is remove it
                if (!c.hasSpecial() || !c.hasGrade()){
                    schedule.deleteClass(c);
                }
            });
        }
        // If there are no buttons in a td, put the appropriate empty button in it
        if (list.length == 0){
            td.addEmptyClass(schedule);
        }
        // Update the count of the corresponding table
        if (td.attr("id").startsWith("s")){
            schedule.specials[parseInt(td.classDataFromtd()[0])].specialistClassCount(schedule);
        }
    });
}

// Detaches dropdowns
// Takes off the schedule swapping event listener
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

$.fn.addEmptyClass = function(schedule){
    $(this).each( function(){
        let td = $(this);
        let data = td.classDataFromtd();
        let day = parseInt(data[1]);
        let c = new Class(schedule.blocks[0], day, schedule.grades[0].teachers[0], schedule.specials[0]);

        if (td.attr("id").startsWith("s")){
            c.special = schedule.specials[parseInt(data[0])];
            c.block = schedule.blocks[parseInt(data[2])];
            c.createScheduleButton($.fn.emptyDisplay);
        }
        else {
            let grade = schedule.grades[parseInt(data[0])];
            c.block = grade.defaultBlock;
            c.teacher = grade.teachers[parseInt(data[2])];
            c.createScheduleButton($.fn.gradeDisplay); 
        }
        c.buttons.updateButton();
        schedule.classes.push(c);
    });
}

$.fn.highlightScheduleButtons = function(schedule){
    $(this).on("mouseenter", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.addClass("hvr");
    });
    $(this).on("mouseleave", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.removeClass("hvr");
    });    
}