import { HomMatrix, translation } from './HomMatrix';

const SVG_NS = 'http://www.w3.org/2000/svg';

function setAttrs(elem: any, attrs: Record<string, any>) {
    Object.entries(attrs).forEach((entry: [any]) => {
        const [key, value] = entry;
        elem.setAttribute(key, value);
    });
}

export class SVGTilePlacer {
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

export function createTileSymbolSVG(
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

