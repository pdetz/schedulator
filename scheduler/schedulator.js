$(document).ready(function(){
    console.log("yeah buddy");
    let schedules = [];
    schedules.push(new Stored_Schedule("Empty Schedule", EMPTY_SCHEDULE));
    schedules.push(new Stored_Schedule("SSES Original", ORIGINAL_SCHEDULE));
    schedules.push(new Stored_Schedule("SSES Return", RETURN_SCHEDULE));
    //schedules.push(new Stored_Schedule("Original Schedule", ORIGINAL_SCHEDULE));

    // Load data into Schedule object
    let schedule = new Schedule(schedules[0]);
    load(schedule, schedules);
    configButtons(schedule,schedules);
    //schedule.menu.find("#menu_edit").click();
});

function Stored_Schedule(name, json){
    this.name = name;
    this.json = json;
}

function load(schedule, schedules){
    schedule.loadTables();
    schedule.loadButtons();
    schedule.loadSpecialsDD();
    schedule.loadBlocksDD();
    schedule.loadPaletteDD();
    schedule.loadScheduleEditor();
    
    attachPermanentListeners(schedule);
    attachEditorListeners(schedule);

    loadMenus(schedule, schedules);
    

    $("#body").keyup(function(e){
        if (e.which == 27){
            $("input").blur();
            schedule.resetButtons();
            $("#menu").hide();
            $("#modal").hide();
            $("#modal_content").children().remove();
            $(".blur").removeClass("blur");
        }
    });

    $("#close_modal").click(function(e){
        $("#modal").hide();
        $("#modal_content").children().remove();
        $(".blur").removeClass("blur");
    });
}

//New buttons
function configButtons(schedule, schedules){
    
    $("#viewEdit").click(()=> {
        if (schedule.editor.is(":visible")){
            $("button.ctrl.on").click();
            $("*").off(".editor");
            schedule.gradeSchedules.find(".grades_to_remove").remove();

            $("#right").showPanel(schedule.specialSchedules);
            attachActiveScheduleListeners(schedule);
            $("#menu_edit").html(BUILD).append(" Build Mode");
        }
        else {
            $("*").off(".active");
            for (i = 1; i < schedule.grades.length; i++){
                schedule.grades[i].addGradeEditControls(schedule);
            }
            $("#right").showPanel(schedule.editor);
            attachEditorListeners(schedule);
            $("#menu_edit").html(PENCIL).append(" Schedule Mode");
        }
    })
    $("#save").click(()=> {
        let title = $("#title").val();
        let description = $("#description").val();
        if(!title) {
            alert("Please input a title for this schedule");
            return;
        }
        if(params.has("id")){
            editSchedule(title,description,schedule,savedSchedule,()=> {
                alert("Schedule has been saved");
            },(e)=> {
                alert(e.message);
            })
        } else {
            saveNewSchedule(title,description,schedule,(id)=> {
                alert("Schedule has been saved");
                window.location.href = `?id=${id}`;
            },(e)=> {
                alert(e.message);
            })
        }
    })
    $("#print").click(()=>{
        window.print(JSON.stringify(schedule));
    })
    $("#clear").click(()=>{
        let newSchedule = new Schedule(schedules[0]);
        load(newSchedule, []);
    })
    $("#back").click(()=> {
        console.log("back");
        window.location.href = "../main";
    });
    const params = new URLSearchParams(window.location.search);
    let savedSchedule;
    if(params.has("id") && !savedSchedule){
        getSchedule(params.get("id"),(schedule)=> {
            savedSchedule = schedule;
            $("#title").val(schedule.get("title"))
            $("#description").val(schedule.get("description"))
            let loadedSchedule = new Schedule({name:schedule.get("title"),json:schedule.get("data")});
            load(loadedSchedule, []);
        },(e)=> {
            alert(e.message);
        });
    }
}