let savedSchedule;

const params = new URLSearchParams(window.location.search);
const emptySchedule = new Stored_Schedule("New Schedule", EMPTY_SCHEDULE);

$(document).ready(function () {
    const user = getCurrentUser();
    let schedules = [];

    getSchedules((savedSchedules) => {
        savedSchedules.forEach(s => {
            let sched = { name: s.get("title"), id: s.get("objectId") }
            //console.log(sched);
            schedules.push(sched);
        })
    }, (e) => {
        alert(e.message);        
    });
    

    /*
    schedules.push(new Stored_Schedule("SSES Original", ORIGINAL_SCHEDULE));
    schedules.push(new Stored_Schedule("SSES Return", RETURN_SCHEDULE));
    //schedules.push(new Stored_Schedule("Original Schedule", ORIGINAL_SCHEDULE));
*/

    if (params.has("id") && !savedSchedule) {
        getSchedule(params.get("id"), (schedule) => {
            savedSchedule = schedule;
            $("#title").val(schedule.get("title"))
            //$("#description").val(schedule.get("description"))
            let loadedSchedule = new Schedule({ name: schedule.get("title"), json: schedule.get("data") });
            load(loadedSchedule, schedules);
        }, (e) => {
            alert(e.message);
        });
    } else {
        // Load data into Schedule object
        let loadedSchedule = new Schedule(emptySchedule);
        load(loadedSchedule, schedules, true);
    }

    $(document).title = loadedSchedule.name + " - Schedulator";

    //schedule.menu.find("#menu_edit").click();
});

function Stored_Schedule(name, id) {
    this.name = name;
    this.id = id;
}

function load(schedule, schedules, edit = false) {
    schedule.loadTables();
    schedule.loadButtons();
    schedule.loadScheduleEditor();
    schedule.loadSpecialsDD();
    schedule.loadBlocksDD();
    schedule.loadPaletteDD();


    attachPermanentListeners(schedule);

    if (edit) {
        schedule.showScheduleEditor();
    } else {
        attachActiveScheduleListeners(schedule);
    }


    configButtons(schedule, schedules);
    loadMenus(schedule, schedules);

    
    
    //$("#right").showPanel(editor);
    //$("#right").showPanel(schedule.specialSchedules);


    $("#body").keyup(function (e) {
        if (e.which == 27) {
            $("input").blur();
            schedule.resetButtons();
            $("#menu").hide();
            $("#modal").hide();
            $("#modal_content").children().remove();
            $(".blur").removeClass("blur");
        }
    });

    $("#close_modal").click(function (e) {
        $("#modal").hide();
        $("#modal_content").children().remove();
        $(".blur").removeClass("blur");
    });
}

//New buttons
function configButtons(schedule, schedules) {
    $("#menu-holder").append('<button id="open_menu" class="topbar_button user_control gray" type="button">Menu</button>');

    $("#user-controls")
    .append('<button id="viewEdit" class="topbar_button user_control purple" type="button">View/Edit Schedule</button>')
    .append('<button id="save" class="topbar_button user_control green" type="button">Save</button>')
    .append('<button id="print" class="topbar_button user_control blue" type="button">Print</button>');

    $("#viewEdit").click(() => {
        if (schedule.editor.is(":visible")) {
            schedule.showScheduleViewer();
            //$("#menu_edit").html(BUILD).append(" Build Mode");
        }
        else {
            schedule.showScheduleEditor();
        }
    })
    $("#save").click((e) => {
        e.stopImmediatePropagation();
        console.log("Save button clicked")
        let title = $("#title").val();
        let description = $("#description").val();
        if (!title) {
            alert("Please input a title for this schedule");
            return;
        }
        if (params.has("id")) {
            editSchedule(title, description, schedule.formatFile(), savedSchedule, () => {
                alert("Schedule has been saved");
            }, (e) => {
                alert(e.message);
            })
        } else {
            saveNewSchedule(title, description, schedule.formatFile(), (id) => {
                alert("Schedule has been saved");
                window.location.href = `?id=${id}`;
            }, (e) => {
                alert(e.message);
            })
        }
    });
    $("#print").click(() => {
        window.print();
    });
    $("#back").click(() => {
        window.location.href = "../main/index.html";
    });

}