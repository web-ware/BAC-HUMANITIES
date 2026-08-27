/* تنقل الواجهة — ملف صغير مستقل حتى يبقى app.js مخصصًا للمنطق. */
document.querySelectorAll('[data-route]').forEach(button => {
  button.addEventListener('click', () => {
    location.hash = '#/' + button.dataset.route;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
});
