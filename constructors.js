"use strict";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DELETE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
const PENCIL = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
const PRINT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 8H2v9h4v4h12v-4h4V8zm-6 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>';

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
    this.paletteDD = $(document.createElement("DIV"));
    this.gradeSchedules = $(document.createElement("DIV")).attr("id", "grade_schedules");
    this.specialSchedules = $(document.createElement("DIV"));
    this.editor = $(document.createElement("DIV"));

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