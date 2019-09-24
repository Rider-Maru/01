var ClickNum = 1;
var SE_authorize = document.getElementById("Sound_Zero-One:2");
var SE_standby = document.getElementById("Sound_Zero-One:standby");

var onStandBy = false;



// ========================================
// 効果音を鳴らす（★今回のメインはこれ★）
// ========================================
function ring() {
    document.getElementById("Sound_Zero-One:" + ClickNum).play();
    if (onStandBy) SEstandbyStop();
    ClickNum++;
}
SE_authorize.addEventListener("ended", function () {
    SE_standby.play();
    onStandBy = true;
}, false);

function SEstandbyStop() {
    SE_standby.pause();
}


