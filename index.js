function $(selector) { // 将原生方法抽象一下
    return document.querySelector(selector)
}

function $$(selector) { // 将原生方法抽象一下
    return document.getElementById(selector)
}

window.onload = function () {
    main()
}

function main() { // 主函数
    initMap(gameData[0]) // 初始化第一关数据
    var select = $('select')
    var html = ''
    for (var i = 0; i < 15; i++) {
        html += '<option>第' + (i + 1) + '关</option>'
    }
    select.innerHTML = html
    select.onchange = function () { // 选择关卡
        var level = parseInt(this.value.substring(1, 3))
        initMap(gameData[level - 1])
        $('.level').innerHTML = 'level <span>' + level + '</span>'
        this.blur()
    }
    $('button').onclick = function () { // 重试
        initMap(gameData[parseInt(select.value.substring(1, 3)) - 1])
    }
    keyEvent()
}

function initMap(data) { // 初始化地图
    var html = ''
    for (var i = 0; i < data.size.height; i++) {
        html += '<tr>'
        for (var j = 0; j < data.size.width; j++) {
            html += '<td id=' + i + '_' + j + '></td>'
        }
        html += '</tr>'
    }
    $('table').innerHTML = html
    setMapClass(data.map)
}

function setMapClass(data) { // 给每一个格子赋上一个类名
    keys = {
        05: "wall", // 墙
        10: "ground", // 地板
        20: "target", // 目标点
        60: 'man', // 人
        80: "real", // 箱子
    }
    data.forEach(function (arr, i) {
        arr.forEach(function (item, j) {
            $$(i + '_' + j).className = keys[item]
            $$(i + '_' + j).dataset.class = keys[item]
        })
    })
}

function keyEvent() { // 监控键盘事件
    document.onkeydown = function (event) {
        var cur = $('.man').id.split('_')
        var row = cur[0]
        var col = cur[1]
        var rows = $('table').rows.length
        var cols = $('table').rows[0].cells.length
        var direction
        switch (event.keyCode) {
            case 37: // 左 
                direction = 'l'
                col--
                if (col < 0 || $$(row + '_' + col).className == 'wall') { // 左边为墙时，不能移动
                    return
                } // 左边为箱子或左边为到达目标的箱子时，可以移动 
                else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col--
                    // 超出边界、左边为墙或左边为另一个箱子时，不能移动
                    if (col < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return
                    }
                    col++
                }
                break
            case 38: // 上
                direction = 'u'
                row--
                if (row < 0 || $$(row + '_' + col).className == 'wall') {
                    return
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row--
                    if (row < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return
                    }
                    row++
                }
                break
            case 39: // 右
                direction = 'r'
                col++
                if (col >= cols || $$(row + '_' + col).className == 'wall') {
                    return
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col++
                    if (col >= cols || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return
                    }
                    col--
                }
                break
            case 40: // 下
                direction = 'd'
                row++
                if (row >= rows || $$(row + '_' + col).className == 'wall') {
                    return
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row++
                    if (row >= rows || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'real') {
                        return
                    }
                    row--
                }
                break
            default:
                break
        }
        move(cur, [row, col], direction)
    }
}

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
