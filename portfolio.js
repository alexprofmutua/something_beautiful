const form = document.querySelector('#terminal-form');
const input = document.querySelector('#terminal-input');
const history = document.querySelector('#terminal-history');
const responses = {
  whoami: 'Alex Mutua\nComputer science student at Williams.',
  ls: 'about.txt   projects/   chess/\nwriting/   contact.txt   CV.pdf',
  'cat about.txt': 'I enjoy learning and turning\nrandom ideas into working projects.',
  'ls projects': 'neatify/   colorBash/   where-is-this-williams/   go_search/',
  pwd: '/home/alex/portfolio',
  help: 'whoami · ls · ls projects · cat about.txt · pwd · clear',
};
input.addEventListener('input', () => input.classList.toggle('has-value', Boolean(input.value)));
form.addEventListener('submit', event => {
  event.preventDefault();
  const command = input.value.trim();
  if (!command) return;
  if (command === 'clear') history.replaceChildren();
  else {
    const line = document.createElement('p');
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'alex@portfolio:~$ ';
    line.append(prompt, document.createTextNode(command));
    const answer = document.createElement('p');
    answer.className = 'terminal-answer';
    answer.style.whiteSpace = 'pre-wrap';
    answer.textContent = responses[command] ?? `Command not found: ${command}. Try help.`;
    history.append(line, answer);
    while (history.children.length > 30) history.firstElementChild.remove();
  }
  input.value = '';
  input.classList.remove('has-value');
  history.scrollTop = history.scrollHeight;
});
