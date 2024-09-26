document.getElementById('audioFiles').addEventListener('change', handleFileSelect);
document.getElementById('playAll').addEventListener('click', playAllSounds);
document.getElementById('stopAll').addEventListener('click', stopAllSounds);
document.getElementById('globalVolume').addEventListener('input', adjustGlobalVolume);

let audioElements = [];

function handleFileSelect(event) {
    const files = event.target.files;
    const soundboard = document.getElementById('soundboard');
    soundboard.innerHTML = '';  // 既存のボタンをクリア

    Array.from(files).forEach((file, index) => {
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener('canplay', () => {
        // 音量スライダーのデフォルト値を反映
        audio.volume = parseFloat(volumeSlider.value) / 100;
    });
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
            audio.volume = parseFloat(e.target.value) / 100;
        });

        // 再生・停止ボタン
        const playPauseButton = document.createElement('button');
        playPauseButton.textContent = '再生';
        playPauseButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.volume = parseFloat(volumeSlider.value) / 100;  // 再生時に音量設定
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

/*function playAllSounds() {
    audioElements.forEach(audio => audio.play());
}*/

/*function stopAllSounds() {
    audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;  // 再生位置をリセット
    });
}*/

function adjustGlobalVolume(event) {
    const globalVolume = event.target.value / 100;
    audioElements.forEach(audio => {
        audio.volume = globalVolume;
    });
}
