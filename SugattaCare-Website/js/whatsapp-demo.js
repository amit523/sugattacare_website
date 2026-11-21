const phone = '918750804069';
const followUp = document.querySelector('.follow-up');
const followUpText = document.querySelector('.follow-up-text');
const sendLink = document.querySelector('.send-whatsapp');
document.querySelectorAll('.quick-actions button').forEach((button) => {
  button.addEventListener('click', () => {
    const message = button.dataset.message;
    followUpText.textContent = message;
    followUp.hidden = false;
    sendLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    document.querySelector('.chat-body').scrollTop = document.querySelector('.chat-body').scrollHeight;
  });
});
