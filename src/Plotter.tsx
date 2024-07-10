import { useEffect, useState } from "react";

interface ColProps {
  point?: number | null;
  size?: number;
}
/**
 * Coloumn component used in plotting grid 
 * 
 * @param row - The row number in the grid
 * @param size - The size of the grid (number of cells per side). Not the plotting grid.
 */
function Col({ point = null, size = 20 }: ColProps){
  const grid = [];

  //Avoid decrementing null. Creates offset by 1. 0 values do not show up in the plotting grid
  const adjustedPoint = point !== null ? point - 1 : -1; 
  
  for (let y = 0; y < size * size; y++) {
    grid.push(
      <div
        key={y}
        style={{ width: 450 / (size * 2 - 2), height: 450 / (size * size) }}
        className={y !== adjustedPoint ? "plotCell" : "filledCell"}
      ></div>
    );
  }
  return <div>{grid}</div>;
}


interface GridProps {
  pointsList: number[];
  size?: number;
}

/**
 * Grid component used to plot bacterial growth 
 * 
 * @param pointsList - Array of bacteria population from the most recent n-1 intervals
 * @param size - The size of the grid (number of cells per side).
 */
function Grid({ pointsList, size = 20 }: GridProps) {
  const gridDOM = [];
  for (let x = 0; x < (size) * 2 - 2; x++) {
    gridDOM.push(
      <Col
        key={x + 1000}
        size={size}
        point={x < pointsList.length ? pointsList[x] : null}
      />
    );
  }
  return (
    <div className="plotterGrid" style={{ display: "flex", backgroundColor: 'aliceblue' }}>
      {gridDOM}
    </div>
  );
}

interface AxisYProps {
  size: number;
}

/**
 * Y-axis component for the plotting grid 
 * 
 * @param size - The size of the grid (number of cells per side). Not the plotting grid.
 */
function AxisY({ size }: AxisYProps) {
  const axisDOM = [];
  for (let i = 5; i > 0; i--) {
    axisDOM.push(
      <div
        key={(size / 5) * i}
        style={{ transform: `translate(0%,-0.4rem)`, fontSize: '0.8rem', width: '1.5rem', height: (450 / 5) + 'px' }}
      >
        {((size * size) / 5) * i}
      </div>
    );
  }
  return (
    <div>
      {axisDOM}
    </div>
  );
}

interface AxisXProps {
  time: number;
  gridInterval: number;
  size: number;
  plotY: number[];
}

/**
 * X-axis component for the plotting grid 
 * 
 * @param time - The current time of the simulation
 * @param gridInterval - Time interval for the simulation step in milliseconds
 * @param size - The size of the grid (number of cells per side). Not the plotting grid.
 * @param plotY - Array of bacteria population from the most recent n-1 intervals
 */
function AxisX({ time, gridInterval, size, plotY }: AxisXProps) {
  const axisDOM = [];
  //moving x-axis after the plot is filled
  if (plotY.length === (size * 2) - 1) {
    for (let i = 5; i >= 0; i--) {
      axisDOM.push(
        <div
          key={i}
          style={{ width: 450 / 5 + 'px' }}
        >
          {Math.round(time - gridInterval * (((2 * size - 2) / 5) * i))}
        </div>
      );
    }
  } else {
    //initial x-axis
    for (let i = 0; i <= 5; i++) {
      axisDOM.push(
        <div
          key={i}
          style={{ width: 450 / 5 + 'px' }}
        >
          {Math.round(gridInterval * ((2 * size - 2) / 5 * i))}
        </div>
      );
    }
  }
  return (<div className="axisX">{axisDOM}</div>);
}

interface PlotterProps {
  count: number;
  time: number;
  size: number;
  gridInterval: number;
}

/**
 * Plotter component that renders the grid with axes
 * 
 * @param count - The current count of the bacteria population
 * @param time - The current time of the simulation
 * @param size - The size of the grid (number of cells per side). Not the plotting grid.
 * @param gridInterval - Time interval for the simulation step in milliseconds
 */
function Plotter({ count, time, size, gridInterval }: PlotterProps) {
  const [plotY, setPlotY] = useState<number[]>([]);
  console.log(plotY);
  console.log(time);

  //Update the y values(bacterial count) arrays, with change in time
  useEffect(() => {
    setPlotY((prevPlotY) => {
      if (time === 0) return prevPlotY; //prevent sideEffects with useEffect from initial renders 
      let newPlot: number[];
      if (prevPlotY.length === (size * 2) - 1) {
        newPlot = prevPlotY.slice(1); 
      } else {
        newPlot = prevPlotY.slice();
      }
      newPlot.push(count);
      return newPlot;
    });
  }, [time]);

  return (
    <div className="plotContainer">
      <AxisY size={size} />
      <Grid key={30} size={size} pointsList={plotY} />
      <AxisX time={time} gridInterval={gridInterval} size={size} plotY={plotY} />
    </div>
  );
}

export default Plotter;
