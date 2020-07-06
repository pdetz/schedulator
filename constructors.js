"use strict";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

$.fn.c = function() {
    return this.data("c");
}

function createStylesheet(id) {
    var stylesheet = document.createElement('style');
    stylesheet.type = 'text/css';
    stylesheet.id = id;
    document.head.appendChild(stylesheet);
    return stylesheet;
}

function Block(start, end, n) {
    this.start = start;
    this.end = end;
    this.n = n;
}

Block.prototype = {get name(){return this.start + " – " + this.end;}}

// Constructor function for GRADES object
function Grade(name, abbr, color, block, t, n) {
    this.name = name;
    this.abbr = abbr;
    this.defaultBlock = block;
    this.n = n;
    this.color = color;

    this.teachers = new Array(t); // an array of Teachers
    for (let i = 0; i < t; i++){
        this.teachers[i] = new Teacher("Teacher " + String.fromCharCode("A".charCodeAt(0) + i), this);
    }

    this.isVisible = true;
    this.topbarClass = "grade";
    this.colorClass = "grade" + n.toString();
    
    this.table = "";
    this.button = topbarButton(this);

    this.stylesheet = createStylesheet(this.colorClass);
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
    this.color = color;
    this.n = n;

    this.isVisible = true;
    this.topbarClass = "specials";
    this.colorClass = "specials" + n.toString();
    this.table = ""; // this table is created in Schedule.prototype.loadTables
    this.button = topbarButton(this);

    this.stylesheet = createStylesheet(this.colorClass);
}

function Class(block, day, teacher, special){
    this.block = block;
    this.day = day;
    this.teacher = teacher;
    this.special = special;
}

Class.prototype.createScheduleButton = function(displayFunctions){
    let buttons = $();
    for (let i = 0; i < arguments.length; i++){
        let button = $(document.createElement("BUTTON"));
        button.data({"c": this,
                     "display": arguments[i]});
        arguments[i].call(button);
        buttons = buttons.add(button);
    }
    return buttons;
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
    this.altBlocks = [];
    this.grades = []; // an array of Grade objects
    this.specials = []; // an array of Special objects
    this.classes = []; // an array of Class objects
    this.palette = file.palette;

    this.selectedClass = [];
    
    this.specialsDD = $(document.createElement("DIV"));
    this.blocksDD = $(document.createElement("DIV"));
    this.gradeSchedules = $(document.createElement("DIV"));
    this.specialSchedules = $(document.createElement("DIV"));
    this.settingsPanel = $(document.createElement("DIV"));

    // Copy blocks from file to Schedule
    let alt = false;
    file.blocks.forEach(function(block,i){
        if (block == "") {
            alt = true;
        }
        else if (alt) {
            let newBlock = new Block(block.start,block.end,block.n);
            this.altBlocks.push(newBlock);
        }
        else {
            let newBlock = new Block(block.start,block.end,block.n);
            this.blocks.push(newBlock);
        }
    }, this);

    // Copy grades from file to Schedule
    file.grades.forEach(function(grade,n){
        let t = grade.teachers.length;
        let newGrade = new Grade(grade.name,grade.abbr,grade.color,this.blocks[grade.defaultBlock],t,n);
        for (let i = 0; i < t; i++){
            newGrade.teachers[i].name = grade.teachers[i];
        }
        newGrade.stylesheet.innerHTML = this.stylesheetRules(newGrade);
        
        this.grades.push(newGrade);
    }, this);

    // Copy specials from file to Schedule
    file.specials.forEach(function(special,n){
        let newSpecial = new Special(special.name, special.abbr, special.specialist, special.color, n);
        newSpecial.stylesheet.innerHTML = this.stylesheetRules(newSpecial);
        this.specials.push(newSpecial);
    }, this);

    // Copy classes from file to Schedule
    file.classes.forEach(function(c){
        let block = "";
        if (c[0] > this.blocks.length){
            c[0] -= this.blocks.length + 1;
            block = this.altBlocks[c[0]];
        }
        else {
            block = this.blocks[c[0]];
        }
        let newClass = new Class(block, c[1], this.grades[c[2]].teachers[c[3]], this.specials[c[4]]);
        this.classes.push(newClass);
    }, this);
}

Schedule.prototype.stylesheetRules = function(gOrS){
    return "." + gOrS.colorClass + "{background:" + this.palette[gOrS.color[0]] + ";color:" + this.palette[gOrS.color[1]] + ";}" +
            " ." + gOrS.colorClass + ".hvr{filter: brightness(70%);}" + 
            " ." + gOrS.colorClass + ":hover{filter: brightness(70%);}" + 
            " ." + gOrS.colorClass + ".selected{background:#000;color:" + this.palette[gOrS.color[0]] + ";}";
}