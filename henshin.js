var ClickNum = 0;
var SE_authorize = document.getElementById("Sound_Zero-One:2");
var SE_standby = document.getElementById("Sound_Zero-One:standby");

var onStandBy = false;
var onAuthorize = false;

//videoタグを取得
var video = document.getElementById("video");
//取得するメディア情報を指定
var medias = { audio: false, video: {} };
//medias.video.facingMode = { exact: "user" };
medias.video.facingMode = { exact: "environment" };
document.getElementById("str").textContent = "environment";

//getUserMediaを用いて、webカメラの映像を取得
navigator.mediaDevices.getUserMedia(medias).then(
    function (stream) {
        //videoタグのソースにwebカメラの映像を指定
        video.srcObject = stream;

    }
).catch(
    function (err) {
        //カメラの許可がされなかった場合にエラー
        window.alert("not allowed to use camera");
    }
);

var canvas = document.getElementById("canvas");
//ビデオのメタデータが読み込まれるまで待つ
video.addEventListener("loadedmetadata", function (e) {
    //canvasにカメラの映像のサイズを設定
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    //getContextで描画先を取得
    var ctx = canvas.getContext("2d");
    //毎フレームの実行処理
    setInterval(function (e) {

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imagedata.data;
        var allPicColor = 0;
        for (var i = 0; i < canvas.height; i++) {
            for (var j = 0; j < canvas.width; j++) {
                var index = (i * canvas.width + j) * 4;
                //元のピクセルカラーを取得
                var r = data[index + 0];
                var g = data[index + 1];
                var b = data[index + 2];

                //RGBをグレースケールに変換
                var color = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
                data[index + 0] = color;
                data[index + 1] = color;
                data[index + 2] = color;
                allPicColor += color;
            }
        }
        var val = allPicColor / (canvas.height * canvas.width);
        document.getElementById("debug").textContent = val;
        if (val > 50) {
            onAuthorize = false;
            document.getElementById("debug_bool").textContent = "false";
        }
        else {
            if (!onAuthorize) {
                onAuthorize = true;
                ring();
            }
            document.getElementById("debug_bool").textContent = "true";
        }
        ctx.putImageData(imagedata, 0, 0, 0, 0, canvas.width, canvas.height);
    }, 33);
});



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
        //document.getElementById("Sound_Zero-One:standby").play();
    }
    else {
        document.getElementById("Sound_Zero-One:" + ClickNum).play();
    }
    ClickNum++;
}

SE_authorize.addEventListener("play", function () {
    //SE_standby.play();
    onStandBy = true;
}, false);

function SEstandbyStop() {
    SE_authorize.pause();
    SE_authorize.currentTime = 0;
    onStandBy = false;
}


