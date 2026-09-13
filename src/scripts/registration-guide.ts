const trigger = document.querySelector<HTMLAnchorElement>('[data-registration-open]');
const dialog = document.querySelector<HTMLDialogElement>('#registration-dialog');

if (trigger && dialog && typeof dialog.showModal === 'function') {
  trigger.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (dialog.open) return;
    dialog.showModal();
    document.documentElement.classList.add('registration-modal-open');
  });
  dialog.querySelector('[data-registration-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('registration-modal-open');
    trigger.focus({ preventScroll: true });
  });
  // Close on an intentional backdrop click, not when clicking empty space inside the panel.
  const outside = (event: PointerEvent | MouseEvent) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog && outside(event); });
  dialog.addEventListener('pointercancel', () => { backdropDown = false; });
  dialog.addEventListener('click', event => {
    if (backdropDown && event.target === dialog && outside(event)) dialog.close();
    backdropDown = false;
  });
  // Native dialog provides focus trapping, inert background content, and Escape dismissal.
}
