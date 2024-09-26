document.getElementById('audioFiles').addEventListener('change', handleFileSelect);
document.getElementById('stopAll').addEventListener('click', stopAllSounds);
document.getElementById('globalVolume').addEventListener('input', adjustGlobalVolume);

let audioElements = [];
let playPauseButtons = [];

function handleFileSelect(event) {
    const files = event.target.files;
    const soundboard = document.getElementById('soundboard');
    soundboard.innerHTML = '';  // 既存のボタンをクリア
    audioElements = [];  // 音源リストをリセット
    playPauseButtons = [];  // 再生/停止ボタンリストをリセット

    Array.from(files).forEach((file, index) => {
        const audio = new Audio(URL.createObjectURL(file));
        audio.preload = 'auto';  // iOSで確実に動作させるためにプリロードを設定
        audioElements.push(audio);
        
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
            audio.volume = volume;  // 音量を直接変更
        });

        // 再生・停止ボタン
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = '再生';
        playPauseButtons.push(playPauseButton);

        playPauseButton.addEventListener('click', () => {
            if (audio.paused) {
                // ユーザー操作が発生したときに再生を開始
                audio.play().then(() => {
                    playPauseButton.textContent = '停止';
                }).catch(error => {
                    console.error('再生エラー:', error);  // エラーログを確認
                });

                // 再生終了後、自動的にボタンを「再生」に戻す
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
        audio.currentTime = 0;  // 再生位置をリセット
        playPauseButtons[index].textContent = '再生';  // 各ボタンを「再生」にリセット
    });
}

// 全体音量調整
function adjustGlobalVolume(event) {
    const globalVolume = event.target.value / 100;
    audioElements.forEach(audio => {
        audio.volume = globalVolume;  // 各音源の音量を一括で調整
    });
}
