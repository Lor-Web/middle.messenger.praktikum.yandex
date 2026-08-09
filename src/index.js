import Handlebars from "handlebars";

import authTpl from "./pages/auth.hbs?raw";

import buttonTpl from "./components/button/button.hbs?raw";
import inputTpl from "./components/input/input.hbs?raw";

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("input", inputTpl);

document.body.innerHTML = Handlebars.compile(authTpl)();
