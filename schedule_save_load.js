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
    this.specialSchedules = $(document.createElement("DIV")).attr("id", "specials_schedules");
    this.editor = $(document.createElement("DIV"));
    this.menu = $(document.createElement("div"));

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
        let newGrade = new Grade(grade.name,grade.abbr,grade.color,this.blocks[grade.defaultBlock],t,n,this.palette);
        for (let i = 0; i < t; i++){
            newGrade.teachers[i].name = grade.teachers[i];
        }
        //newGrade.stylesheet.innerHTML = stylesheetRules(newGrade, this.palette);
        
        this.grades.push(newGrade);
    }, this);

    // Copy specials from file to Schedule
    file.specials.forEach(function(special,n){
        let newSpecial = new Special(special.name, special.abbr, special.specialist, special.color, n, this.palette);
        
        //newSpecial.stylesheet.innerHTML = stylesheetRules(newSpecial, this.palette);
        this.specials.push(newSpecial);
    }, this);

    // Copy classes from file to Schedule
    file.classes.forEach(function(c){
        let block = "";
        if (c[0] > this.blocks.length){
            block = this.altBlocks[c[0] - this.blocks.length - 1];
        }
        else {
            block = this.blocks[c[0]];
        }
        let newClass = new Class(block, c[1], this.grades[c[2]].teachers[c[3]], this.specials[c[4]]);
        this.classes.push(newClass);
    }, this);
}

function deleteSchedule(schedule){
    schedule.specialsDD.remove();
    schedule.blocksDD.remove();
    schedule.paletteDD.remove();
    schedule.gradeSchedules.remove();
    schedule.specialSchedules.remove();
    schedule.menu.remove();
    $(".topbar_button").remove();
    $("*").off("click");
}

Schedule.prototype.formatFile = function(){
    let file = new SavedFile();

    this.palette.forEach(function(color){
        file.palette.push(color);
    });

    this.blocks.forEach(function(block){
        let formattedBlock = {
            "start": block.start,
            "end": block.end,
            "n": block.n,
        };
        file.blocks.push(formattedBlock);
    });

    file.blocks.push("");

    this.altBlocks.forEach(function(block, b){
        let formattedBlock = {
            "start": block.start,
            "end": block.end,
            "n": block.n
        };
        file.blocks.push(formattedBlock);
    });

    this.grades.forEach(function(grade){
        let newGrade = {
            "name": grade.name,
            "abbr": grade.abbr,
            "defaultBlock": grade.defaultBlock.n,
            "color": grade.color,
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
            "color": special.color,
        };
        file.specials.push(newSpecial);
    });

    this.classes.forEach(function(c){
        if (c.hasGrade() && c.hasSpecial()){
            let blockNumber = this.blocks.indexOf(c.block);
            if (blockNumber == -1) {
                blockNumber = this.blocks.length + this.altBlocks.indexOf(c.block) + 1;
            }
            //let blockNumber = file.blocks.indexOf(c.block);
            file.classes.push( [blockNumber, c.day, c.teacher.grade.n, c.teacher.n(), c.special.n]);
        }
    }, this);
    return file;
}

function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}

function SavedFile() {
    this.blocks = []; // an array of Block objects
    this.grades = []; // an array of Grade arrays
    this.specials = []; // an array of Special arrays
    this.classes = []; // an array of Class arrays
    this.palette = [];
}