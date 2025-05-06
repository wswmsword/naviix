
export default function focux(squares) {
  const formattedSquares = formatIpt(squares);
  const x = getX(formattedSquares);
  return x;
}

function getX(squares, notRoot) {
  let mergedX = new Map();

  if (!notRoot && squares.length > 1) { // 位于 root，且区域数量大于 1
    const wraps = squares.map(info => info.wrap);
    const { x } = getXBySimple(wraps);
    mergedX = new Map([...mergedX, ...x]);
  }

  squares.forEach(({ locs, subs }) => {
    const subWraps = (subs || []).map(s => s.wrap);
    const newLocs = locs.concat(subWraps);
    const { x } = getXBySimple(newLocs);
    const subsX = getX(subs || [], true);
    mergedX = new Map(Array.from(mergedX).concat(Array.from(x)).concat(Array.from(subsX)));
  });

  return mergedX;
}

function getXBySimple(squares) {
  const sortedX = [...squares];
  sortedX.sort((s1, s2) => s1.loc[0] - s2.loc[0]);
  const sortedY = [...squares];
  sortedY.sort((s1, s2) => s1.loc[1] - s2.loc[1]);
  const dirMap = new Map();
  let t = -Infinity;
  let b = Infinity;
  let l = Infinity;
  let r = -Infinity;

  squares.forEach(s => {
    const [x, y, t1, t2] = s.loc;
    const sOrderY = sortedY.findIndex(e => e.id === s.id);
    const sOrderX = sortedX.findIndex(e => e.id === s.id);

    // next down element
    let minDownDis = Infinity;
    let downS = null;
    sortedY.slice(0, sOrderY).forEach(s2 => {
      let dis = getMinDownDis(s.loc, s2.loc);

      if (dis < minDownDis) {
        downS = s2;
        minDownDis = dis;
      }
    });

    // next up element
    let minUpDis = Infinity;
    let upS = null;
    sortedY.slice(sOrderY + 1).forEach(s2 => {
      let dis = getMinUpDis(s.loc, s2.loc);

      if (dis < minUpDis) {
        upS = s2;
        minUpDis = dis;
      }
    });

    // next left element
    let minLDis = Infinity;
    let lS = null;
    sortedX.slice(0, sOrderX).forEach(s2 => {
      let dis = getMinLeftDis(s.loc, s2.loc);

      if (dis < minLDis) {
        lS = s2;
        minLDis = dis;
      }
    });

    // next right element
    let minRDis = Infinity;
    let rS = null;
    sortedX.slice(sOrderX + 1).forEach(s2 => {
      const dis = getMinRightDis(s.loc, s2.loc);

      if (dis < minRDis) {
        rS = s2;
        minRDis = dis;
      }
    });

    dirMap.set(s.id, {
      up: upS,
      down: downS,
      left: lS,
      right: rS,
    });

    // 更新边界
    t = y + t2 > t ? y + t2 : t;
    b = y - t2 < b ? y - t2 : b;
    l = x - t2 < l ? x - t1 : l;
    r = x + t2 > r ? x + t1 : r;
  });

  return { x: dirMap, t, b, l, r };
}

function getMinDownDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (y > y2) { // is below

    if (x2 - t1a > x + t1) { // is right corner

      if (x2 - t1a - x - t1 < y - t2 - y2 - t2a) {

        dis = getDistance(x + t1, y - t2, x2 - t1a, y2 + t2a);
      }
    } else if (x2 + t1a < x - t1) { // is left corner

      if (x - t1 - x2 - t1a < y - t2 - y2 - t2a) {
        dis = getDistance(x + t1, y - t2, x2 + t1a, y2 + t2a);
      }
    } else { // is project
      dis = Math.pow(y - t2 - y2 - t2a, 2);
      if (y2 + t2a > y - t2) dis = -dis;
    }
  }

  return dis;
}

function getMinUpDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (y < y2) { // is above
    if (x2 - t1a > x + t1) { // is right corner
      if (x2 - t1a - x - t1 < y2 - t2a - y - t2) {
        dis = getDistance(x + t1, y + t2, x2 - t1a, y2 - t2a);
      }
    } else if (x2 + t1a < x - t1) { // is left corner
      if (x - t1 - x2 - t1a < y2 - t2a - y - t2) {
        dis = getDistance(x - t1, y + t2, x2 + t1a, y2 - t2a);
      }
    } else { // is project
      dis = Math.pow(y2 - t2a - y - t2, 2);
      if (y2 - t2a < y + t2) dis = -dis;
    }
  }
  return dis;
}

function getMinLeftDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (x > x2) { // is left
    if (y2 - t2a > y + t2) { // is top corner
      if (y2 - t2a - y - t2 < x - t1 - x2 - t1a) { // closer x
        dis = getDistance(x - t1, y + t2, x2 + t1a, y2 - t2a);
      }
    } else if (y2 + t2a < y - t2) { // is bottom corder
      if (y - t2 - y2 - t2a < x - t1 - x2 - t1a) { // closer x
        dis = getDistance(x - t1, y - t2, x2 + t1a, y2 + t2a);
      }
    } else { // is project
      dis = Math.pow(x - t1 - x2 - t1a, 2);
      if (x2 + t1a > x - t1) dis = -dis;
    }
  }
  return dis;
}

function getMinRightDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (x2 > x) { // is right
    if (y2 - t2a > y + t2) { // is top corner
      if (y2 - t2a - y - t2 < x2 - t1a - x - t1) { // closer x
        dis = getDistance(x + t1, y + t2, x2 - t1a, y2 - t2a);
      }
    } else if (y2 + t2a < y - t2) { // is bottom corder
      if (y - t2 - y2 - t2a < x2 - t1a - x - t1) {
        dis = getDistance(x + t1, y - t2, x2 - t1a, y2 + t2a);
      }
    } else {
      dis = Math.pow(x2 - t1a - x - t1, 2);
      if (x2 - t1a < x + t1) // overlap
        dis = -dis;
    }
  }

  return dis;
}

function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy; // without sqrt
}

function formatIpt(input) {

  if (input == null) return;

  const aryIpt = Array.isArray(input);
  const simpleIpt = aryIpt &&
    (Array.isArray(input[0]) ?
      typeof input[0][0] === "number" :
      input[0].loc != null);
  const objIpt = !aryIpt;
  const normalIpt = !simpleIpt && !objIpt;

  let formatted = null;

  if (simpleIpt) {
    formatted = [{ locs: input.map((s) => Array.isArray(s) ? { id: s, loc: s } : s) }];
  } else if (objIpt) {
    const { wrap, subs, locs } = input;
    formatted = [{ locs: formatIpt(locs)[0].locs }];
    if (subs != null) {
      Object.assign(formatted[0], {
        subs: formatIpt(input.subs),
      });
    }
    if (wrap != null) {
      Object.assign(formatted[0], {
        wrap: Array.isArray(wrap) ? { loc: wrap, id: wrap } : wrap
      });
    }
  } else if (normalIpt) {
    formatted = input.map((item) => {
      const { locs, wrap, subs } = item;
      const res = {
        locs: formatIpt(locs)[0].locs,
        wrap: Array.isArray(wrap) ? { loc: wrap, id: wrap } : wrap,
      };
      if (subs) {
        Object.assign(res, {
          subs: formatIpt(subs),
        });
      }
      return res;
    });
  }
  return formatted;
}