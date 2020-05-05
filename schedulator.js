$(document).ready(function(){

    let loadedFile = {"altBlocks":[],"blocks":[{"start":"9:00","end":"9:45","n":0},{"start":"9:50","end":"10:35","n":1},{"start":"10:50","end":"11:35","n":2},{"start":"12:55","end":"1:35","n":3},{"start":"1:55","end":"2:35","n":4},{"start":"2:40","end":"3:20","n":5}],"grades":[{"name":"No Class","abbr":"NA","defaultBlock":0,"css":[{"background":"none","color":"#999"},{"background":"#fff","color":"#000"},{"background":"#000","color":"#ddd"}],"teachers":["Teacher A"]},{"name":"Pre-Kindergarten","abbr":"Pre-K","defaultBlock":0,"css":[{"background":"#e5c","color":"#000"},{"background":"#c1c","color":"#000"},{"background":"#000","color":"#e5c"}],"teachers":["Teacher A","Teacher B"]},{"name":"Kindergarten","abbr":"K","defaultBlock":3,"css":[{"background":"#f00","color":"#000"},{"background":"#b00","color":"#000"},{"background":"#000","color":"#f00"}],"teachers":["Teacher A","Teacher B","Teacher C","Teacher D","Teacher E","Teacher F"]},{"name":"1st Grade","abbr":"1st","defaultBlock":4,"css":[{"background":"#f80","color":"#000"},{"background":"#b40","color":"#000"},{"background":"#000","color":"#f80"}],"teachers":["Teacher A","Teacher B","Teacher C","Teacher D","Teacher E","Teacher F"]},{"name":"2nd Grade","abbr":"2nd","defaultBlock":5,"css":[{"background":"#ff0","color":"#000"},{"background":"#ba0","color":"#000"},{"background":"#000","color":"#ff0"}],"teachers":["Teacher A","Teacher B","Teacher C","Teacher D","Teacher E","Teacher F","Teacher G"]},{"name":"3rd Grade","abbr":"3rd","defaultBlock":0,"css":[{"background":"#7b0","color":"#000"},{"background":"#380","color":"#000"},{"background":"#000","color":"#7b0"}],"teachers":["Teacher A","Teacher B","Teacher C","Teacher D","Teacher E","Teacher F","Teacher G"]},{"name":"4th Grade","abbr":"4th","defaultBlock":1,"css":[{"background":"#0af","color":"#000"},{"background":"#07b","color":"#000"},{"background":"#000","color":"#0af"}],"teachers":["Teacher A","Teacher B","Teacher C","Teacher D","Teacher E","Teacher F"]},{"name":"5th Grade","abbr":"5th","defaultBlock":2,"css":[{"background":"#a0c","color":"#000"},{"background":"#708","color":"#000"},{"background":"#000","color":"#a0c"}],"teachers":["Teacher A","Teacher B","Teacher C","Teacher D","Teacher E"]}],"specials":[{"name":"No Special","abbr":"NS","specialist":"N/A","css":[{"background":"none","color":"#999"},{"background":"#fff","color":"#000"},{"background":"#000","color":"#ddd"}]},{"name":"Art","abbr":"A","specialist":"Stone","css":[{"background":"#f66","color":"#000"},{"background":"#c33","color":"#000"},{"background":"#000","color":"#f66"}]},{"name":"Art *","abbr":"A *","specialist":"Reger","css":[{"background":"#f66","color":"#000"},{"background":"#c33","color":"#000"},{"background":"#000","color":"#f66"}]},{"name":"Music","abbr":"M","specialist":"Russell","css":[{"background":"#4ad","color":"#000"},{"background":"#18a","color":"#000"},{"background":"#000","color":"#4ad"}]},{"name":"Music *","abbr":"M *","specialist":"Caramanica","css":[{"background":"#4ad","color":"#000"},{"background":"#18a","color":"#000"},{"background":"#000","color":"#4ad"}]},{"name":"PE","abbr":"P","specialist":"Detzner","css":[{"background":"#a8e","color":"#000"},{"background":"#75b","color":"#000"},{"background":"#000","color":"#a8e"}]},{"name":"PE *","abbr":"P *","specialist":"Harding","css":[{"background":"#a8e","color":"#000"},{"background":"#75b","color":"#000"},{"background":"#000","color":"#a8e"}]},{"name":"STEM","abbr":"S","specialist":"Bagish","css":[{"background":"#6d9","color":"#000"},{"background":"#3a6","color":"#000"},{"background":"#000","color":"#6d9"}]},{"name":"STEM *","abbr":"S *","specialist":"Haskins","css":[{"background":"#6d9","color":"#000"},{"background":"#3a6","color":"#000"},{"background":"#000","color":"#6d9"}]}],"classes":[[3,0,2,0,1],[3,1,2,0,3],[3,4,2,0,6],[3,3,2,0,8],[3,0,2,1,3],[3,1,2,1,5],[3,3,2,1,7],[3,4,2,1,1],[3,0,2,2,5],[3,1,2,2,8],[3,3,2,2,2],[3,4,2,2,3],[3,0,2,3,8],[3,3,2,3,1],[3,2,2,3,4],[3,4,2,3,5],[3,1,2,4,1],[3,3,2,4,3],[3,2,2,4,6],[3,4,2,4,7],[3,4,2,5,2],[3,1,2,5,4],[3,3,2,5,5],[3,2,2,5,8],[4,0,3,0,1],[4,1,3,0,4],[4,4,3,0,6],[4,3,3,0,7],[4,0,3,1,3],[4,1,3,1,5],[4,2,3,1,7],[4,3,3,1,1],[4,0,3,2,5],[5,4,4,0,6],[4,3,3,2,2],[4,4,3,2,3],[4,0,3,3,7],[4,2,3,3,1],[4,3,3,3,3],[4,4,3,3,5],[4,1,3,4,1],[4,2,3,4,3],[4,3,3,4,5],[4,4,3,4,7],[4,4,3,5,1],[4,2,3,5,4],[4,3,3,5,6],[4,1,3,5,8],[5,0,4,0,1],[5,1,4,0,4],[4,2,3,2,8],[5,3,4,0,7],[5,0,4,1,3],[5,3,4,1,6],[5,2,4,1,7],[5,4,4,1,1],[5,0,4,2,5],[5,1,4,2,7],[5,3,4,2,1],[5,4,4,2,3],[5,0,4,3,7],[5,2,4,3,1],[5,3,4,3,3],[5,4,4,3,5],[5,1,4,4,1],[5,2,4,4,3],[5,3,4,4,5],[5,4,4,4,7],[5,4,4,5,2],[5,3,4,5,4],[5,2,4,5,6],[5,1,4,5,8],[5,2,4,6,4],[5,1,4,6,5],[5,0,4,6,8],[5,3,4,6,2],[0,0,5,0,1],[0,1,5,0,3],[0,4,5,0,6],[0,3,5,0,7],[0,0,5,2,3],[0,3,5,2,6],[0,2,5,2,2],[0,0,5,1,6],[0,1,5,1,7],[0,3,5,1,1],[0,4,5,1,3],[0,0,5,3,7],[0,2,5,3,1],[0,3,5,3,3],[0,1,5,3,5],[0,1,5,4,1],[0,2,5,4,3],[0,3,5,4,5],[0,0,5,4,8],[0,3,5,5,2],[0,1,5,5,4],[0,2,5,5,6],[0,4,5,5,8],[1,0,6,0,1],[1,1,6,0,3],[1,4,6,0,6],[1,2,6,0,8],[1,0,6,1,3],[1,3,6,1,6],[1,2,6,1,7],[1,4,6,1,2],[1,0,6,2,5],[1,1,6,2,7],[1,2,6,2,2],[1,4,6,2,3],[1,0,6,3,7],[1,2,6,3,1],[1,3,6,3,4],[1,4,6,3,5],[1,3,6,4,1],[1,2,6,4,3],[1,0,6,4,6],[1,4,6,4,7],[1,3,6,5,2],[1,1,6,5,4],[1,2,6,5,6],[1,4,6,5,8],[2,4,7,2,2],[2,1,7,2,3],[2,2,7,2,6],[2,3,7,2,7],[2,3,7,3,4],[2,1,7,3,5],[2,2,7,3,7],[2,4,7,3,1],[2,3,7,0,6],[2,1,7,0,7],[2,0,7,0,1],[2,4,7,0,3],[2,0,7,1,7],[2,2,7,1,1],[2,3,7,1,3],[2,4,7,1,5],[2,1,7,4,1],[2,2,7,4,3],[2,3,7,4,5],[2,4,7,4,7],[0,1,5,2,8],[2,1,1,0,4],[2,0,1,0,6],[4,3,1,1,4],[0,0,5,6,5],[0,2,5,6,7],[0,3,5,6,4],[0,4,5,6,2],[4,4,1,1,2],[4,2,1,1,6],[2,2,1,0,2]]};

    // Load data into Schedule object
    let schedule = new Schedule(loadedFile);

    // Load toggle buttons and schedule tables into the DOM
    // Schedule tables are blank
    // Each <td> is labelled, ready to accept a class button
    schedule.loadTables();
    schedule.loadButtons();
    schedule.loadSpecialsDD();
    schedule.loadBlocksDD();

    $("#body").keyup(function(e){
        if (e.which == 27){
            $("input").blur();
            schedule.resetButtons();
        }
    });

    $("#menu").click(function(){
        saveText( JSON.stringify(schedule.formatFile()), "schedule.json" );
        /*
        $("#right").addClass("flip");
        $("#right").children().delay(500) //.slideUp(10)
            .queue(function(){
                $("#right").addClass("flip2");
                $("#right").children().slideDown(10);
            })
        //$("#right").removeClass("flip");
        */
    });

    $("#print").click(function(){
        window.print();
    });

});

function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}


function SavedFile() {
    this.blocks = []; // an array of Block objects
    this.altBlocks = []; // an array of Block objects
    this.grades = []; // an array of Grade arrays
    this.specials = []; // an array of Special arrays
    this.classes = []; // an array of Class arrays
}


Schedule.prototype.formatFile = function(){

    let file = new SavedFile();

    this.blocks.forEach(function(block){
        file.blocks.push(block);
    });

    this.altBlocks.forEach(function(block){
        file.altBlocks.push(block);
        console.log(block);
    });

    this.grades.forEach(function(grade){
        let newGrade = {
            "name": grade.name,
            "abbr": grade.abbr,
            "defaultBlock": grade.defaultBlock.n,
            "css": grade.css,
            "teachers": []
        };
        grade.teachers.forEach(function(teacher) {
            newGrade.teachers.push(teacher.name);
        });
        file.grades.push(newGrade);
    });

    this.specials.forEach(function(special){
        let newSpecial = {
            "name": special.name,
            "abbr": special.abbr,
            "specialist": special.specialist,
            "css": special.css,
        };
        file.specials.push(newSpecial);
    });

    this.classes.forEach(function(c){
        if (c.hasGrade() && c.hasSpecial()){
            file.classes.push( [c.block.n, c.day, c.teacher.grade.n, c.teacher.n(), c.special.n]);
        }
    }, this);

    return file;

}

Schedule.prototype.rebuild = function(){
    this.grades.forEach(function(grade){
            this.isVisible = true;
            this.cssClass = "grade";
            this.table = this.scheduleTable();
            this.button = topbarButton(this); 
            grade.teachers.forEach(function(teacher, i) {
                teacher.grade = grade;
            });
    });
}

Schedule.prototype.tempInitializer = function() {
    let index = [1, 3, 5, 7, 0];
    this.grades.forEach(function(grade){
        if (grade.n != "0"){
            grade.teachers.forEach(function(teacher, i) {
                DAYS.forEach(function(day, d){
                    if ((i + d + 5) % 5 != 4) {
                        let c = new Class(grade.defaultBlock, d, teacher,
                            this.specials[index[(i + d + 5) % 5]]);
                        this.classes.push(c);
                    }
                }, this);     
            }, this);
        }
    }, this);
};