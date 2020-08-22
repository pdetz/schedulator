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
    table.data({"objType": "grade"});
    return table;
}

Schedule.prototype.editGradeLevelTables = function(){
    let schedule = this;

    // Add edit controls to all grade schedule tables
    $("#grade_schedules div").each(function(){
        let grade = $(this).data("grade");
        let tbody = $(this).find("tbody");
        let tr = $(document.createElement("tr"));
        let addTeacher = $(document.createElement("button"))
                            .append(PLUS, "Add Teacher")
                            .attr("class", "grades_to_remove add")
                            .data("grade", grade);
        tr.append(addTeacher);
        tbody.append(tr);

        tbody.find("[id^='trt']").each(function(){
            //let tr = $(this);
            //tr.(":first-child").prepend(selectButton())
            $(this).append( make("td", "grades_to_remove")
                                .append(deleteButton()));
        });
    });    
}

Grade.prototype.addTeacher = function(schedule){
    let grade = this;
    let newTeacher = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + grade.teachers.length), grade);
    grade.teachers.push(newTeacher);
    let newRow = newTeacher.teacherRow();
    newRow.append( $(document.createElement("td"))
            .attr("class", "grades_to_remove")
            .append(deleteButton()));
    grade.table.find("tr").last().before(newRow);
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
    tr.append(make("td").append(color)).append(make("td"));

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