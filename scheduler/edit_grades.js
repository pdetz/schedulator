// Creates the table that allows users to add/remove/edit grades from the schedule
Schedule.prototype.editGradesTable = function(){
    let schedule = this;
    let n = schedule.grades.length;
    let table = schedule.gradesEditor;

    table.append("<tbody><tr><td></td><td>Grade Name</td><td>Default Block</td><td>Abbr</td><td>Color</td><td></td><td></td></tr></tbody>");
    let tbody = table.find("tbody");

    for (let i = 1; i < n; i++){
        tbody.append(schedule.grades[i].editGradeRow(schedule));
    }

    let controlRow = ctrlRow("Grade", 4, 1, schedule.addGrade, schedule);

    tbody.append(controlRow.prepend(make("td")));
    table.data({"objType": "grade"});
    return table;
}

Schedule.prototype.addGrade = function(){
    // Adds to the list of grades
    let schedule = this;
    let addedGrade = new Grade("New Grade", "New", [13,0], schedule.blocks[0], 5, schedule.grades.length, schedule.palette);
    schedule.grades.push(addedGrade);
    let n = schedule.grades.length;

    // Adds the topbar toggle button
    addedGrade.button.html(addedGrade.abbr);
    $("#leftbar").append(addedGrade.button);

    // Adds the grade schedule table for the new grade
    // and populates it with empty classes
    addedGrade.table = addedGrade.scheduleTable();
    schedule.gradeSchedules.append(addedGrade.table);
    addedGrade.table.find("td:empty").addEmptyClass(schedule);

    // Adds the edit grade row for the new grade to the editor
    schedule.gradesEditor.find(".ctrl_row").before(addedGrade.editGradeRow(schedule));
    schedule.gradesEditor.find("button.ctrl.on").click().click();

    // Adds the control buttons to the grade schedule table
    addedGrade.addGradeEditControls(schedule);
}

Grade.prototype.addGradeEditControls = function(schedule){
    let grade = this;
    let tbody = grade.table.find("tbody");

    tbody.find("[id^='trt']").each(function(){
        $(this).append( make("td", "grades_to_remove")
                .append(make("div", "ctrl").css("width", "3rem")));
    });
    let controlRow = ctrlRow(grade.name + " Teacher", 4, 2, grade.addTeacher, grade, schedule);
    tbody.append(controlRow);
}

Grade.prototype.addTeacher = function(schedule){
    let grade = this;
    let newTeacher = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + grade.teachers.length), grade);
    grade.teachers.push(newTeacher);
    
    let newRow = newTeacher.teacherRow();

    // Add ctrl div to the end and populate if a ctrl button is on
    newRow.append( make("td", "grades_to_remove")
            .append(make("div", "ctrl").css("width", "3rem")));
    grade.table.find("tr.ctrl_row").before(newRow);
    grade.table.find("button.ctrl.on").click().click();

    newRow.find("td:empty").not(".grades_to_remove").addEmptyClass(schedule);
}

Grade.prototype.editGradeRow = function(schedule){
    let grade = this;
    grade.editRow = make("tr").data("obj", grade);
    let tr = grade.editRow;
    
    tr.append(make("td"));

    let name = make("input", "edit").val(grade.name)
                .data("update", $.fn.changeGradeName);
    tr.append(make("td").append(name));

    tr.append(make("td").append(grade.defaultBlockButton()));

    let abbr = make("input", "abbr edit").val(grade.abbr)
                .data("update", $.fn.changeGradeAbbr);
    tr.append(make("td").append(abbr));

    let color = make("button", "topbar_button open_palette specials " + grade.colorClass);

    tr.append(make("td").append(color)).append(make("td")).append(make("td").append(make("div", "ctrl")));

    return tr;
}

// Updates the name of the Grade throughout the schedule
// Both on the schedule itself and in the dropdown menu
$.fn.changeGradeName = function(schedule) {
    let input = this;
    let grade = input.obj();
    grade.name = input.val();
    grade.table.find("th.name").html(grade.name);
}

$.fn.changeGradeAbbr = function(schedule){
    $(this).changeAbbr();
    let grade = this.obj();
    schedule.specialSchedules.find(".schedule." + grade.colorClass).each(function(){
        $(this).specialsDisplay();
    });
}