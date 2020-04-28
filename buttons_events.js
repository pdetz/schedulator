Schedule.prototype.loadButtons = function(){
    let schedule = this;
    schedule.classes.forEach( function(c){
        c.buttons = c.createGradeButton().updateButton()
                     .add(c.createSpecialButton().updateButton());
    }, this);
    schedule.specials.forEach(function(special){
        special.specialistClassCount(schedule);
    });

    $(".grade td:empty").addEmptyGrade(schedule);
    $(".specials td:empty").addEmptySpecial(schedule);
    this.initializeDropdown();

    $("body").on("click", "button.schedule", function(e){
        $(this).selectOnClick(schedule,e);
    });

    // hiliting handlers
    $("body").on("mouseenter", "button.schedule", function(){
        let c = $(this).c();
        if (c != schedule.selectedClass[0]){
            c.buttons.each(function(){
                let button = $(this);
                button.css(button.data("css")[1]);
            });
        }
    });
    $("body").on("mouseleave", "button.schedule", function(){
        let c = $(this).c();
        if (c != schedule.selectedClass[0]){
            c.buttons.each(function(){
                let button = $(this);
                button.css(button.data("css")[0]);
            });
        }
    });

}

Schedule.prototype.initializeDropdown = function(){
    let schedule = this;
    let dropdown = this.dropdown;

    dropdown.attr("class", "dropdown").attr("id", "dropdown").hide();

    dropdown.hover(function(){
        dropdown.show();
    }, function(){
        dropdown.hide();
    });

    // Add buttons for each special to the dropdown menu
    for (i = 0; i < schedule.specials.length; i++){
        let button = $(document.createElement("BUTTON"));
        let special = schedule.specials[(i+1) % schedule.specials.length];
        button.data("special", special)
              .attr("class", "dropdown_button")
              .append(special.name)
              .css(special.css[0])
              .hover(function(){
                  button.css(special.css[1]);
              }, function(){
                  button.css(special.css[0]);
              });
        schedule.dropdown.append(button);
    }

    dropdown.on("click", ".dropdown_button", (function(e){
        let button = $(this);
        let s = schedule.selectedClass.pop();

        // Deletes buttons and removes a class from the array if the user clicks "No Special"
        if (button.data("special") == schedule.specials[0]){
            s.buttons.remove();
            $("#body").append(dropdown);
            let index = schedule.classes.indexOf(s);
            schedule.classes.splice(index,1);
            $(".grade td:empty").addEmptyGrade(schedule);
            $(".specials td:empty").addEmptySpecial(schedule);
        }
        else{
            // If we are changing an empty block to a specials block
            // Delete the button, and create new buttons for specials and grade level schedules
            if (s.special == schedule.specials[0]){
                s.buttons.remove();
                s.special = button.data("special");
                s.buttons = s.createGradeButton().add(s.createSpecialButton());
            }
            else {
                s.special = button.data("special");
            }
            updateClasses(schedule, [s]);
        }
        dropdown.hide();
        $("#left").off();
        $("#right").off();
        $("body").on("click", "button.schedule", function(e){
            $(this).selectOnClick(schedule,e);
        });
  }));
}

$.fn.selectOnClick = function(schedule,e) {
    e.stopPropagation();
    $("body").off("click");

    let clicked = $(this);
    let c = clicked.c();
    schedule.selectedClass.push(c);

    c.buttons.each(function(){
        $(this).css($(this).data("css")[2]);
    });

    if (c.hasGrade()){
        clicked.after(schedule.dropdown);
        c.buttons.hover(function(){
            schedule.dropdown.insertAfter($(this)).show();
        }, function(){
            schedule.dropdown.hide();
        });
        schedule.dropdown.slideDown(200);
    }
    clicked.blur();

    // add the correct  click handlers to the other buttons

    $("#left").on("click", "button.schedule", function(e){
        $(this).swapClasses(schedule, e, "teacher");
    });

    $("#right").on("click", "button.schedule", function(e){
        $(this).swapClasses(schedule, e, "special");
    });

    return this;
}

$.fn.swapClasses = function(schedule, e, swapProp) {
    e.stopImmediatePropagation();
    $("#left").off("click");
    $("#right").off("click");

    let c = [this.c()];
    let s = schedule.selectedClass.pop();

    if (c[0] != s){

        c.push(s);

        let block = c[0].block;
        c[0].block = s.block;
        s.block = block;
    
        let day = c[0].day;
        c[0].day = s.day;
        s.day = day;
    
        let swap = c[0][swapProp];
        c[0][swapProp] = s[swapProp];
        s[swapProp] = swap;

    }

    updateClasses(schedule, c);
    schedule.dropdown.hide();

    $("body").on("click", "button.schedule", function(e){
        $(this).selectOnClick(schedule,e);
    });
}

updateClasses = function(schedule, classes){

    let tds = $();

    // Add to the list of tds that need to be checked for empties
    // Also, update buttons to their new locations
    classes.forEach( function(c){
        c.buttons.each(function(){
            tds = tds.add($(this).parent());
        });
        c.buttons.each(function(){
            $(this).updateButton();
        });
        c.buttons.each(function(){
            tds = tds.add($(this).parent());
        });
    });

    // Check the tds for empties
    tds.each(function(){
        let td = $(this);
        // List of all the class buttons inside a td
        let list = td.children().not("#dropdown");

        // If there is more than 1 button in a td:
        if (list.length > 1){
            list.each(function(){
                let button = $(this);
                // Then check each button to see if it's an empty, if it is remove it
                if (button.c().special == schedule.specials[0] || button.c().teacher.grade == schedule.grades[0]){
                    button.remove();
                }
            });
        }

        // If there are no buttons in a td, put the appropriate empty button in it
        if (list.length == 0){
            if (td.attr("id").startsWith("s")){
                td.addEmptySpecial(schedule);
            }
            else{
                td.addEmptyGrade(schedule);
            }
        }

        // Update the count of the corresponding table
        if (td.attr("id").startsWith("s")){
            let data = $(this).classDataFromtd();
            schedule.specials[parseInt(data[0])].specialistClassCount(schedule);
        }
    });
}

$.fn.updateButton = function(){
    this.data("display").call(this)
        .off("mouseenter")
        .off("mouseleave")
        .hide()
        .fadeIn(400)
    return this;
}

$.fn.addEmptySpecial = function(schedule){
    $(this).each( function(){
        let data = $(this).classDataFromtd();
        let special = schedule.specials[parseInt(data[0])];
        let day = parseInt(data[1]);
        let block = schedule.blocks[parseInt(data[2])];
        let c = new Class(block, day, schedule.grades[0].teachers[0], special);
        schedule.classes.push(c);
        c.buttons = c.createSpecialButton()
                     .data("display", $.fn.emptyDisplay)
                     .updateButton();
    });
    return this;
}

$.fn.addEmptyGrade = function(schedule){
    $(this).each( function(){
        let data = $(this).classDataFromtd();
        let grade = schedule.grades[parseInt(data[0])];
        let day = parseInt(data[1]);
        let teacher = grade.teachers[parseInt(data[2])];
        let c = new Class(grade.defaultBlock, day, teacher, schedule.specials[0]);
        schedule.classes.push(c);
        c.buttons = c.createGradeButton().updateButton();
    });
    return this;
}

$.fn.gradeDisplay = function(){
    let c = this.c();
    this.css(c.special.css[0])
        .data("css", c.special.css)
        .html(c.special.name + "<br>" + c.block.display());
    c.tdGrade().append(this);
    return this;
}

$.fn.specialsDisplay = function(){
    let c = this.c();
    this.css(c.teacher.grade.css[0])
        .data("css", c.teacher.grade.css)
        .html("<span class='ulbold'>" + c.teacher.grade.abbr + "</span> " +
              c.teacher.name + "<br>" + c.block.display());
    c.tdSpecial().append(this);
    return this;
}

$.fn.emptyDisplay = function(){
    let c = this.c();
    this.css(c.teacher.grade.css[0])
        .data("css", c.teacher.grade.css)
        .html(DAYS[c.day] + "<br>" + c.block.display());
    c.tdSpecial().append(this);
    return this;
}

$.fn.classDataFromtd = function(){
    return $(this).attr("id").slice(1).split(/[dtb]/);
}