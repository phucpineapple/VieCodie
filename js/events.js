(function () {
  'use strict';

  const handlers = {
    "action-3792b0ea9ff4": function (event) {
      switchLang('vi');
    },
    "action-06a818fc6aef": function (event) {
      switchLang('en');
    },
    "action-49d3c68fc442": function (event) {
      applyPromo();
    },
    "action-f23c61244318": function (event) {
      selectMethod('qr');
    },
    "action-aa85c431f305": function (event) {
      selectMethod('card');
    },
    "action-ffec8d791dd4": function (event) {
      selectMethod('gplay');
    },
    "action-b655139ea371": function (event) {
      selectMethod('bank');
    },
    "action-4ed50e469025": function (event) {
      selectMethod('crypto');
    },
    "action-34717411df2b": function (event) {
      formatCardNumber(this);
    },
    "action-0459e8fc2018": function (event) {
      updateCardPreview();
    },
    "action-441a86e58d50": function (event) {
      formatCardExpiry(this);
    },
    "action-c353a3ea0f20": function (event) {
      flipCard(true);
    },
    "action-9a26ed613ab9": function (event) {
      flipCard(false);
    },
    "action-f60cb9026057": function (event) {
      copyText('998866889999');
    },
    "action-ba4c3d358d6e": function (event) {
      copyText('DTR89321');
    },
    "action-8095f1908d69": function (event) {
      copyText('T9yD14Nj9j7x2kLm3pQ8vR4sTuWzYx12aB');
    },
    "action-c03150868ae2": function (event) {
      processPayment();
    },
    "action-82ee6561282c": function (event) {
      downloadReceipt();
    },
    "action-019a92b186e3": function (event) {
      closeReceipt();
    },
    "action-77139c7a70e4": function (event) {
      event.preventDefault();
      this.querySelector('input').value = '';
      this.querySelector('button').textContent = '✓';
    },
    "action-27e739e7ee9f": function (event) {
      this.parentElement.innerHTML = '<span class=placeholder>LOAD ERROR</span>';
    },
    "action-00baa6836a92": function (event) {
      this.style.display = 'none';
      document.getElementById('loaderLogoFallback').style.display = 'grid';
    },
    "action-81980b311371": function (event) {
      closeCheckoutModal();
    },
    "action-c99b772c95e0": function (event) {
      this.style.opacity = 0.2;
    },
    "action-06014a4747e8": function (event) {
      this.style.display = 'none';
    }
  };
  const eventTypes = ["click", "input", "focus", "blur", "submit", "error"];
  for (const eventType of eventTypes) {
    document.addEventListener(eventType, event => {
      const target = event.target instanceof Element ? event.target : event.target.parentElement;
      const element = target?.closest('[data-action-' + eventType + ']');
      if (!element || ['error', 'load', 'focus', 'blur'].includes(eventType) && element !== target) return;
      const handler = handlers[element.getAttribute('data-action-' + eventType)];
      if (handler?.call(element, event) === false) event.preventDefault();
    }, ['error', 'load', 'focus', 'blur'].includes(eventType));
  }
})();
