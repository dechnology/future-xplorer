export const onBackdropClick = (e: MouseEvent, cb: () => void) => {
  const { x, y } = e;
  const { left, right, top, bottom } = (
    e.target as HTMLDialogElement
  ).getBoundingClientRect();

  if (x < left || x > right || y < top || y > bottom) {
    cb();
  }
};
