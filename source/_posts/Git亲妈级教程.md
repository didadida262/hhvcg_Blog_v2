---
title: Git亲妈级教程
category: 前端气宗专栏
date: 2023-08-03 11:20:52
tags:
---

- 一般的代码提交流程：
```javascript
git add .
git commit -m 'message'
git push
```
提交到自己的分支，发起合并到dev分支的merge交由负责人审查合并代码。
<img src="/img/git.jpg" alt="图片描述" width="500">

- 克隆分支并同步远端
```javascript
git checkout -b '分支名'
git push origin '分支名'
```

- 查看哪些文件被修改及修改的内容
```javascript
git diff --cached
```

- 本地仓库与远程主机仓库关联起来
```javascript
git remote add origin "https://github.com/kinglion580/shiyanlou.git"
```

- 如何在本地给远程仓库创建一个分支？（就是远程仓库没有该分支）
首先需要在本地新建一个分支： git checkout -b 分支名
同步到远程：git push --set-upstream origin 分支名
然后通过命令直接push到远程：git push

- 如何在本地删除远程分支
```javascript
// 删除本地分支
git branch -d 分支名

// 删除远程分支
git push origin --delete 分支名

// 本地分支和远程同步
git remote update upstream --prune
```

- 有时候，我们在自己分支上写的好好的，突然需要切换到别的分支，而此时，我们又不想commit，咋办？
**git stash,可以理解为暂时保存，切换到其他分支，干完后，回到自己的分支,git stash pop，恢复**

- 如果代码写到一半，突然发现写错分支，该如何？
**同7类似，即，执行暂存git stash,但是随后切换到正确分支，执行git stash pop,即将自己的一波操作释放到正确的分支上了**

- 但我修改了一处小bug提交时，不想写个message做新的commit,转而合并最近一次提交，该如何？
**git commit --amend,包您满意，实质就是，覆盖最近一次提交**

- 当自己在主分支写测试代码后，没有add 和commit的情况下，想放弃在该分支上的所有修改切换回自己的分支，此种场景下，该如何？
```javascript
// 撤销对所有已修改但未提交的文件的修改，但不包括新增的文件
git checkout .
// 撤销对指定文件的修改，[filename]为文件名
git checkout [filename] 
```
- 撤销add
```javascript
// 撤销全部
git reset HEAD .
// 撤销某文件或者文件夹
git reset HEAD -filename
```

- 撤销commit
```javascript
git reset --soft HEAD~1
```

- 其他常用操作
```javascript
// 回退
git reset --hard git版本号 
git push -f
// 查看当前分支数
git branch -a
// 合并提交记录
git rebase -i HEAD~分枝数
git push -f


// 查看本地的git配置信息
git config --global -l
git config --list 查看所有信息
```

- cherry-pic合并指定分支的某个提交
<img src="/img/cherry.jpg" alt="图片描述" width="500">

- 团队协作相关
在公司的开发过程中，一个项目的至少有三个分支。master（线上-在跑的代码）、stagging（类似于测试）、dev（开发分支）。**大体分成两种工作方式。**
1. 所有的开发人员，在项目中都有自己的dev分支，通常命名dev_dadadad.....。每次开发完毕后，发起合并请求，负责人合并到stagging分支进行测试。
2. 开发人员需要fork一下项目，相当于创建一个自己私人的项目。克隆到本地后做的第一件事情，就是关联主项目。设置origin和upstream仓库地址，分别是自己的项目和主项目的地址。
```javascript
git remote add upstream + 主项目代码
```
这样，当我们通过git remote -v命令，在控制台打印当前fork项目的远程信息时，会出现下面所示：
```javascript
origin  fork地址 (fetch)
origin  fork地址 (push)
upstream        主项目地址(fetch)
upstream        主项目地址(push)
```
每次开发前，通过如下命令拉取并合并主项目dev分支的最新代码：
```javascript
git pull upstream dev
```
**注意，上面的命令做了两件事，第一，拉去目标分支代码，第二，自动合并到当前所在分支。fetch少了一个自动合并的操作**

rebase和merge的区别：
从提交记录来看，merge会多一个合并的提交记录。完毕


