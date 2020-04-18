$(document).ready(function(){

    let blocks = new Array(6);
    blocks[0] = new Block("9:00", "9:45", 0);
    blocks[1] = new Block("9:50", "10:35", 1);
    blocks[2] = new Block("10:55", "11:40", 2);
    blocks[3] = new Block("12:50", "1:30", 3);
    blocks[4] = new Block("1:55", "2:35", 4);
    blocks[5] = new Block("2:40", "3:20", 5);

    let grades = new Array(0);
    grades[0] = new Grade("No Class", "NA", ["#ddd", "#fff", "#999", "#000"], blocks[0], 1, 0);
    grades[1] = new Grade("Pre-Kindergarten", "Pre-K", ["#e5c", "#c1c", "#000", "#000"], blocks[0], 2, 1);
    grades[2] = new Grade("Kindergarten", "K", ["#f00", "#b00", "#000", "#000"], blocks[3], 6, 2);
    grades[3] = new Grade("1st Grade", "1st", ["#f80", "#b40", "#000", "#000"], blocks[4], 6, 3);
    grades[4] = new Grade("2nd Grade", "2nd", ["#ff0", "#ba0", "#000", "#000"], blocks[5], 7, 4);
    grades[5] = new Grade("3rd Grade", "3rd", ["#7b0", "#380", "#000", "#000"], blocks[0], 6, 5);
    grades[6] = new Grade("4th Grade", "4th", ["#0af", "#07b", "#000", "#000"], blocks[1], 6, 6);
    grades[7] = new Grade("5th Grade", "5th", ["#a0c", "#708", "#000", "#000"], blocks[2], 5, 7);

    let specials = new Array(9);
    specials[0] = new Special("No Special", "NS", "N/A", ["#ddd", "#fff", "#999", "#000"], 0);
    specials[1] = new Special("Art", "A", "Stone", ["#f66", "#c33", "#000", "#000"], 1);
    specials[2] = new Special("Art *", "A *", "PT Art", ["#f66", "#c33", "#000", "#000"], 2);
    specials[3] = new Special("Music", "M", "Russell", ["#4ad", "#18a", "#000", "#000"], 3);
    specials[4] = new Special("Music *", "M *", "PT Music", ["#4ad", "#18a", "#000", "#000"], 4);
    specials[5] = new Special("PE", "P", "Detzner", ["#a8e", "#75b", "#000", "#000"], 5);
    specials[6] = new Special("PE *", "P *", "Harding", ["#a8e", "#75b", "#000", "#000"], 6);
    specials[7] = new Special("STEM", "S", "Bagish", ["#6d9", "#3a6", "#000", "#000"], 7);
    specials[8] = new Special("STEM *", "S *", "Haskins", ["#6d9", "#3a6", "#000", "#000"], 8);
    
    // Load data into Schedule object
    let schedule = new Schedule(blocks, grades, specials);
    schedule.tempInitializer(this.specials);

    // Load toggle buttons and schedule tables into the DOM
    // Schedule tables are blank
    // Each <td> is labelled, ready to accept a class button
    schedule.loadTables();
    schedule.loadButtons();

    $("#menu").click(function(){
        schedule.streamline();
        //console.log(JSON.stringify(schedule));

        saveText( JSON.stringify(schedule), "schedule.json" );

        //schedule.rebuild();
    });

});

function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
}

/*
function SavedFile() {
    this.blocks = []; // an array of Block arrays
    this.grades = []; // an array of Grade arrays
    this.specials = []; // an array of Special arrays
    this.classes = []; // an array of Class arrays
}
*/

Schedule.prototype.formatFile = function(){

    this.grades.forEach(function(grade){
        grade.teachers.forEach(function(teacher, i) {
            teacher = teacher.name;
        });
    });

    this.specials.forEach(function(special){
        delete special.isVisible; // = true;
        delete special.cssClass; // = "specials";
        delete special.table; // = ""; // this table is created in Schedule.prototype.loadTables
        delete special.button; // = topbarButton(this);
    });

    this.c = [];

    this.classes.forEach(function(c){
        this.c.push( [c.special.n, c.block.n, c.teacher.grade.n, c.teacher.n]);
    }, this);

    delete this.classes;

    this.grades.forEach(function(grade){
        delete grade.isVisible;
        delete grade.cssClass;
        delete grade.table;
        delete grade.button;
        grade.block = grade.defaultBlock.n;
        delete grade.defaultBlock;
        grade.teachers.forEach(function(teacher, i) {
            delete teacher.n;
            delete teacher.grade;
        });
    });    

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