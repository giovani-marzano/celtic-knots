import config from './tile-spec.json';
import { generateTiles } from './TilingSpec';

const tiles = generateTiles(config);

const SVG_NS = 'http://www.w3.org/2000/svg';

const gr_tiles: any = document.getElementById('gr_tiles');

gr_tiles.setAttribute('transform', 'matrix(4 0 0 4 10 400)');

const rect = document.createElementNS(SVG_NS, 'rect');

setAttrs(
    rect,
    {
        x: 10, y: 10,
        width: 10, height: 10,
        fill: 'black',
        stroke: 'magenta',
    }
);

gr_tiles.appendChild(rect);

function setAttrs(elem: any, attrs: Record<string, any>) {
    Object.entries(attrs).forEach((entry: [any]) => {
        const [key, value] = entry;
        elem.setAttribute(key, value);
    });
}

