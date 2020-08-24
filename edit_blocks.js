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
    console.log(schedule);

    let newBlock = new Block("", "", schedule.blocks.length, -1);    
    schedule.blocks.push(newBlock);
    
    schedule.blocks[schedule.blocks.length - 2].ddButton.after(newBlock.ddButton);
    $("#add_block").blur().closest("tr").before(newBlock.blockRow(schedule));
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

Block.prototype.blockRow = function(schedule) {
    let block = this;
    let tr = make("tr");

    tr.append(make("td"))
      .append( make("td")
               .appendBlockInputs(block));
    let altTD = make("td").attr("colspan", "4")
                    .append(make("div", "alts"))
                    .append(make("div", "alts_button")
                    .append(make("button", "add inv")
                    .data("block", block)
                    .append(PLUS)));
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
        block.renumber(block.n, i, schedule);
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
                    .append(deleteButton());
    block.altBlockButton = button;
    return button;
}
