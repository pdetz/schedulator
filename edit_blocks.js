Schedule.prototype.editBlocks = function(){
    let schedule = this;
    let table = $(document.createElement("table"));
    table.attr("class", "blocks schedule");
    let tbody = $(document.createElement("tbody"));

    table.append(
        tbody.append("<tr><td>Row</td><td>Default Block Time</td><td colspan=2>Alternate Block Times</td></tr>")
    );
    schedule.blocks.forEach(block => {
        tbody.append(block.blockRow(schedule.altBlocks));
    });

    tbody.on("mouseenter", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).parent().addClass("delete");
    });
    tbody.on("mouseleave", "button.delete", function(e){
        e.stopImmediatePropagation();
        $(this).parent().removeClass("delete");
    });
    tbody.on("click", "button.delete", function(e){
        e.stopImmediatePropagation();
        let altBlock = $(this).parent().data("block");
        altBlock.deleteAltBlock(schedule);
    });

    tbody.on("keyup", "input", function(){
        $(this).data("update").call($(this), schedule);
    });

    tbody.on("click", "button.add", function(e){
        e.stopImmediatePropagation();
        $(this).data("block").addAltBlock(schedule);
    });

    return table;
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

    schedule.altBlocks.splice(schedule.altBlocks.indexOf(altBlock),1);
}

Block.prototype.blockRow = function(altBlocks) {
    let block = this;
    let tr = $(document.createElement("tr"));

    tr.append("<td id='block" + block.n + "'>" + (block.n + 1).toString() + "</td>")
      .append( $(document.createElement("td"))
               .appendBlockInputs(block));
    let altTD = $(document.createElement("td")).attr("class", "alts");
    altBlocks.forEach(alt => {
        if (alt.n == block.n) {
            altTD.append(alt.altBlockButton());
        }
    });
    tr.append(altTD);
    tr.append($(document.createElement("td")));
    /*
        .append($(document.createElement("button"))
                    .attr("class", "add inv")
                    .data("block", block)
                    .append(PLUS)
    ));
*/
    block.editRow = tr;
    return tr;
}

Block.prototype.addAltBlock = function(schedule){
    let block = this;
    let newAltBlock = new Block(block.start, block.end, block.n);
    schedule.altBlocks.push(newAltBlock);
    schedule.altBlocks.sort(function(a, b){return a.n - b.n});

    block.editRow.find(".alts").append(newAltBlock.altBlockButton());
    schedule.blocksDD.append(newAltBlock.ddButton);
}

$.fn.appendBlockInputs = function(block){
    let start = $(document.createElement("input")).val(block.start)
                .attr("class", "blocks")
                .data({"block": block, "prop": "start", "update": $.fn.changeBlockName});
    let end = $(document.createElement("input")).val(block.end)
                .attr("class", "blocks")
                .data({"block": block, "prop": "end", "update": $.fn.changeBlockName});
    $(this).append(start, "–", end);
    return $(this);
}

// Updates the name of the Block throughout the schedule
// Both on the schedule itself and in the dropdown menu
$.fn.changeBlockName = function(schedule) {
    let input = this;
    let block = input.data("block");
    block[input.data("prop")] = input.val();
    
    schedule.gradeSchedules.find("div.b" + block.n).replaceWith(block.name);
    schedule.specialSchedules.find("div.b" + block.n).replaceWith(block.name);
    schedule.blocksDD.find("div.b" + block.n).replaceWith(block.name);
    //block.dropdownButton.html(block.name);

}

Block.prototype.altBlockButton = function(){
    let block = this;
    let button = $(document.createElement("div"))
                    .data("block", block)
                    .attr("class", "blocks")
                    .attr("id", "altBlock" + block.n)
                    .appendBlockInputs(block)
                    .append(deleteButton());
    block.altBlockButton = button;
    return button;
}

function deleteButton(){
    let button = $(document.createElement("button")).attr("class", "inv delete")
                .append(DELETE_ICON);
    return button;
}