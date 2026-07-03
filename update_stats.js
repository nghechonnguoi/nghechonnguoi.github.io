const fs = require('fs');
let html = fs.readFileSync('d:/Nhà của Ngàn/landing-blackorange.html', 'utf8');

// Replace hero-stats
html = html.replace(
  /<div class="hero-stats">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i,
  `<div class="hero-stats">
          <div>
            <div class="hero-stat-num">1000+</div>
            <div class="hero-stat-label">Ngành nghề</div>
          </div>
          <div>
            <div class="hero-stat-num">5</div>
            <div class="hero-stat-label">Bộ công cụ</div>
          </div>
          <div>
            <div class="hero-stat-num" id="live-traffic-hero">500</div>
            <div class="hero-stat-label">Lưu lượng truy cập</div>
          </div>
          <div>
            <div class="hero-stat-num">5s</div>
            <div class="hero-stat-label">Thời gian phân tích</div>
          </div>
        </div>
      </div>
    </section>`
);

// Replace stats-grid
html = html.replace(
  /<div class="stats-grid fade-up">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
  `<div class="stats-grid fade-up">
          <div class="stat-item">
            <div class="num" id="live-traffic-grid">500</div>
            <div class="label">Lưu lượng truy cập</div>
          </div>
          <div class="stat-item">
            <div class="num">1000+</div>
            <div class="label">Ngành nghề phân tích</div>
          </div>
          <div class="stat-item">
            <div class="num">5</div>
            <div class="label">Bộ công cụ tâm lý học</div>
          </div>
          <div class="stat-item">
            <div class="num">5 giây</div>
            <div class="label">Thời gian xuất báo cáo</div>
          </div>
        </div>
      </div>
    </div>`
);

// Inject script at the bottom
if (!html.includes('id="live-traffic-script"')) {
  html = html.replace(
    /<\/body>/i,
    `  <script id="live-traffic-script">
      // Simulate live traffic
      (function() {
        // Use a base number (e.g. 500) and add increments based on time so it persists reasonably
        const startDate = new Date('2026-07-02T00:00:00Z').getTime();
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startDate) / 1000);
        let trafficCount = 500 + Math.floor(elapsedSeconds / 1800); // 1 visitor every ~30 mins
        
        function updateTraffic() {
          const heroEl = document.getElementById('live-traffic-hero');
          const gridEl = document.getElementById('live-traffic-grid');
          if (heroEl) heroEl.innerText = trafficCount;
          if (gridEl) gridEl.innerText = trafficCount;
        }
        
        updateTraffic();
        
        // Randomly increment every 30-90 seconds
        function scheduleNext() {
          const delay = Math.floor(Math.random() * 60000) + 30000;
          setTimeout(() => {
            trafficCount += Math.floor(Math.random() * 2) + 1;
            updateTraffic();
            scheduleNext();
          }, delay);
        }
        
        scheduleNext();
      })();
    </script>\n</body>`
  );
}

fs.writeFileSync('d:/Nhà của Ngàn/landing-blackorange.html', html, 'utf8');
