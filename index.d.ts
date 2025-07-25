
type baseAryLoc = [number, number, number, number] | HTMLElement;
type baseObjLoc = { id: any, loc: baseAryLoc };
type loc = baseAryLoc | baseObjLoc;

type simpleSquares = Array<loc>;

type subLocs = {
  locs: simpleSquares;
  wrap: loc;
  subs?: subLocs;
};

type objSquares = {
  locs: Array<loc>;
  subs: subLocs | Array<subLocs>;
};

type arySquares = Array<subLocs>;

type directionLoc = baseObjLoc;

declare function naviix(squares: simpleSquares | objSquares | arySquares):
  Map<any, { up?: directionLoc; down?: directionLoc; left?: directionLoc; right?: directionLoc }>;

export = naviix;
export default naviix;