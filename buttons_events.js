Schedule.prototype.loadButtons = function(){
    let schedule = this;
    schedule.classes.forEach( function(c){
        c.buttons = c.createGradeButton().updateButton()
                     .add(c.createSpecialButton().updateButton());
    }, this);

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

    schedule.classes[0].buttons.eq(0).after(this.dropdown);
    dropdown.attr("class", "dropdown").attr("id", "dropdown").hide();

    dropdown.hover(function(){
        dropdown.show();
    }, function(){
        dropdown.hide();
    });

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
        if (button.data("special") == schedule.specials[0]){
            s.buttons.remove();
            $("#menu").append(dropdown);

            let index = schedule.classes.indexOf(s);
            schedule.classes.splice(index,1);
            $(".grade td:empty").addEmptyGrade(schedule);
            $(".specials td:empty").addEmptySpecial(schedule);
        }
        else{
            s.special = button.data("special");
            updateClasses(schedule, s, s);
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
        $(this).switchByGrade(schedule, e);
    });

    $("#right").on("click", "button.schedule", function(e){
        $(this).switchBySpecial(schedule, e);
    });

    return this;
}

$.fn.switchByGrade = function(schedule, e) {
    e.stopImmediatePropagation();
    $("#left").off("click");
    $("#right").off("click");

    let c = this.c();
    let s = schedule.selectedClass.pop();

    if (c != s){

        let block = c.block;
        c.block = s.block;
        s.block = block;
    
        let day = c.day;
        c.day = s.day;
        s.day = day;
    
        let teacher = c.teacher;
        c.teacher = s.teacher;
        s.teacher = teacher;
    }

    updateClasses(schedule, c, s);
    schedule.dropdown.hide();

    $("body").on("click", "button.schedule", function(e){
        $(this).selectOnClick(schedule,e);
    });
}

$.fn.switchBySpecial = function(schedule, e) {
    e.stopImmediatePropagation();
    $("#left").off("click");
    $("#right").off("click");

    let c = this.c();
    let s = schedule.selectedClass.pop();

    if (c != s){

        let block = c.block;
        c.block = s.block;
        s.block = block;
    
        let special = c.special;
        c.special = s.special;
        s.special = special;

        let day = c.day;
        c.day = s.day;
        s.day = day;
    }

    updateClasses(schedule, c, s);
    schedule.dropdown.hide();

    $("body").on("click", "button.schedule", function(e){
        $(this).selectOnClick(schedule,e);
    });
}

Class.prototype.updateClass = function(){
    this.buttons.each(function(){
        $(this).updateButton();
    });
}

updateClasses = function(schedule, c, s){

    let tds = $();
    c.buttons.each(function(){
        tds = tds.add($(this).parent());
    });
    s.buttons.each(function(){
        tds = tds.add($(this).parent());
    });

    c.buttons.each(function(){
        $(this).updateButton();
    });
    s.buttons.each(function(){
        $(this).updateButton();
    });

    c.buttons.each(function(){
        tds = tds.add($(this).parent());
    });
    s.buttons.each(function(){
        tds = tds.add($(this).parent());
    });

    tds.each(function(){
    
        let td = $(this);

        let list = td.children().not("#dropdown");

        if (list.length > 1){
            list.each(function(){
                let button = $(this);
                if (button.c().special == schedule.specials[0] || button.c().teacher.grade == schedule.grades[0]){
                    button.remove();
                }
            });
        }

        if (list.length == 0){
            if (td.attr("id").startsWith("s")){
                td.addEmptySpecial(schedule);
            }
            else{
                td.addEmptyGrade(schedule);
            }
        }
    });
}

$.fn.updateButton = function(){
    this.data("display").call(this)
        .off("mouseenter")
        .off("mouseleave")
        .hide()
        .fadeIn(800)
    return this;
}

$.fn.addEmptySpecial = function(schedule){
    $(this).each( function(){
        let data = classDataFromtd($(this).attr("id").slice(1));
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
        let data = classDataFromtd($(this).attr("id").slice(1));
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

var classDataFromtd = function(id){
    return id.split(/[dtb]/);
}