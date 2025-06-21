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
    assert.equal(res.get(s1).top, undefined);
    assert.equal(res.get(s1).bottom, undefined);
    assert.equal(res.get(s2).right, undefined);
    assert.equal(res.get(s2).top, undefined);
    assert.equal(res.get(s2).bottom, undefined);
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
}); 

