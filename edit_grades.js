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
            $(this).append( $(document.createElement("td"))
                                .attr("class", "edit_grade")
                                .append(grade.deleteButton()));
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
            .append(grade.deleteButton()));
    grade.table.find("tr").last().before(newRow);
    newRow.find("td:empty").addEmptyClass(schedule);
}

Grade.prototype.deleteButton = function(){
    let button = $(document.createElement("button")).attr("class", "inv delete")
                .append(DELETE_ICON);

    button.hover(function(){
        button.closest("tr").children().addClass("delete");
        button.closest("tr").find("button.schedule").addClass("delete");
    }, function(){
        button.closest("tr").children().removeClass("delete");
        button.closest("tr").find("button.schedule").removeClass("delete");
    });

    return button;
}