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
    touchEvent()
}