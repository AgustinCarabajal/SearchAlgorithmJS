'use strict'

const cols = 50
const rows = 50

var grid

var w, h

var openSet = []
var closedSet = []

var start, end

var path = []

var current

var walls = 0.4

function _heuristic (a, b) {
  let d = dist(a.x, a.y, b.x, b.y)
  //   let d = abs(a.x - b.x) + abs(a.y - b.y)
  return d
}

function Spot (i, j) {
  this.x = i
  this.y = j

  this.f = 0
  this.g = 0
  this.h = 0

  this.neigh = []

  this.prev = undefined

  this.wall = false

  if (random(1) < walls) {
    this.wall = true
  }

  this.show = function (col) {
    fill(col)
    if (this.wall) {
      fill(0)
    }
    noStroke()
    rect(this.x * w, this.y * h, w - 1, h - 1)
  }

  this.addNeigh = function (grid) {
    var i = this.x
    var j = this.y

    if (i > 0) {
      this.neigh.push(grid[i - 1][j])
    }

    if (i < cols - 1) {
      this.neigh.push(grid[i + 1][j])
    }

    if (j > 0) {
      this.neigh.push(grid[i][j - 1])
    }

    if (j < rows - 1) {
      this.neigh.push(grid[i][j + 1])
    }
    // Diagonals
    if (i > 0 && j > 0) {
      this.neigh.push(grid[i - 1][j - 1])
    }

    if (i < cols - 1 && j < rows - 1) {
      this.neigh.push(grid[i + 1][j + 1])
    }

    if (i < cols - 1 && j > 0) {
      this.neigh.push(grid[i + 1][j - 1])
    }

    if (i > 0 && j < rows - 1) {
      this.neigh.push(grid[i - 1][j + 1])
    }
  }
}

function setup () {
  createCanvas(600, 400)
  background(50)

  w = width / cols
  h = height / rows
  grid = new Array(cols)

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows)
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j)
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeigh(grid)
    }
  }

  start = grid[0][0]
  end = grid[cols - 1][rows - 1]
  start.wall = false
  end.wall = false

  openSet.push(start)
}

function _removeFrom (arr, val) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === val) {
      arr.splice(i, 1)
    }
  }
}

function draw () {
  if (openSet.length > 0) {
    let winner = 0
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i
      }
    }

    current = openSet[winner]
    if (current === end) {
      noLoop()
      console.log('Done!')
    }

    _removeFrom(openSet, current)
    closedSet.push(current)

    let neighs = current.neigh

    for (let i = 0; i < neighs.length; i++) {
      let n = neighs[i]

      if (!closedSet.includes(n) && !n.wall) {
        var tempG = current.g + 1

        let newPath = false

        if (openSet.includes(n)) {
          if (tempG < n.g) {
            n.g = tempG
            newPath = true
          }
        } else {
          n.g = tempG
          newPath = true
          openSet.push(n)
        }

        if (newPath) {
          n.h = _heuristic(n, end)
          n.f = n.g + n.h
          n.prev = current
        }
      }
    }
  } else {
    noLoop()
    console.log('No solution!')
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255))
    }
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0))
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0))
  }

  path = []
  var temp = current
  path.push(temp)
  while(temp.prev) {
    path.push(temp.prev)
    temp = temp.prev
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255))
  }
}
