import config from './tile-spec.json';
import { generateTiles } from './TilingSpec';
import { HomMatrix, translation } from './HomMatrix';

const tilling = generateTiles(config);

const SVG_NS = 'http://www.w3.org/2000/svg';

const gr_tiles: any = document.getElementById('gr_tiles');
const def_shapes: any = document.getElementById('def_shapes');

tilling.tiles.forEach((tile) => {
  createTileSymbolSVG(def_shapes, tilling, tile);
});

gr_tiles.setAttribute('transform', 'matrix(4 0 0 4 10 100)');

class SVGTilePlacer {
  constructor(
    private parentElem: any,
    private tilingSpec: TilingSpecNormalized,
  ) {}

  placeTile(
    tile: TileSpecNormalized,
    x: number,
    y: number,
  ) {
    const useElem = document.createElementNS(SVG_NS, 'use');
    setAttrs(useElem, {
      href: `#${tile.id}`,
      x: this.tilingSpec.tileSize * x,
      y: this.tilingSpec.tileSize * y,
    });
    this.parentElem.appendChild(useElem);
  }
}

const placer = new SVGTilePlacer(gr_tiles, tilling);

let x = 0;
let y = 0;

tilling.tiles.forEach((tile) => {
  placer.placeTile(tile, x, y);

  x++;
  if (x > 6) {
    x = 0;
    y++;
  }
});

function setAttrs(elem: any, attrs: Record<string, any>) {
    Object.entries(attrs).forEach((entry: [any]) => {
        const [key, value] = entry;
        elem.setAttribute(key, value);
    });
}

function createTileSymbolSVG(
  parentElem: any,
  tilingSpec: TileSpecNormalized,
  tile: TileSpecNormalized,
) {

  // Se o tile for igual ao baseTile já está incluso no SVG
  if (tile.id === tile.baseTileId) {
    return;
  }

  const symbol = document.createElementNS(SVG_NS, 'symbol');
  setAttrs(symbol, {
    id: tile.id,
    height: tilingSpec.tileSize,
    width: tilingSpec.tileSize,
    viewBox: `0 0 ${tilingSpec.tileSize} ${tilingSpec.tileSize}`,
  });

  const halfTile = tilingSpec.tileSize/2;
  const centerTileOrigin = translation(-halfTile, -halfTile);
  const restoreTileOrigin = translation(halfTile, halfTile);

  const transform = centerTileOrigin
    .before(tile.transform)
    .before(restoreTileOrigin);

  const useElem = document.createElementNS(SVG_NS, 'use');
  setAttrs(useElem, {
    href: `#${tile.baseTileId}`,
    transform: homMatrixToSVGTransform(transform),
  });

  symbol.appendChild(useElem);
  parentElem.appendChild(symbol);
}

function homMatrixToSVGTransform(m: HomMatrix): string {
  return `matrix( ${m.x1} ${m.x2} ${m.y1} ${m.y2} ${m.dx} ${m.dy} )`;
}

