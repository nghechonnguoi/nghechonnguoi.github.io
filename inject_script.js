const fs = require('fs');
let script = fs.readFileSync('d:/Nhà của Ngàn/script.js', 'utf8');
const injectCode = `
    // === NEW PREVIEW FETCH LOGIC ===
    const previewContainer = document.getElementById('free-preview-container');
    if (previewContainer) {
      previewContainer.classList.remove('hidden');
      document.getElementById('preview-loading').style.display = 'block';
      document.getElementById('preview-content').classList.add('hidden');
      
      fetch('https://ncn-academy-web.vercel.app/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(window.pdfPayload)
      })
      .then(r => r.json())
      .then(data => {
        document.getElementById('preview-p1').innerText = data.AI_PAGE3_P1 || '';
        document.getElementById('preview-p2').innerText = data.AI_PAGE3_P2 || '';
        
        const colors = { R: '#8b5cf6', I: '#3b82f6', A: '#ec4899', S: '#10b981', E: '#f59e0b', C: '#64748b' };
        const labels = { R: 'Thực tế (Realistic)', I: 'Nghiên cứu (Investigative)', A: 'Nghệ thuật (Artistic)', S: 'Xã hội (Social)', E: 'Quản lý (Enterprising)', C: 'Tổ chức (Conventional)' };
        let barsHtml = '';
        const pct = window.pdfPayload;
        const scores = [
          { k: 'R', v: pct.R_PCT }, { k: 'I', v: pct.I_PCT }, { k: 'A', v: pct.A_PCT },
          { k: 'S', v: pct.S_PCT }, { k: 'E', v: pct.E_PCT }, { k: 'C', v: pct.C_PCT }
        ];
        
        scores.forEach(s => {
          barsHtml += "<div style='margin-bottom: 12px'><div style='font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 6px;'>" + s.k + " — " + labels[s.k] + "</div><div style='width: 100%; background: #f1f5f9; border-radius: 6px; height: 12px; overflow: hidden;'><div style='height: 100%; background: " + colors[s.k] + "; width: " + s.v + "%; border-radius: 6px;'></div></div></div>";
        });
        
        document.getElementById('preview-holland-bars').innerHTML = barsHtml;
        
        document.getElementById('preview-loading').style.display = 'none';
        document.getElementById('preview-content').classList.remove('hidden');
      })
      .catch(e => {
         console.error('Preview error', e);
         previewContainer.style.display = 'none';
      });
    }
`;
script = script.replace("  } catch (err) {\r\n    console.error('L", injectCode + "\n  } catch (err) {\r\n    console.error('L");
script = script.replace("  } catch (err) {\n    console.error('L", injectCode + "\n  } catch (err) {\n    console.error('L");
fs.writeFileSync('d:/Nhà của Ngàn/script.js', script, 'utf8');
