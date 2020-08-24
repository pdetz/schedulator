function ctrlRow(str, n1, n2, addFunction, callFrom, args){
    let tr = make("tr", "ctrl_row grades_to_remove");
    tr.append( make("td").attr("colspan", n1)
      .append(addCtrl(str, addFunction, callFrom, args)));
    tr.append( make("td").attr("colspan", n2)
      .append(reorderCtrl(str, callFrom)).append(deleteCtrl(str)));
    return tr;
}

function deleteButton(){
    let button = make("button", "inv delete")
                .append(X);
    return button;
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

function deleteCtrl(str){
    let button = make("button", "delete ctrl")
                    .append(X)
                    .append(" Delete ")
                    .data("onclick", function(){
                        console.log("delete", this);
                    });
    return button;
}

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

function reorderCtrl(str, callFrom){
    let button = make("button", "reorder ctrl")
                    .append(UP)
                    .append(" Reorder")
                    .data({"onclick": function(){
                        console.log("reorder", this);
                    },
                            "callFrom": callFrom
                    });
    return button;
}