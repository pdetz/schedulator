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

    let controlRow = ctrlRow("Grade", 4, 1, "grade");

    tbody.append(controlRow.prepend(make("td")));
    table.data({"objType": "grade"});
    return table;
}

Schedule.prototype.addGrade = function(){
    console.log("add Grade");
}

Schedule.prototype.editGradeLevelTables = function(){
    let schedule = this;

    // Add edit controls to all grade schedule tables
    $("#grade_schedules div.grade_schedule").each(function(){
        let grade = $(this).data("grade");
        let tbody = $(this).find("tbody");
        //tbody.append(ctrlRow("Teacher", 4, 2, "teacher", grade.addTeacher).addClass("grades_to_remove"));

        tbody.find("[id^='trt']").each(function(){
            //let tr = $(this);
            //tr.(":first-child").prepend(selectButton())
            $(this).append( make("td", "ctrl grades_to_remove").css("width", "2.5rem"));
        });

        let controlRow = ctrlRow(grade.name + " Teacher", 4, 2, "teacher");

        tbody.append(controlRow);
    });
}

Grade.prototype.addTeacher = function(schedule){
    let grade = this;
    let newTeacher = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + grade.teachers.length), grade);
    grade.teachers.push(newTeacher);
    let newRow = newTeacher.teacherRow();
    newRow.append( make("td", "ctrl grades_to_remove").css("width", "2.5rem"));
    grade.table.find("tr.ctrl_row").before(newRow);
    newRow.find("td:empty").addEmptyClass(schedule);
}

Grade.prototype.editGradeRow = function(schedule){
    let grade = this;
    grade.editRow = $(document.createElement('tr')).data("grade", grade);
    let tr = grade.editRow;
    
    tr.append(make("td"));

    let name = make("input", "edit").val(grade.name)
                .data({"grade": grade, "update": $.fn.changeGradeName});
    tr.append(make("td").append(name));
    
    tr.append(make("td").append(grade.defaultBlockButton()));

    let abbr = make("input", "abbr edit").val(grade.abbr)
                .data({"gOrS": grade, "update": $.fn.changeGradeAbbr});
    tr.append(make("td").append(abbr));

    let color = make("button", "topbar_button open_palette specials " + grade.colorClass)
                .data({"grade": grade});
    tr.append(make("td").append(color)).append(make("td")).append(make("td").append(make("div", "ctrl")));

    return tr;
}

// Updates the name of the Grade throughout the schedule
// Both on the schedule itself and in the dropdown menu
$.fn.changeGradeName = function(schedule) {
    let input = this;
    let grade = input.data("grade");
    grade.name = input.val();
    grade.table.find("th.name").html(grade.name);
}

$.fn.changeGradeAbbr = function(schedule){
    $(this).changeAbbr();
    let grade = this.data("gOrS");;
    schedule.specialSchedules.find(".schedule." + grade.colorClass).each(function(){
        $(this).specialsDisplay();
    });
}