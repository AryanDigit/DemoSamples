window.addEventListener('load', () => {
  document.getElementById('preloader')?.classList.add('hide');
});
if (window.AOS) AOS.init({ duration: 700, once: true });
