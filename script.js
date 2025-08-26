// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

const input = document.getElementById('search');
const items = Array.from(document.querySelectorAll('.faq-item'));
const sections = Array.from(document.querySelectorAll('[data-section]'));
const empty = document.getElementById('no-results');

// Keyboard shortcut: focus with "/"
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== input && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    input.focus();
    input.select();
  }
});

input.addEventListener('input', () => applyFilter(input.value.trim()));

function applyFilter(q){
  const query = q.toLowerCase();

  let anyShown = false;

  // Reset and filter items
  items.forEach(li => {
    const link = li.querySelector('.faq-link');
    const rawText = link.getAttribute('data-raw') || link.textContent.trim();
    // store original once
    if (!link.getAttribute('data-raw')) link.setAttribute('data-raw', rawText);

    if (!query){
      link.innerHTML = `<span class="doc-icon" aria-hidden="true"></span>${escapeHtml(rawText)}`;
      li.hidden = false;
      anyShown = true;
      return;
    }

    const idx = rawText.toLowerCase().indexOf(query);
    if (idx >= 0){
      // highlight match
      const before = rawText.slice(0, idx);
      const mid    = rawText.slice(idx, idx + query.length);
      const after  = rawText.slice(idx + query.length);
      link.innerHTML = `<span class="doc-icon" aria-hidden="true"></span>${escapeHtml(before)}<mark>${escapeHtml(mid)}</mark>${escapeHtml(after)}`;
      li.hidden = false;
      anyShown = true;
    } else {
      li.hidden = true;
    }
  });

  // Hide entire sections with no visible items
  sections.forEach(sec => {
    const visible = Array.from(sec.querySelectorAll('.faq-item')).some(el => !el.hidden);
    sec.hidden = !visible;
  });

  empty.hidden = anyShown;
}

// Utility: escape HTML
function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

// On load: apply filter if query param ?q=
const params = new URLSearchParams(location.search);
if (params.has('q')) {
  input.value = params.get('q');
  applyFilter(input.value);
}
