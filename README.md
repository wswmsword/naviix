# naviix

<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg" alt="996.icu" align="right"></a>

naviix 可以辅助实现键盘的空间导航（方向键聚焦导航）。输入[元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)（或坐标尺寸），输出每个元素的上、下、左、右方向上的相邻元素。具体效果请访问一个线上🎵音乐主题范例：[naviix music](https://wswmsword.github.io/examples/navix-music/)。

<details>
<summary>浏览器中，可以打开“短暂地突出显示焦点对象”无障碍功能，来可视化观察键盘导航的过程。</summary>

Chrome 中，在地址栏输入 `chrome://settings/accessibility`，或者在“设置 -> 无障碍”中，可以设置“短暂地突出显示焦点对象”。其它浏览器也许有类似的设定。

![Chrome Outer Row](https://github.com/wswmsword/hanav/blob/main/images/chrome-outer-row.png)

</details>

## 安装和使用

使用 npm 安装最新版本（yarn 则是 `yarn add naviix`）：

```bash
npm install naviix
```

使用格式：
```javascript
const res = naviix(rectangles);
```

具体范例：
```javascript
import navix from "naviix";
const r1 = document.getElementById("r1"); // 矩形 r1 元素（假设坐标尺寸为 [1, 1, 1, 1]）
const r2 = [4, 1, 1, 1]; // 矩形 r2 的坐标尺寸
const nxMap = navix([r1, r2]);
const r1Right = nxMap.get(r1).right; // r1 的右方元素
const r2Left = nxMap.get(r2).left; // r2 的左方元素
```

### 参数

- `rectangles`，数组或对象，代表所有矩形，当矩形都固定在同一平面中时，选择数组格式，否则选择对象。

数组格式范例：
```javascript
const rectangles = [
  document.getElementById("r1"),
  { "id": "r2", "loc": [4, 1, 1, 1] }
]
```

> 简写形式为 `[document.getElementById("r1"), [4, 1, 1, 1]]`。

- `loc`，[元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)或坐标尺寸数字数组，数组前两个数字表示矩形中心坐标，第 3、4 个数字表示中心距离竖边与横边的距离，而元素会在内部被转为数字数组；
- `id` 作为唯一值代表了某个矩形，可以是任何值，当忽略 `id` 时，naviix 会主动将 `loc` 填充为 `id`。

<details>
<summary>
展开查看具有更多功能的对象格式范例，当有矩形存在滚动区域内时，选择对象格式。
</summary>

```json
{
  "locs": [{ "id": "s1", "loc": [1, 5, 1, 1] }],
  "subs": {
    "locs": [
      { "id": "s2", "loc": [5, 1, 1, 1] },
      { "id": "s3", "loc": [5, 4, 1, 1] }
    ],
    "wrap": { "id": "w", "loc": [5, 3.5, 2, 3.5] }
  }
}
```

- 当包含 `subs` 子区时，`wrap` 是必须的，表示子区的包裹层的坐标尺寸信息，`wrap` 也可以是 Element 对象元素。

> 对象格式中，同样支持简写形式。

</details>



### 返回值

返回值是一个 `Map`，`Map` 的键是输入参数中的 `id`，值是一个包含 `up/right/down/left` 四个属性的对象，属性值为 `undefined` 表示该方向没有相邻矩形，否则值是一个形如 `{ id: "", loc: [] }` 的对象。

<details>
<summary>
输入参数中，可以将 id 设置为 DOM 对象，方便在返回值中操作。例如“resMap.get(btn).right?.id.focus()”。
</summary>

```javascript
const r1 = document.getElementById("r1"); // [1, 1, 1, 1]
const r2 = document.getElementById("r2");
const nxMap = navix([r1, {
  id: r2,
  loc: [4, 1, 1, 1]
}]);
nxMap.get(r1).right.id.focus(); // nxMap.get(r1).right.id === r2
```

上面代码块中，返回值 `nxMap` 的结构如下：

```
Map(2) {
  r1 => {
    up: undefined,
    right: { id: r2, loc: [4, 1, 1, 1] },
    down: undefined,
    left: undefined
  },
  r2 => {
    up: undefined,
    right: undefined,
    down: undefined,
    left: { id: r1, loc: [1, 1, 1, 1] }
  }
}
```

</details>


## 单元测试与参与开发

```bash
npm install
npm run test
```

参与开发，一起让程序的变量命名更合适、性能和功能更好。修改源码后，编写并执行相关[单元测试](./index.spec.js)，验证是否输出了预期的结果。项目中的原理文件（[how-it-works.md](./how-it-works.md)）也许能提供一定帮助。

## 支持与赞助

点亮星星、提出问题、请求合并来推动这个项目！

<details>
<summary>展开查看用于微信支付和支付宝支付的二维码。</summary>

您可以支付该项目，支付金额由您从该项目中获得的收益自行决定。

<table>
  <tr align="center">
    <td>微信支付</td>
    <td>支付宝支付</td>
  </tr>
	<tr>
		<td><img src="https://raw.githubusercontent.com/wswmsword/postcss-mobile-forever/main/images/wechat-pay.png" alt="Pay through WeChat" /></td>
		<td><img src="https://github.com/wswmsword/postcss-mobile-forever/raw/main/images/ali-pay.jpg" alt="Pay through AliPay" /></td>
	</tr>
</table>

</details>

## 日志、版本规则、协议和其它

相关资源：
- [CSS Spatial Navigation Level 1](https://drafts.csswg.org/css-nav-1/)，W3C 空间导航草案
- [WICG/spatial-navigation](https://github.com/WICG/spatial-navigation)，WICG GitHub 仓库，提供在线范例和空间导航 polyfill
- [TV Spatial Navigation](https://engineering.atspotify.com/2023/05/tv-spatial-navigation)，Spotify 的空间导航介绍
- [hanav](https://github.com/wswmsword/hanav)，支持空间导航的导航栏库
- [科技爱好者周刊（第 351 期）](https://www.ruanyifeng.com/blog/2025/06/weekly-issue-351.html)，本期的“工具”板块收录了 naviix

---

[Demo](https://wswmsword.github.io/examples/navix-music/) • [更新日志](./CHANGELOG.md) • [语义化版本 2.0.0](https://semver.org/lang/zh-CN/) • [MPL-2.0 License](./LICENSE)