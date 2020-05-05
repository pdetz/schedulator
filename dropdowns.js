Schedule.prototype.loadBlocksDD = function(){
    let schedule = this;
    let blocksDD = this.blocksDD;

    blocksDD.attr("class", "dropdown blocks")
            .attr("id", "blocksDD").hide();

    // Add buttons for each block to the dropdown menu
    for (let i = 0; i < schedule.blocks.length; i++){
        let block = schedule.blocks[i];
        let button = dropdownButton(block, "block", schedule.specials[0].css);
        blocksDD.append(button);
    }
    blocksDD.append("<hr>")
            .append("<div id='altblocks'></div>");
    for (let i = 0; i < schedule.altBlocks.length; i++){
        let block = schedule.altBlocks[i];
        //console.log(block);
        let button = dropdownButton(block, "block", schedule.specials[0].css);
        console.log(button);
        blocksDD.append(button);
        console.log(block);
    }

    blocksDD.append("<hr>")
            .append("<input style='width:3em' id='nbStart'></input> – ")
            .append("<input style='width:3em' id=\"nbEnd\"></input>")
            .append("<input style='width:1em' id=\"nbN\"></input>"+
                    "<button style='width:5em' id=\"addBlock\">Add Block</block>");

    blocksDD.on("click", "#addBlock", function(e){
        e.stopImmediatePropagation();
        let start = $("#nbStart").val();
        let end = $("#nbEnd").val();
        let n = $("#nbN").val();
        let newBlock = new Block(start, end, n);
        schedule.altBlocks.push(newBlock);
        $("#altblocks").append(dropdownButton(newBlock, "block", schedule.specials[0].css));
        console.log(newBlock);
    });

    blocksDD.on("click", ".dropdown_button", function(e){
        let button = $(this);
        let s = schedule.selectedClass[0];
        console.log(s);
        s.block = button.data("block");
        schedule.updateClasses();
        blocksDD.slideUp();
        schedule.resetButtons();
    });

    $("#left").on("contextmenu", "button.schedule", function(e){
        e.preventDefault();
        let clicked = $(this);
        let c = clicked.c();

        if (c.hasSpecial()){
            schedule.resetButtons();
            schedule.selectedClass.push(c);
            clicked.after(blocksDD);
            blocksDD.slideDown(200);
        }
        clicked.blur();
    });
}

Schedule.prototype.loadSpecialsDD = function(){
    let schedule = this;
    let specialsDD = this.specialsDD;

    specialsDD.attr("class", "dropdown")
              .attr("id", "specialsDD").hide();

    // Add buttons for each special to the dropdown menu
    for (i = 0; i < schedule.specials.length; i++){
        let special = schedule.specials[(i+1) % schedule.specials.length];
        let button = dropdownButton(special, "special", special.css);
        specialsDD.append(button);
    }

    // Click handler for each Specials button in the dropdown menu
    specialsDD.on("click", ".dropdown_button", (function(e){
        let button = $(this);
        let s = schedule.selectedClass[0];

        // Deletes buttons and removes a class from the array if the user clicks "No Special"
        if (button.data("special") == schedule.specials[0]){
            let tds = s.buttons.parent();
            schedule.removeClass(s);
            tds.each(function(){
                let td = $(this);
                let list = td.children(".schedule");
                if (list.length == 0){
                    td.addEmptyClass(schedule);
                }
            });
            schedule.selectedClass = [];
        }
        else{
            // If we are changing an empty block to a specials block
            // Delete the button, and create new buttons for specials and grade level schedules
            if (!s.hasSpecial()){
                s.buttons.remove();
                s.special = button.data("special");
                s.buttons = s.createGradeButton().add(s.createSpecialButton());
            }
            else {
                s.special = button.data("special");
            }
            schedule.updateClasses();
        }
        schedule.resetButtons();
  }));
}

$.fn.dropdownMenu = function(menu){
    $(this).on("mouseenter", function(){
        menu.insertAfter($(this)).show();
    });
    $(this).on("mouseleave", function(){
        menu.hide();
    });
    menu.hover(function(){
        menu.show();
    }, function(){
        menu.hide();
    });
}

function dropdownButton(obj, objType, css) {
    let button = $(document.createElement("BUTTON"));
    button.data(objType, obj)
          .attr("class", "dropdown_button")
          .append(obj.name)
          .css(css[0])
          .hover(function(){
              button.css(css[1]);
          }, function(){
              button.css(css[0]);
          });
    return button;
}