Schedule.prototype.editGradeLevelTables = function(){
    let schedule = this;

    // Add edit controls to all grade schedule tables
    $("#grade_schedules div").each(function(){
        let grade = $(this).data("grade");
        let tbody = $(this).find("tbody");
        let tr = $(document.createElement("tr"));
        let addTeacher = $(document.createElement("button"))
                            .append("Add Teacher")
                            .attr("class", "edit_grade add")
                            .data("grade", grade);
        tr.append(addTeacher);
        tbody.append(tr);

        tbody.find("[id^='trt']").each(function(){
            let teacher = $(this).find("input").data("teacher");
            $(this).append( $(document.createElement("td"))
                                .attr("class", "edit_grade")
                                .append(deleteButton()));
        });
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

Grade.prototype.addTeacher = function(schedule){
    let grade = this;
    let newTeacher = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + grade.teachers.length), grade);
    grade.teachers.push(newTeacher);
    let newRow = newTeacher.teacherRow();
    newRow.append( $(document.createElement("td"))
            .attr("class", "edit_grade")
            .append(deleteButton()));
    grade.table.find("tr").last().before(newRow);
    newRow.find("td:empty").addEmptyClass(schedule);
}

// Creates the table that allows users to add/remove/edit grades from the schedule
Schedule.prototype.editGradesTable = function(){
    let schedule = this;
    let n = schedule.grades.length;
    let table = $(document.createElement("table"));
    table.attr("class", "edit grade schedule");

    table.append("<tbody><tr><td>Grade Name</td><td>Abbr</td><td>Default Block</td><td>Color</td></tr></tbody>");

    let tbody = table.find("tbody");

    //schedule.newSpecial = new Special("", "", "", [4,0], n, schedule.palette);
    //let newSpecial = schedule.newSpecial;

    for (let i = 1; i < n; i++){
        if (i == n){
            //tbody.append("<tr id='new_special'><td colspan='4'><hr class = 'black'></td></tr>");
            //tbody.append(newSpecial.editSpecialRow(schedule));
        }
        else {
            tbody.append(schedule.grades[i].editGradeRow(schedule));
        }
    }
    
/*    let addSpecialButton = $(document.createElement("button")).append("Add").attr("class", "add grade topbar_button");
    tbody.append(   $(document.createElement("tr"))
                    .append(    $(document.createElement("td"))
                                .append(addSpecialButton)));
*/
    tbody.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });

    tbody.on("click", ".open_palette", function(e){
        e.stopImmediatePropagation();
        schedule.openPalette($(this), "grade");
    });
 
    tbody.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().addClass("delete");
    });
    tbody.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).closest("tr").children().removeClass("delete");
    });
    tbody.on("click", ".delete", function(e){
        e.stopImmediatePropagation();
        let special = $(this).closest("tr").data("special");
        schedule.deleteSpecial(special);
    });

    let selectedGrade = "";

    tbody.on("click", "button.arrow", function(e){
        e.stopImmediatePropagation();
        schedule.blocksDD.hide();
        $(this).parent().append(schedule.blocksDD);
        schedule.blocksDD.slideDown();
        selectedGrade = $(this).data("grade");
    });

    tbody.on("click", ".block.dropdown_button", function(e){
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
    
/*
    addGradeButton.on("click", function(e){
        e.stopImmediatePropagation();
        schedule.addSpecial();
    });
    */
    return table;
}