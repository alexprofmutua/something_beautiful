const themeButton = document.querySelector('.theme-toggle');
let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.querySelector('span').textContent = dark ? '☼' : '☾';
}
setTheme(savedTheme === 'dark');
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  setTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {}
});
