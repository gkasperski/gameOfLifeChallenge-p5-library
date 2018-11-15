const gameOfLife = sketch => {
  let board;
  let nextGeneration;
  let run = false;
  const width = 1200;
  const height = 500;
  const elSize = 10;
  const columnsQuantity = Math.floor(width / elSize);
  const rowsQuantity = Math.floor(height / elSize);
  const backgroundColor = 50;
  const tileColor = 225;

  const setElementOnPosition = (x, y, element) => (board[x][y] = element);
  const getElementFromPosition = (x, y) => board[(x + columnsQuantity) % columnsQuantity][(y + rowsQuantity) % rowsQuantity];
  const randomizeBoard = () => board = board.map(column => column.map(() => Math.random() > 0.85));
  const deepCopyArray = array => array.map(arr => arr.slice());
  const toggleElement = (x, y) => setElementOnPosition(x, y, !getElementFromPosition(x, y));
  const toggleGame = () => { run = !run; document.getElementById('toggle').innerHTML = run ? 'Pause' : 'Start'; };

  const getRelativePositionFromEvent = event => {
    const { offsetX, offsetY } = event;
    const x = Math.floor(offsetX / elSize);
    const y = Math.floor(offsetY / elSize);
    return { x, y };
  }

  const addElementsToArray = (array, element, quantity) => {
    const newArray = [ ...array ];
    for(let i = 0; i < quantity; i++) {
      newArray[i] = element;
    }
    return newArray;
  }

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    sketch.background(backgroundColor);
  };
 
  /**
   * Runs in loop (p5 hidden mechanism)
   */
  sketch.draw = () => { 
    run && createNewGeneration(); 
    board.forEach((column, columnIndex) => {
      column.forEach((row, rowIndex) => {
        sketch.fill(row ? tileColor : backgroundColor);
        sketch.stroke(backgroundColor);
        sketch.rect(columnIndex * elSize, rowIndex * elSize, elSize-1, elSize-1);
      });
    });
  };

  sketch.mousePressed = event => {
    const { target } = event;
    if (target.className === 'p5Canvas') {
      const { x, y } = getRelativePositionFromEvent(event);
      toggleElement(x, y);
      return true;
    }
    switch(target.id) {
      case 'toggle':
        toggleGame(target);
        break;
      case 'clear':
        initializeboard();
        break;
      case 'randomize':
        randomizeBoard();
        break;
      case 'next':
        createNewGeneration();
        break;
      default: break;
    }
  };

  sketch.mouseDragged = event => {
    if (event.target.className === 'p5Canvas') {
      const { x, y } = getRelativePositionFromEvent(event);
      setElementOnPosition(x, y, 1);
    }
  };

  function initializeboard() {
    board = [];
    board = addElementsToArray(board, [], columnsQuantity);
    board = board.map(columnArr =>
      addElementsToArray(columnArr, false, rowsQuantity)
    );
    nextGeneration = deepCopyArray(board);
  }


  function countNeighboursQuantityForPosition(x, y) {
    let neighbors = 0;
    for (let neighborColumnDeviation = -1 ; neighborColumnDeviation <= 1 ; neighborColumnDeviation++) {
      for(let neighborRowDeviation = -1 ; neighborRowDeviation <= 1 ; neighborRowDeviation++) {
        neighbors += getElementFromPosition(x+neighborColumnDeviation, y+neighborRowDeviation);
      }
    }
    neighbors -= board[x][y]; // substracts itself, coz it should care only for neigbours
    return neighbors;
  }

  function applyGameOfLifeRules(cell, neighbors) {
    if ((cell == true) && (neighbors < 2)) return false;
    if ((cell == true) && (neighbors > 3)) return false;
    if ((cell == false) && (neighbors == 3)) return true;
    return cell;
  }

  function createNewGeneration() {
    board.forEach((column, columnIndex) => {
      column.forEach((cell, rowIndex) => {
        nextGeneration[columnIndex][rowIndex] = applyGameOfLifeRules(cell, countNeighboursQuantityForPosition(columnIndex, rowIndex));
      });
    });
    board = deepCopyArray(nextGeneration);
  }

  initializeboard();
};

new p5(gameOfLife);
