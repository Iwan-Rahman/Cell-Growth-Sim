# Project Overview

The project simulates bacterial growth in an n x n petri dish represented on a grid.

The bacteria in a cell will divide to adjacent cells(top, right, left, down) at chosen time intervals. The bacteria population is then plotted in another real time display.

The user is able to pause and play the simulation, manually place or remove bacteria and can set the simulation settings: grid size and length of the time interval.

# Local Setup

To run the project locally, enter the local directory and run the command, 'npm run dev' in a terminal. The project will then be hosted locally, and a link to the localhost will be displayed in the terminal. Paste the link in a browser to view the project.

# Project Structure

## Overall
The project follows a component based architecure approach and has 3 main components. 
- Grid: The grid component is responsible for bacterial division logic, interacting with the grid and rendering the grid
- Plotter: The plotter is responsible for the logic in rendering the live plot
- App: The App component serves as a controller. It is responsible for creating the grid and plotting diagrams from the grid settings, while also communicating data received from the grid to the plotter. 

The grid and plotter cannot communicate directly. By seperating it in this way, the app is not as tightly coupled, and for example if we were to change the inner logic of the grid or plotter, we can do so while minimizing the work needed to do in the other components.

## Grid
The grid has child components such as the cell and col, that is used to build the grid. By seperating the cell as its own component we can ensure that the cell can function independantly of the grid, allowing us to easily add new properties to the cell in the future.

## Plotter
The plotter has col components to build the grid. Each col represents the x-position and will receive a y-value in the form of a point to plot inside of it. The plotter also has the y-axis and x-axis components

## App
The App component renders the grid and plotter based on its state variables. It also serves as the intermediary for the grid to communicate to the plotter.

# Additional Features

## Grid Size
Due to the modular nature of the grid, we are able to render the grid at any size. The sizes for each cell in the grid is calculated dynamically. This is to ensure that the size of the overall grid stays consistent and that the grid does not overflow the page as the grid size grows. This is done by shrinking the individual cell sizes with a larger grid size.

Note that the overall grid size is currently set to 450px by 450px in the CSS file. If this grid size changes, the code responsible for calculating cell sizes will need to be updated accordingly. This can be remedied by setting the grid size dynamically within the React application file, passing this value to the cell component for calculations instead of relying on a static 450px dimension.

## Plotting
The plotter creates a live plot of the number of bacteria over time. 

For any grid at a given starting point the maximum number of bacteria will be n * n. Hence each coloumn there are n * n cells. 

The simulation will at most take n-1 intervals to complete the entire grid, that is why there will be n-1 coloumns in the intial grid. 

Due to the large number of points in the plot as it grows, only 5 ticks are displayed on both the x and y axes at any given time. Due to this limitation and the use of divs in the grid, there might be slight discrepancies between the plots and the axes. However, it's important to note that the grid itself remains accurate, and the axes maintain accuracy with small margins of error.

The plotting grid also functions similarly to the simulation grid where each cell will shrink/grow to match the overall grid dimensions. 

A downside to this implmentation is that the size of each point can differ significantly depending on the grid size.

# Performance Analysis
Most functions such as the cell division logic, counting the number of bacteria, rendering the grid has a time complexity of n^2. While some changes or other approaches may have been used such as using a variable to store the bacteria count during cell division or tracking an array on which cells are filled and only checking neigbouring cells, the overall time complexity would stay the same, and so these approaches were abandoned for the most straightforward approach.

One of upsides from the implementation of the x-axis and y-axis is that it is incredibly efficient, as it approximates the ticks or points from the last value.

## Grid
 - Grid Render: N rows with n cells in each row. O(n^2)
 - Cell Division: N x N cells check its 4 adjacent cells. (4n^2) -> O(n^2)

## Plotter
- Grid Render: N cols with n cells in each col. O(n^2) 

 ## App
 - Get Bacteria Function: O(n^2)
 - Render Y-axis: O(1)
 - Render X-axis: O(1)

While these are the time complexities for some of the function, there's other factors to consider such as how often React would have to re-render the page, and how many times the above functions may have to run with each render. Through the project a consistent effort was put in to only call these functions when necassary, while also ensuring that the simulation does not lose its accuracy by skipping updates during its renders.
