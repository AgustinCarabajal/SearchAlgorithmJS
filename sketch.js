'use strict'

const cols = 5
const rows = 5

var grid

var w, h

var openSet = []
var closedSet = []

function Spot (i, j) {
  this.x = i
  this.y = j

  this.f = 0
  this.g = 0
  this.h = 0

  this.neigh = []

  this.show = function (col) {
    fill(col)
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

  let start = grid[0][0]
  let end = grid[cols - 1][rows - 1]

  openSet.push(start)

  //   -------------    //

  if (openSet.length > 0) {
    let winner = 0
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i
      }
    }

    let current = openSet[winner]
    if (current === end) {
      console.log('Done!')
    }

    removeFrom(openSet, current)
    closedSet.push(current)

    let neighs = current.neigh

    for (let i = 0; i < neighs.length; i++) {
      let n = neighs[i]

      if (!closedSet.includes(n)) {
        var tempG = current.g + 1

        if (openSet.includes(n)) {
          if (tempG < n.g) {
            n.g = tempG
          }
        } else {
          n.g = tempG
          openSet.push(n)
        }

      // Min 38
      }
    }
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

  console.log(grid)
}

function removeFrom (arr, val) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === val) {
      arr.splice(i, 1)
    }
  }
}
