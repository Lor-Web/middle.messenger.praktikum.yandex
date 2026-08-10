import Handlebars from "handlebars";

import authTpl from "./pages/auth.hbs?raw";
import registerTpl from "./pages/register.hbs?raw";
import dashboardTpl from "./pages/dashboard.hbs?raw";
import settingsTpl from "./pages/settings.hbs?raw";

import sidebarTpl from "./layouts/sidebar/sidebar.hbs?raw";
import chatWindowTpl from "./layouts/chat-window/chat-window.hbs?raw";
import profileTpl from "./layouts/profile/profile.hbs?raw";

import buttonTpl from "./components/button/button.hbs?raw";
import inputTpl from "./components/input/input.hbs?raw";
import cardTpl from "./components/card/card.hbs?raw";
import chatItemTpl from "./components/chat-item/chat-item.hbs?raw";
import counterTpl from "./components/counter/counter.hbs?raw";
import messageItemTpl from "./components/message-item/message-item.hbs?raw";
import iconTpl from "./components/icon/icon.hbs?raw";
import textAreaTpl from "./components/textarea/textarea.hbs?raw";

import formatDate from "./helpers/formatDate";
import getIcon from "./helpers/getIcon";
import authorMessage from "./helpers/authorMessage";
import messageTypeText from "./helpers/messageTypeText";

import { chats } from "./mocks/chats.mock";
import { messages } from "./mocks/messages.mock";
import { user } from "./mocks/user.mock";

Handlebars.registerPartial("sidebar", sidebarTpl);
Handlebars.registerPartial("chat-window", chatWindowTpl);
Handlebars.registerPartial("profile", profileTpl);

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("input", inputTpl);
Handlebars.registerPartial("card", cardTpl);
Handlebars.registerPartial("chat-item", chatItemTpl);
Handlebars.registerPartial("counter", counterTpl);
Handlebars.registerPartial("message-item", messageItemTpl);
Handlebars.registerPartial("icon", iconTpl);
Handlebars.registerPartial("textarea", textAreaTpl);

Handlebars.registerHelper("formatDate", formatDate);
Handlebars.registerHelper("icon", getIcon);
Handlebars.registerHelper("authorMessage", authorMessage);
Handlebars.registerHelper("messageTypeText", messageTypeText);

const ROTUES = {
  auth: {
    template: authTpl,
  },
  register: {
    template: registerTpl,
  },
  dashboard: {
    template: dashboardTpl,
    data: {
      chats,
      messages,
      user,
    },
  },
  settings: {
    template: settingsTpl,
    data: {
      chats,
      messages,
      user,
    },
  },
  404: {
    template: "404", // TODO: сделать страницу 404
  },
};

const render = () => {
  const path = window.location.pathname.split("/").filter((v) => v !== "");

  if (!path.length) {
    window.location.pathname = "auth";
  }

  if (!ROTUES[path[0]]) {
    window.location.pathname = "404";
  }

  if (path.length > 1) {
    document.body.innerHTML = Handlebars.compile(ROTUES[path[0]].template)(
      ROTUES[path[0]].data
    );
  } else {
    document.body.innerHTML = Handlebars.compile(ROTUES[path].template)(
      ROTUES[path].data
    );
  }
};

window.addEventListener("DOMContentLoaded", render);

document.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.target;

  if (
    form.dataset.form === "auth-form" ||
    form.dataset.form === "register-form"
  ) {
    window.location.pathname = "/dashboard/chats";
    render();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const chatItem = document.querySelector(".chat-item");
  chatItem?.addEventListener("click", () => {
    window.location.pathname = "/dashboard/chats";
    render();
  });
});
