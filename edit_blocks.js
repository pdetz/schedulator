Schedule.prototype.editBlocksTable = function(){
    let schedule = this;
    let table = schedule.blocksEditor;

    table.append("<tbody><tr><td></td><td>Grade Name</td><td>Default Block</td><td>Abbr</td><td>Color</td><td></td><td></td></tr></tbody>");

    let tbody = table.find("tbody");
    tbody.append("<tr><td></td><td>Default Times</td><td colspan=4>Alternate Block Times</td><td></td></tr>");

    schedule.blocks.forEach(block => {
        tbody.append(block.blockRow(schedule));
    });
    
    let controlRow = ctrlRow("Time Block", 4,1, schedule.addDefaultBlock, schedule);
    
    tbody.append(controlRow.prepend(make("td")));

    return table;
}

Schedule.prototype.addDefaultBlock = function(){
    let schedule = this;

    let newBlock = new Block("", "", schedule.blocks.length, -1);    
    schedule.blocks.push(newBlock);
    
    schedule.blocks[schedule.blocks.length - 2].ddButton.after(newBlock.ddButton);
    schedule.blocksEditor.find("tr.ctrl_row").before(newBlock.blockRow(schedule));
    schedule.blocksEditor.find("button.ctrl.on").click().click();

    for (let i = 1; i < schedule.specials.length; i++){
        let special = schedule.specials[i];
        let newRow = special.scheduleTableRow(newBlock);
        $(special.table).find("tbody").append(newRow);
        newRow.children().addEmptyClass(schedule);
    };
}

Block.prototype.deleteAltBlock = function(schedule) {
    let altBlock = this;
    let defaultBlock = schedule.blocks[altBlock.n];

    schedule.classes.forEach(c => {
        if (c.block == altBlock) {
            c.block = defaultBlock;
            c.buttons.updateButton();
        }
    });
    altBlock.ddButton.remove();
    altBlock.altBlockButton.remove();

    let index = schedule.altBlocks.indexOf(altBlock);
    schedule.altBlocks.splice(index,1);
    for (let i = index; i < schedule.altBlocks.length; i++){
        let block = schedule.altBlocks[i];
        block.renumber(block.n, i, schedule);
    }
}

Block.prototype.deleteBlock = function(schedule) {
if (schedule.blocks.length > 1) {

    let block = this;

// First: delete all associated altBlocks
    for (let i = 0; i < schedule.altBlocks.length; i++) {
        if (schedule.altBlocks[i].n == block.n) {
            schedule.altBlocks[i].deleteAltBlock(schedule);
            i--;
        }
    }
// Search through all classes, change to an available time block
    for (let i = 0; i < schedule.classes.length; i++){
        let c = schedule.classes[i];
        if (c.block.n == block.n && c.hasGrade()){
            // Change to available block
            if (block.n == schedule.blocks.length - 1) {
                console.log(schedule.blocks[schedule.blocks.length - 1]);
                c.block = schedule.blocks[schedule.blocks.length - 2];
            }
            else {
                c.block = schedule.blocks[block.n + 1];
            }
            schedule.selectedClass.push(c);
            schedule.updateClasses();
            //c.buttons.updateButton();
        }
    };
// Remove the dropdown button and the edit Row in the editor
    block.ddButton.remove();
    block.editRow.remove();

// Delete classes and rows from the specials schedules

console.log("length before: ", schedule.classes.length);
    let classesToDelete = [];
    let specialRows = schedule.specialSchedules.find("[id*=b" + block.n.toString()).parent();
    specialRows.find("button").each(function(){
        classesToDelete.push($(this).c());
    });
    classesToDelete.forEach(c =>{
        schedule.classes.splice(schedule.classes.indexOf(c), 1);
    });
    
    console.log("length after: ", schedule.classes.length);
    specialRows.remove();

// Splice the schedule.blocks array and renumber all affected blocks
    let index = schedule.blocks.indexOf(block);
    schedule.blocks.splice(index,1);
    for (let i = index; i < schedule.blocks.length; i++){
        let block = schedule.blocks[i];
        schedule.altBlocks.forEach( altBlock =>{
            if (altBlock.n == block.n) {
                altBlock.renumber(i, altBlock.n, schedule);
            }
        });
        block.renumber(i, -1, schedule);
    }
}
}

Block.prototype.blockRow = function(schedule) {
    let block = this;
    let tr = make("tr").data("obj", block);

    tr.append(make("td"))
      .append( make("td")
               .appendBlockInputs(block));
    let altTD = make("td").attr("colspan", "4")
                    .append(make("div", "alts_button")
                        .append(make("button", "add inv")
                        .append(PLUS)))
                        .append(make("div", "alts"));
    schedule.altBlocks.forEach(alt => {
        if (alt.n == block.n) {
            altTD.find("div.alts").append(alt.altBlockButton());
        }
    });
    tr.append(altTD);
    tr.append(make("td").append(make("div", "ctrl")));

    block.editRow = tr;
    return tr;
}

Block.prototype.addAltBlock = function(schedule){
    let block = this;
    let newAltBlock = new Block(block.start, block.end, block.n, schedule.altBlocks.length);
    schedule.altBlocks.push(newAltBlock);
    schedule.blocksDD.append(newAltBlock.ddButton);
    schedule.altBlocks.sort(function(a, b){return a.n - b.n});
    schedule.altBlocks.forEach(function(block, i){
        console.log("before: ", block.a);
        block.renumber(block.n, i, schedule);
        console.log("after: ", block.a);
        schedule.blocksDD.append(block.ddButton);
    });

    block.editRow.find("div.alts").append(newAltBlock.altBlockButton());
}

$.fn.appendBlockInputs = function(block){
    let start = make("input", "edit_blocks").val(block.start)
                .data({"block": block, "prop": "start", "update": $.fn.changeBlockName});
    let end = make("input", "edit_blocks").val(block.end)
                .data({"block": block, "prop": "end", "update": $.fn.changeBlockName});
    $(this).append(start, " – ", end);
    return $(this);
}

// Updates the name of the Block throughout the schedule
// Both on the schedule itself and in the dropdown menu
$.fn.changeBlockName = function(schedule) {
    let input = this;
    let block = input.data("block");
    block[input.data("prop")] = input.val();
    
    schedule.gradeSchedules.find("div." + block.divClass).replaceWith(block.name);
    schedule.specialSchedules.find("div." + block.divClass).replaceWith(block.name);
    schedule.blocksDD.find("div." + block.divClass).replaceWith(block.name);
    //block.dropdownButton.html(block.name);
}

Block.prototype.altBlockButton = function(){
    let block = this;
    let button = make("div", "#altBlock" + block.n, "alt_block")
                    .data("block", block)
                    .appendBlockInputs(block)
                    .append(deleteButton().addClass("alt"));
    block.altBlockButton = button;
    return button;
}
