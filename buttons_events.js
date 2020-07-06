Schedule.prototype.loadButtons = function(){
    let schedule = this;
    schedule.classes.forEach( function(c){
        c.buttons = c.createScheduleButton($.fn.gradeDisplay, $.fn.specialsDisplay);
    });
    schedule.specials.forEach(function(special){
        special.specialistClassCount(schedule);
    });
    $("td:empty").addEmptyClass(schedule);
    
    $("#body").on("mouseenter", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.addClass("hvr");
    });
    $("#body").on("mouseleave", "button.schedule", function(e){
        let c = $(this).c();
        c.buttons.removeClass("hvr");
    });

    $("#body").on("click", "button.schedule", function(e){
        e.stopImmediatePropagation();

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
            $("#left, #right").swapClassesListener(schedule, switchInSpecial);
        }
        else if (!c.hasSpecial()){
            $("#left, #right").swapClassesListener(schedule, switchInGrade);
        }
        else {
            $("#left").swapClassesListener(schedule, switchInGrade);
            $("#right").swapClassesListener(schedule, switchInSpecial);
        }
    });
}

$.fn.swapClassesListener = function(schedule, swapProps) {
    $(this).on("click", "button.schedule", function(e){
        e.stopImmediatePropagation();

        let c = $(this).c();
        let s = schedule.selectedClass[0];

        console.log("Switch with:" + '\n' + c.id());
    
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
                    schedule.removeClass(c);
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

Schedule.prototype.resetButtons = function(){
    if (this.selectedClass.length == 1) {
        this.selectedClass.pop().buttons.updateButton();
    }
    $("#left, #right").off("click");
    this.specialsDD.off("mouseenter").off("mouseleave").hide();
    this.blocksDD.off("mouseenter").off("mouseleave").hide();
}

Schedule.prototype.removeClass = function(c){
    let special = c.special;
    c.buttons.remove();
    let index = this.classes.indexOf(c);
    this.classes.splice(index,1);
    special.specialistClassCount(this);
}

$.fn.updateButton = function(){
    $(this).each( function(){
        $(this).data("display").call($(this))
               .off("mouseenter").off("mouseleave")
               .hide().fadeIn(400);
    });
    return this;
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
            c.buttons = c.createScheduleButton($.fn.emptyDisplay);
        }
        else {
            let grade = schedule.grades[parseInt(data[0])];
            c.block = grade.defaultBlock;
            c.teacher = grade.teachers[parseInt(data[2])];
            c.buttons = c.createScheduleButton($.fn.gradeDisplay); 
        }
        schedule.classes.push(c);
    });
}

$.fn.gradeDisplay = function(){
    let c = this.c();
    this.html(c.special.name + "<br>" + c.block.name)
        .attr("class", "schedule " + c.special.colorClass);
    c.tdGrade().append(this);
    return this;
}

$.fn.specialsDisplay = function(){
    let c = this.c();
    this.html("<span class='ulbold'>" + c.teacher.grade.abbr + "</span> " +
              c.teacher.name + "<br>" + c.block.name)
              .attr("class", "schedule " + c.teacher.grade.colorClass);
    c.tdSpecial().append(this);
    return this;
}

$.fn.emptyDisplay = function(){
    let c = this.c();
    this.html(DAYS[c.day] + "<br>" + c.block.name)
        .attr("class", "schedule " + c.teacher.grade.colorClass);
    c.tdSpecial().append(this);
    return this;
}

$.fn.classDataFromtd = function(){
    return $(this).attr("id").slice(1).split(/[dtb]/);
}

Class.prototype.id = function(){
    return DAYS[this.day].toString() +  "\n" + 
            this.block.name + "\n" +
            this.teacher.name + ", " + this.teacher.grade.abbr +  "\n" + 
            this.special.name;
}

