# Git 学习笔记

> 2026-09-07 学习记录

## 创建本地仓库的核心流程

```bash
mkdir 项目名 && cd 项目名
git init -b main        # 初始化仓库,主分支命名为 main
```

## 日常提交循环(背下来)

```bash
git add .               # 把改动放入暂存区
git commit -m "说明"    # 提交到本地仓库
git push                # 有远程仓库时才需要
```

## 关联 GitHub 远程仓库

方式一:先有远程,克隆下来(推荐新手)

```bash
git clone https://github.com/用户名/仓库名.git
```

方式二:先有本地,再关联远程

```bash
git remote add origin https://github.com/用户名/仓库名.git
git push -u origin main   # -u 建立追踪,以后直接 git push
```

## 常用查看命令

| 命令 | 作用 |
|------|------|
| `git status` | 查看工作区状态(改了什么、暂存了什么) |
| `git log --oneline` | 查看简洁提交历史 |
| `git log --oneline --graph` | 带分支图的提交历史 |
| `git diff` | 查看未暂存的具体改动 |

## 提交信息规范(Conventional Commits)

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档变更
- `chore:` 杂项(配置、构建等)
