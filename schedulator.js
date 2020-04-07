$(document).ready(function(){

    let blocks = new Array(6);
    blocks[0] = new Block("9:00", "9:40", "1");
    blocks[1] = new Block("9:45", "10:25", "2");
    blocks[2] = new Block("10:55", "11:35", "3");
    blocks[3] = new Block("12:35", "2:20", "4");
    blocks[4] = new Block("1:30", "2:15", "5");
    blocks[5] = new Block("2:30", "3:15", "6");

    let grades = new Array(7);
    grades[0] = new Grade("Pre-Kindergarten", "Pre-K", "#f6d", blocks[0], 2, "0");
    grades[1] = new Grade("Kindergarten", "K", "#f00", blocks[0], 7, "1");
    grades[2] = new Grade("1st Grade", "1st", "#f80", blocks[1], 7, "2");
    grades[3] = new Grade("2nd Grade", "2nd", "#ff0", blocks[2], 7, "3");
    grades[4] = new Grade("3rd Grade", "3rd", "#7b0", blocks[3], 5, "4");
    grades[5] = new Grade("4th Grade", "4th", "#0af", blocks[4], 5, "5");
    grades[6] = new Grade("5th Grade", "5th", "#a0c", blocks[5], 5, "6");

    let specials = new Array(9);
    specials[0] = new Special("No Special", "NS", "N/A", "none", "0");
    specials[1] = new Special("Art", "A", "Stone", "#f66", "1");
    specials[2] = new Special("Art *", "A *", "PT Art", "#f66", "2");
    specials[3] = new Special("Music", "M", "Russell", "#4ad", "3");
    specials[4] = new Special("Music *", "M *", "PT Music", "#4ad", "4");
    specials[5] = new Special("PE", "P", "Detzner", "#a8e", "5");
    specials[6] = new Special("PE *", "P *", "Harding", "#a8e", "6");
    specials[7] = new Special("STEM", "S", "Bagish", "#6d9", "7");
    specials[8] = new Special("STEM *", "S *", "Haskins", "#6d9", "8");
    
// Load specials toggle buttons and schedule tables into the DOM
specials.forEach(function(special) {
    if (special.n != "0") {
        $("#rightbar").append(special.button);
        special.table = special.scheduleTable(blocks, grades);
        $("#right").append(special.table);
    }

    $(special.button).click( function() {
        toggleTable(special);
    });

});

    // Load grade level toggle buttons and schedule tables into the DOM
    grades.forEach(function(grade) {
        grade.tempInitializer(specials);

        $("#leftbar").append(grade.button);
        $(grade.button).click( function() {
            toggleTable(grade);
        });

        $("#left").append(grade.table);
    });

    var selectedButton = "";

    $("button.schedule").click( function() {
        if (selectedButton == "") {
            selectedButton = this;
        }
        else {

            let special = $(selectedButton).data("c").special;
            let block = $(selectedButton).data("c").block;

            $(selectedButton).data("c").special = $(this).data("c").special;
            $(selectedButton).data("c").block = $(this).data("c").block;


            
            $(this).data("c").special = special;
            $(this).data("c").block = block;
            updateGradeLevelButton(selectedButton);

            updateSpecialsButton($(this).data("c").sbutton);
            updateSpecialsButton($(selectedButton).data("c").sbutton);

            selectedButton = "";
            updateGradeLevelButton(this);
        }
    });
});

Grade.prototype.tempInitializer = function(specials) {
    let grade = this;
    this.teachers.forEach(function(teacher, i) {
        let td = $(grade.table).find("td:contains('" + teacher.name + "')");
        for (let c = 0; c < 5; c++){
            teacher.classes[c].special = specials[(2 * (c + i) + 1) % specials.length];
            teacher.classes[c].gbutton = gradeLevelButton(teacher.classes[c]);
            td = $(td).next().append(teacher.classes[c].gbutton);

            teacher.classes[c].sbutton = specialsButton(teacher.classes[c]);
            $(teacher.classes[c].tdID()).append(teacher.classes[c].sbutton);
        }
    });
};