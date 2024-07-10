import React, { useState } from "react";
import Grid from "./Cell";
import Plotter from "./Plotter";

//App component connects grid and plotter, and manages grid settings
function App() {
  const [key, setKey] = useState<number>(0); // Key to force re-render of Grid
  const [gridInterval, setGridInterval] = useState<number>(1000);
  const [size, setGridSize] = useState<number>(20);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [numBacteria, setNumBacteria] = useState<number>(0);
  const [currTime, setCurrTime] = useState<number>(0);
  const [inputGridSize, setInputGridSize] = useState<number>(size);
  const [inputGridInterval, setInputGridInterval] = useState<number>(gridInterval);

  const handleGridSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputGridSize(Number(e.target.value));
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputGridInterval(Number(e.target.value));
  };

  //Resets all fields and creates a new grid
  const createGrid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGridSize(inputGridSize); // Update the grid size
    setGridInterval(inputGridInterval); // Update the grid interval
    reset();
    if (!isPaused) pause();
  };

  //pauses the simulation
  const pause = () => {
    setIsPaused((prevPausedState) => !prevPausedState);
  };

  //reset grid, bacteria count and current time
  const reset = () => {
    setNumBacteria(0);
    setCurrTime(0);
    setKey((prevKey) => prevKey + 1); // Update key to force re-render of Grid
  };

  //Callback function to get bacteria count from a grid
  const getBacteria = (gridState: boolean[][]) => {
    let bacteriaCount = 0;
    for (const col of gridState) {
      for (const cell of col) {
        if (!cell) {
          bacteriaCount++;
        }
      }
    }
    if (bacteriaCount === size * size && !isPaused) {
      pause();
    }
    setNumBacteria(bacteriaCount);
  };

  const getCurrentTime = (runTime: number) => {
    setCurrTime(runTime);
  };

  return (
    <>
      <div>
        <Grid
          key={"G" + key}
          size={size}
          gridInterval={gridInterval}
          isPaused={isPaused}
          getBacteriaFunc={getBacteria}
          getCurrTimeFunc={getCurrentTime}
        />
        <div>
          <button onClick={reset}>Reset</button>
          <button onClick={pause}>{isPaused ? "Play" : "Pause"}</button>
        </div>
      </div>
      <div>
        <Plotter 
        key={"P" + key} 
        count={numBacteria} 
        time={currTime}
        size={size} 
        gridInterval={gridInterval} />
        <div>
          Bacteria Count: {numBacteria} | Current Time: {currTime}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          createGrid(e);
        }}
      >
        <h2>Grid Settings</h2>
        <div>
          <label htmlFor="gridSize">Grid Size: </label>
          <input
            onChange={handleGridSize}
            id="gridSize"
            type="number"
            max={20}
            min={4}
            required
            defaultValue={size}
          />
        </div>
        <div>
          <label htmlFor="simInterval">Simulation Interval: </label>
          <input
            onChange={handleIntervalChange}
            id="simInterval"
            type="number"
            required
            max={10000}
            min={100}
            defaultValue={gridInterval}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
}

export default App;
