/*
  Representa uma transformação linear em coordenadas homogêneas
  Matrix na forma:

  x1 y1 dx
  x2 y2 dy
   0  0  1
*/
export class HomMatrix {
  constructor(
    readonly x1,
    readonly x2,
    readonly y1,
    readonly y2,
    readonly dx,
    readonly dy
  ) {}

  after(other: HomMatrix): HomMatrix {
    return new HomMatrix(
      this.x1*other.x1 + this.y1*other.x2,
      this.x2*other.x1 + this.y2*other.x2,
      this.x1*other.y1 + this.y1*other.y2,
      this.x2*other.y1 + this.y2*other.y2,
      this.x1*other.dx + this.y1*other.dy + this.dx,
      this.x2*other.dx + this.y2*other.dy + this.dy,
    );
  }

  before(other: HomMatrix): HomMatrix {
    return other.after(this);
  }

  equals(other?: HomMatrix): boolean {
    if (!other) {
      return false;
    }
    return this.x1 === other.x1 &&
    this.x2 === other.x2 &&
    this.y1 === other.y1 &&
    this.y2 === other.y2 &&
    this.dx === other.dx &&
    this.dy === other.dy;
  }

  toString() {
    return `HomMatrix(${this.x1},${this.x2},${this.y1},${this.y2},${this.dx},${this.dy})`;
  }
}

export function identity(): HomMatrix {
  return new HomMatrix(1,0,0,1,0,0);
}

export function rotation90(): HomMatrix {
  return new HomMatrix(0,1,-1,0,0,0);
}

export function flipX(): HomMatrix {
  return new HomMatrix(-1,0,0,1,0,0);
}

export function flipY(): HomMatrix {
  return new HomMatrix(1,0,0,-1,0,0);
}
