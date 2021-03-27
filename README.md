[![npm version](https://badge.fury.io/js/%40neochess%2Fcore.svg)](https://badge.fury.io/js/%40neochess%2Fcore)
[![Build Status](https://travis-ci.org/luismanuelamengual/Neochess-Core.svg?branch=main)](https://travis-ci.org/luismanuelamengual/Neochess-Core)
![](https://img.shields.io/github/forks/luismanuelamengual/Neochess-Core.svg?style=social&label=Fork)
![](https://img.shields.io/github/stars/luismanuelamengual/Neochess-Core.svg?style=social&label=Star)
![](https://img.shields.io/github/watchers/luismanuelamengual/Neochess-Core.svg?style=social&label=Watch)
![](https://img.shields.io/github/followers/luismanuelamengual.svg?style=social&label=Follow)

# Neochess-Core

Neochess-Core is a Javascript chess library that supports move validation/generation, piece placement/movement and detection of check/checkmate/draw situations. This library supports moves in SAN notation and also supports FEN notation for static positions and PGN notation for dynamic chess matches. 

This library has been extensively tested with Jest.

## Installation

```
npm install @neochess/core
```

## Getting started

Import the "Match" (Dynamic view) or "Board" (Static view) object and start playing ...

```js
// Import the "Match" class from @neochess/core
import {Match} from "@neochess/core";

// Create a match
const match = new Match();

// Create a match starting from a valid FEN position 
const matchFEN = new Match('1k6/3R4/4P3/8/3b2r1/8/5r2/7K w - - 0 1');
```

## Examples

### Getting information from a position

```js
const match = new Match();
console.log('Piece at e2: ' + match.getPiece(Square.E2));
console.log('Side To Move: ' + match.getSideToMove());
console.log('Move Counter: ' + match.getMoveCounter());
console.log('Half Move Counter: ' + match.getHalfMoveCounter());
console.log('En Passant Square: ' + match.getEPSquare());
console.log('FEN: ' + match.getFEN());
```

### Making Moves
```js
// Making single moves
match.makeMove('e4');
match.makeMove('e5');
match.makeMove('Qh5');

// Making multiple moves
match.makeMoves(['Nc6', 'Bc4', 'd6', 'Qxf7#']);
```

### Getting valid moves

```js
const match = new Match('r1bqkbnr/ppppp1pp/2n2P2/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3');
console.log(match.getValidMoves());
```

### Moving between match nodes

```js
match.goToNextPosition();  // Moving forward
match.goToPreviousPosition();  // Moving backwards
match.goToStartPosition();  // Move to root position
match.goToCurrentPosition();  // Move to current (main line) position
match.goToPosition(2);  // Move to position at ply 2
```

### Working with PGN Notation

```js
// Loading a PGN
match.setPGN('1.e4 $1 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3) 2...Nc6 3.Qh5 *');

// Obtaining a PGN
match.getPGN();
```

### Adding comments on positions

```js
match.addPositionComments('We are in a crucial moment');  // Adding comments to a position
match.getPositionComments();  // Obtaining the position comments
match.clearPositionComments();  // Removing comments of the position
```

### Adding annotations on positions

```js
// Adding annotations
match.addPositionAnnotation(Annotation.VERY_GOOD_MOVE);
match.addPositionAnnotation(Annotation.QUESTIONABLE_MOVE);

// Getting annotations
match.getPositionAnnotations();

// Removing annotations
match.clearPositionAnnotations();
```

### Listening for match events

```js
// Listening for position changes
match.addEventListener('positionChange', () => {
   console.log('Position changed !!');
});

// Listening for moves made
match.addEventListener('moveMade', (move) => {
    console.log('Move made !!');
    console.log(move);
});
```

## Contact

For bugs or for requirements please contact me at luismanuelamengual@gmail.com