# naviix

<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg" alt="996.icu" align="right"></a>

naviix 可以辅助实现键盘的方向键聚焦导航。输入元素的坐标和尺寸，naviix 将输出每个元素的上、下、左、右方向上的相邻元素。

> 查看具体的使用效果，请访问 naviix 线上的🎵音乐主题范例：[naviix music](https://wswmsword.github.io/examples/naviix-music/)。


## 安装

使用 npm 安装最新版本（yarn 则是 `yarn add naviix`）：

```bash
npm install naviix
```

## 使用

格式：
```javascript
const res = naviix(squares);
```

范例：
```javascript
import fx from "naviix";
const s1 = [1, 1, 1, 1];
const s2 = [4, 1, 1, 1];
const fxMap = fx([s1, s2]);
const s1Right = fxMap.get(s1).right;
const s2Left = fxMap.get(s2).left;
```

### 参数

- `squares`，数组或对象，当所有矩形在同一平面中时选择数组格式，当存在例如可滚动区域的子区时选择对象格式，下面是两种输入格式范例。

数组：
```json
[
  { "id": "s1", "loc": [1, 1, 1, 1] },
  { "id": "s2", "loc": [4, 1, 1, 1] }
]
```

> 上面的简写形式是 `[[1, 1, 1, 1], [4, 1, 1, 1]]`，这样忽略 `id` 只剩坐标信息后，naviix 会统一规范为上面有 `id` 的格式，其中 `id` 会被填充为简写形式中的坐标尺寸数组。

对象：
```json
{
  "locs": [{ "id": "s1", "loc": [1, 5, 1, 1] }],
  "subs": {
    "locs": [
      { "id": "s2", "loc": [5, 1, 1, 1] },
      { "id": "s3", "loc": [5, 4, 1, 1] }
    ],
    "wrap": { "id": "w", "loc": [5, 3.5, 2, 3.5] },
  }
}
```

`loc` 是一个包含 4 个数字元素的数组，前两个数字表示矩形的中心坐标，后两个数字表示中心距离竖向与横向边框的距离。`id` 作为一个唯一值代表了各个矩形，可以是任何值，方便在返回值中找到某个元素，当忽略 `id` 时，naviix 会主动将 `loc` 填充为 `id`。

### 返回值

返回值是一个 `Map`，`Map` 的键是输入参数中的 `id`，值是一个对象，对象包含了 `up`、`right`、`down`、`left` 四个属性，属性值为 `undefined` 表示该方向没有相邻矩形，否则值是一个形如 `{ id: "", loc: [] }` 的对象。

> 输入参数中，可以将 `id` 设置为 DOM 对象，方便在返回值中操作。例如 `resMap.get(btn).right?.id.focus()`。

## 单元测试与参与开发

```bash
npm install
npm run test
```

修改源码后，编写并执行单元测试，验证是否输出了预期的结果。

一起开发，让程序的变量命名更合适、性能和功能更好。

## CHANGELOG

查看[更新日志](./CHANGELOG.md)。

## 版本规则

查看[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)。

## 协议

查看 [MPL-2.0 License](./LICENSE)。

## 支持与赞助

请随意 Issue、PR 和 Star，您也可以支付该项目，支付金额由您从该项目中获得的收益自行决定。

<details>
<summary>展开查看用于微信支付和支付宝支付的二维码。</summary>

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

## 其它

相关链接：
- [CSS Spatial Navigation Level 1](https://drafts.csswg.org/css-nav-1/)，W3C 空间导航草案
- [WICG/spatial-navigation](https://github.com/WICG/spatial-navigation)，WICG GitHub 仓库，提供在线范例和空间导航 polyfill
- [TV Spatial Navigation](https://engineering.atspotify.com/2023/05/tv-spatial-navigation)，Spotify 的空间导航介绍