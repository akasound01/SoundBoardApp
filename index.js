document.getElementById('audioFiles').addEventListener('change', handleFileSelect);
document.getElementById('stopAll').addEventListener('click', stopAllSounds);
document.getElementById('globalVolume').addEventListener('input', adjustGlobalVolume);

let audioElements = [];
let gainNodes = [];
let playPauseButtons = [];
let audioContext = null;

function handleFileSelect(event) {
    const files = event.target.files;
    const soundboard = document.getElementById('soundboard');
    soundboard.innerHTML = '';  // 既存のボタンをクリア
    audioElements = [];
    gainNodes = [];
    playPauseButtons = [];

    // AudioContextをユーザー操作内で作成
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    Array.from(files).forEach((file, index) => {
        const audio = new Audio(URL.createObjectURL(file));
        audio.preload = 'auto';
        audioElements.push(audio);

        // GainNodeを作成して音量調整用に使用
        const gainNode = audioContext.createGain();
        gainNodes.push(gainNode);

        // MediaElementSourceを作成してGainNodeに接続
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
            gainNode.gain.value = volume;  // 音量調整
        });

        // 再生・停止ボタン
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = '再生';
        playPauseButtons.push(playPauseButton);

        playPauseButton.addEventListener('click', () => {
            if (audio.paused) {
                // AudioContextの再開（iOSで一時停止したコンテキストを再開するため）
                audioContext.resume().then(() => {
                    audio.play();
                    playPauseButton.textContent = '停止';
                }).catch(error => {
                    console.error('再生エラー:', error);  // エラーログ
                });

                // 再生終了時にボタンを「再生」にリセット
                audio.addEventListener('ended', () => {
                    playPauseButton.textContent = '再生';
                });
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

// 全体停止ボタンが押されたとき、すべての音源を停止し、ボタンを「再生」にリセット
function stopAllSounds() {
    audioElements.forEach((audio, index) => {
        audio.pause();
        audio.currentTime = 0;
        playPauseButtons[index].textContent = '再生';
    });
}

// 全体音量調整
function adjustGlobalVolume(event) {
    const globalVolume = event.target.value / 100;
    gainNodes.forEach(gainNode => {
        gainNode.gain.value = globalVolume;
    });
}
