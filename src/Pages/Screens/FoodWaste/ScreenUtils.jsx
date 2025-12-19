export const areDOMOverlapped = (rect1, rect2) => {
  if (!(rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
    if (rect1.top < rect2.top) return -1;
    else return 1;
  }
  else return 0;
}
