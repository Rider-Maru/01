var ClickNum = 0;
var AutorizeNum = 0;
var SE_authorize = document.getElementById("Sound_Zero-One:2");
var SE_progrise = document.getElementById("Sound_Zero-One:3");
var SE_standby = document.getElementById("Sound_Zero-One:standby");

var isPushKey = false;
var isAuthorizable = false;
var onStandBy = false;
var onAuthorize = false;


var threshold = 30;
//videoタグを取得
var video = document.getElementById("video");
//取得するメディア情報を指定
var medias = { audio: false, video: {} };
window.onload = function () {
    medias.video.facingMode = { exact: "environment" };
    //medias.video.facingMode = { exact: "user" };
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
}
var canvas = document.getElementById("canvas");
//ビデオのメタデータが読み込まれるまで待つ
video.addEventListener("loadedmetadata", function (e) {
    //canvasにカメラの映像のサイズを設定
    canvas.width = video.videoWidth/3;
    canvas.height = video.videoHeight/3;

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
        JudgeAutorize(val);
        ctx.putImageData(imagedata, 0, 0, 0, 0, canvas.width, canvas.height);
    }, 33);
});


function JudgeAutorize(value) {
    if (val > threshold) {
        onAuthorize = false;
        document.getElementById("debug_bool").textContent = "false";
    }
    else {
        if (!onAuthorize) {
            onAuthorize = true;
            ringByCamera();
        }
        document.getElementById("debug_bool").textContent = "true";
    }
}

// ========================================
// 効果音を鳴らす（★今回のメインはこれ★）
// ========================================
function ring() {
    SEstandbyStop();
    if (ClickNum == 0) {
        for (var i = 1; i < 4; i++) {
            document.getElementById("Sound_Zero-One:" + i).load();
        }
        //document.getElementById("Sound_Zero-One:standby").play();
        ClickNum = 1;
    }
    else {
        isAutorizable = true;
        AutorizeNum = 2;
        playSECallKey();
    }
    //ClickNum++;
}


function ringByCamera() {
    if (AutorizeNum < 4 && isAutorizable) {
        if (onStandBy) SEstandbyStop();
        if (AutorizeNum == 2) onStandBy = true;
        playSE(AutorizeNum - 1);
        //SE_authorize.currentTime = 1;

        isAutorizable = false;
        setTimeout(function () {
            isAutorizable = true;
        }, 3000)
        AutorizeNum++;
    }
}


SE_authorize.addEventListener("play", function () {
    //SE_standby.play();
    onStandBy = true;
}, false);

function SEstandbyStop() {
    
    //SE_authorize.pause();
    //SE_authorize.currentTime = 0;
    //SE_progrise.pause();
    //SE_progrise.currentTime = 0;
    onStandBy = false;
    stopSE();
}


//-----------------------------------------------------------

