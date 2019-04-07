function move(cur, next, direction) { // cur当前点 next下一点 direction代表移动方向
    var row = next[0]
    var col = next[1]
    if ($$(cur[0] + '_' + cur[1]).dataset.class == 'target') { // 人可以走到地面或目标点上，离开后要恢复原有样式
        $$(cur[0] + '_' + cur[1]).className = 'target'
    } else {
        $$(cur[0] + '_' + cur[1]).className = 'ground'
    }
    // 如果下一个点为地面或目标点，移动后要改变样式
    if ($$(next[0] + '_' + next[1]).className == 'ground' || $$(next[0] + '_' + next[1]).className == 'target') {
        $$(next[0] + '_' + next[1]).className = 'man'
    } else { // 如果下一个点为箱子，要根据移动方向来判断箱子的对应方向的相邻点
        switch (direction) {
            case 'u':
                row--
                break
            case 'r':
                col++
                break
            case 'd':
                row++
                break
            case 'l':
                col--
                break
        }
        if ($$(row + '_' + col).className == 'ground') { // 如果箱子的下一个点为地面
            $$(row + '_' + col).className = 'real' // 将下一个点改变为箱子
            $$(next[0] + '_' + next[1]).className = 'man' // 箱子所在位置改变为人
        } else { // 不为地点那就为目标点
            $$(row + '_' + col).className = 'arrive' // 将下一个点改变为箱子到达
            $$(next[0] + '_' + next[1]).className = 'man' // 箱子所在位置改变为人
        }
    }
    setTimeout(function () {
        isWin()
    }, 1000)
}

function isWin() { // 是否过关
    if (!$('.real')) { // 当不存在类名为real的元素时，即箱子全部到达目的地后，表示过关
        if ($('.level span').innerHTML == '15') {
            alert('恭喜你通关全部关卡，这个游戏已经难不倒你了！')
            isWin = function () {}
        } else {
            alert('恭喜你通关了, 再接再励，攻克下一关')
            var level = parseInt($('.level span').innerHTML)
            initMap(gameData[level])
            $('.level').innerHTML = 'level <span>' + (level + 1) + '</span>'
            $('select').value = '第' + (level + 1) + '关'
        }
    }
}