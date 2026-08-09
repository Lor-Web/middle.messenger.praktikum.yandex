import Handlebars from "handlebars";

import authTpl from "./pages/auth.hbs?raw";
import registerTpl from "./pages/register.hbs?raw";

import buttonTpl from "./components/button/button.hbs?raw";
import inputTpl from "./components/input/input.hbs?raw";
import cardTpl from "./components/card/card.hbs?raw";

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("input", inputTpl);
Handlebars.registerPartial("card", cardTpl);

document.body.innerHTML = Handlebars.compile(authTpl)();
