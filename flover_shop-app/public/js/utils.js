/**
 * utils.js — глобальные утилиты клиентского кода
 */

function showToast(message, type = 'success') {
  const el = document.getElementById('appToast');
  const msg = document.getElementById('toastMsg');
  if (!el || !msg) return;

  msg.textContent = message;
  el.className = `toast align-items-center border-0 text-bg-${type}`;

  const toast = new bootstrap.Toast(el, { delay: 3500 });
  toast.show();
}
