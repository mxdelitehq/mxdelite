// ── Grain ──
const canvas = document.getElementById('grain');
const ctx = canvas.getContext('2d');
let w, h;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
function grain() {
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  requestAnimationFrame(grain);
}
grain();

// ── No custom cursor — default system cursor ──

// ── Form submission → Google Sheet ──
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCaOlE1sfQD119yUaOM0BKXWNELfTh3pV01fT37Hl0xQvPj-IyezZdTOnKVAG0WiKG/exec';

document.getElementById('submit-btn').addEventListener('click', async () => {
  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const brief = document.getElementById('brief').value.trim();
  const note  = document.getElementById('form-note');
  const label = document.getElementById('submit-label');

  if (!name || !email || !brief) {
    note.textContent = 'Please fill in all fields.';
    note.style.color = '#ff5555';
    return;
  }

  label.textContent = 'Sending...';
  document.getElementById('submit-btn').disabled = true;
  note.textContent = 'Response within 24 hours.';
  note.style.color = '';

  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', brief);
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    label.textContent = 'Sent.';
    note.textContent = 'We will be in touch within 24 hours.';
    note.style.color = 'rgba(255,255,255,0.5)';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('brief').value = '';
  } catch (err) {
    label.textContent = 'Send Message';
    document.getElementById('submit-btn').disabled = false;
    note.textContent = 'Something went wrong. Email us directly.';
    note.style.color = '#ff5555';
  }
});

// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));