"use strict";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Block(start, end, n) {
    this.start = start;
    this.end = end;
    this.n = n;
    this.display = function(){
        return start + " -- " + end;
    }
}

// Constructor function for GRADES object
function Grade(name, abbr, color, block, t, n) {
    this.name = name;
    this.abbr = abbr;
    this.color = color;
    this.isVisible = true;
    this.css = "grade";
    this.defaultBlock = block;
    this.n = n;

    this.teachers = new Array(t); // an array of Teachers
    for (let i = 0; i < t; i++){
        this.teachers[i] = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + i), this);
        for (let d = 0; d < 5; d++){
            this.teachers[i].classes[d] =
                new Class(this.defaultBlock, d, this.teachers[i]);
        }
    }
    this.table = this.scheduleTable();
    this.button = topbarButton(this);

}

function Teacher(name, grade) {
    this.name = name;
    this.grade = grade; 
    this.classes = new Array(5);
    this.n = function() {
        return this.grade.teachers.indexOf(this);
    }
}



// Constructor function for SPECIAL object
function Special(name, abbr, specialist, color, n) {
    this.name = name;
    this.abbr = abbr;
    this.specialist = specialist;
    this.color = color;
    this.isVisible = true;
    this.css = "specials";
    this.n = n;

    this.table = "";
    this.button = topbarButton(this);
}

function Class(block, day, teacher){
    this.block = block;
    this.day = day;
    this.teacher = teacher;
    this.special = new Special("No Special", "NS", "None", "#fff", 0);
    this.tdID = function() {
        return "#s" + this.special.n + "d" + this.day + "b" + this.block.n;
    };

    //this.gbutton = document.createElement("BUTTON");
}


// Constructor function for SCHEDULE object
function Schedule() {
    this.grades = []; // an array of Grade objects
    this.blocks = []; // an array of Block objects
    this.specials = []; // an array of Special objects
    this.classes = []; // an array of Class objects
}
