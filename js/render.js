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