/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-prettier-scss"],
  ignoreFiles: ["./src/styles/base/_normalized.scss"],
  rules: {
    // Разрешаем пустые строки между группами Sass-переменных
    "scss/dollar-variable-empty-line-before": null,
    // БЭМ: .block__element, .block--modifier
    "selector-class-pattern": null,

    "scss/operator-no-unspaced": null,
  },
};
