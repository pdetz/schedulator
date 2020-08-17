function Block(start, end, n) {
    this.start = start;
    this.end = end;
    this.n = n;
    this.colorClass = "block";
    this.ddButton = dropdownButton(this, "block");
}

Block.prototype = {get name(){
    let name = $(document.createElement("div"));
    name.attr("class", "b" + this.n)
        .append(this.start + " – " + this.end + "<br>");
    return name;
}}