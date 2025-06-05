(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'Form action is missing!');
        return;
      }

      thisForm.querySelector('.loading').style.display = 'block';
      thisForm.querySelector('.error-message').style.display = 'none';
      thisForm.querySelector('.sent-message').style.display = 'none';

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error(`${response.status} ${response.statusText}`);
          }
        })
        .then(data => {
          thisForm.querySelector('.loading').style.display = 'none';
          if (data.trim() === 'OK') {
            thisForm.querySelector('.sent-message').style.display = 'block';
            thisForm.reset();
          } else {
            throw new Error(data || 'Form submission failed.');
          }
        })
        .catch(error => {
          displayError(thisForm, error.message);
        });
    });
  });

  function displayError(form, message) {
    form.querySelector('.loading').style.display = 'none';
    form.querySelector('.error-message').innerHTML = message;
    form.querySelector('.error-message').style.display = 'block';
  }
})();
