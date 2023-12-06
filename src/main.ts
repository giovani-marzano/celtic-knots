import config from './tile-spec.json';
import { generateTiles } from './TilingSpec';
import { createTileSymbolSVG, SVGTilePlacer } from './svgUtils';

document.addEventListener('load', main, false);

function main() {
  const tilling = generateTiles(config);

  const gr_tiles: any = document.getElementById('gr_tiles');
  const def_shapes: any = document.getElementById('def_shapes');

  tilling.tiles.forEach((tile) => {
    createTileSymbolSVG(def_shapes, tilling, tile);
  });

  gr_tiles.setAttribute('transform', 'matrix(4 0 0 4 10 100)');


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
}
