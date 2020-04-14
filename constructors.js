"use strict";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

var cssProperties = function(color){
    return [{"background": color[0], "color": color[2]},
            {"background": color[1], "color": color[3]},
            {"background": color[3], "color": color[0]}];
}

$.fn.c = function() {
    return this.data("c");
}

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
    this.css = cssProperties(color);
    this.isVisible = true;
    this.cssClass = "grade";
    this.defaultBlock = block;
    this.n = n;

    this.teachers = new Array(t); // an array of Teachers
    for (let i = 0; i < t; i++){
        this.teachers[i] = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + i), this);
    }

    this.table = this.scheduleTable();
    this.button = topbarButton(this); 
}

function Teacher(name, grade) {
    this.name = name;
    this.grade = grade; 
    this.n = function() {
        return this.grade.teachers.indexOf(this);
    }
}

// Constructor function for SPECIAL object
function Special(name, abbr, specialist, color, n) {
    this.name = name;
    this.abbr = abbr;
    this.specialist = specialist;
    this.css = cssProperties(color);
    this.isVisible = true;
    this.cssClass = "specials";
    this.n = n;

    this.table = ""; // this table is created in Schedule.prototype.loadTables
    this.button = topbarButton(this);
}

function Class(block, day, teacher, special){
    this.block = block;
    this.day = day;
    this.teacher = teacher;
    this.special = special;
}

Class.prototype.createSpecialButton = function(){
    let button = $(document.createElement("BUTTON"));
    button.attr("class", "specials schedule")
          .data({"c": this,
                 "display": $.fn.specialsDisplay,
                 "css": this.teacher.grade.css});
    return button;
};

Class.prototype.createGradeButton = function(){
    let button = $(document.createElement("BUTTON"));
    button.attr("class", "grade schedule")
          .data({"c": this,
                 "display": $.fn.gradeDisplay,
                 "css": this.special.css});
    return button;
};

Class.prototype.tdSpecial = function() {
    return $("#s" + this.special.n + "d" + this.day + "b" + this.block.n);
};

Class.prototype.tdGrade = function() {
    return $("#g" + this.teacher.grade.n + "d" + this.day + "t" + this.teacher.n());
};

Class.prototype.hasSpecial = function(){
    return this.special.n != "0";
}

Class.prototype.hasGrade = function(){
    return this.teacher.grade.n != "0";
}

// Constructor function for SCHEDULE object
function Schedule(blocks, grades, specials) {
    this.blocks = blocks; // an array of Block objects
    this.grades = grades; // an array of Grade objects
    this.specials = specials; // an array of Special objects
    this.classes = []; // an array of Class objects

    this.selectedClass = [];
    
    this.dropdown = $(document.createElement("DIV"));

}
