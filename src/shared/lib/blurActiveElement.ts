/** Снимает фокус до перерисовки формы, чтобы Enter вёл себя как клик по submit. */
export const blurActiveElement = (): void => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
