// Keep the linked organization text if a logo cannot be loaded.
document.querySelectorAll('.organization-logo img').forEach((image) => {
  const showTextOnly = () => {
    const link = image.closest('.organization-logo');
    link.hidden = true;
    link.parentElement.classList.add('organization-logo-unavailable');
  };
  image.addEventListener('error', showTextOnly, { once: true });
  if (image.complete && image.naturalWidth === 0) showTextOnly();
});
