
export default function naviix(squares) {
  const formattedSquares = formatIpt(squares);

  const { x: rawX, firstInWrap } = getX(formattedSquares);
  const x = genUserX(rawX, firstInWrap);
  return x;
}

function getX(squares, notRoot) {
  let mergedX = new Map();
  let firstInWrap = new Map();

  if (!notRoot && squares.length > 1) { // 位于 root，且区域数量大于 1
    const wraps = squares.map(info => info.wrap);
    squares.forEach(s => {
      firstInWrap.set(s.wrap.id, s.locs[0]);
    });
    const { x } = getXBySimple(wraps);
    mergedX = x;
  }

  squares.forEach(({ locs, subs, wrap }) => {
    const subWraps = (subs || []).map(s => s.wrap);
    (subs || []).map(s => {
      firstInWrap.set(s.wrap.id, s.locs[0]);
    });
    const newLocs = locs.concat(subWraps);
    const { x } = getXBySimple(newLocs, wrap, subWraps);
    const { x: subsX, firstInWrap: _firstInWrap } = getX(subs || [], true);
    mergedX = new Map(Array.from(mergedX).concat(Array.from(x)).concat(Array.from(subsX)));
    firstInWrap = new Map(Array.from(firstInWrap).concat(Array.from(_firstInWrap)));
  });

  return { x: mergedX, firstInWrap };
}

function getXBySimple(squares, wrap, subWraps) {
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
    let downS = wrap; // 默认指向包裹层
    let gotDown = false;
    sortedY.slice(0, sOrderY).forEach(s2 => {
      let dis = getMinDownDis(s.loc, s2.loc);

      if (dis < minDownDis) {
        gotDown = true;
        downS = s2;
        minDownDis = dis;
      }
    });

    // next up element
    let minUpDis = Infinity;
    let upS = wrap;
    let gotUp = false;
    sortedY.slice(sOrderY + 1).forEach(s2 => {
      let dis = getMinUpDis(s.loc, s2.loc);

      if (dis < minUpDis) {
        gotUp = true;
        upS = s2;
        minUpDis = dis;
      }
    });

    // next left element
    let minLDis = Infinity;
    let lS = wrap;
    let gotLeft = false;
    sortedX.slice(0, sOrderX).forEach(s2 => {
      let dis = getMinLeftDis(s.loc, s2.loc);

      if (dis < minLDis) {
        gotLeft = true;
        lS = s2;
        minLDis = dis;
      }
    });

    // next right element
    let minRDis = Infinity;
    let rS = wrap;
    let gotRight = false;
    sortedX.slice(sOrderX + 1).forEach(s2 => {
      const dis = getMinRightDis(s.loc, s2.loc);

      if (dis < minRDis) {
        gotRight = true;
        rS = s2;
        minRDis = dis;
      }
    });

    dirMap.set(s.id, {
      up: upS,
      down: downS,
      left: lS,
      right: rS,
      nextWrap: { // 指向元素是否为包裹层
        up: !gotUp,
        down: !gotDown,
        right: !gotRight,
        left: !gotLeft,
      },
      nextSubWrap: { // 是否内部的包裹层
        up: subWraps.includes(upS),
        down: subWraps.includes(downS),
        right: subWraps.includes(rS),
        left: subWraps.includes(lS),
      },
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
      (input[0].loc != null) || istanceofHtmlElement(input[0]));
  const objIpt = !aryIpt;
  const normalIpt = !simpleIpt && !objIpt;

  let formatted = null;

  if (simpleIpt) {
    formatted = [{ locs: input.map((s) => Array.isArray(s) ?
      { id: s, loc: s } : getElementObjLoc(s)) }];
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
        wrap: Array.isArray(wrap) ? { loc: wrap, id: wrap } : getElementObjLoc(wrap),
      });
    }
  } else if (normalIpt) {
    formatted = input.map((item) => {
      const { locs, wrap, subs } = item;
      const res = {
        locs: formatIpt(locs)[0].locs,
        wrap: Array.isArray(wrap) ? { loc: wrap, id: wrap } : getElementObjLoc(wrap),
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

function genUserX(rawX, firstInWrap) {
  const x = new Map();
  rawX.forEach((val, key) => {
    const { up, right, down, left, nextWrap, nextSubWrap } = val;
    const { up: upWrap, right: rWrap, down: downWrap, left: lWrap } = nextWrap;
    const { up: upSubW, right: rSubW, down: dSubWrap, left: lSubW } = nextSubWrap;

    const userUp = genUserDir("up", up, upWrap, upSubW);
    const userRight = genUserDir("right", right, rWrap, rSubW);
    const userDown = genUserDir("down", down, downWrap, dSubWrap);
    const userLeft = genUserDir("left", left, lWrap, lSubW);

    x.set(key, {
      up: userUp,
      right: userRight,
      down: userDown,
      left: userLeft,
    });
  });

  return x;

  function genUserDir(dirStr, rawDir, wrap, subW) {
    let userDir = rawDir;
    if (rawDir && wrap) { // 是否指向包裹层
      const wrapTarget = rawX.get(rawDir.id);
      const { nextSubWrap } = wrapTarget;
      userDir = wrapTarget[dirStr];
      if (nextSubWrap[dirStr]) {
        userDir = firstInWrap.get(wrapTarget[dirStr].id);
      }
    } else if (subW) { // 是否指向子包裹层
      userDir = firstInWrap.get(rawDir.id);
    }

    return userDir;
  }
}

function getElementObjLoc(o) {
  if (istanceofHtmlElement(o))
    return getElementObjLoc2(o);
  if (istanceofHtmlElement(o.loc)) {
    return {
      ...o,
      loc: getElementAryLoc(o.loc)
    }
  }
  return o;
}

function getElementObjLoc2(e) {
  return { id: e, loc: getElementAryLoc(e) };
}

function getElementAryLoc(e) {
  const t = e.getBoundingClientRect();
  const { x, y, width, height } = t;
  const halfW = width / 2;
  const halfH = height / 2;
  return [x + halfW, -y - halfH, halfW, halfH];
}

function istanceofHtmlElement(o) {
  return o instanceof HTMLElement;
}