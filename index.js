import Handlebars from "handlebars";

import layoutTpl from "./layouts/layout.hbs?raw";

import buttonTpl from "./components/button/button.hbs?raw";

Handlebars.registerPartial("new-chat-button", buttonTpl);

document.body.innerHTML = Handlebars.compile(layoutTpl)();
