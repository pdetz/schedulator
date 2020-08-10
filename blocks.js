function Block(start, end, n) {
    this.start = start;
    this.end = end;
    this.n = n;
}

Block.prototype = {get name(){return this.start + " – " + this.end;}}