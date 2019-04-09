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
    $('.level').innerHTML = data.name
    setMapClass(data.map)
}

function setMapClass(data) { // 给每一个格子赋上一个类名
    keys = {
        05: "wall", // 墙
        10: "ground", // 地板
        20: "target", // 目标点
        60: 'man', // 人
        80: "box", // 箱子
    }
    data.forEach(function (arr, i) {
        arr.forEach(function (item, j) {
            $$(i + '_' + j).className = keys[item]
            $$(i + '_' + j).dataset.class = keys[item]
        })
    })
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
            $$(row + '_' + col).className = 'box' // 将下一个点改变为箱子
            $$(next[0] + '_' + next[1]).className = 'man' // 箱子所在位置改变为人
        } else { // 不为地点那就为目标点
            $$(row + '_' + col).className = 'arrive' // 将下一个点改变为箱子到达
            $$(next[0] + '_' + next[1]).className = 'man' // 箱子所在位置改变为人
        }
    }
    setTimeout(function () {
        isWin()
        isLose()
    }, 1000)
}

function isWin() { // 是否过关
    if (!$('.box')) { // 当不存在类名为box的元素时，即箱子全部到达目的地后，表示过关
        if ($('.level').innerHTML == '15') {
            alert('恭喜你通关全部关卡，这个游戏已经难不倒你了！')
            isWin = function () {}
        } else {
            alert('恭喜你通关了, 再接再励，攻克下一关')
            var level = parseInt($('.level').innerHTML.split(" ")[1])
            initMap(gameData[level])
            $('select').value = '第' + (level + 1) + '关'
        }
    }
}

function isLose() {
    var boxes = document.getElementsByClassName("box")
    var len = boxes.length
    for(var i = 0; i < len; i++){
        var cur = boxes[i].id.split("_")
        var row = cur[0]
        var col = cur[1]
        if (!canMove(row, col)) {
            alert("失败了，再试一次吧！")
            var level = parseInt($('.level').innerHTML.split(" ")[1])
            initMap(gameData[level - 1])
            $('select').value = '第' + (level) + '关'
            break
        }
    }
}

function canMove(row, col) {
    row = parseInt(row)
    col = parseInt(col)
    var top = $$(row - 1 + '_' + col).className
    var left = $$(row + '_' + (col - 1)).className
    var right = $$(row + '_' + (col + 1)).className
    var bottom = $$(row + 1 + '_' + col).className
    if(top == 'wall' && (left == 'wall' || right == 'wall')) {
        return false
    }
    if(bottom == 'wall' && (left == 'wall' || right == 'wall')) {
        return false
    }
    return true
}