import { useState, useEffect } from "react";
import "./index.css";

interface CellProps {
  row: number;
  size: number;
  col: number;
  isEmpty: boolean;
  onClick: (row: number, col: number) => void;
}

/**
 * Cell component used in Row that can be populated and emptied with bacteria on click
 * 
 * @param row - The row number of the cell in the grid
 * @param col - The coloumn number of the cell in the grid
 * @param size - the size of the grid(number of cells per side)
 * @param isEmpty - Whether cell is empty of bacteria
 * @param onClick - Callback function to toggle isEmpty property of the cell
 */
function Cell({ row, col, size, isEmpty, onClick }: CellProps) {
  const toggleState = () => {
    onClick(row, col);
  };

  return (
    <div
      className="cell"
      style={{width: 450/size + "px", height: 450/size + "px",  
        backgroundColor: isEmpty ? "aliceblue" : "red"}}
      onClick={toggleState}
    ></div>
  );
}

interface RowProps {
  row: number;
  size: number;
  gridState: boolean[][];
  onClick: (row: number, col: number) => void;
}

/**
 * Row component used in Grid that is populated by size number of cells
 * 
 * @param row - The row number in the grid
 * @param gridState - 2D boolean array of the grid with filled/empty cells
 * @param onClick - Callback function passed to cell toggle cell state
 */
function Row({ row, gridState, onClick }: RowProps) {
  const grid = [];
  for (let y = 0; y < gridState.length; y++) {
    grid.push(  
      <Cell
        key={`${row},${y}`}
        row={row}
        size={gridState.length}
        col={y}
        isEmpty={gridState[row][y]}
        onClick={onClick}
      />
    );
  }
  return <div style={{ display: "flex" }}>{grid}</div>;
}

interface GridProps {
  size: number;
  gridInterval: number;
  isPaused?: boolean;
  getBacteriaFunc: (gridState: boolean[][]) => void;
  getCurrTimeFunc: (time: number) => void;
}

/**
 * Grid component that renders the grid and simulates bacterial growth to adjacent cells
 * 
 * @param size - The size of the grid (number of cells per side)
 * @param gridInterval - Time interval for the simulation step in milliseconds
 * @param isPaused - Whether the simulation is paused
 * @param getBacteriaFunc - Callback function to get the current number of bacteria cells
 * @param getCurrTimeFunc - Callback function to get the current simulation time
 */
function Grid({ size, gridInterval, isPaused = false, getBacteriaFunc, getCurrTimeFunc }: GridProps) {
  //2D array that tracks whether a cell is empty on the grid. True if empty, false if filled.
  const [gridState, setGridState] = useState(
    Array(size)
      .fill(null)
      .map(() => Array(size).fill(true))
  );

  const [runTime, setRunTime] = useState(0);

  //REQ: Row and cell are valid coordinates on the grid
  //Modifies: gridState
  //Effect: Toggles the state of the cell, filling it or emptying it.
  const handleClick = (row: number, col: number) => {
    const newGridState = gridState.map((row) => row.map((cell) => cell));
    newGridState[row][col] = !newGridState[row][col];
    setGridState(newGridState);
  };

  //Modifies: gridState, 
  //Effect: Division logic for the bacterial growth to spread to adjacent cells[top, bottom, right, left]
  const divide = () => {
    setGridState((prevGridState) => {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
      ];

      const newGridState = prevGridState.map((row) => row.map((cell) => cell));

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          //if the cell is filled
          if (prevGridState[i][j] === false) {
            //fill adjacent cells
            for (const [x, y] of directions) {
              const newX = i + x;
              const newY = j + y;
              //check for out of bounds
              if (newX < size && newY < size && newX >= 0 && newY >= 0) {
                newGridState[newX][newY] = false;
              }
            }
          }
        }
      }
      return newGridState;
    });
  };

  // useEffect to handle the grid state updates and runTime
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setRunTime((prevRunTime) => prevRunTime + gridInterval);
        divide();  
      }, gridInterval);
      return () => clearInterval(interval); //clears interval on component unmount
    }
  }, [isPaused, gridInterval]);

  // useEffect to update time, bacteria count for the App or external components when runtime, or gridState changes
  useEffect(() => {
    if(runTime !== 0){
      console.log("R: " + runTime);
      getCurrTimeFunc(runTime)
      getBacteriaFunc(gridState);
    }
  },[runTime, gridState])

  //Creates the grid element
  const gridDOM = [];
  for (let x = 0; x < size; x++) {
    gridDOM.push(
      <Row
        key={x + 1000}
        row={x}
        size={size}
        gridState={gridState}
        onClick={handleClick}
      />
    );
  }

  return <div className='grid'>{gridDOM}</div>;

}
export default Grid;
