class PodcastGenerator {
    constructor() {
        this.uploadedFile = null;
        this.audioFile = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const generateBtn = document.getElementById('generateBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        // 파일 입력 이벤트
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // 드래그 앤 드롭 이벤트
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // 생성 버튼 이벤트
        generateBtn.addEventListener('click', () => this.generateWebsite());

        // 다운로드 버튼 이벤트
        downloadBtn.addEventListener('click', () => this.downloadFiles());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
            alert('MP3 파일만 업로드 가능합니다.');
            return;
        }

        this.uploadedFile = file;
        this.audioFile = file;
        
        // 팟캐스트 정보 섹션 표시
        document.getElementById('podcastInfo').style.display = 'block';
        
        // 파일명을 기본 제목으로 설정
        const fileName = file.name.replace('.mp3', '');
        document.getElementById('podcastTitle').value = fileName;
    }

    generateWebsite() {
        const title = document.getElementById('podcastTitle').value.trim();
        const description = document.getElementById('podcastDescription').value.trim();

        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!this.audioFile) {
            alert('MP3 파일을 업로드해주세요.');
            return;
        }

        // HTML 템플릿 생성
        const htmlContent = this.generateHTMLTemplate(title, description);
        
        // 미리보기 표시
        this.showPreview(htmlContent);
        
        // 파일 생성 준비
        this.prepareDownload(htmlContent);
    }

    generateHTMLTemplate(title, description) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }

        .podcast-website {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .podcast-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .podcast-title {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .podcast-description {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .audio-player {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .audio-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .control-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .control-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .progress-container {
            margin-bottom: 15px;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
        }

        .progress {
            height: 100%;
            background: white;
            border-radius: 4px;
            transition: width 0.1s ease;
            width: 0%;
        }

        .time-display {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .download-link {
            text-align: center;
            margin-top: 20px;
        }

        .download-link a {
            color: white;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 20px;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .download-link a:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .podcast-title {
                font-size: 2rem;
            }
            
            .audio-controls {
                gap: 15px;
            }
            
            .control-btn {
                width: 45px;
                height: 45px;
            }
        }
    </style>
</head>
<body>
    <div class="podcast-website">
        <div class="podcast-header">
            <h1 class="podcast-title">${title}</h1>
            <p class="podcast-description">${description}</p>
        </div>

        <div class="audio-player">
            <audio id="audioPlayer" preload="metadata">
                <source src="audio.mp3" type="audio/mpeg">
                브라우저가 오디오를 지원하지 않습니다.
            </audio>

            <div class="audio-controls">
                <button class="control-btn" id="prevBtn" title="이전">◀◀</button>
                <button class="control-btn" id="playPauseBtn" title="재생/일시정지">▶</button>
                <button class="control-btn" id="nextBtn" title="다음">▶▶</button>
            </div>

            <div class="progress-container">
                <div class="progress-bar" id="progressBar">
                    <div class="progress" id="progress"></div>
                </div>
            </div>

            <div class="time-display">
                <span id="currentTime">00:00</span>
                <span id="duration">00:00</span>
            </div>

            <div class="download-link">
                <a href="audio.mp3" download>음원 다운로드</a>
            </div>
        </div>
    </div>

    <script>
        class AudioPlayer {
            constructor() {
                this.audio = document.getElementById('audioPlayer');
                this.playPauseBtn = document.getElementById('playPauseBtn');
                this.progressBar = document.getElementById('progressBar');
                this.progress = document.getElementById('progress');
                this.currentTimeEl = document.getElementById('currentTime');
                this.durationEl = document.getElementById('duration');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');

                this.isPlaying = false;
                this.initializeEventListeners();
            }

            initializeEventListeners() {
                this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
                this.progressBar.addEventListener('click', (e) => this.setProgress(e));
                this.audio.addEventListener('timeupdate', () => this.updateProgress());
                this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
                this.audio.addEventListener('ended', () => this.onAudioEnded());
                this.prevBtn.addEventListener('click', () => this.seekBackward());
                this.nextBtn.addEventListener('click', () => this.seekForward());
            }

            togglePlayPause() {
                if (this.isPlaying) {
                    this.audio.pause();
                    this.playPauseBtn.textContent = '▶';
                    this.isPlaying = false;
                } else {
                    this.audio.play();
                    this.playPauseBtn.textContent = '⏸';
                    this.isPlaying = true;
                }
            }

            updateProgress() {
                const progress = (this.audio.currentTime / this.audio.duration) * 100;
                this.progress.style.width = progress + '%';
                this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
            }

            updateDuration() {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }

            setProgress(e) {
                const width = this.progressBar.clientWidth;
                const clickX = e.offsetX;
                const duration = this.audio.duration;
                this.audio.currentTime = (clickX / width) * duration;
            }

            onAudioEnded() {
                this.playPauseBtn.textContent = '▶';
                this.isPlaying = false;
                this.progress.style.width = '0%';
                this.currentTimeEl.textContent = '00:00';
            }

            seekBackward() {
                this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
            }

            seekForward() {
                this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
            }

            formatTime(time) {
                if (isNaN(time)) return '00:00';
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            }
        }

        // 오디오 플레이어 초기화
        document.addEventListener('DOMContentLoaded', () => {
            new AudioPlayer();
        });
    </script>
</body>
</html>`;
    }

    showPreview(htmlContent) {
        const previewSection = document.getElementById('previewSection');
        const previewFrame = document.getElementById('previewFrame');
        
        // Blob URL 생성
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        previewFrame.src = url;
        previewSection.style.display = 'block';
        
        // 스크롤하여 미리보기 섹션으로 이동
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    prepareDownload(htmlContent) {
        this.htmlContent = htmlContent;
        this.downloadReady = true;
    }

    async downloadFiles() {
        if (!this.downloadReady || !this.audioFile) {
            alert('먼저 웹사이트를 생성해주세요.');
            return;
        }

        try {
            // 현재 날짜로 파일명 생성
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
            
            // HTML 파일 다운로드
            const htmlBlob = new Blob([this.htmlContent], { type: 'text/html' });
            const htmlUrl = URL.createObjectURL(htmlBlob);
            
            const htmlLink = document.createElement('a');
            htmlLink.href = htmlUrl;
            htmlLink.download = \`\${dateString}.html\`;
            htmlLink.click();
            
            // MP3 파일 다운로드
            const audioUrl = URL.createObjectURL(this.audioFile);
            const audioLink = document.createElement('a');
            audioLink.href = audioUrl;
            audioLink.download = 'audio.mp3';
            audioLink.click();
            
            // URL 정리
            setTimeout(() => {
                URL.revokeObjectURL(htmlUrl);
                URL.revokeObjectURL(audioUrl);
            }, 1000);
            
            alert(\`파일이 다운로드되었습니다!\\n- \${dateString}.html\\n- audio.mp3\\n\\n두 파일을 같은 폴더에 저장하고 HTML 파일을 열어보세요.\`);
            
        } catch (error) {
            console.error('다운로드 중 오류 발생:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new PodcastGenerator();
});
