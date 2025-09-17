let uploadedAudioFile = null;

// DOM 요소들
const uploadArea = document.getElementById('uploadArea');
const audioFileInput = document.getElementById('audioFile');
const formSection = document.getElementById('formSection');
const resultSection = document.getElementById('resultSection');
const podcastForm = document.getElementById('podcastForm');
const generatedFileName = document.getElementById('generatedFileName');
const previewLink = document.getElementById('previewLink');

// 드래그 앤 드롭 이벤트
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleAudioFile(files[0]);
    }
});

// 파일 입력 이벤트
audioFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleAudioFile(e.target.files[0]);
    }
});

// 음원 파일 처리
function handleAudioFile(file) {
    // 파일 타입 검증
    if (!file.type.startsWith('audio/')) {
        alert('음원 파일만 업로드 가능합니다.');
        return;
    }
    
    uploadedAudioFile = file;
    
    // 업로드 영역 업데이트
    uploadArea.innerHTML = `
        <div class="upload-icon">✅</div>
        <h3>파일 업로드 완료!</h3>
        <p><strong>파일명:</strong> ${file.name}</p>
        <p><strong>크기:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <button class="upload-btn" onclick="resetUpload()">다른 파일 선택</button>
    `;
    
    // 폼 섹션 표시
    formSection.style.display = 'block';
}

// 업로드 초기화
function resetUpload() {
    uploadedAudioFile = null;
    formSection.style.display = 'none';
    resultSection.style.display = 'none';
    
    uploadArea.innerHTML = `
        <div class="upload-icon">🎵</div>
        <h3>음원 파일을 드래그하거나 클릭하여 업로드</h3>
        <p>MP3, WAV, OGG 파일을 지원합니다</p>
        <input type="file" id="audioFile" accept="audio/*" hidden>
        <button class="upload-btn" onclick="document.getElementById('audioFile').click()">
            파일 선택
        </button>
    `;
    
    // 이벤트 리스너 재등록
    document.getElementById('audioFile').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleAudioFile(e.target.files[0]);
        }
    });
}


// 폼 제출 처리
podcastForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!uploadedAudioFile) {
        alert('먼저 음원 파일을 업로드해주세요.');
        return;
    }
    
    const formData = new FormData(podcastForm);
    const podcastData = {
        title: formData.get('title'),
        description: formData.get('description'),
        author: formData.get('author')
    };
    
    generatePodcastSite(podcastData);
});

// 팟캐스트 사이트 생성
async function generatePodcastSite(data) {
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.textContent;
    
    // 로딩 상태
    generateBtn.innerHTML = '<span class="loading"></span>생성 중...';
    generateBtn.disabled = true;
    
    try {
        // 현재 날짜로 파일명 생성
        const now = new Date();
        const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const fileName = `podcast_${dateString}.html`;
        
        // 오디오 파일을 base64로 변환
        const audioBase64 = await fileToBase64(uploadedAudioFile);
        
        // HTML 템플릿 생성
        const htmlContent = generateHTMLTemplate(data, audioBase64);
        
        // 파일 다운로드
        downloadFile(htmlContent, fileName, 'text/html');
        
        // 결과 표시
        generatedFileName.textContent = fileName;
        previewLink.href = URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }));
        
        formSection.style.display = 'none';
        resultSection.style.display = 'block';
        
    } catch (error) {
        console.error('Error generating podcast site:', error);
        alert('팟캐스트 사이트 생성 중 오류가 발생했습니다.');
    } finally {
        // 버튼 상태 복원
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
}

// 파일을 base64로 변환
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// HTML 템플릿 생성
function generateHTMLTemplate(data, audioBase64) {
    
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || '팟캐스트'}</title>
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
            color: #333;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .meta {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        
        .content {
            padding: 40px;
        }
        
        .description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #555;
        }
        
        .audio-player {
            background: #f8f9ff;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }
        
        .audio-player h3 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        
        audio {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            display: block;
        }
        
        
        .footer {
            background: #f8f9ff;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e1e5e9;
        }
        
        @media (max-width: 600px) {
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .audio-player {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.title || '팟캐스트'}</h1>
            ${data.author ? `<div class="meta"><p>작성자: ${data.author}</p></div>` : ''}
        </div>
        
        <div class="content">
            ${data.description ? `<div class="description">${data.description}</div>` : ''}
            
            <div class="audio-player">
                <h3>🎵 재생하기</h3>
                <audio controls>
                    <source src="${audioBase64}" type="${uploadedAudioFile.type}">
                    브라우저가 오디오 재생을 지원하지 않습니다.
                </audio>
            </div>
        </div>
        
        <div class="footer">
            <p>팟캐스트 사이트 생성기로 제작되었습니다.</p>
        </div>
    </div>
</body>
</html>`;
}

// 파일 다운로드
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
