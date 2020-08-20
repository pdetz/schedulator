// Load empty tables and toggle buttons into the DOM
Schedule.prototype.loadTables = function() {
    let schedule = this;

    for (let i = 1; i < this.specials.length; i++){
        this.specials[i].table = this.specials[i].scheduleTable(this.blocks);
        this.specialSchedules.append(this.specials[i].table);
        $("#menu_bar").append(this.specials[i].button);
    }
    for (let i = 1; i < this.grades.length; i++){
        this.grades[i].table = this.grades[i].scheduleTable();
        this.gradeSchedules.append(this.grades[i].table);
        $("#leftbar").append(this.grades[i].button); 
    }

    $("#left").showPanel(schedule.gradeSchedules);
    $("#right").showPanel(schedule.specialSchedules);
    
    topbarToggleHandlers(schedule);
    gradeTeacherNameHandler(schedule);
};

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
    
    viewScheduleHandlers(schedule);
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

// Toggle buttons that control the visibilty of the tables
function topbarButton(gOrS) {
    let button = make("BUTTON");

    button.attr("class", "topbar_button " + gOrS.topbarClass + " " + gOrS.colorClass)
          .append(gOrS.abbr)
          .data("c", gOrS);

    return button;
}