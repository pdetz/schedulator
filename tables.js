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

    // Keyup event listener to update Teachers' names
    $("#left").on("keyup", "input.teacher_name", function(e){
        let input = $(this);
        let teacher = input.data("teacher");
        teacher.name = input.val();
        input.parent().siblings().children(".schedule").each(function(){
            let c = $(this).c();
            if (c.hasSpecial()) {
                $(c.buttons[1]).specialsDisplay();
            }
        });
        if (e.which == 27 || e.which == 13){
            input.blur();
        }
    });
};

// Toggle buttons that control the visibilty of the tables
function topbarButton(gOrS) {
    let button = $(document.createElement("BUTTON"));

    button.attr("class", "topbar_button " + gOrS.topbarClass + " " + gOrS.colorClass)
          .append(gOrS.abbr)
          .data("c", gOrS);

    return button;
}