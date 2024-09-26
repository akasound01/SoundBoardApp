document.getElementById('audioFiles').addEventListener('change', handleFileSelect);
document.getElementById('stopAll').addEventListener('click', stopAllSounds);
document.getElementById('globalVolume').addEventListener('input', adjustGlobalVolume);

let audioElements = [];
let playPauseButtons = [];  // 各再生/停止ボタンを追跡するための配列

function handleFileSelect(event) {
    const files = event.target.files;
    const soundboard = document.getElementById('soundboard');
    soundboard.innerHTML = '';  // 既存のボタンをクリア
    audioElements = [];  // 音源リストをリセット
    playPauseButtons = [];  // 再生/停止ボタンリストをリセット

    Array.from(files).forEach((file, index) => {
        const audio = new Audio(URL.createObjectURL(file));
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
            audio.volume = e.target.value / 100;
        });

        // 再生・停止ボタン
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = '再生';
        playPauseButtons.push(playPauseButton);  // ボタンを追跡する配列に追加

        playPauseButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playPauseButton.textContent = '停止';
                audio.addEventListener('ended', () => {
                    playPauseButton.textContent = '再生';  // 再生が終わったらボタンを「再生」にリセット
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

function adjustGlobalVolume(event) {
    const globalVolume = event.target.value / 100;
    audioElements.forEach(audio => {
        audio.volume = globalVolume;
    });
}
