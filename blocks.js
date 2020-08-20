function Block(start, end, n, a) {
    this.start = start;
    this.end = end;
    this.n = n;
    this.a = a;
    this.colorClass = "block";
    this.divClass = blockDivClass(this.n, this.a);
  
    this.ddButton = dropdownButton(this, "block");
}

function blockDivClass(n, a){
    let dc = "b" + n.toString();
    if (a >= 0) {
        dc += "a" + a.toString();
    }
    return dc;
}

Block.prototype = {get name(){
    let name = make("div");
    name.attr("class", this.divClass)
        .append(this.start + " – " + this.end);
    return name;
}}

Block.prototype.renumber = function(n, a, schedule){
    let block = this;
    let instances = schedule.gradeSchedules.find("div." + block.divClass)
                    .add(schedule.specialSchedules.find("div." + block.divClass))
                    .add(schedule.blocksDD.find("div." + block.divClass))
                    .add(schedule.editor.find("div." + block.divClass));
    block.divClass = blockDivClass(n, a);
    instances.attr("class", block.divClass);
}