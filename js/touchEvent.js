const SWIPE_DISTANCE = 30 //移动30px之后才认为swipe事件
const SWIPE_TIME = 500 //swipe最大经历时间
var point_start, // 点击起始坐标
point_end, // 点击结束坐标
time_start, // 点击开始时间
time_end // 点击接受时间

function touchEvent() {
    var touchPad = $('table')
    var startEv, moveEv, endEv
    if("ontouchstart" in window) { // 如果存在touch事件，为移动端
        startEv = "touchstart"
        moveEv = "touchmove"
        endEv = "touchend"
    } else { // 否则为pc端，使用mouse事件
        startEv = "mousedown"
        moveEv = "mousemove"
        endEv = "mouseup"
    }
    touchPad.addEventListener(startEv, startHandler)
    touchPad.addEventListener(moveEv, moveHandler)
    touchPad.addEventListener(endEv, endHandler)
}

function getTouchPos (e) { // 获取点击位置坐标
    var touches = e.touches
    if(touches && touches[0]) {
        return {
            x: touches[0].clientX,
            y: touches[0].clientY
        }
    } else {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }
}

function getDist (p1,p2) { // 获取两点之间距离
    if(!p1 || !p2) return 0
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
}

function getAngel(p1,p2) { // 获取两点之间角度
    // 获取两点之间弧度
    var rad = Math.atan2(p1.y - p2.y, p2.x - p1.x)
    // 弧度 * (180 / π） = 度数
    return rad * 180 / Math.PI
}

function getDir(p1,p2) { // 获取手势方向
    var angle = getAngel(p1,p2)
    if(angle < 45 && angle > -45) return "r";
    if(angle >= 45 && angle < 135) return "u";
    if(angle >= 135 || angle < -135) return "l";
    if(angle >= -135 && angle <= -45) return "d";
}

function startHandler (e) {
    point_start = getTouchPos(e)
    time_start = new Date()
}

function moveHandler (e) {
    // 兼容pc端，所以在move中获取结束坐标
    point_end = getTouchPos(e)
    // 避免andriod系统touch事件bug
    e.preventDefault()
}

function endHandler (e) {
    time_end = new Date()
    if(getDist(point_start,point_end) > SWIPE_DISTANCE && time_end - time_start < SWIPE_TIME) {
        var dir = getDir(point_start, point_end)
        var cur = $('.man').id.split('_')
        var row = cur[0]
        var col = cur[1]
        var rows = $('table').rows.length
        var cols = $('table').rows[0].cells.length
        switch (dir) {
            case 'l': // 左 
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
            case 'u': // 上
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
            case 'r': // 右
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
            case 'd': // 下
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
        move(cur, [row, col], dir)
    }
}

