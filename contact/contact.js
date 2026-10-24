const copyButton = document.getElementById('copy-email');
const emailAddress = document.getElementById('contact-email-address');
const feedback = document.getElementById('copy-email-status');

if (copyButton && emailAddress && feedback) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    copyButton.setAttribute('aria-busy', 'true');
    delete copyButton.dataset.copied;
    feedback.textContent = 'Copying email…';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(emailAddress.textContent.trim());
      copyButton.dataset.copied = 'true';
      feedback.textContent = 'Email copied: ' + emailAddress.textContent.trim() + '.';
    } catch {
      feedback.textContent = "Couldn't copy. You can select and copy the email address above.";
    } finally {
      copyButton.disabled = false;
      copyButton.removeAttribute('aria-busy');
    }
  });
}

