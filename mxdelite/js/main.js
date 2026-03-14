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

// ── Form submission → Supabase REST ──
const SUPABASE_URL = 'https://nxakuzlcqolztadfklof.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54YWt1emxjcW9senRhZGZrbG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDI3NjIsImV4cCI6MjA4OTA3ODc2Mn0.BlhjYMtdWppWN_YQ8BhKe91veYuZM06R1VTlp_4dzec';
const leadsEndpoint = `${SUPABASE_URL}/rest/v1/leads`;

async function submitToSupabase(payload) {
  const res = await fetch(leadsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Supabase insert failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

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
    await submitToSupabase({ name, email, brief });

    label.textContent = 'Sent.';
    note.textContent = 'We will be in touch within 24 hours.';
    note.style.color = 'rgba(255,255,255,0.5)';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('brief').value = '';
  } catch (err) {
    console.error(err);
    label.textContent = 'Send Message';
    document.getElementById('submit-btn').disabled = false;
    note.textContent = 'Something went wrong. ' + (err.message || 'Email us directly.');
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