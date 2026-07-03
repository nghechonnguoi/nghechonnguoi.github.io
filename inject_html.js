const fs = require('fs');
let html = fs.readFileSync('d:/Nhà của Ngàn/index.html', 'utf8');
const previewHtml = `
      <div id="free-preview-container" style="background: #ffffff; color: #1e293b; border-radius: 12px; padding: 25px; margin-top: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div id="preview-loading" style="text-align: center; padding: 30px;">
          <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 15px; color: #475569; font-weight: 500;">Đang tổng hợp phân tích chuyên sâu...</p>
        </div>
        <div id="preview-content" class="hidden">
          <div style="display: inline-block; background: #4f46e5; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 15px; letter-spacing: 0.5px;">CHƯƠNG I — BẠN LÀ AI?</div>
          <h3 style="color: #0f172a; font-size: 22px; font-weight: 800; margin-bottom: 20px;">Xu Hướng Vận Hành Tự Nhiên & Bản Ngã Hành Vi</h3>
          <p id="preview-p1" style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 15px;"></p>
          <p id="preview-p2" style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 25px;"></p>
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 4px; height: 20px; background: #6366f1; margin-right: 10px;"></div>
            <h4 style="color: #0f172a; font-size: 18px; font-weight: 800; margin: 0;">Biểu Đồ Radar Holland Code Đa Chiều</h4>
          </div>
          <div id="preview-holland-bars" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;"></div>
        </div>
        <style>
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </div>
`;
html = html.replace('<div id="vocational-route-banner"></div>', previewHtml + '      <div id="vocational-route-banner"></div>');
fs.writeFileSync('d:/Nhà của Ngàn/index.html', html, 'utf8');
