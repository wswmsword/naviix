/* 这是 1.0.0 版本的 naviix。 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global.scaleView;
    var exports = global.scaleView = factory();
    exports.noConflict = function () { global.scaleView = current; return exports; };
  })());
})(this, (function () { 'use strict';

  function naviix(squares) {
    var formattedSquares = formatIpt(squares);
    var _getX = getX(formattedSquares),
      rawX = _getX.x,
      firstInWrap = _getX.firstInWrap;
    var x = genUserX(rawX, firstInWrap);
    return x;
  }
  function getX(squares, notRoot) {
    var mergedX = new Map();
    var firstInWrap = new Map();
    if (!notRoot && squares.length > 1) {
      // 位于 root，且区域数量大于 1
      var wraps = squares.map(function (info) {
        return info.wrap;
      });
      squares.forEach(function (s) {
        firstInWrap.set(s.wrap.id, s.locs[0]);
      });
      var _getXBySimple = getXBySimple(wraps),
        x = _getXBySimple.x;
      mergedX = x;
    }
    squares.forEach(function (_ref) {
      var locs = _ref.locs,
        subs = _ref.subs,
        wrap = _ref.wrap;
      var subWraps = (subs || []).map(function (s) {
        return s.wrap;
      });
      (subs || []).map(function (s) {
        firstInWrap.set(s.wrap.id, s.locs[0]);
      });
      var newLocs = locs.concat(subWraps);
      var _getXBySimple2 = getXBySimple(newLocs, wrap, subWraps),
        x = _getXBySimple2.x;
      var _getX2 = getX(subs || [], true),
        subsX = _getX2.x,
        _firstInWrap = _getX2.firstInWrap;
      mergedX = new Map(Array.from(mergedX).concat(Array.from(x)).concat(Array.from(subsX)));
      firstInWrap = new Map(Array.from(firstInWrap).concat(Array.from(_firstInWrap)));
    });
    return {
      x: mergedX,
      firstInWrap: firstInWrap
    };
  }
  function getXBySimple(squares, wrap, subWraps) {
    var sortedX = [].concat(squares);
    sortedX.sort(function (s1, s2) {
      return s1.loc[0] - s2.loc[0];
    });
    var sortedY = [].concat(squares);
    sortedY.sort(function (s1, s2) {
      return s1.loc[1] - s2.loc[1];
    });
    var dirMap = new Map();
    var t = -Infinity;
    var b = Infinity;
    var l = Infinity;
    var r = -Infinity;
    squares.forEach(function (s) {
      var _s$loc = s.loc,
        x = _s$loc[0],
        y = _s$loc[1],
        t1 = _s$loc[2],
        t2 = _s$loc[3];
      var sOrderY = sortedY.findIndex(function (e) {
        return e.id === s.id;
      });
      var sOrderX = sortedX.findIndex(function (e) {
        return e.id === s.id;
      });

      // next down element
      var minDownDis = Infinity;
      var downS = wrap; // 默认指向包裹层
      var gotDown = false;
      sortedY.slice(0, sOrderY).forEach(function (s2) {
        var dis = getMinDownDis(s.loc, s2.loc);
        if (dis < minDownDis) {
          gotDown = true;
          downS = s2;
          minDownDis = dis;
        }
      });

      // next up element
      var minUpDis = Infinity;
      var upS = wrap;
      var gotUp = false;
      sortedY.slice(sOrderY + 1).forEach(function (s2) {
        var dis = getMinUpDis(s.loc, s2.loc);
        if (dis < minUpDis) {
          gotUp = true;
          upS = s2;
          minUpDis = dis;
        }
      });

      // next left element
      var minLDis = Infinity;
      var lS = wrap;
      var gotLeft = false;
      sortedX.slice(0, sOrderX).forEach(function (s2) {
        var dis = getMinLeftDis(s.loc, s2.loc);
        if (dis < minLDis) {
          gotLeft = true;
          lS = s2;
          minLDis = dis;
        }
      });

      // next right element
      var minRDis = Infinity;
      var rS = wrap;
      var gotRight = false;
      sortedX.slice(sOrderX + 1).forEach(function (s2) {
        var dis = getMinRightDis(s.loc, s2.loc);
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
        nextWrap: {
          // 指向元素是否为包裹层
          up: !gotUp,
          down: !gotDown,
          right: !gotRight,
          left: !gotLeft
        },
        nextSubWrap: {
          // 是否内部的包裹层
          up: subWraps.includes(upS),
          down: subWraps.includes(downS),
          right: subWraps.includes(rS),
          left: subWraps.includes(lS)
        }
      });

      // 更新边界
      t = y + t2 > t ? y + t2 : t;
      b = y - t2 < b ? y - t2 : b;
      l = x - t2 < l ? x - t1 : l;
      r = x + t2 > r ? x + t1 : r;
    });
    return {
      x: dirMap,
      t: t,
      b: b,
      l: l,
      r: r
    };
  }
  function getMinDownDis(s, s2) {
    var x = s[0],
      y = s[1],
      t1 = s[2],
      t2 = s[3];
    var x2 = s2[0],
      y2 = s2[1],
      t1a = s2[2],
      t2a = s2[3];
    var dis = Infinity;
    if (y > y2) {
      // is below

      if (x2 - t1a > x + t1) {
        // is right corner

        if (x2 - t1a - x - t1 < y - t2 - y2 - t2a) {
          dis = getDistance(x + t1, y - t2, x2 - t1a, y2 + t2a);
        }
      } else if (x2 + t1a < x - t1) {
        // is left corner

        if (x - t1 - x2 - t1a < y - t2 - y2 - t2a) {
          dis = getDistance(x + t1, y - t2, x2 + t1a, y2 + t2a);
        }
      } else {
        // is project
        dis = Math.pow(y - t2 - y2 - t2a, 2);
        if (y2 + t2a > y - t2) dis = -dis;
      }
    }
    return dis;
  }
  function getMinUpDis(s, s2) {
    var x = s[0],
      y = s[1],
      t1 = s[2],
      t2 = s[3];
    var x2 = s2[0],
      y2 = s2[1],
      t1a = s2[2],
      t2a = s2[3];
    var dis = Infinity;
    if (y < y2) {
      // is above
      if (x2 - t1a > x + t1) {
        // is right corner
        if (x2 - t1a - x - t1 < y2 - t2a - y - t2) {
          dis = getDistance(x + t1, y + t2, x2 - t1a, y2 - t2a);
        }
      } else if (x2 + t1a < x - t1) {
        // is left corner
        if (x - t1 - x2 - t1a < y2 - t2a - y - t2) {
          dis = getDistance(x - t1, y + t2, x2 + t1a, y2 - t2a);
        }
      } else {
        // is project
        dis = Math.pow(y2 - t2a - y - t2, 2);
        if (y2 - t2a < y + t2) dis = -dis;
      }
    }
    return dis;
  }
  function getMinLeftDis(s, s2) {
    var x = s[0],
      y = s[1],
      t1 = s[2],
      t2 = s[3];
    var x2 = s2[0],
      y2 = s2[1],
      t1a = s2[2],
      t2a = s2[3];
    var dis = Infinity;
    if (x > x2) {
      // is left
      if (y2 - t2a > y + t2) {
        // is top corner
        if (y2 - t2a - y - t2 < x - t1 - x2 - t1a) {
          // closer x
          dis = getDistance(x - t1, y + t2, x2 + t1a, y2 - t2a);
        }
      } else if (y2 + t2a < y - t2) {
        // is bottom corder
        if (y - t2 - y2 - t2a < x - t1 - x2 - t1a) {
          // closer x
          dis = getDistance(x - t1, y - t2, x2 + t1a, y2 + t2a);
        }
      } else {
        // is project
        dis = Math.pow(x - t1 - x2 - t1a, 2);
        if (x2 + t1a > x - t1) dis = -dis;
      }
    }
    return dis;
  }
  function getMinRightDis(s, s2) {
    var x = s[0],
      y = s[1],
      t1 = s[2],
      t2 = s[3];
    var x2 = s2[0],
      y2 = s2[1],
      t1a = s2[2],
      t2a = s2[3];
    var dis = Infinity;
    if (x2 > x) {
      // is right
      if (y2 - t2a > y + t2) {
        // is top corner
        if (y2 - t2a - y - t2 < x2 - t1a - x - t1) {
          // closer x
          dis = getDistance(x + t1, y + t2, x2 - t1a, y2 - t2a);
        }
      } else if (y2 + t2a < y - t2) {
        // is bottom corder
        if (y - t2 - y2 - t2a < x2 - t1a - x - t1) {
          dis = getDistance(x + t1, y - t2, x2 - t1a, y2 + t2a);
        }
      } else {
        dis = Math.pow(x2 - t1a - x - t1, 2);
        if (x2 - t1a < x + t1)
          // overlap
          dis = -dis;
      }
    }
    return dis;
  }
  function getDistance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy; // without sqrt
  }
  function formatIpt(input) {
    if (input == null) return;
    var aryIpt = Array.isArray(input);
    var simpleIpt = aryIpt && (Array.isArray(input[0]) ? typeof input[0][0] === "number" : input[0].loc != null);
    var objIpt = !aryIpt;
    var normalIpt = !simpleIpt && !objIpt;
    var formatted = null;
    if (simpleIpt) {
      formatted = [{
        locs: input.map(function (s) {
          return Array.isArray(s) ? {
            id: s,
            loc: s
          } : s;
        })
      }];
    } else if (objIpt) {
      var wrap = input.wrap,
        subs = input.subs,
        locs = input.locs;
      formatted = [{
        locs: formatIpt(locs)[0].locs
      }];
      if (subs != null) {
        Object.assign(formatted[0], {
          subs: formatIpt(input.subs)
        });
      }
      if (wrap != null) {
        Object.assign(formatted[0], {
          wrap: Array.isArray(wrap) ? {
            loc: wrap,
            id: wrap
          } : wrap
        });
      }
    } else if (normalIpt) {
      formatted = input.map(function (item) {
        var locs = item.locs,
          wrap = item.wrap,
          subs = item.subs;
        var res = {
          locs: formatIpt(locs)[0].locs,
          wrap: Array.isArray(wrap) ? {
            loc: wrap,
            id: wrap
          } : wrap
        };
        if (subs) {
          Object.assign(res, {
            subs: formatIpt(subs)
          });
        }
        return res;
      });
    }
    return formatted;
  }
  function genUserX(rawX, firstInWrap) {
    var x = new Map();
    rawX.forEach(function (val, key) {
      var up = val.up,
        right = val.right,
        down = val.down,
        left = val.left,
        nextWrap = val.nextWrap,
        nextSubWrap = val.nextSubWrap;
      var upWrap = nextWrap.up,
        rWrap = nextWrap.right,
        downWrap = nextWrap.down,
        lWrap = nextWrap.left;
      var upSubW = nextSubWrap.up,
        rSubW = nextSubWrap.right,
        dSubWrap = nextSubWrap.down,
        lSubW = nextSubWrap.left;
      var userUp = genUserDir("up", up, upWrap, upSubW);
      var userRight = genUserDir("right", right, rWrap, rSubW);
      var userDown = genUserDir("down", down, downWrap, dSubWrap);
      var userLeft = genUserDir("left", left, lWrap, lSubW);
      x.set(key, {
        up: userUp,
        right: userRight,
        down: userDown,
        left: userLeft
      });
    });
    return x;
    function genUserDir(dirStr, rawDir, wrap, subW) {
      var userDir = rawDir;
      if (rawDir && wrap) {
        // 是否指向包裹层
        var wrapTarget = rawX.get(rawDir.id);
        var nextSubWrap = wrapTarget.nextSubWrap;
        userDir = wrapTarget[dirStr];
        if (nextSubWrap[dirStr]) {
          userDir = firstInWrap.get(wrapTarget[dirStr].id);
        }
      } else if (subW) {
        // 是否指向子包裹层
        userDir = firstInWrap.get(rawDir.id);
      }
      return userDir;
    }
  }

  return naviix;

}));
//# sourceMappingURL=naviix.umd.js.map
