function Class(block, day, teacher, special){
    this.block = block;
    this.day = day;
    this.teacher = teacher;
    this.special = special;
    this.buttons = ""; // this.createScheduleButton($.fn.gradeDisplay, $.fn.specialsDisplay);
}

Schedule.prototype.deleteClass = function(c){
    let special = c.special;
    let schedule = this;

    c.buttons.remove();
    let index = this.classes.indexOf(c);
    this.classes.splice(index,1);
    special.specialistClassCount(schedule);
    
    schedule.gradeSchedules.find("td:empty").addEmptyClass(schedule);
    schedule.specialSchedules.find("td:empty").addEmptyClass(schedule);
}

Class.prototype.changeSpecial = function(special, schedule) {
    let s = this;
    console.log("change: ", s);
    if (special == schedule.specials[0]){
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
            s.special = special;
            s.buttons = s.createScheduleButton($.fn.gradeDisplay, $.fn.specialsDisplay);
        }
        else {
            s.special = special;
        }
        schedule.updateClasses();
    }
    schedule.resetButtons();
}

$.fn.updateButton = function(){
    $(this).each( function(){
        $(this).data("display").call($(this))
               .off("mouseenter").off("mouseleave")
               .hide().fadeIn(400);
    });
    return this;
}

Class.prototype.createScheduleButton = function(displayFunctions){
    let buttons = $();
    for (let i = 0; i < arguments.length; i++){
        let button = make("BUTTON");
        button.data({"c": this,
                     "display": arguments[i]});
        arguments[i].call(button);
        buttons = buttons.add(button);
    }
    this.buttons = buttons;
    return buttons;
};

// Returns the $() table cell where the class's Special button is placed
Class.prototype.tdSpecial = function() {
    return $(this.special.table.find("#s" + this.special.n + "d" + this.day + "b" + this.block.n));
};

// Returns the $() table cell where the class's Grade button is placed
Class.prototype.tdGrade = function() {
    return $(this.teacher.grade.table.find("#g" + this.teacher.grade.n + "d" + this.day + "t" + this.teacher.n()));
};

Class.prototype.hasSpecial = function(){
    return this.special.n != 0;
}

Class.prototype.hasGrade = function(){
    return this.teacher.grade.n != 0;
}

// button.gradeDisplay writes the content on the Grade-table button of a class
// and appends that button into the Grade-table
$.fn.gradeDisplay = function(){
    let c = this.c();
    this.html(c.special.name)
        .append(c.block.name)
        .attr("class", "schedule " + c.special.colorClass);
    c.tdGrade().append(this);
    return this;
}

// button.gradeDisplay writes the content on the Specials-table button of a class
// and appends that button into the Specials-table
$.fn.specialsDisplay = function(){
    let c = this.c();
    this.html("<span class='ulbold'>" + c.teacher.grade.abbr + "</span> " + c.teacher.name)
        .append(c.block.name)
        .attr("class", "schedule " + c.teacher.grade.colorClass);
    c.tdSpecial().append(this);
    return this;
}

// button.gradeDisplay writes the content of an empty Specials-table cell
// and appends that button into the Specials-table
$.fn.emptyDisplay = function(){
    let c = this.c();
    this.html(DAYS[c.day])
        .append(c.block.name)
        .attr("class", "schedule " + c.teacher.grade.colorClass);
    c.tdSpecial().append(this);
    return this;
}

$.fn.classDataFromtd = function(){
    return $(this).attr("id").slice(1).split(/[dtb]/);
}