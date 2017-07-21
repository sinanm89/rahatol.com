"use strict";
  var DEBUG = false;
  var w = 200;
  var h = 200;
  var cell_size = 6;

  var view_area_width = window.innerWidth - 18;
  var view_area_height = window.innerHeight - 18;
  w = (view_area_width - (view_area_width%cell_size))/cell_size;
  h = Math.floor((view_area_height - (view_area_height%cell_size))/cell_size);

  // console.log(w);
  // console.log(h);
  var canvas = d3.select("body").append("canvas")
    .attr("width", w*cell_size)
    .attr("height", h*cell_size)
    .attr("id", "myCanvas");
  var context = canvas.node().getContext("2d");

function fill_maze(i) {
  context.fillStyle = "#fff";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function fill_wall(i) {
  context.fillStyle = "#000";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function fill_maybe_maze(i) {
  context.fillStyle = "#00f";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}


function prims_generate_graph(w, h, clicked_walls) {

  // var walls = Array(w*h);
  var walls = clicked_walls;
  var visited = Array(w*h);
  var directions = [-w, +1, +w, -1];

  var maybe_maze = {
    'stack': [],
  };

  var current_i = (Math.floor(h/2) * w) + Math.floor(w/2) - 1;
  maybe_maze.stack.push(current_i);
  maybe_maze[current_i] = true;
  // middle start point
  while (maybe_maze.stack.length > 0) {
      delete maybe_maze[current_i];
      fill_maze(current_i);
      visited[current_i] = true;
      add_maybe_walls(current_i);
      current_i = choose_next_index(current_i);
  }
  return visited;

  function add_maybe_walls(current_index) {
    // add maybe maze
    var i;
    for (var j=0; j < directions.length; j++) {
      i = current_index + directions[j];
      if (check_edges(i) || walls[i] || visited[i]) {continue;}
      else if (maybe_maze[i]) {
        walls[i] = true;
        delete maybe_maze[i];
        // should be already popped
        fill_wall(i);
      } else {
        fill_maybe_maze(i);
        maybe_maze.stack.push(i);
        maybe_maze[i] = true;
      }
    }
  }

  function check_edges(index) {
    if (index < w || index % w === 0 || index > w*h || (index+1)%w === 0) {
      fill_wall(index);
      walls[index] = true;
      return true;
    }
    return false;
  }

  function choose_next_index(current_index){
    var legal_directions = [-w, +1, +w, -1];
    var next_index = null;
    var direction;
    // pop a random legal direction from the list of directions left on the node.
    // TODO: add switcher direction case to legal_directions
    while (legal_directions.length > 0) {
      direction = legal_directions.splice(Math.floor(Math.random() * legal_directions.length), 1)[0];
      next_index = current_index + direction;
      // edge cases and if the next chosen index is in an unmutable wall or visited ; continue
      if (check_edges(next_index) || walls[next_index] || visited[next_index]) {continue;}
      else return next_index;
    }
    // if we run out of legal directions get a random legal index from maybe_maze
    do {
      next_index = maybe_maze.stack.pop();
      delete maybe_maze[next_index];
    } while (check_edges(next_index) || walls[next_index] || visited[next_index]);
    return next_index;
  }
}

var clicked_walls = Array(w*h);
function fill_clicked_maze(x_0, y_0, color) {
    context.fillStyle = color;

    // |---|---|---|---|
    // | 0 | 1 | 2 | 3 |
    // |---|---|---|---|
    // |   |   |   | 7 |
    // |---|---|---|---|
    // |   |   |   | 11|
    // |---|---|---|---|
    // |   |   |   | 15|
    // |---|---|---|---|

    var cell_offsetX = x_0 % cell_size;
    var cell_offsetY = y_0 % cell_size;
    // Determine which cell the pointers at
    var x_cell = (x_0 - cell_offsetX);
    var y_cell = (y_0 - cell_offsetY);

    var y_1 = (y_0 - cell_offsetY) / cell_size;
    var x_1 = (x_0 - cell_offsetX) / cell_size;
    // we cant have negative indexes
    if (y_1 <= 0) y_1 = 1;
    if (x_1 <= 0) x_1 = 0;
    var index = ((y_1) * w) + x_1;

    if (DEBUG) {
      document.getElementById("posX0").innerHTML = x_0;
      document.getElementById("posY0").innerHTML = y_0;
      document.getElementById("posX").innerHTML = x_1;
      document.getElementById("posY").innerHTML = y_1;
      document.getElementById("index").innerHTML = index;
    }
    clicked_walls[index] = true;
    context.fillRect(x_cell, y_cell, cell_size, cell_size);
  }

var keyp = false;
d3.select("body").on("keydown", function(){
  console.log("keypress");
  keyp = !keyp;
  if (keyp){
    prims_generate_graph(w, h, clicked_walls);
  }
  else{
    clicked_walls = Array(w*h);
    context.clearRect(0, 0, w*cell_size, h*cell_size);
  }
});

var isDown = false;
d3.select("#myCanvas").on("mousedown", function(){
  isDown = true;
  })
  .on("mousemove", function(){
    if(isDown) {
        var coordinates = d3.mouse(this);
        fill_clicked_maze(
          coordinates[0],
          coordinates[1],
          "#0f0"
        );
    }
 })
.on("mouseup", function(){
    isDown = false;
});
