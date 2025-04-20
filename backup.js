
const focux = (function() {
  const _private = new WeakMap();

  function _focux(..._squares) {
    /** 是否有子区 */
    const hasChasm = _squares[1] != null && !Array.isArray(_squares[1]);
    const squares = hasChasm ? _squares[0] : _squares;
    /** 子区的矩形们 */
    const subSqus = hasChasm && _squares[1];
    /** 各子区框成的虚拟矩形 */
    const virtuSq = getVirtualSquare(subSqus);
    const { x, t, b, l, r } = getX(squares.concat(virtuSq));
    // 计算深渊矩形的各方向，不包括和外部矩形的联系
    // 匹配深渊矩形和外界矩形的联系，计算方向
    const xWithSub = getXWithSub(subSqus, x, virtuSq);
    this.x = xWithSub;
    _private.set(this, { t, b, l, r });
    return this;
  }

  _focux.prototype.next = function(...squares) {
    const { x: nextX, t: nt, b: nb, l: nl, r: nr  } = getX(squares);
    const { t, b, l, r } = _private.get(this);
    const down = nt < b;
    const up = nb > t;
    const right = nl > r;
    const left = nr < l;

    if (down) {
      // 找到无上方向的新矩形
      const upS = [];
      for (const [key, val] of nextX) {
        if (val.up == null) upS.push(key);
      }
      // 找到无下方向的旧矩形
      const downS = [];
      for (const [key, val] of this.x) {
        if (val.down == null) downS.push(key);
      }
      // 计算方向
      downS.forEach(s => {
        // next down element
        let minDownDis = Infinity;
        let downS = null;
        upS.forEach(s2 => {
          let dis = getMinDownDis(s, s2);
          if (dis < minDownDis) {
            downS = s2;
            minDownDis = dis;
          }
        });

        const dir = this.x.get(s);
        dir.down = downS;
      });

      upS.forEach(s => {
        let minUpDis = Infinity;
        let upS = null;
        downS.forEach(s2 => {
          let dis = getMinUpDis(s, s2);
          if (dis < minUpDis) {
            upS = s2;
            minUpDis = dis;
          }

          const dir = nextX.get(s);
          dir.up = upS;
        });
      });
    } else if (up) {
    } else if (right) {
    } else if (left) {
    }

    this.x = new Map([...this.x, nextX]);
    _private.set(this, { t: nt, b, nb, l, nl, r: nr });

    return this;
  };
  
  _focux.prototype.updateChasm = function() {

  };

  return _focux;
})();

function getX(...squares) {
  const sortedX = [...squares];
  sortedX.sort((s1, s2) => s1[0] - s2[0]);
  const sortedY = [...squares];
  sortedY.sort((s1, s2) => s1[1] - s2[1]);
  const dirMap = new Map();
  let t = -Infinity;
  let b = Infinity;
  let l = Infinity;
  let r = -Infinity;

  squares.forEach(s => {
    const [x, y, t1, t2] = s;
    const sOrderY = sortedY.findIndex(e => e === s);
    const sOrderX = sortedX.findIndex(e => e === s);

    // next down element
    let minDownDis = Infinity;
    let downS = null;
    sortedY.slice(0, sOrderY).forEach(s2 => {
      let dis = getMinDownDis(s, s2);

      if (dis < minDownDis) {
        downS = s2;
        minDownDis = dis;
      }
    });

    // next up element
    let minUpDis = Infinity;
    let upS = null;
    sortedY.slice(sOrderY + 1).forEach(s2 => {
      let dis = getMinUpDis(s, s2);

      if (dis < minUpDis) {
        upS = s2;
        minUpDis = dis;
      }
    });

    // next left element
    let minLDis = Infinity;
    let lS = null;
    sortedX.slice(0, sOrderX).forEach(s2 => {
      let dis = getMinLeftDis(s, s2);

      if (dis < minLDis) {
        lS = s2;
        minLDis = dis;
      }
    });

    // next right element
    let minRDis = Infinity;
    let rS = null;
    sortedX.slice(sOrderX + 1).forEach(s2 => {
      const dis = getMinRightDis(s, s2);

      if (dis < minRDis) {
        rS = s2;
        minRDis = dis;
      }
    });

    dirMap.x.set(s, {
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
  if (y - t2 > y2 + t2a) { // is below

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
    }
  }

  return dis;
}

function getMinUpDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (y + t2 < y2 - t2a) { // is above
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
    }
  }
  return dis;
}

function getMinLeftDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (x - t1 > x2 + t1a) { // is left
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
    }
  }
  return dis;
}

function getMinRightDis(s, s2) {
  const [x, y, t1, t2] = s;
  const [x2, y2, t1a, t2a] = s2;
  let dis = Infinity;
  if (x2 - t1a > x + t1) { // is right
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
    }
  }

  return dis;
}

function getVirtualSquare(chasmSquares) {

}

function getXWithSub() {
  // 获取 items x
  // 分别获取无上下左右方向的深渊矩形
  // 找到下方向是虚拟矩形的外部矩形
  // 匹配无上方向的深渊矩形和下方向的外部矩形
  // ...
}

function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy; // without sqrt
}