function connect() {
    Parse.initialize("gz9fm5hy73iFv55j6DUSHMAd2kDqyg4BG8rPcELX", "ASG4ZC2OSC65IK7BfN2MaQJzyRxvvmcPhkUH8fq1");
    Parse.serverURL = "https://parseapi.back4app.com/";
}
function signUp(data, success, fail) {
    let user = new Parse.User();
    user.set("username", data.username);
    user.set("email", data.username);
    user.set("password", data.password);
    user.set("name", data.name);
    user.signUp().then(() => {
        success();
    }).catch((e) => {
        fail(e);
    })
}
function logIn(data, success, fail) {
    Parse.User.logIn(data.username, data.password).then((u) => {
        success(u);
    }).catch((e) => {
        fail(e)
    });
}
function logOut(success, fail) {
    Parse.User.logOut().then(() => {
        success();
    }).catch((e)=> {
        fail(e);
    });
}
function isLoggedIn() {
    return Parse.User.current() !== null;
}
function getCurrentUser() {
    return Parse.User.current();
}
function getSchedule(id,success,fail) {
    const query = new Parse.Query("Schedule");
    query.get(id).then((schedule) => {
        success(schedule)
    }).catch((e)=> {
        if (fail) fail(e)
    })
}
function getSchedules(success,fail) {
    const query = new Parse.Query("Schedule");
    query.find().then((data) => {
        success(data);
    }).catch((e)=> {
        fail(e);
    })
}
function saveNewSchedule(title,description,data,success,fail){
    const Schedule = Parse.Object.extend("Schedule");
    const schedule = new Schedule();
    schedule.setACL(new Parse.ACL(getCurrentUser()));
    saveSchedule(title,description,data,schedule,success,fail)
}

function saveSchedule(title,description,data,schedule,success,fail) {
    schedule.set("title",title);
    schedule.set("description",description);
    schedule.set("data",data); //.formatFile());
    schedule.save().then((obj)=> {
        console.log("saved");
        success(obj.id);
    }).catch((e)=> {
        console.log("not saved");
        fail(e);
    });
}

function duplicateSchedule(schedule, success, fail) {
    let data = schedule.get("data");
    let desc = schedule.get("description");
    let title = "Copy of " + schedule.get("title");
    saveNewSchedule(title, desc, data, success, fail);
}

function editSchedule(title,description,data,schedule,success,fail){
    saveSchedule(title,description,data,schedule,success,fail)
}

function deleteSchedule(id, success, fail) {
    getSchedule(id, (schedule) => {
        schedule.destroy().then(
            (result) => {
                console.log(id + " deleted successfully");
                if (success) success(result);
            },
            (error) => {
                if (fail) fail(error);
            }
        );
    });
}


connect();