document.getElementById('audioFiles').addEventListener('change', handleFileSelect);
document.getElementById('stopAll').addEventListener('click', stopAllSounds);
document.getElementById('globalVolume').addEventListener('input', adjustGlobalVolume);

let audioElements = [];
let gainNodes = [];
let audioContext = null;  // AudioContextをグローバルで管理

function handleFileSelect(event) {
    const files = event.target.files;
    const soundboard = document.getElementById('soundboard');
    soundboard.innerHTML = '';  // 既存のボタンをクリア
    audioElements = [];  // 音源リストをリセット
    gainNodes = [];  // Gainノードリストをリセット

    // AudioContextの作成
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    Array.from(files).forEach((file, index) => {
        const audio = new Audio(URL.createObjectURL(file));
        audioElements.push(audio);

        // GainNodeを作成して音量調整用に使用
        const gainNode = audioContext.createGain();
        gainNodes.push(gainNode);

        // audio要素をMediaElementSourceに変換し、GainNodeに接続
        const track = audioContext.createMediaElementSource(audio);
        track.connect(gainNode).connect(audioContext.destination);

        const soundButton = document.createElement('div');
        soundButton.className = 'sound-button';

        // ボタンラベル
        const label = document.createElement('label');
        label.textContent = file.name;

        // 音量スライダー
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '100';
        volumeSlider.value = '50';
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            gainNode.gain.value = volume;  // GainNodeで音量調整
        });

        // 再生・停止ボタン
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = '再生';
        playPauseButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playPauseButton.textContent = '停止';
            } else {
                audio.pause();
                audio.currentTime = 0;  // 再生位置をリセット
                playPauseButton.textContent = '再生';
            }
        });

        soundButton.appendChild(label);
        soundButton.appendChild(volumeSlider);
        soundButton.appendChild(playPauseButton);
        soundboard.appendChild(soundButton);
    });
}

// 全体停止ボタンが押されたとき、すべての音源を停止
function stopAllSounds() {
    audioElements.forEach((audio, index) => {
        audio.pause();
        audio.currentTime = 0;  // 再生位置をリセット
        gainNodes[index].gain.value = 0;  // 音量を0にリセット（必要であれば）
    });
}

// 全体音量調整
function adjustGlobalVolume(event) {
    const globalVolume = event.target.value / 100;
    gainNodes.forEach(gainNode => {
        gainNode.gain.value = globalVolume;
    });
}
