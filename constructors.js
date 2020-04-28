"use strict";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

var cssProperties = function(css){
    return [{"background": css[0], "color": css[2]},
            {"background": css[1], "color": css[3]},
            {"background": css[3], "color": css[0]}];
}

$.fn.c = function() {
    return this.data("c");
}

function Block(start, end, n) {
    this.start = start;
    this.end = end;
    this.n = n;
    this.display = function(){
        return start + " – " + end;
    }
}

// Constructor function for GRADES object
function Grade(name, abbr, css, block, t, n) {
    this.name = name;
    this.abbr = abbr;
    this.defaultBlock = block;
    this.n = n;
    this.css = css;//cssProperties(css);

    this.teachers = new Array(t); // an array of Teachers
    for (let i = 0; i < t; i++){
        this.teachers[i] = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + i), this);
    }

    this.isVisible = true;
    this.cssClass = "grade";
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
function Special(name, abbr, specialist, css, n) {
    this.name = name;
    this.abbr = abbr;
    this.specialist = specialist;
    this.css = css;//cssProperties(css);
    this.n = n;

    this.isVisible = true;
    this.cssClass = "specials";
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
    return this.special.n != 0;
}

Class.prototype.hasGrade = function(){
    return this.teacher.grade.n != 0;
}

// Constructor function for SCHEDULE object
function Schedule(file) {
    this.blocks = []; // an array of Block objects
    this.grades = []; // an array of Grade objects
    this.specials = []; // an array of Special objects
    this.classes = []; // an array of Class objects

    this.selectedClass = [];
    
    this.dropdown = $(document.createElement("DIV"));

    // Copy blocks from file to Schedule
    file.blocks.forEach(function(block,i){
        let newBlock = new Block(block.start,block.end,block.n);
        this.blocks.push(newBlock);
    }, this);

    // Copy grades from file to Schedule
    file.grades.forEach(function(grade,n){
        let t = grade.teachers.length;
        let css = [];
        for (let i = 0; i < grade.css.length; i++){
            let color = Object.assign(grade.css[i]);
        }
        let newGrade = new Grade(grade.name,grade.abbr,grade.css,this.blocks[grade.defaultBlock],t,n);
        for (let i = 0; i < t; i++){
            newGrade.teachers[i].name = grade.teachers[i];
        }
        this.grades.push(newGrade);
    }, this);

    // Copy specials from file to Schedule
    file.specials.forEach(function(special,n){
        let newSpecial = new Special(special.name, special.abbr, special.specialist, special.css, n);
        this.specials.push(newSpecial);
    }, this);

    // Copy classes from file to Schedule
    file.classes.forEach(function(c){
        let newClass = new Class(this.blocks[c[0]], c[1], this.grades[c[2]].teachers[c[3]], this.specials[c[4]]);
        this.classes.push(newClass);
    }, this);
}
