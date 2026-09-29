import { listenerForChild } from '@/shared/lib/setListenerForChild';

import messagesSocket from '../api/MessagesSocket';
import type { ChatFormModel } from '../models/ChatFormModel';
import type { ChatFormValues } from '../types/chatForm.type';
import type ChatFormView from '../view/ChatFormView';

export default class ChatFormController {
  private ignoreBlur = false;

  constructor(
    private model: ChatFormModel,
    private view: ChatFormView,
  ) {}

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const form = this.view.getRef('chatForm');

    if (form instanceof HTMLFormElement) {
      listenerForChild.set({
        element: form as HTMLFormElement,
        eventName: 'submit',
        eventCallback: (e: Event) => {
          this.handleSubmitForm(e);
        },
      });
    }

    const submitBtn = this.view.getRef('submitBtn');

    if (submitBtn instanceof HTMLButtonElement) {
      listenerForChild.set({
        element: submitBtn,
        eventName: 'mousedown',
        eventCallback: (event: Event) => {
          event.preventDefault();
        },
      });
    }

    this.view.children.forEach((child) => {
      const textarea = child.getRef('textarea');

      if (textarea instanceof HTMLTextAreaElement) {
        listenerForChild.set({
          element: textarea,
          eventName: 'blur',
          eventCallback: () => {
            this.handleBlur(textarea);
          },
        });
        listenerForChild.set({
          element: textarea,
          eventName: 'keydown',
          eventCallback: (event: Event) => {
            this.handleMessageKeyDown(event);
          },
        });
      }
    });
  }

  private removeListeners() {
    const form = this.view.getRef('chatForm');

    if (form instanceof HTMLFormElement) {
      listenerForChild.remove({
        element: form as HTMLFormElement,
        eventName: 'submit',
        eventCallback: (e: Event) => {
          this.handleSubmitForm(e);
        },
      });
    }

    this.view.children.forEach((child) => {
      const textarea = child.getRef('textarea');

      if (textarea instanceof HTMLTextAreaElement) {
        listenerForChild.remove({
          element: textarea,
          eventName: 'blur',
          eventCallback: () => {
            this.handleBlur(textarea);
          },
        });
      }
    });
  }

  private handleSubmitForm(event: Event) {
    event.preventDefault();
    this.syncValuesFromView();

    const message = (this.model.getValues().message ?? '').trim();
    this.model.setValue('message', message);

    if (!this.model.validate()) {
      this.updateView();
      return;
    }

    this.ignoreBlur = true;
    messagesSocket.sendMessage(message);
    this.model.setValue('message', '');
    this.clearMessageField();
    this.updateView();
    this.focusMessageField();
    this.ignoreBlur = false;
  }

  private clearMessageField(): void {
    this.view.children.forEach((child) => {
      const textarea = child.getRef('textarea');

      if (textarea instanceof HTMLTextAreaElement) {
        textarea.value = '';
      }
    });
  }

  private focusMessageField(): void {
    this.view.children.forEach((child) => {
      const textarea = child.getRef('textarea');

      if (textarea instanceof HTMLTextAreaElement) {
        textarea.focus();
      }
    });
  }

  private handleMessageKeyDown(event: Event): void {
    if (
      !(event instanceof KeyboardEvent) ||
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.repeat ||
      event.isComposing
    ) {
      return;
    }

    event.preventDefault();
    this.handleSubmitForm(event);
  }

  private handleBlur(textarea: HTMLTextAreaElement): void {
    if (this.ignoreBlur) {
      return;
    }

    const field = textarea.name as keyof ChatFormValues;
    this.model.setValue(field, textarea.value);
    this.model.validateField(field);
    this.updateView();
  }

  private syncValuesFromView(): void {
    this.view.children.forEach((child) => {
      const textarea = child.getRef('textarea');

      if (textarea instanceof HTMLTextAreaElement) {
        const field = textarea.name as keyof ChatFormValues;
        this.model.setValue(field, textarea.value);
        this.model.validateField(field);
      }
    });
  }

  private updateView(): void {
    this.view.setProps({
      values: this.model.getValues(),
      errors: this.model.getErrors(),
    });
  }
}
