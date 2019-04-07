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
                else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    col--
                    // 超出边界、左边为墙或左边为另一个箱子时，不能移动
                    if (col < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
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
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    row--
                    if (row < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
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
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    col++
                    if (col >= cols || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
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
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    row++
                    if (row >= rows || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
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