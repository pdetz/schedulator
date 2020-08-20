Schedule.prototype.loadSpecialsDD = function(){
    let schedule = this;
    let specialsDD = this.specialsDD;

    // Add buttons for each special to the dropdown menu
    for (i = 0; i < schedule.specials.length; i++){
        let special = schedule.specials[(i+1) % schedule.specials.length];
        specialsDD.append(special.dropdownButton);
    }

    specialsDDClickHandler(schedule);
}

Schedule.prototype.loadBlocksDD = function(){
    let schedule = this;
    let blocksDD = this.blocksDD;

    // Add buttons for each block to the dropdown menu
    for (let i = 0; i < schedule.blocks.length; i++){
        let block = schedule.blocks[i];
        blocksDD.append(block.ddButton);
    }
    blocksDD.append("<hr id='altblocks'>");
    for (let i = 0; i < schedule.altBlocks.length; i++){
        let block = schedule.altBlocks[i];
        //block.ddButton = dropdownButton(block, "block");
        blocksDD.append(block.ddButton);
    }
    blocksDDRightClickHandler(schedule);
}

Schedule.prototype.loadPaletteDD = function(){
    let schedule = this;
    let palette = schedule.palette;
    let paletteDD = schedule.paletteDD;

    paletteDD.hide();

    for (let c = 4; c < palette.length; c++){
        let color = palette[c];

        let button = make("button", "specials palette")
                        .data("color", c)
                        .css("background-color", color);
        
        paletteDD.append(button);
    }
}

// Opens/toggles the palette in the correct area in the editing space
Schedule.prototype.openPalette = function(button, objType){

    let schedule = this;
    schedule.paletteDD.data(objType, button.data(objType));
    let tr = button.closest("tr");

    if (tr.has(schedule.paletteDD).length){
        schedule.paletteDD.slideUp(200, function(){schedule.paletteDD.detach()});
    }
    else {
        schedule.paletteDD.hide();
        button.parent().next().append(schedule.paletteDD);
        schedule.paletteDD.slideDown(200);
    }
    button.blur();
    paletteDDClickHandler(schedule, objType);
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

function dropdownButton(obj, objType) {
    let button = $(document.createElement("BUTTON"));
    button.data(objType, obj)
          .attr("class", "dropdown_button " + obj.colorClass)
          .append(obj.name);
    return button;
}