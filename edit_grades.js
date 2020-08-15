
Schedule.prototype.editGradeLevelTables = function(){
    $("#grade_schedules div").each(function(){
        let grade = $(this);
        let table = grade.find("table");
        let tr = $(document.createElement("tr"));
        let addTeacher = $(document.createElement("button"))
                            .append("Add Teacher")
                            .attr("class", "edit_grade");
        tr.append(addTeacher);
        table.append(tr);
    });
}