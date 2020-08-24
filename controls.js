function ctrlRow(str, n1, n2, addFunction, callFrom, args){
    let tr = make("tr", "ctrl_row grades_to_remove");
    tr.append( make("td").attr("colspan", n1)
      .append(addCtrl(str, addFunction, callFrom, args)))
      .append( make("td").attr("colspan", n2)
      .append(populateCtrlButton("reorder ctrl", UP, " Reorder", reorderButton))
      .append(populateCtrlButton("delete ctrl", X, " Delete", deleteButton)));
    return tr;
}

function addButton() {
    let button = make("button", "inv add")
                .append(PLUS);
    return button;
}

function reorderButton(){
    let button = make("button", "inv up")
                .append(UP)
                .data("onclick", function(){
                    console.log("reorder");
                });
    return button;
}

function deleteButton(){
    let button = make("button", "inv delete")
                .append(X)
                .data("onclick", function(schedule){
                    $(this).obj().deleteObj(schedule);
                });
    return button;
}

Grade.prototype.deleteObj = function(schedule){
    let grade = this;
    grade.table.find("button.schedule").each(function(){
        schedule.deleteClass($(this).c());
    });
    schedule.resetButtons();

    grade.table.remove();
    grade.button.remove();
    grade.editRow.remove();
    grade.stylesheet.remove();

    let index = grade.n;
    schedule.grades.splice(index,1);
    for (let i = index; i < schedule.grades.length; i++){
        schedule.grades[i].renumber(i, schedule);
        schedule.grades[i].table.renumberTable("g", i+1, i);
    }
}
Special.prototype.deleteObj = function(schedule){
    let special = this;

    special.table.find("button.schedule").each(function(){
        schedule.deleteClass($(this).c());
    });
    schedule.resetButtons();

    special.table.remove();
    special.button.remove();
    special.dropdownButton.remove();
    special.editRow.remove();
    special.stylesheet.remove();

    //let index = schedule.specials.indexOf(special);
    let index = special.n;
    schedule.specials.splice(index,1);
    for (let i = index; i < schedule.specials.length; i++){
        schedule.specials[i].renumber(i, schedule);
    }
}
Block.prototype.deleteObj = function(schedule){
    let block = this;
    console.log("delete ", block);
}

Teacher.prototype.deleteObj = function(schedule){
    let teacher = this;
    let teachers = teacher.grade.teachers;
    teacher.tr.find("button.schedule").each(function(){
        schedule.deleteClass($(this).c());
    });
    schedule.resetButtons();

    teacher.tr.remove();

    let index = teacher.n();
    teachers.splice(index, 1);
    for (let i = index; i < teachers.length; i++){
        teachers[i].tr.parent().renumberTable("t", i+1, i);
    }
}

//////////////////////////////////////////////////////////////
function addCtrl(str, addFunction, callFrom, args){
    let button = make("button", "add ctrl")
                    .append(PLUS)
                    .append(" Add " + str)
                    .data({"onclick": addFunction,
                            "callFrom": callFrom,
                            "args": args
                    });
    return button;
}

function populateCtrlButton(cssClass, icon, label, buttons) {
    let ctrlButton = make("button", cssClass)
                    .append(icon, label)
        ctrlButton.data({"onclick": function(){
                        let button = this;
                        let tbody = button.closest("tbody");
                        if (button.hasClass("on")){
                            tbody.find("div.ctrl").children().remove();
                            button.removeClass("on");
                        }
                        else {
                            $("div.ctrl").children().remove();
                            $("button.ctrl.on").removeClass("on");
                            button.addClass("on");
                            tbody.find("div.ctrl").html(buttons);
                        }
                    },
                    "callFrom": ctrlButton});
    return ctrlButton;
}