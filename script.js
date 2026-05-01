const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js' 
});

const uploader = document.getElementById('uploader');
const startBtn = document.getElementById('startBtn');
const message = document.getElementById('message');
const progress = document.getElementById('progress');

startBtn.addEventListener('click', async () => {
    const file = uploader.files[0];
    if (!file) return alert('الرجاء اختيار ملف أولاً');

    const targetFormat = document.getElementById('format').value;
    message.innerText = 'جاري تحميل المحرك...';

    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    message.innerText = 'جاري المعالجة... قد يستغرق هذا وقتاً حسب حجم الملف';
    
    // كتابة الملف إلى ذاكرة FFmpeg الوهمية
    ffmpeg.FS('writeFile', 'input_file', await fetchFile(file));

    // تشغيل أمر FFmpeg
    // مثال: ffmpeg -i input_file output.mp4
    await ffmpeg.run('-i', 'input_file', `output.${targetFormat}`);

    message.innerText = 'اكتملت المعالجة!';
    
    // قراءة الملف الناتج
    const data = ffmpeg.FS('readFile', `output.${targetFormat}`);

    // إنشاء رابط تحميل وعرض الفيديو
    const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: `video/${targetFormat}` }));
    const player = document.getElementById('player');
    player.src = videoUrl;
    
    // إضافة زر تحميل تلقائي
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = videoUrl;
    downloadAnchor.download = `converted_video.${targetFormat}`;
    downloadAnchor.click();
});
