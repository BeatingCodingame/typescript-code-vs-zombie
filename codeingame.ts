/**
 * Save humans, destroy zombies!
 **/

class Point {
  _x: number
  _y: number

  constructor(x: number, y: number) {
    this._x = Math.round(x)
    this._y = Math.round(y)
  }

  set x(x: number) {
    this._x = Math.round(x)
  }

  get x() {
    return this._x
  }

  set y(y: number) {
    this._y = Math.round(y)
  }

  get y() {
    return this._y
  }

  *[Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  equals(other: Point) {
    return this.x === other.x && this.y === other.y
  }

  static distance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  distance(point: Point): number {
    return Point.distance(this, point)
  }

  static angle(p1: Point, p2: Point): number {
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
  }

  angle(point: Point): number {
    return Point.angle(this, point)
  }

  toString() {
    return `${this.x} ${this.y}`
  }
}

class Line {
  m: number
  q: number

  constructor(m: number, q: number) {
    this.m = m
    this.q = q
  }

  toString() {
    return `Line(${this.m}, ${this.q})`
  }

  static fromPoints(p1: Point, p2: Point): Line {
    if (p1.equals(p2)) {
      throw new Error(`p1 === p2`)
    }

    if (p1.x == p2.x) return new Line(Number.POSITIVE_INFINITY, p1.x)

    return new Line((p1.y - p2.y) / (p1.x - p2.x), (p1.x * p2.y - p2.x * p1.y) / (p1.x - p2.x))
  }

  intersect(point: Point): boolean {
    if (this.m == Number.POSITIVE_INFINITY) {
      return this.q - point.x > -1 && this.q - point.x < 1
    }

    return point.x * this.m + this.q - point.y > -1 && point.x * this.m + this.q - point.y < 1
  }
}

class Segment extends Line {
  p1: Point
  p2: Point

  constructor(p1: Point, p2: Point) {
    const l = Line.fromPoints(p1, p2)
    super(l.m, l.q)

    this.p1 = p1
    this.p2 = p2
  }
}

class Walker extends Point {
  SPEED: number
  RANGE: number

  constructor(x: number, y: number, speed: number, range: number) {
    super(x, y)
    this.SPEED = speed
    this.RANGE = range
  }

  turns_to_reach(point: Point): number {
    return Math.floor((this.distance(point) - this.RANGE) / this.SPEED)
  }
}

class Ash extends Walker {
  constructor(x: number, y: number) {
    super(x, y, 1000, 2000)
  }
}

class Zombie extends Walker {
  id: number
  _xNext: number
  _yNext: number

  constructor(id: number, x: number, y: number, xNext: number, yNext: number) {
    super(x, y, 400, 400)
    this.id = id
    this._xNext = Math.round(xNext)
    this._yNext = Math.round(yNext)
  }

  set xNext(x: number) {
    this._xNext = Math.round(x)
  }

  get xNext() {
    return this._xNext
  }

  set yNext(y: number) {
    this._yNext = Math.round(y)
  }

  get yNext() {
    return this._yNext
  }
}

class Human extends Point {
  id: number
  constructor(id: number, x: number, y: number) {
    super(x, y)
    this.id = id
  }
}

// const p = new Point(3.1, 3)

// delete p

// let humanX: number
// let humanY: number

// // game loop
while (true) {
  const huamns: Human[] = []
  const zombies: Zombie[] = []

  var inputs: string[] = readline().split(' ')
  const ash: Ash = new Ash(parseInt(inputs[0]), parseInt(inputs[1]))

  const humanCount: number = parseInt(readline())
  for (let i = 0; i < humanCount; i++) {
    var inputs: string[] = readline().split(' ')

    huamns.push(new Human(parseInt(inputs[0]), parseInt(inputs[1]), parseInt(inputs[2])))
  }

  const zombieCount: number = parseInt(readline())
  for (let i = 0; i < zombieCount; i++) {
    var inputs: string[] = readline().split(' ')

    zombies.push(
      new Zombie(
        parseInt(inputs[0]),
        parseInt(inputs[1]),
        parseInt(inputs[2]),
        parseInt(inputs[3]),
        parseInt(inputs[4])
      )
    )
  }

  const point = zombies.reduce((acc, zombie) => (ash.distance(acc) < ash.distance(zombie) ? acc : zombie), ash)
  console.log(point.toString())
}
