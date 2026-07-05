// Управление модальным окном онлайн-бронирования
(function () {
  var modal = document.getElementById('bookingModal');
  var wrap = document.getElementById('frameWrap');
  var frame = document.getElementById('bookingFrame');
  var closeBtn = document.getElementById('modalClose');
  var widgetUrl = 'https://transfer.yarobltour.ru/bron/bron_modern.php';

  // Виджет свёрстан на фиксированную ширину ~400px и не адаптивен.
  // На узких экранах масштабируем iframe, чтобы он помещался без прокрутки.
  var WIDGET_MIN_WIDTH = 400;

  function fitFrame() {
    if (!modal.classList.contains('open')) return;
    var availW = wrap.clientWidth;
    var availH = wrap.clientHeight;
    if (availW >= WIDGET_MIN_WIDTH) {
      // Места достаточно — виджет тянется сам
      frame.style.width = '100%';
      frame.style.height = '100%';
      frame.style.transform = 'none';
    } else {
      // Узкий экран — рендерим виджет в его натуральную ширину и уменьшаем
      var scale = availW / WIDGET_MIN_WIDTH;
      frame.style.width = WIDGET_MIN_WIDTH + 'px';
      frame.style.height = (availH / scale) + 'px';
      frame.style.transform = 'scale(' + scale + ')';
    }
  }

  function openModal() {
    // Загружаем виджет только при первом открытии
    if (frame.getAttribute('src') !== widgetUrl) {
      frame.setAttribute('src', widgetUrl);
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Ждём, пока модалка отрисуется, затем подгоняем размеры
    requestAnimationFrame(fitFrame);
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

  // Пересчитываем масштаб при повороте экрана / изменении размера окна
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitFrame, 150);
  });
})();
