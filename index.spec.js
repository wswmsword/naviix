import assert from "node:assert";
import naviix from "./index.js";

describe("naviix", function () {
  /**
   *  +---+  +---+
   *  |   |  |   |
   *  +---+  +---+
   */
  it("两个矩形", function () {
    const s1 = [1, 1, 1, 1];
    const s2 = [4, 1, 1, 1];
    const squares = [s1, s2];
    const res = naviix(squares);
    assert.equal(res.get(s1).right.id, s2);
    assert.equal(res.get(s2).left.id, s1);
    assert.equal(res.get(s1).left, undefined);
    assert.equal(res.get(s1).up, undefined);
    assert.equal(res.get(s1).down, undefined);
    assert.equal(res.get(s2).right, undefined);
    assert.equal(res.get(s2).up, undefined);
    assert.equal(res.get(s2).down, undefined);
  });

  /**
   *  +---+
   *  | 2 |  +---+
   *  +---+  | 3 |
   *  +---+  |   |
   *  | 1 |  +---+
   *  +---+
   */
  it("三个矩形", function() {
    const s1 = [1, 1, 1, 1];
    const s2 = [1, 4, 1, 1];
    const s3 = [4, 2.5, 1, 1.5];
    const res = naviix([s1, s2, s3]);
    assert.equal(res.get(s1).right.id, s3);
    assert.equal(res.get(s1).up.id, s2);
    assert.equal(res.get(s2).right.id, s3);
    assert.equal(res.get(s2).down.id, s1);
    assert.equal(res.get(s3).left.id, s2);
  });

  /**
   *  +-------+
   *  |    +--+--+
   *  |    |  |  |
   *  |    +--+--+
   *  +-------+
   */
  it("重叠", function() {
    const s1 = [3, 3, 2, 2];
    const s2 = [5.5, 3, 1.5, 1];
    const res = naviix([s1, s2]);
    assert.equal(res.get(s1).right.id, s2);
    assert.equal(res.get(s2).left.id, s1);
  });

  /**
   *         +---+
   *         |   |
   *         +---+
   *  +---+
   *  |   |
   *  +---+
   */
  it("相离", function() {
    const s1 = [1, 1, 1, 1];
    const s2 = [4, 4, 1, 1];
    const res = naviix([s1, s2]);
    const { left, right, up, down } = res.get(s1);
    const { left: l2, right: r2, up: u2, down: d2 } = res.get(s2);
    [left, right, up, down].forEach(d => assert.equal(d, undefined));
    [l2, r2, u2, d2].forEach(d => assert.equal(d, undefined));
  });

  it("相离二", function() {
    const s1 = [1, 1, 1, 1];
    const s2 = [4, 3.5, 1, 1];
    const res = naviix([s1, s2]);
    const { left, right, up, down } = res.get(s1);
    const { left: l2, right: r2, up: u2, down: d2 } = res.get(s2);
    assert.equal(right.id, s2);
    assert.equal(l2.id, s1);
    [left, up, down].forEach(d => assert.equal(d, undefined));
    [r2, u2, d2].forEach(d => assert.equal(d, undefined));
  });

  /**
   *  +---+  +---+
   *  | 2 |  | 4 |
   *  +---+  +---+
   *  +---+  +---+
   *  | 1 |  | 3 |
   *  +---+  +---+
   */
  it("网格", function() {
    const s1 = [2, 2, 1, 1];
    const s2 = [2, 5, 1, 1];
    const s3 = [5, 2, 1, 1];
    const s4 = [5, 5, 1, 1];
    const res = naviix([s1, s2, s3, s4]);
    const { left: l1, right: r1, up: u1, down: d1 } = res.get(s1);
    const { left: l2, right: r2, up: u2, down: d2 } = res.get(s2);
    const { left: l3, right: r3, up: u3, down: d3 } = res.get(s3);
    const { left: l4, right: r4, up: u4, down: d4 } = res.get(s4);
    assert.equal(u1.id, s2);
    assert.equal(r1.id, s3);
    assert.equal(d2.id, s1);
    assert.equal(r2.id, s4);
    assert.equal(l3.id, s1);
    assert.equal(u3.id, s4);
    assert.equal(l4.id, s2);
    assert.equal(d4.id, s3);
    [l1, d1, l2, u2, r3, d3, r4, u4].forEach(d => assert.equal(d, undefined));
  });

  /**
   *        +-------+
   *        | +---+ |
   *        | | 3 | |
   *        | +---+ |
   *  +---+ | +---+ |
   *  | 1 | | | 2 | |
   *  +---+ | +---+ |
   *        +-------+
   */

  it("子区", function() {
    const s1 = [1, 5, 1, 1];
    const s2 = [5, 1, 1, 1];
    const s3 = [5, 4, 1, 1];
    const w = [5, 3.5, 2, 3.5];
    const res = naviix({
      "locs": [s1],
      "subs": {
        "locs": [s2, s3],
        "wrap": w,
      }
    });
    const { left: l1, up: u1, right: r1, down: d1 } = res.get(s1);
    const { left: l2, up: u2, right: r2, down: d2 } = res.get(s2);
    const { left: l3, up: u3, right: r3, down: d3 } = res.get(s3);
    const { left: lw, up: uw, right: rw, down: dw } = res.get(w);

    assert.equal(r1.id, s2);
    assert.equal(lw.id, s1);
    assert.equal(u2.id, s3);
    assert.equal(l2.id, s1);
    assert.equal(d3.id, s2);
    assert.equal(l3.id, s1);
    [l1, u1, r2, d2, u3, r3, uw, rw, dw].forEach(d => assert.equal(d, undefined));
  });

  /**
   *  +----------------------+
   *  | +---+                |
   *  | | 2 |    1           |
   *  | +---+                |
   *  +----------------------+
   */

  it("包含", function() {
    const r1 = [4, 2, 4, 2];
    const r2 = [2, 2, 1, 1];
    const res = naviix([r1, r2]);
    const { left, right, up, down } = res.get(r1);
    const { left: l2, right: ri2, up: u2, down: d2 } = res.get(r2);
    assert.equal(left.id, r2);
    assert.equal(ri2.id, r1);
    [right, up, down].forEach(d => assert.equal(d, undefined));
    [l2, u2, d2].forEach(d => assert.equal(d, undefined));
  });

  /**
   *  +---+
   *  | 3 |
   *  +---+
   *  +---+
   *  | 2 |
   *  +---+
   *  +---+
   *  | 1 |
   *  +---+
   */
  it("三个直线矩形", function() {
    const r1 = [1, 1, 1, 1];
    const r2 = [1, 4, 1, 1];
    const r3 = [1, 7, 1, 1];
    const res = naviix([r1, r2, r3]);
    assert.equal(res.get(r1).up.id, r2);
    assert.equal(res.get(r3).down.id, r2);
  });

  /**
   *        +-------+
   *  +---+ | +---+ |
   *  | 1 | | | 2 | |
   *  +---+ | +---+ |
   *        | +---+ |
   *        +-| 3 |-+
   *        . +---+ .
   *        . +---+ .
   *        . | 4 | .
   *        . +---+ .
   *        . . . . .
   */
  it("子区中视图外的矩形", function() {
    const s1 = [1, 8, 1, 1];
    const s2 = [5, 8, 1, 1];
    const s3 = [5, 5, 1, 1];
    const s4 = [5, 2, 1, 1];
    const w = [5, 7.5, 2, 2.5];
    const res = naviix({
      "locs": [s1],
      "subs": {
        "locs": [s2, s3, s4],
        "wrap": w,
      }
    });
    const { left: l4, up: u4, right: r4, down: d4 } = res.get(s4);
    const { left: lw, up: uw, right: rw, down: dw } = res.get(w);
    assert.equal(l4.id, s1);
    assert.equal(u4.id, s3);
    assert.equal(r4, undefined);
    assert.equal(d4, undefined);
    assert.equal(lw.id, s1);
  });

  it("准确导航到可滚动元素", function() {
    const s1 = [1, 8, 1, 1];
    const s2 = [5, 8, 1, 1];
    const s3 = [5, 5, 1, 1];
    const s4 = [5, 2, 1, 1];
    const w = [5, 7.5, 2, 2.5];
    const { scroll, left, up, right, down } = naviix({
      "locs": [s1],
      "subs": {
        "locs": [s2, s3, s4],
        "wrap": w,
      }
    }, { scroll: true });
    assert.equal(right(s1).id, s2);
    assert.equal(left(s2).id, s1);
    scroll([
      { id: s2, loc: [5, 8 + 3, 1, 1] },
      { id: s3, loc: [5, 5 + 3, 1, 1] },
      { id: s4, loc: [5, 2 + 3, 1, 1] }]); // 向上滚动 3 单位
    assert.equal(right(s1).id, s3);
  });

  /**
   *        +-------+ +-------+
   *  +---+ | +---+ | | +---+ |
   *  | 1 | | | 2 | | | | 5 | |
   *  +---+ | +---+ | | +---+ |
   *        | +---+ | | +---+ |
   *        +-| 3 |-+ +-| 6 |-+
   *        . +---+ . . +---+ .
   *        . +---+ . . +---+ .
   *        . | 4 | . . | 7 | .
   *        . +---+ . . +---+ .
   *        . . . . . . . . . .
   */
  it("准确导航到可滚动元素 2", function() {
    const r1 = [1, 8, 1, 1];
    const r2 = [5, 8, 1, 1];
    const r3 = [5, 5, 1, 1];
    const r4 = [5, 2, 1, 1];
    const w = [5, 7.5, 2, 2.5];
    const r5 = [10, 8, 1, 1];
    const r6 = [10, 5, 1, 1];
    const r7 = [10, 2, 1, 1];
    const w2 = [10, 7.5, 2, 2.5];
    const { scroll, left, up, right, down } = naviix({
      "locs": [r1],
      "subs": [{
        "locs": [r2, r3, r4],
        "wrap": w,
      }, {
        "locs": [r5, r6, r7],
        "wrap": w2,
      }]
    }, { scroll: true });
    assert.equal(right(r1).id, r2);
    scroll([
      { id: r5, loc: [10, 8 + 3, 1, 1] },
      { id: r6, loc: [10, 5 + 3, 1, 1] },
      { id: r7, loc: [10, 2 + 3, 1, 1] }]); // 向上滚动 3 单位
    assert.equal(right(r2).id, r6);
    assert.equal(left(r6).id, r2);
    assert.equal(right(r2).id, r6);
    scroll([
      { id: r2, loc: [5, 8 + 3, 1, 1] },
      { id: r3, loc: [5, 5 + 3, 1, 1] },
      { id: r4, loc: [5, 2 + 3, 1, 1] }]); // 向上滚动 3 单位
    assert.equal(left(r6).id, r3);
  });

  /**
   *    +---+  +---+  +---+  +---+
   *    | 1 |  | 2 |  | 3 |  | 4 |
   *    +---+  +---+  +---+  +---+
   *  +---------------------+
   *  | +---+  +---+  +---+ |
   *  | | 5 |  | 6 |  | 7 | |
   *  | +---+  +---+  +---+ |
   *  +---------------------+
   *  +---------------------+
   *  | +---+  +---+  +---+ |
   *  | | 8 |  | 9 |  | 10| |
   *  | +---+  +---+  +---+ |
   *  +---------------------+
   */
  it("记忆导航", function() {
    const s1 = [3, 12, 1, 1];
    const s2 = [6, 12, 1, 1];
    const s3 = [9, 12, 1, 1];
    const s4 = [12, 12, 1, 1];
    const s5 = [3, 8, 1, 1];
    const s6 = [6, 8, 1, 1];
    const s7 = [9, 8, 1, 1];
    const s8 = [3, 3, 1, 1];
    const s9 = [6, 3, 1, 1];
    const s10 = [9, 3, 1, 1];
    const w1 = [6, 8, 5, 2];
    const w2 = [6, 3, 5, 2];

    const { left, up, right, down } = naviix({
      "locs": [s1, s2, s3, s4],
      "subs": [{
        "locs": [s5, s6, s7],
        "wrap": w1,
      }, {
        "locs": [s8, s9, s10],
        "wrap": w2,
      }]
    }, { memo: true });

    assert.equal(right(s1).id, s2);
    assert.equal(right(s2).id, s3);
    assert.equal(down(s3).id, s5);
    assert.equal(up(s5).id, s3);
    assert.equal(left(s3).id, s2);
    assert.equal(down(s2).id, s5);
    assert.equal(right(s5).id, s6);
    assert.equal(right(s6).id, s7);
    assert.equal(down(s7).id, s8);
    assert.equal(right(s8).id, s9);
    assert.equal(up(s9).id, s7);
    assert.equal(left(s7).id, s6);
    assert.equal(left(s6).id, s5);
    assert.equal(down(s5).id, s9);
    assert.equal(up(s9).id, s5);
    assert.equal(up(s5).id, s2);
  });

  /**
   *  +-------------+ +-------------+
   *  | +---+ +---+ | | +---+ +---+ | +---+
   *  | | 7 | | 8 | | | | 9 | |10 | | |11 |
   *  | +---+ +---+ | | +---+ +---+ | +---+
   *  +-------------+ +-------------+
   *  +-------------------------------------+
   *  | +---+ +---+ +---+ +---+ +---+ +---+ |
   *  | | 1 | | 2 | | 3 | | 4 | | 5 | | 6 | |
   *  | +---+ +---+ +---+ +---+ +---+ +---+ |
   *  +-------------------------------------+
   */
  it("记忆导航 2", function() {
    const w1 = [10.5, 3, 9.5, 2];
    const r1 = [3, 3, 1, 1];
    const r2 = [6, 3, 1, 1];
    const r3 = [9, 3, 1, 1];
    const r4 = [12, 3, 1, 1];
    const r5 = [15, 3, 1, 1];
    const r6 = [18, 3, 1, 1];
    const w2 = [4.5, 8, 3.5, 2];
    const r7 = [3, 8, 1, 1];
    const r8 = [6, 8, 1, 1];
    const w3 = [12.5, 8, 3.5, 2];
    const r9 = [11, 8, 1, 1];
    const r10 = [14, 8, 1, 1];
    const r11 = [18, 8, 1, 1];
    const { left, up, right, down } = naviix({
      "locs": [r11],
      "subs": [{
        "locs": [r1, r2, r3, r4, r5, r6],
        "wrap": w1,
      }, {
        "locs": [r7, r8],
        "wrap": w2,
      }, {
        "locs": [r9, r10],
        "wrap": w3,
      }]
    }, { memo: true });
    assert.equal(left(r11).id, r9);
    assert.equal(down(r9).id, r1);
    assert.equal(right(r1).id, r2);
    assert.equal(right(r2).id, r3);
    assert.equal(up(r3).id, r9);
    assert.equal(left(r9).id, r7);
    assert.equal(right(r7).id, r8);
    assert.equal(down(r8).id, r3);
    assert.equal(right(r3).id, r4);
    assert.equal(up(r4).id, r8);
    assert.equal(right(r8).id, r9);
    assert.equal(right(r9).id, r10);
    assert.equal(right(r10).id, r11);
    assert.equal(down(r11).id, r4);
    assert.equal(right(r4).id, r5);
    assert.equal(up(r5).id, r11);
  });

  /**
   *        +-------+             +-------+
   *  +---+ | +---+ |       +---+ | +---+ |
   *  |>1<| | | 3 | |       | 1 | | | 5 | |
   *  +---+ | +---+ | --->  +---+ | +---+ |
   *  +---+ | +---+ |       +---+ | +---+ |
   *  | 2 | | | 4 | |       |>2<| | | 6 | |
   *  +---+ | +---+ |       +---+ | +---+ |
   *        +-------+             +-------+
   */
  it("更新（记忆导航）", function() {
    const r1 = [2, 6, 1, 1];
    const r2 = [2, 3, 1, 1];
    const w = [6, 4.5, 2, 3.5];
    const r3 = { id: "r3", loc: [6, 6, 1, 1] };
    const r4 = { id: "r4", loc: [6, 3, 1, 1] };
    const r5 = { id: "r5", loc: [6, 6, 1, 1] };
    const r6 = { id: "r6", loc: [6, 3, 1, 1] };

    const { left, up, right, down, update } = naviix({
      "locs": [r1, r2],
      "subs": {
        "locs": [r3, r4],
        "wrap": w,
      }
    }, { memo: true });

    assert.equal(right(r1).id, "r3");
    assert.equal(down("r3").id, "r4");
    assert.equal(left("r4").id, r1);
    assert.equal(down(r1).id, r2);
    update(w, { locs: [r5, r6], wrap: w });
    assert.equal(right(r2).id, "r5");
    assert.equal(down("r5").id, "r6");
    assert.equal(left("r6").id, r2);
    assert.equal(up(r2).id, r1);
    assert.equal(right(r1).id, "r6");
  });

  /**
   *   +-----------+
   *   |     1     |
   *   |           |
   *   +-----------+
   * +---+ +---+ +---+
   * | 2 | | 3 | | 4 |
   * +---+ +---+ +---+
   */
  it("整体导航", function() {
    const r2 = [1, 1, 1, 1];
    const r3 = [4, 1, 1, 1];
    const r4 = [7, 1, 1, 1];
    const r1 = [4, 5, 3, 1];
    const res = naviix([r1, r2, r3, r4]);
    assert.equal(res.get(r1).down.id, r3);
  });

  it.only("循环", function() {
    const r1 = [1, 1, 1, 1];
    const r2 = [4, 1, 1, 1];
    const r3 = [7, 1, 1, 1];

    const res = naviix({ locs: [r1, r2, r3], loop: "row" });
    assert.equal(res.get(r1).left.id, r3);
    assert.equal(res.get(r3).right.id, r1);
    assert.equal(res.get(r1).up, undefined);
    assert.equal(res.get(r3).down, undefined);

    const { left, right } = naviix({ locs: [r1, r2, r3], loop: "row" }, { scroll: true });
    assert.equal(left(r1).id, r3);
    assert.equal(right(r3).id, r1);

    const r4 = [5, 8, 1, 1];
    const r5 = [5, 5, 1, 1];
    const r6 = [5, 2, 1, 1];

    const { up, down } = naviix({ locs: [r4, r5, r6], loop: "col" }, { scroll: true });
    assert.equal(up(r4).id, r6);
    assert.equal(down(r6).id, r4);
  });

}); 

