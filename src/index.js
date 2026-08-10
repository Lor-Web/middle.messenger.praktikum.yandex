import Handlebars from "handlebars";

import authTpl from "./pages/auth.hbs?raw";
import registerTpl from "./pages/register.hbs?raw";
import chatsTpl from "./pages/chats.hbs?raw";

import sidebarTpl from "./layouts/sidebar/sidebar.hbs?raw";
import chatWindowTpl from "./layouts/chat-window/chat-window.hbs?raw";

import buttonTpl from "./components/button/button.hbs?raw";
import inputTpl from "./components/input/input.hbs?raw";
import cardTpl from "./components/card/card.hbs?raw";
import chatItemTpl from "./components/chat-item/chat-item.hbs?raw";
import counterTpl from "./components/counter/counter.hbs?raw";
import messageItemTpl from "./components/message-item/message-item.hbs?raw";
import iconTpl from "./components/icon/icon.hbs?raw";

import formatDate from "./helpers/formatDate";
import getIcon from "./helpers/getIcon";
import authorMessage from "./helpers/authorMessage";
import messageTypeText from "./helpers/messageTypeText";

import { chats } from "./mocks/chats.mock";
import { messages } from "./mocks/messages.mock";
import { user } from "./mocks/user.mock";

Handlebars.registerPartial("sidebar", sidebarTpl);
Handlebars.registerPartial("chat-window", chatWindowTpl);

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("input", inputTpl);
Handlebars.registerPartial("card", cardTpl);
Handlebars.registerPartial("chat-item", chatItemTpl);
Handlebars.registerPartial("counter", counterTpl);
Handlebars.registerPartial("message-item", messageItemTpl);
Handlebars.registerPartial("icon", iconTpl);

Handlebars.registerHelper("formatDate", formatDate);
Handlebars.registerHelper("icon", getIcon);
Handlebars.registerHelper("authorMessage", authorMessage);
Handlebars.registerHelper("messageTypeText", messageTypeText);

document.body.innerHTML = Handlebars.compile(chatsTpl)({
  chats,
  messages,
  user,
});
