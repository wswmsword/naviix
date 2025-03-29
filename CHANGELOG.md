# Changelog
该文件记录项目的所有改动。

格式基于“[如何维护更新日志](https://keepachangelog.com/zh-CN/1.0.0/)”，
版本管理基于“[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)”。

## [1.0.4] - 2024-11-12

### Fixed

- 修复矫正 fixed 定位时，left 和 right 尺寸超过视图一半时的计算错误；
- 修复矫正定位的尺寸精度错误。

## [1.0.3] - 2023-12-16

- 跳过冲突的版本号。

## [1.0.0] - 2023-12-16

### Added

- 添加 `init`、`percentage`、`vw`、`clampVw`、`centre` 函数。