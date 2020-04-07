var topbarButton = function(gOrS) {
    let button = document.createElement("BUTTON");
    $(button).attr("class", "topbar_button " + gOrS.css);
    $(button).css("background", gOrS.color);
    $(button).append(gOrS.abbr);
    return button;
}

var toggleTable = function(gradeOrSpecial){
    if (gradeOrSpecial.isVisible) {
        $(gradeOrSpecial.table).slideUp();
        $(gradeOrSpecial.button).css({"background": "#eee", "color": "#999"});
    }
    else {
        $(gradeOrSpecial.table).slideDown();
        $(gradeOrSpecial.button).css({"background": gradeOrSpecial.color, "color": "#000"});
    }
    gradeOrSpecial.isVisible = !gradeOrSpecial.isVisible;
};


// Returns a button element for one cell
// of the grade level schedule table
var gradeLevelButton = function(c) {
    let button = document.createElement("BUTTON");
    $(button).data({
        "c": c
    });
    updateGradeLevelButton(button);
    return button;
};

var updateGradeLevelButton = function(button) {
    $(button).attr("class", "schedule");
    $(button).css("background", $(button).data("c").special.color);
    $(button).html($(button).data("c").special.name + "<br>" + $(button).data("c").block.display());
    $(button).css("opacity", "0");
    $(button).animate({opacity: 1}, 800);
}

var specialsButton = function(c) {
    let button = document.createElement("BUTTON");
    $(button).data({
        "c": c
    });
    updateSpecialsButton(button);
    return button;
};

var updateSpecialsButton = function(button) {
    $(button).attr("class", "schedule");
    $(button).css("background", $(button).data("c").teacher.grade.color);
    $(button).html($(button).data("c").teacher.grade.abbr + " " +  $(button).data("c").teacher.name + "<br>" + $(button).data("c").block.display());
    if ($(button).data("c").special.n == "0") {
        $(button).hide();
    }
    else {
        $($(button).data("c").tdID()).append(button);
        $(button).css("opacity", "0");
        $(button).show();
        $(button).animate({opacity: 1}, 800);
    }
}
