var soundArray = [];
var bufferListUp = [];
var nowplay;
    function BufferLoader(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }
    BufferLoader.prototype.loadBuffer = function (url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        var loader = this;
        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount == loader.urlList.length)
                        loader.onload(loader.bufferList);
                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        }
        request.onerror = function () {
            alert('BufferLoader: XHR error');
        }
        request.send();
    }
    BufferLoader.prototype.load = function () {
        for (var i = 0; i < this.urlList.length; ++i)
            this.loadBuffer(this.urlList[i], i);
    }
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    bufferLoader = new BufferLoader(
        context,
        [
            'audio/jump.mp3',
            'audio/authorizeANDstandby.mp3',
            'audio/progrise.mp3',
        ],
        finishedLoading
    );
    bufferLoader.load();
    function finishedLoading(bufferList) {
        //el = document.getElementsByClassName("sound");
        for (var i = 0; i < bufferList.length; i++) {
            var source = context.createBufferSource();
            source.buffer = bufferList[i];
            bufferListUp[i] = bufferList[i];
            source.connect(context.destination);
            soundArray.push(source);
        }
        /*
        for (let i = 0; i < el.length; i++) {
            el[i].addEventListener('click', function () {
                soundArray[i].start(0);
                soundArray[i] = context.createBufferSource();
                soundArray[i].buffer = bufferList[i];
                soundArray[i].connect(context.destination);
            });
        }
        */
}
function playSE(num) {
    nowplay = soundArray[num];
    nowplay.start(0);

    /*
    soundArray[num].start(0);
    soundArray[num] = context.createBufferSource();
    soundArray[num].buffer = bufferListUp[num];
    soundArray[num].connect(context.destination);
    */
}
function stopSE() {
    nowplay.stop();
    nowplay = context.createBufferSource();
    nowplay.buffer = bufferListUp[num];
    nowplay.connect(context.destination);
    //soundArray[1].suspend();
    //soundArray[2].stop();
}