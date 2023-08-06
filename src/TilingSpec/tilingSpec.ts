import {HomMatrix} from '../HomMatrix';

export interface TilingSpec {
  tileSize: number;
  sockets: SocketSpec;
  tiles: TilesSpec;
}

/**
  Dictonary of sockets and its pair.

  The key is the name (id) of the socket and the value is
  the name os the socket it connects to.

  The user does not have to specify a socket pair twice (one for each direction).

  Example:
  {
    "a": "a",
    "b": "c"
  }

  , this specify 3 sockets:
  - "a" that connects to sockets of type "a"
  - "b" that connects to sockets of type "c"
  - "c" that connects to sockets of type "b"
*/
export type SocketSpec = Record<string, string>;

export type TilesSpec = Record<string, TileSpec>;

export interface TileSpec {
  sockets: TileSocketSpec;
  derivatives?: TileDerivativeSpec[];
}

export type TileDerivativeOp = 'id'
    | 'rot1'
    | 'rot2'
    | 'rot3'
    | 'flipWE'
    | 'flipNS'
    ;

export type TileDerivativeSpec = TileDerivativeOp
  | [TileDerivativeOp, TileDerivativeSpec[]];

export type BorderSocketSpec = string | string[];

export interface TileSocketSpec {
  default?: BorderSocketSpec;
  /** Sockets of north border */
  N?: BorderSocketSpec;
  /** Sockets of south border */
  S?: BorderSocketSpec;
  /** Sockets of west border */
  W?: BorderSocketSpec;
  /** Sockets of east border */
  E?: BorderSocketSpec;
}

export interface TileSocketSpecNormalized {
  /** Sockets of north border */
  N?: string;
  /** Sockets of south border */
  S?: string;
  /** Sockets of west border */
  W?: string;
  /** Sockets of east border */
  E?: string;
}

export interface TileSpecNormalized {
    id: string;
    baseTileId: string;
    outSockets: TileSocketSpecNormalized;
    inSockets: TileSocketSpecNormalized;
    transform: HomMatrix;
}

export interface TilingSpecNormalized {
    tileSize: number;
    tiles: TileSpecNormalized[];
}

