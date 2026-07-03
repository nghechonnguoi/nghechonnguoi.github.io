const fs = require('fs');
let js = fs.readFileSync('d:/Nhà của Ngàn/script.js', 'utf8');
js = js.replace(/MBTI: mbtiCode,/, `MBTI: mbtiCode,
      LIFEPATH: lifepathNum,
      SOUL: soulNum,
      MISSION: missionNum,
      TALENT: talentNum,
      PASSION: passionNums.join(' & '),`);
fs.writeFileSync('d:/Nhà của Ngàn/script.js', js, 'utf8');
