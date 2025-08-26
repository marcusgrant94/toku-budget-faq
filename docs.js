// Put the current year in the footer (reusing script.js behavior if present)
document.getElementById('year').textContent = new Date().getFullYear();

// Build a simple table of contents from h2/h3
const toc = document.getElementById('toc-list');
const headers = [...document.querySelectorAll('.content h2, .content h3')];

headers.forEach(h => {
  if (!h.id){
    h.id = h.textContent.trim().toLowerCase()
      .replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');
  }
  const a = document.createElement('a');
  a.href = `#${h.id}`;
  a.textContent = h.textContent;
  a.className = h.tagName === 'H3' ? 'sub' : '';
  toc.appendChild(a);
});

// Scroll spy to highlight current section
const links = [...toc.querySelectorAll('a')];
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const id = e.target.id;
    const link = links.find(l => l.getAttribute('href') === `#${id}`);
    if (link){
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

headers.forEach(h => io.observe(h));
