import Handlebars from "handlebars";

import authTpl from "./pages/auth.hbs?raw";
import registerTpl from "./pages/register.hbs?raw";
import chatsTpl from "./pages/chats.hbs?raw";

import sidebarTpl from "./layouts/sidebar/sidebar.hbs?raw";

import buttonTpl from "./components/button/button.hbs?raw";
import inputTpl from "./components/input/input.hbs?raw";
import cardTpl from "./components/card/card.hbs?raw";
import chatItemTpl from "./components/chat-item/chat-item.hbs?raw";
import counterTpl from "./components/counter/counter.hbs?raw";

import formatDate from "./helpers/formatDate";

import { chats } from "./mocks/chats.mock";

Handlebars.registerPartial("sidebar", sidebarTpl);

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("input", inputTpl);
Handlebars.registerPartial("card", cardTpl);
Handlebars.registerPartial("chat-item", chatItemTpl);
Handlebars.registerPartial("counter", counterTpl);

Handlebars.registerHelper("formatDate", formatDate);

document.body.innerHTML = Handlebars.compile(chatsTpl)({ chats });
