/*
  Минимальный JavaScript для КР №1 (проект оценивается как HTML/CSS):
  - открытие и закрытие модальных окон <dialog>;
  - проверка форм встроенной HTML-валидацией и сообщение об успехе.
  Данные никуда не отправляются: backend в проекте пока нет.
*/

// Кнопка с data-dialog-open="id" открывает окно с этим id.
document.querySelectorAll('[data-dialog-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialogOpen);

    // Если кнопка знает товар, записываем его в скрытое поле формы.
    const productInput = dialog.querySelector('input[name="product"]');
    if (productInput && button.dataset.product) {
      productInput.value = button.dataset.product;
    }

    dialog.showModal();
  });
});

// Кнопка с data-dialog-close закрывает окно, внутри которого находится.
document.querySelectorAll('[data-dialog-close]').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('dialog').close();
  });
});

// Клик по затемнённому фону (мимо содержимого окна) тоже закрывает окно.
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

// Формы с атрибутом data-validate проверяются перед «отправкой».
document.querySelectorAll('form[data-validate]').forEach((form) => {
  const successMessage = document.getElementById(form.dataset.success);
  const fields = Array.from(form.elements).filter((element) => element.willValidate);

  // Помечаем поле ошибочным через aria-invalid (CSS подсвечивает его красным).
  const markField = (field) => {
    if (field.validity.valid) {
      field.removeAttribute('aria-invalid');
    } else {
      field.setAttribute('aria-invalid', 'true');
    }
  };

  // Как только пользователь исправил поле, подсветка ошибки исчезает.
  form.addEventListener('input', () => {
    fields
      .filter((field) => field.hasAttribute('aria-invalid'))
      .forEach(markField);
  });

  form.addEventListener('submit', (event) => {
    // Отменяем настоящую отправку: backend не подключён.
    event.preventDefault();

    fields.forEach(markField);

    if (!form.checkValidity()) {
      // Показываем стандартные подсказки браузера у первого ошибочного поля.
      form.reportValidity();
      return;
    }

    form.reset();

    const dialog = form.closest('dialog');
    if (dialog) {
      dialog.close();
    }

    // Показываем сообщение и переводим на него фокус, чтобы его заметили.
    successMessage.hidden = false;
    successMessage.focus();
  });

  // Кнопка «Очистить» и form.reset() снимают подсветку и прячут сообщение.
  form.addEventListener('reset', () => {
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
    successMessage.hidden = true;
  });
});
