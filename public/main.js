let currentId = null;

async function createText() {
  const text = document.getElementById('text-input').value.trim();
  const duration = parseInt(document.getElementById('duration').value);

  if (!text) return alert('Please enter some text.');

  const res = await fetch('/api/texts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, duration })
  });

  const data = await res.json();
  currentId = data.id;

  const link = `${window.location.origin}/api/texts/${currentId}`;
  document.getElementById('share-link').value = link;
  document.getElementById('result-box').classList.remove('hidden');
}

function copyLink() {
  const link = document.getElementById('share-link').value;
  navigator.clipboard.writeText(link);
  alert('Link copied!');
}

async function deleteText() {
  if (!currentId) return;
  await fetch(`/api/texts/${currentId}`, { method: 'DELETE' });
  alert('Text deleted.');
  document.getElementById('result-box').classList.add('hidden');
  document.getElementById('text-input').value = '';
  currentId = null;
}

async function retrieveText() {
  let input = document.getElementById('retrieve-id').value.trim();

  // Extract ID if full URL was pasted
  if (input.includes('/api/texts/')) {
    input = input.split('/api/texts/')[1];
  }

  const res = await fetch(`/api/texts/${input}`);

  if (res.status === 404) {
    alert('Text not found or has expired.');
    return;
  }

  const data = await res.json();
  document.getElementById('retrieved-text').value = data.text;
  document.getElementById('retrieved-box').classList.remove('hidden');
}