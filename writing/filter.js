const category = document.getElementById('writing-category');
if (category) {
  const entries = [...document.querySelectorAll('#article-list .writing-entry')];
  const count = document.getElementById('writing-count');
  category.closest('.writing-filters').hidden = false;
  category.addEventListener('change', () => {
    let visible = 0;
    for (const entry of entries) {
      entry.hidden = Boolean(category.value && entry.dataset.category !== category.value);
      if (!entry.hidden) visible += 1;
    }
    count.textContent = visible + (visible === 1 ? ' article' : ' articles');
  });
}
