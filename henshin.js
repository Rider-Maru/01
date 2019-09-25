var ClickNum = 0;
var SE_authorize = document.getElementById("Sound_Zero-One:2");
var SE_standby = document.getElementById("Sound_Zero-One:standby");

var onStandBy = false;



// ========================================
// 効果音を鳴らす（★今回のメインはこれ★）
// ========================================
function ring() {
    if (onStandBy) SEstandbyStop();
    if (ClickNum == 4) ClickNum = 1;
    if (ClickNum == 0) {
        for (var i = 1; i < 4; i++) {
            document.getElementById("Sound_Zero-One:" + i).play();
        }
    }
    else {
        document.getElementById("Sound_Zero-One:" + ClickNum).play();
    }
    ClickNum++;
}
SE_authorize.addEventListener("ended", function () {
    SE_standby.play();
    onStandBy = true;
}, false);

function SEstandbyStop() {
    SE_standby.pause();
}


