
const dirs = ["up", "right", "down", "left"];

export default function naviix(rects, config = {}) {
  const { memo, scroll, dev } = config;
  const formattedRects = formatIpt(rects);
  const { x: rawX, firstInWrap, enterWrapX, exitWrapX, edgeX } = getX(formattedRects);
  const memoMap = new Map(); // { enter, exit: { up, down, left, right } }

  if (scroll) {
    return scrollReturn(rawX);
  } else if (memo) {
    return memoReturn(rawX);
  } else {
    return genUserX(rawX, firstInWrap);
  }

  function update(wrapId, newRects) {

    const newFormattedRects = formatIpt(newRects);
    const { x: newRawX, firstInWrap: newFirstInWrap, enterWrapX: newEnterWrapX, exitWrapX: newExitWrapX, edgeX: newEdgeX } = getX(newFormattedRects);
    const { rectsIncludeWrap, i } = cleanByFormattedRects(formattedRects, false);
    rectsIncludeWrap[i] = newFormattedRects[0];
    mergeMap(rawX, newRawX);
    mergeMap(firstInWrap, newFirstInWrap);
    mergeMap(enterWrapX, newEnterWrapX);
    mergeMap(exitWrapX, newExitWrapX);
    mergeMap(edgeX, newEdgeX);

    function cleanByFormattedRects(rects, found) {

      if (rects == null) return;

      for (let i = 0; i < rects.length; ++ i) {
        const _rects = rects[i];
        const { locs, subs, wrap = {} } = _rects;
        const curWrapId = wrap.id;
        const foundTargetWrap = wrapId === curWrapId;
        const _found = found || foundTargetWrap;
        if (_found) {
          locs.forEach(({ id }) => rawX.delete(id));
          firstInWrap.delete(curWrapId);
          exitWrapX.delete(curWrapId);
          edgeX.delete(curWrapId);
          if (found) {
            rawX.delete(curWrapId);
            enterWrapX.delete(curWrapId);
            memoMap.delete(curWrapId);
          } else {
            delete memoMap.get(curWrapId).enter;
          }
        }
        const res = cleanByFormattedRects(subs, _found);

        if (res) return res;
        if (foundTargetWrap) return { rectsIncludeWrap: rects, i };
      }
    }
  }

  function more(wrapId, newRects, dir) {
    const edgeXOfWrap = edgeX.get(wrapId);
    const edgeXRects = edgeXOfWrap.map(eId => rawX.get(eId).origin);
    const formattedRects = formatIpt(newRects);
    Array.prototype.push.apply(formattedRects[0].locs, edgeXRects); // 暂不支持 subs
    const { x: _rawX, firstInWrap: _firstInWrap, enterWrapX: _enterWrapX, exitWrapX: _exitWrapX, edgeX: _edgeX } = getX(formattedRects);

    // combine rawX
    edgeXOfWrap.forEach(xId => {
      const originRawX = rawX.get(xId);
      const moreRawX = _rawX.get(xId);
      dirs.forEach(dir => {
        if (moreRawX.dis[dir] < originRawX.dis[dir]) {
          originRawX[dir] = moreRawX[dir];
          originRawX.nextWrap[dir] = false;
          originRawX.nextSubWrap[dir] = false;
          originRawX.dis[dir] = moreRawX.dis[dir];
        }
      });
    });

    // combine firstInWrap
    mergeMap(firstInWrap, _firstInWrap);
    // combine enterWrapX
    mergeMap(enterWrapX, _enterWrapX);
    // combine exitWrapX
    for (const [key, val] of _exitWrapX) {
      if (key === wrapId) {
        const originExitWrapX = exitWrapX.get(key);
        for (dir of dirs) {
          Array.prototype.push.apply(originExitWrapX[dir], val[dir]);
        }
      } else {
        exitWrapX.set(key, val);
      }
    }
    // combine edgeX
    mergeMap(edgeX, _edgeX);
    // replace edgeX
    edgeX.set(wrapId, edgeX.get(wrapId).filter(xs => !edgeXOfWrap.includes(xs)));
  }

  function scrollReturn(x) {
    return {
      scroll(newX) {
        updateRawXByScroll(x, newX);
      },
      left: id => getScrollDirX(id, "left", "right", getMinLeftDis),
      up: id => getScrollDirX(id, "up", "down", getMinUpDis),
      right: id => getScrollDirX(id, "right", "left", getMinRightDis),
      down: id => getScrollDirX(id, "down", "up", getMinDownDis),
      update,
      more,
    };

    function getScrollDirX(id, dir, antiDir, calcMinDis) {
      const idXInfo = x.get(id);
      const dirX = idXInfo[dir];
      const dirXIsWrap = idXInfo.nextWrap[dir];
      const dirXIsSubWrap = idXInfo.nextSubWrap[dir];
      const startLoc = calcLocIfE(idXInfo.origin);
      if (dirXIsWrap) { // exit
        // 找到所有父区内所有指向当前区（子区）左边框的矩形
        const allDirWrapX = getAllExitWrapX(dirX.id, antiDir);
        return getNextWrapX(allDirWrapX);
      } else if (dirXIsSubWrap) { // enter
        // 找到子区内所有指向子区右边框的矩形
        const allDirWrapX = getAllEnterWrapX(dirX.id, antiDir);
        return getNextWrapX(allDirWrapX);
      } else return dirX;

      function getNextWrapX(allDirWrapX) {
        let res = null;
        // next direction element
        let minLDis = Infinity;
        for (let i = 0; i < allDirWrapX.length; ++ i) {
          const r2Info = x.get(allDirWrapX[i]);
          const r2 = r2Info.origin;
          const targetLoc = calcLocIfE(r2);
          const r2WrapInfo = x.get(r2.wrapId);
          if (!isVisualElement(targetLoc, calcLocIfE(r2WrapInfo.origin))) continue;
          const { dis, isProj } = calcMinDis(startLoc, targetLoc);

          if (dis < minLDis) {
            minLDis = dis;
            res = r2;
            if (isProj) break;
          }
        }
        return res;
      }

      /**
       *  +--------------+
       *  |        +---+ |
       *  |        |   | |
       *  |        +---+ |
       *  | +----------+ |
       *  | |    +---+ | | +---+
       *  | |    |   | | | | < |
       *  | |    +---+ | | +---+
       *  | |    +---+ | |
       *  | |    |   | | |
       *  | |    +---+ | |
       *  | +----------+ |
       *  +--------------+
       */
      function getAllEnterWrapX(wrapId, dir) {
        const exitWrapIdX = exitWrapX.get(wrapId)[dir];
        return t(exitWrapIdX, dir);
      }

      /**
       *            +---------------+
       *      +---+ |               |
       *      |   | |               |
       *      +---+ |               |
       *  +-------+ |               |
       *  | +---+ | | +---+         |
       *  | |   | | | | < |         |
       *  | +---+ | | +---+         |
       *  | +---+ | |               |
       *  | |   | | |               |
       *  | +---+ | |               |
       *  +-------+ |               |
       *            +---------------+
       */
      function getAllExitWrapX(wrapId, dir) {
        const enterWrapIdX = enterWrapX.get(wrapId)[dir];
        return t(enterWrapIdX, dir);
      }

      function t(wrapX, dir) {
        const tt = [];
        wrapX.forEach(xId => {
          const subExitWrapX = exitWrapX.get(xId)[dir];
          if (subExitWrapX == null) tt.push(xId);
          else tt.push(...t(subExitWrapX));
        });

        return tt;
      }

      function calcLocIfE(x) {
        return x.e == null ? x.loc : getElementAryLoc(x.e);
      }
    }
  }

  function memoReturn(x) {
    return {
      left: (id) => getMemoizedDirX(id, "left", "right"),
      up: (id) => getMemoizedDirX(id, "up", "down"),
      right: (id) => getMemoizedDirX(id, "right", "left"),
      down: (id) => getMemoizedDirX(id, "down", "up"),
      update,
      more,
    };

    /**
     * @param {any} id 
     * @param {string} dir 
     * @returns 
     */
    function getMemoizedDirX(id, dir, antiDir) {
      const idXInfo = x.get(id);
      const { wrapId } = idXInfo;
      const dirX = idXInfo[dir];
      const dirXIsWrap = idXInfo.nextWrap[dir];
      const dirXIsSubWrap = idXInfo.nextSubWrap[dir];
      const memo = memoMap.get(id);
      if (dirXIsWrap) { // exit
        const exit = memo.exit[dir] || genUserDirX(dir, dirX, dirXIsWrap, dirXIsSubWrap, rawX, firstInWrap);
        return exit;
      } else if (dirXIsSubWrap) { // enter
        const memo = memoMap.get(dirX.id) || {};
        return memo.enter || genUserDirX(dir, dirX, dirXIsWrap, dirXIsSubWrap, rawX, firstInWrap);
      } else {
        const { left: nextL, right: nextR, up: nextU, down: nextD,
          nextSubWrap: {
            left: nextLIsSubWrap,
            up: nextUIsSubWrap,
            right: nextRIsSubWrap,
            down: nextDIsSubWrap,
          }
        } = x.get(dirX.id);
        // 更新 exit
        updateSubExitMemo(nextLIsSubWrap, nextL, antiDir);
        updateSubExitMemo(nextUIsSubWrap, nextU, antiDir);
        updateSubExitMemo(nextRIsSubWrap, nextR, antiDir);
        updateSubExitMemo(nextDIsSubWrap, nextD, antiDir);
        // 更新 enter
        memoMap.set(wrapId, {
          ...memo,
          enter: dirX,
        });
        return dirX;

        function updateSubExitMemo(nextDirXIsSubWrap, nextDirX, dir) {
          if (nextDirXIsSubWrap) {
            const memo = memoMap.get(nextDirX.id);
            memoMap.set(nextDirX.id, {
              ...memo,
              exit: {
                ...memo.exit,
                [dir]: dirX,
              }
            });
          }
        }
      }
    }
  }
}

function getX(rects, notRoot) {
  let mergedX = new Map();
  let firstInWrap = new Map();
  /** 从外部进入 */
  let enterWrapX = new Map();
  /** 从内部退出 */
  let exitWrapX = new Map();
  /** 边缘元素，没有被投影包围的元素 */
  let edgeX = new Map();

  if (!notRoot && rects.length > 1) { // 位于 root，且区域数量大于 1
    const wraps = rects.map(info => info.wrap);
    rects.forEach(s => {
      firstInWrap.set(s.wrap.id, s.locs[0]);
    });
    const { x } = getXBySimple(wraps);
    mergedX = x;
  }

  rects.forEach(({ locs, subs, wrap }) => {
    const subWraps = (subs || []).map(s => s.wrap);
    (subs || []).map(s => {
      firstInWrap.set(s.wrap.id, s.locs[0]);
    });
    const newLocs = locs.concat(subWraps);
    const { x } = getXBySimple(newLocs, wrap, subWraps);
    const { x: subsX, firstInWrap: _firstInWrap, enterWrapX: _enterWrapX, exitWrapX: _exitWrapX, edgeX: _edgeX } = getX(subs || [], true);
    mergedX = new Map(Array.from(mergedX).concat(Array.from(x)).concat(Array.from(subsX)));
    firstInWrap = new Map(Array.from(firstInWrap).concat(Array.from(_firstInWrap)));
    enterWrapX = new Map(Array.from(_enterWrapX));
    exitWrapX = new Map(Array.from(_exitWrapX));
    edgeX = new Map(Array.from((_edgeX)));
  });

  for(const [xId, xInfo] of mergedX) {
    const { nextWrap, nextSubWrap, wrapId, surrounded } = xInfo;
    for(const dir of dirs) {
      if (nextWrap[dir]) {
        const gotExitWrapX = exitWrapX.get(wrapId);
        exitWrapX.set(wrapId, {
          ...gotExitWrapX,
          [dir]: ((gotExitWrapX && gotExitWrapX[dir]) || []).concat(xId),
        });
      }
      if (nextSubWrap[dir]) {
        const wrapId = xInfo[dir].id;
        const gotEnterWrapX = enterWrapX.get(wrapId);
        enterWrapX.set(wrapId, {
          ...gotEnterWrapX,
          [dir]: ((gotEnterWrapX && gotEnterWrapX[dir]) || []).concat(xId),
        })
      }
    }
    if (!surrounded) {
      edgeX.set(wrapId, (edgeX.get(wrapId) || []).concat(xId));
    }
  }

  return { x: mergedX, firstInWrap, enterWrapX, exitWrapX, edgeX };
}

function getXBySimple(rects, wrap, subWraps) {
  const sortedX = [...rects];
  sortedX.sort((s1, s2) => s1.loc[0] - s2.loc[0]);
  const sortedY = [...rects];
  sortedY.sort((s1, s2) => s1.loc[1] - s2.loc[1]);
  const dirMap = new Map();
  let t = -Infinity;
  let b = Infinity;
  let l = Infinity;
  let r = -Infinity;
  let surroundedI = 0;

  rects.forEach(s => {
    const [x, y, t1, t2] = s.loc;
    const sOrderY = sortedY.findIndex(e => e.id === s.id);
    const sOrderX = sortedX.findIndex(e => e.id === s.id);

    // next down element
    let minDownDis = Infinity;
    let downS = wrap; // 默认指向包裹层
    let gotDown = false;
    for (let i = sOrderY - 1; i > -1; -- i) { // 从距离元素最近的位置寻找
      const s2 = sortedY[i];
      const { dis, isProj } = getMinDownDis(s.loc, s2.loc);

      if (dis < minDownDis) {
        gotDown = true;
        downS = s2;
        minDownDis = dis;
        surroundedI += isProj;
        if (isProj) break; // 投影距离是最短距离，无需后续比较
      }
    }

    // next up element
    let minUpDis = Infinity;
    let upS = wrap;
    let gotUp = false;
    for (let i = sOrderY + 1; i < sortedY.length; ++ i) {
      const s2 = sortedY[i];
      const { dis, isProj } = getMinUpDis(s.loc, s2.loc);

      if (dis < minUpDis) {
        gotUp = true;
        upS = s2;
        minUpDis = dis;
        surroundedI += isProj;
        if (isProj) break;
      }
    }

    // next left element
    let minLDis = Infinity;
    let lS = wrap;
    let gotLeft = false;
    for (let i = sOrderX - 1; i > -1; -- i) {
      const s2 = sortedX[i];
      const { dis, isProj } = getMinLeftDis(s.loc, s2.loc);

      if (dis < minLDis) {
        gotLeft = true;
        lS = s2;
        minLDis = dis;
        surroundedI += isProj;
        if (isProj) break;
      }
    }

    // next right element
    let minRDis = Infinity;
    let rS = wrap;
    let gotRight = false;
    for (let i = sOrderX + 1; i < sortedX.length; ++ i) {
      const s2 = sortedX[i];
      const { dis, isProj } = getMinRightDis(s.loc, s2.loc);

      if (dis < minRDis) {
        gotRight = true;
        rS = s2;
        minRDis = dis;
        surroundedI += isProj;
        if (isProj) break;
      }
    }

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
      wrapId: wrap == null ? "root" : wrap.id,
      origin: s,
      surrounded: surroundedI === 4,
      dis: {
        up: minRDis,
        down: minDownDis,
        right: minRDis,
        left: minLDis,
      }
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
  let isProj = false;
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
      isProj = true;
      dis = Math.pow(y - t2 - y2 - t2a, 2);
      if (y2 + t2a > y - t2) dis = -dis;
    }
  }

  return { dis, isProj };
}

function getMinUpDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  let isProj = false;
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
      isProj = true;
    }
  }
  return { dis, isProj };
}

function getMinLeftDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  let isProj = false;
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
      isProj = true;
    }
  }
  return { dis, isProj };
}

function getMinRightDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  let isProj = false;
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
      isProj = true;
    }
  }

  return { dis, isProj };
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
      { id: s, loc: s } : getElementNObjLoc(s)) }];
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
        wrap: Array.isArray(wrap) ? { loc: wrap, id: wrap } : getElementNObjLoc(wrap),
      });
    }
  } else if (normalIpt) {
    formatted = input.map((item) => {
      const { locs, wrap, subs } = item;
      const res = {
        locs: formatIpt(locs)[0].locs,
        wrap: Array.isArray(wrap) ? { loc: wrap, id: wrap } : getElementNObjLoc(wrap),
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

    const userUp = genUserDirX("up", up, upWrap, upSubW, rawX, firstInWrap);
    const userRight = genUserDirX("right", right, rWrap, rSubW, rawX, firstInWrap);
    const userDown = genUserDirX("down", down, downWrap, dSubWrap, rawX, firstInWrap);
    const userLeft = genUserDirX("left", left, lWrap, lSubW, rawX, firstInWrap);

    x.set(key, {
      up: userUp,
      right: userRight,
      down: userDown,
      left: userLeft,
    });
  });

  return x;
}

function genUserDirX(dirStr, rawDirX, wrap, subW, rawX, firstInWrap) {
  let userDir = rawDirX;
  if (rawDirX && wrap) { // 是否指向包裹层
    const wrapTarget = rawX.get(rawDirX.id);
    const { nextSubWrap } = wrapTarget;
    userDir = wrapTarget[dirStr];
    if (nextSubWrap[dirStr]) {
      userDir = firstInWrap.get(wrapTarget[dirStr].id);
    }
  } else if (subW) { // 是否指向子包裹层
    userDir = firstInWrap.get(rawDirX.id);
  }

  if (userDir == null) return userDir;
  const { e, ...cleanUsrDirX } = userDir;
  return cleanUsrDirX;
}

function getElementNObjLoc(o) {
  if (istanceofHtmlElement(o))
    return getElementObjLoc2(o);
  if (istanceofHtmlElement(o.loc)) {
    return {
      ...o,
      loc: getElementAryLoc(o.loc),
      e: o.loc
    }
  }
  return o;
}

function getElementObjLoc2(e) {
  return { id: e, loc: getElementAryLoc(e), e };
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

/**
 * 
 * @param {any} id 
 * @param {Map} rawX 
 * @param {Array<{id: any, loc: number[]}>|Map} newX 
 */
function updateRawXByScroll(rawX, newX) {
  const mapNewX = newX instanceof Map ? newX : newX.reduce((acc, { id, loc }) => acc.set(id, loc), new Map());
  for (const [, val] of rawX) {
    const { up, right, down, left } = val;
    rep(up);
    rep(right);
    rep(down);
    rep(left);
  }

  function rep(dirX) {
    if (dirX) {
      const newLoc = mapNewX.get(dirX.id)
      if (newLoc) dirX.loc = newLoc;
    }
  }
}

function isVisualElement(e, wrap) {
  const [x, y, a, b] = e;
  const [x2, y2, a2, b2] = wrap;
  return x + a <= x2 + a2 && y + b <= y2 + b2 && x - a >= x2 - a2 && y - b >= y2 - b2;
}

function mergeMap(a, b) {
  for (const [key, val] of b) {
    a.set(key, val);
  }
}