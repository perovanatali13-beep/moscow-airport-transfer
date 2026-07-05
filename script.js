// Управление модальным окном онлайн-бронирования
(function () {
  var modal = document.getElementById('bookingModal');
  var frame = document.getElementById('bookingFrame');
  var closeBtn = document.getElementById('modalClose');
  var widgetUrl = 'https://transfer.yarobltour.ru/bron/bron_modern.php';

  function openModal() {
    // Загружаем виджет только при первом открытии
    if (frame.getAttribute('src') !== widgetUrl) {
      frame.setAttribute('src', widgetUrl);
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-booking]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });
  closeBtn.addEventListener('click', closeModal);

  // Закрываем по клику на затемнённый фон только если нажатие НАЧАЛОСЬ на фоне.
  // Иначе окно могло бы закрыться сразу после открытия.
  var pressStartedOnBackdrop = false;
  modal.addEventListener('mousedown', function (e) {
    pressStartedOnBackdrop = (e.target === modal);
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal && pressStartedOnBackdrop) closeModal();
    pressStartedOnBackdrop = false;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
