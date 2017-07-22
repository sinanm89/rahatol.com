"use strict";
var cell_size = 10;
var CONSOLE_DELAY = 0;
var MAZE_COLOR = "#fff";
var WALL_COLOR = "#000";
var MAYBE_MAZE_COLOR = "#00f";
var CLICK_WALL_COLOR = "#0f0";

var view_area_width = window.innerWidth;
var view_area_height = window.innerHeight;
var w = Math.floor(view_area_width/cell_size) - (Math.floor(view_area_width/cell_size)%2) - 1;
var h = Math.floor(view_area_height/cell_size) - (Math.floor(view_area_height/cell_size)%2) - 1;
// =============================================================================================
//
//
//                      USER/TOOL SETTINGS
//
//
// =============================================================================================
var clicked_walls = Array(w*h);
var origin_index;

// =============================================================================================
//
//
//                      MAIN
//
//
// =============================================================================================

var canvas = d3.select("body").append("canvas")
  .attr("width", w*cell_size)
  .attr("height", h*cell_size)
  .attr("background", "black")
  .attr("id", "myCanvas");
var context = canvas.node().getContext("2d");

function fill_maze(i, color) {
  context.fillStyle = color;
  var c = get_coords(i);
  context.fillRect(c.x, c.y, cell_size, cell_size);
}

function prims_generate_graph(w, h, clicked_walls) {

  // var walls = Array(w*h);
  var walls = clicked_walls || Array(w*h);
  var visited = Array(w*h);
  var directions = [-w, +1, +w, -1];

  var current_i = origin_index || (Math.floor(h/2) * w) + Math.floor(w/2) - 1;

  var maybe_maze_history = [current_i];
  var maybe_maze = Array(w*h);

  maybe_maze[current_i] = current_i;
  // middle start point
  while (maybe_maze_history.length > 0) {
      delete maybe_maze[current_i];
      fill_maze(current_i, MAZE_COLOR);
      visited[current_i] = current_i;
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
        walls[i] = i;
        delete maybe_maze[i];
        // should be already popped
        // fill wall
        fill_maze(i, WALL_COLOR);
      } else {
        // fill maybe maze
        fill_maze(i, MAYBE_MAZE_COLOR);
        maybe_maze_history.push(i);
        maybe_maze[i] = i;
      }
    }
  }

  function check_edges(index) {
    if (index < w || index % w === 0 || index > w*h || (index+1)%w === 0) {
      // fill wall edge
      fill_maze(index, WALL_COLOR);
      walls[index] = index;
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
      next_index = maybe_maze_history.pop();
      delete maybe_maze[next_index];
    } while (check_edges(next_index) || walls[next_index] || visited[next_index]);
    return next_index;
  }
}
// =========================================================
//
//
//            UTILITIES
//
//
// =========================================================

function get_coords(index) {
  var x_0 = (index%w) * cell_size;
  var y_0 = Math.floor(index/w) * cell_size;
  return {x: x_0,  y: y_0};
}

function get_cell(x_0, y_0) {
  var cell_offsetX = x_0 % cell_size;
  var cell_offsetY = y_0 % cell_size;
  // Determine which cell the pointers at
  var x_cell = (x_0 - cell_offsetX);
  var y_cell = (y_0 - cell_offsetY);

  var x_1 = Math.floor(x_cell / cell_size);
  var y_1 = Math.floor(y_cell / cell_size);
  // we cant have negative indexes
  if (y_1 <= 0) y_1 = 1;
  if (x_1 <= 0) x_1 = 0;
  return {
    X: x_cell,
    Y: y_cell,
    index: ((y_1) * w) + x_1
  };

}

function fill_clicked_maze(x_0, y_0, color) {
  context.fillStyle = color;

  // |---|---|---|---|---|---|
  // | 0 | 1 | 2 | 3 | 4 | 5 |w+yiw = w+0w
  // |---|---|---|---|---|---|
  // |   | -w|   |   |   | 11|w+yiw = w+yw
  // |---|---|---|---|---|---|
  // |n-1| n |n+1|   |   | 17|w+yi = w+2yw
  // |---|---|---|---|---|---|
  // |   | +w|   |   |   | 23|
  // |---|---|---|---|---|---|

  var cell = get_cell(x_0, y_0);
  clicked_walls[cell.index] = cell.index;
  context.fillRect(cell.X, cell.Y, cell_size, cell_size);
}

var keyp = false;
var teyp = 0;
d3.select("body").on("keydown", function(){
  keyp = !keyp;
  teyp += 1;
  if (keyp){
    prims_generate_graph(w, h, clicked_walls);
  }
},nozoom);

var isDown = false;
d3.select("#myCanvas").on("mousedown", function(){
  isDown = true;
  var coordinates = d3.mouse(this);
  fill_clicked_maze(coordinates[0],coordinates[1],CLICK_WALL_COLOR);
  },nozoom)
.on("mousemove", function(){
  if(isDown) {
    var coordinates = d3.mouse(this);
    fill_clicked_maze(coordinates[0], coordinates[1], CLICK_WALL_COLOR);
  }
}, nozoom)
.on("mouseup", function(){
  isDown = false;
}, nozoom)
.on("mouseout", function(){
  isDown = false;
}, nozoom);

function nozoom() {
  d3.event.preventDefault();
}

(function() {
    var mousePos;
    var console_open = 0;

    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 1000); // setInterval repeats every X ms

    function handleMouseMove(event) {
        var eventDoc, doc, body;

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }
    function getMousePosition() {
        var pos = mousePos;
        // if (!pos) {        }
        if (pos) {
          if (pos.x > view_area_width/2 && pos.y < view_area_height/2){
            console_open += 1;
            if (console_open >= CONSOLE_DELAY && document.getElementById("debugger").style.display === ""){
              document.getElementById("debugger").style.display = "block";
            }
          }
          else console_open = 0;
        }
    }
})();

var map_array;

function save_text(){
  var a = document.getElementById('download_map');
  var map_data = {
    width: w,
    height: h,
    map: clicked_walls
  };
  a.setAttribute(
    'href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(JSON.stringify(map_data))
  );
  a.setAttribute('download', "my_map.json");
}

function set_origin(){
  // origin_index = hmm
  console.log('set_origin');
}

function clear_canvas(){
  context.clearRect(0, 0, view_area_width, view_area_height);
  map_array = [];
  clicked_walls = [];
  console.log('clear_canvas');
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  // files is a FileList of File objects. List some properties.
  var output = [];
  var f = files[0];
  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
              f.size, ' bytes, last modified: ',
              f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
              '</li>');
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  var reader = new FileReader();

  function load_file(){
    var loaded_map = JSON.parse(reader.result);
    // for (var i=0; i<map_array.length; i++){
      // map_array[i] = parseInt(map_array[i]) || null;
      // if (map_array[i]) fill_maze(i, CLICK_WALL_COLOR);
    prims_generate_graph(loaded_map.width, loaded_map.height, loaded_map.array);
    // }
  }
  // var map_array;
  reader.onload = load_file;
  reader.readAsText(f);
}
function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  evt.target.style.background = "rgba(0,0,0,0.1)";
}

// ================================================================================
//
//                    EVENT LISTENERS
//
// ================================================================================

  // Setup the dnd listeners.
  var dropZone = document.getElementById('drop_zone');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('dragleave', function(evt) {
    evt.target.style.background = "rgba(0,0,0,0)";
  }, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
  // dropZone.addEventListener('change', , false);

  var saveText = document.getElementById("download_map");
  saveText.addEventListener('click', save_text, false);

  var setOrigin = document.getElementById("set_origin");
  setOrigin.addEventListener('click', set_origin, false);

  var clearCanvas = document.getElementById("clear_canvas");
  clearCanvas.addEventListener('click', clear_canvas, false);
