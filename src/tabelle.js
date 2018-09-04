'use strict';

function Tabelle(pixelArray, width) {
  this._pixels =  pixelArray;

  this.pixelsPerRow = width * 4;
}

Tabelle.prototype.getRowPos = function(number) {
  return {
    start: this.pixelsPerRow * (number - 1),
    end: this.pixelsPerRow * number,
  };
};

Tabelle.prototype.getRow = function(number) {
  var rowPos = this.getRowPos(number);

  return this._pixels.slice(rowPos.start, rowPos.end);
};

Tabelle.prototype.replaceRow = function(number, row) {
  var rowPos = this.getRowPos(number);

  return this._pixels.set(row, rowPos.start);
};

Tabelle.prototype.shiftRow = function(number, offset) {
  var row = this.getRow(number),
      rowPos = this.getRowPos(number);

  var rowOffset = Math.floor((rowPos.end - rowPos.start) * offset),
      newRowStart = rowPos.start + rowOffset;

  if (newRowStart < 0) {
    newRowStart = 0;
  } else if (newRowStart > )

  return this._pixels.set(row, rowPos.start + rowOffset);
};

// Tabelle.prototype.countRows = function() {
//   var pixels = this._pixels,
//       rows = this._rows,
//       currentRow = 1;
//
//   for (var idx = 0; idx < pixels.length; idx += 4) {
//     if (idx === this.pixelsPerRow * currentRow) {
//       ++currentRow;
//
//       rows.push(idx);
//     }
//   }
//
//   console.log(rows);
// };
