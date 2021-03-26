[![npm version](https://badge.fury.io/js/%40neochess%2Fcore.svg)](https://badge.fury.io/js/%40neochess%2Fcore)
[![Build Status](https://travis-ci.org/luismanuelamengual/Neochess-Core.svg?branch=main)](https://travis-ci.org/luismanuelamengual/Neochess-Core)
![](https://img.shields.io/github/forks/luismanuelamengual/Neochess-Core.svg?style=social&label=Fork)
![](https://img.shields.io/github/stars/luismanuelamengual/Neochess-Core.svg?style=social&label=Star)
![](https://img.shields.io/github/watchers/luismanuelamengual/Neochess-Core.svg?style=social&label=Watch)
![](https://img.shields.io/github/followers/luismanuelamengual.svg?style=social&label=Follow)

# Neochess-Core

Neochess-Core is a Javascript chess library that supports move validation/generation, piece placement/movement and detection check/checkmate/draw situations. This library supports moves in SAN notation and also support FEN notation for static positions and PGN notation for saving/loading a match state. 

This library has been extensively tested in Jest.

## Installation

```
# NPM
npm install @neochess/core

# Yarn
yarn add @neochess/core
```

## Getting started

Import the "Match" (Dynamic view) or "Board" (Static view) object and start playing ...

```js
// Import the "Match" class from @neochess/core
import {Match} from "@neochess/core";

// Create a match
const match = new Match();

// Create a match starting from a valid FEN position 
const match2 = new Match('1k6/3R4/4P3/8/3b2r1/8/5r2/7K w - - 0 1');
```

## Examples

### Making Moves
```js
// Making single moves
match.makeMove('e4');
match.makeMove('e5');
match.makeMove('Qh5');

// Making multiple moves
match.makeMoves(['Nc6', 'Bc4', 'd6', 'Qxf7#']);
```

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
match.setPGN('1.e4 e5 2.Bc4 (2.Nf3 Bb4 {Estoy en una variante} 3.c3) 2...Nc6 3.Qh5 {Intento de mate pastor} 3...g6 4.Qf3 d6 {APA !! aca me deje mate en 1} 5.Nc3 *');

// Obtaining a PGN
match.getPGN();
```

### Adding comments on positions

```js
match.addComments('We are in a crucial moment');  // Adding comments to a position
match.getComments();  // Obtaining the position comments
match.deleteComments();  // Removing comments of the position
```

### Adding annotations on positions

```js
match.addAnnotation(Annotation.VERY_GOOD_MOVE);
match.addAnnotation(Annotation.QUESTIONABLE_MOVE);
```