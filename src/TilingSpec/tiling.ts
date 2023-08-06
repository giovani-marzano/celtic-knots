import {
  TilingSpec,
  TilingSpecNormalized,
  SocketSpec,
  TileSpec,
  TileSocketSpec,
  BorderSocketSpec,
  TileDerivativeSpec,
} from './tillingSpec';
import {
  identity,
  flipX,
  flipY,
  rotation90,
} from '../HomMatrix';

export function generateTiles(
  tilingSpec: TilingSpec
) : TilingSpecNormalized {
  const fullSockets = expandSockets(tilingSpec.sockets);

  const tiles = normalizeTiles(tilingSpec, fullSockets);

  return {
    tileSize: tilingSpec.tileSize,
    tiles,
  }
}

function expandSockets(socketSpec: SocketSpec): SocketSpec {
  const expanded: SocketSpec = {};

  Object.keys(socketSpec).forEach((key) => {
    const value = socketSpec[key];
    expanded[key] = value;
    expanded[value] = key;
  });

  return expanded;
}

function normalizeTiles(
  tilingSpec: TilingSpec,
  socketSpec: SocketSpec,
): TileSpecNormalized[] {
  const tiles: TileSpecNormalized[] = [];

  Object.keys(tilingSpec.tiles).forEach((baseTileId) => {
    const tileSpec = tilingSpec.tiles[baseTileId];
    const baseTile = generateBaseTileNormalized(
      baseTileId, tileSpec, socketSpec
    );

    tiles.push(baseTile);

    generateDerivatives(
      baseTile,
      tileSpec.derivatives,
    ).forEach(derivative => tiles.push(derivative));
  });

  return tiles;
}

function generateBaseTileNormalized(
  baseTileId: string,
  tileSpec: TileSpec,
  socketSpec: SocketSpec
): TileSpecNormalized {
  const outSockets = generateOutSockets(tileSpec.sockets);
  const inSockets = generateInSockets(
    outSockets,
    socketSpec
  );
  
  return {
    id: baseTileId,
    baseTileId,
    outSockets,
    inSockets,
    transform: identity(),
  };
}

function generateOutSockets(
  tileSockets: TileSocketSpec,
): TileSocketSpecNormalized {
  const defaultValue = normalizeBorderSocketSpec(
    tileSockets.default,
  );
  const outSockets: TileSocketSpecNormalized = {
    'N': '', 'S': '', 'W': '', 'E': '',
  };
  ['N','S','W','E'].forEach((key: string) => {
    outSockets[key] = collapseBorderSocket(
      normalizeBorderSocketSpec(
        tileSockets[key],
        defaultValue,
      )
    );
  }); 
  return outSockets;
}

function generateInSockets(
  outSockets: TileSocketSpecNormalized,
  sockets: SocketSpec,
): TileSocketSpecNormalized {
  const inSockets: TileSocketSpecNormalized = {
    'N': '', 'S': '', 'W': '', 'E': '',
  };
  ['N','S','W','E'].forEach((key: string) => {
    inSockets[key] = collapseBorderSocket(
      outToInBorderSocketSpec(
        expandBorderSocket( outSockets[key]),
        sockets,
      ),
    );
  }); 
  return inSockets;
}

function outToInBorderSocketSpec(
  outSockets: string[],
  sockets: SocketSpec,  
): string[] {
  return outSockets.map((socket) => sockets[socket]);
}

function normalizeBorderSocketSpec(
  socketSpec: BorderSocketSpec,
  defaultValue: string[] = []
): string[] {
  if (!socketSpec) {
    return defaultValue;
  }
  if (typeof socketSpec === 'string') {
    return [socketSpec];
  }
  return socketSpec;
}

function collapseBorderSocket(
  socketSpec: string[],
): string {
  return socketSpec.join(",");
}

function expandBorderSocket(
  borderSocket: string,
): string[] {
  return borderSocket.split(',');
}

function generateDerivatives(
  baseTile: TileSocketSpecNormalized,
  derivativeSpecList: TileDerivativeSpec[],
): TileSpecNormalized[] {
  if (
    !baseTile || !derivativeSpecList || derivativeSpecList.length == 0
  ) {
    return [];
  }

  return derivativeSpecList.flatMap(
    (operation) => applyDerivateTileOperation(
      baseTile,
      operation,
    ),
  );
}

function applyDerivateTileOperation(
  tile: TileSpecNormalized,
  operation: TileDerivativeSpec,
): TileSpecNormalized[] {
  if(typeof operation === 'string') {
    return [applyDerivateTileSingleOperation(tile, operation)];
  }

  const [nestedOp = 'id', nestedOpList = []] = operation;

  const newBaseTile = applyDerivateTileSingleOperation(
    tile, nestedOp
  );

  return generateDerivatives(newBaseTile, nestedOpList);
}

function applyDerivateTileSingleOperation(
  tile: TileSpecNormalized,
  operation: TileDerivativeOp,
): TileSpecNormalized {
  switch(operation) {
    case 'rot1':
      return rotateTile90(tile, 1);
    case 'rot2':
      return rotateTile90(tile, 2);
    case 'rot3':
      return rotateTile90(tile, 3);
    case 'flipNS':
      return flipTileNS(tile);
    case 'flipWE':
      return flipTileWE(tile);
    case 'id':
    default:
      return tile;
  }
}

function rotateTile90(
  tile: TileSpecNormalized,
  numRotations: number = 1
): TileSpecNormalized {
  const newTile = copyTile(tile);
  newTile.id = `${tile.id}-rot${numRotations}`;

  const rotateMatrix = rotation90();

  for (let i = 0; i < numRotations; i++) {
    newTile.outSockets = rotateSockets(newTile.outSockets);
    newTile.inSockets = rotateSockets(newTile.inSockets);
    newTile.transform = rotateMatrix.after(newTile.transform);
  }

  return newTile;
}

function flipTileNS(
  tile: TileSpecNormalized,
): TileSpecNormalized {
  const newTile = copyTile(tile);
  newTile.id = `${tile.id}-flipNS`;

  newTile.outSockets = flipNS_Sockets(newTile.outSockets);
  newTile.inSockets = flipNS_Sockets(newTile.inSockets);
  newTile.transform = flipY().after(newTile.transform);

  return newTile;
}

function flipTileWE(
  tile: TileSpecNormalized,
): TileSpecNormalized {
  const newTile = copyTile(tile);
  newTile.id = `${tile.id}-flipWE`;

  newTile.outSockets = flipWE_Sockets(newTile.outSockets);
  newTile.inSockets = flipWE_Sockets(newTile.inSockets);
  newTile.transform = flipX().after(newTile.transform);

  return newTile;
}

function flipNS_Sockets(
  sockets: TileSocketSpecNormalized,
): TileSocketSpecNormalized {
  return {
    N: sockets.S,
    S: sockets.N,
    W: reverseSocket(sockets.W),
    E: reverseSocket(sockets.E),
  };
}

function flipWE_Sockets(
  sockets: TileSocketSpecNormalized,
): TileSocketSpecNormalized {
  return {
    N: reverseSocket(sockets.N),
    S: reverseSocket(sockets.S),
    W: sockets.E,
    E: sockets.W,
  };
}

/**
 * Rotate socket definitions 90 degrees clockwise
 */
function rotateSockets(
  sockets: TileSocketSpecNormalized,
): TileSocketSpecNormalized {
  return {
    N: reverseSocket(sockets.W),
    S: reverseSocket(sockets.E),
    W: sockets.S,
    E: sockets.N,
  };
}

function reverseSocket(
  socket: string,
): string {
  return collapseBorderSocket(
    expandBorderSocket(socket).reverse(),
  );
}

function copyTile(tile: TileSpecNormalized): TileSpecNormalized {
  return { ...tile };
}

