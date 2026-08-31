import { listenerForChild } from '../../../shared/lib/setListenerForChild';
import type { ChatWindowFormModel } from '../models/ChatWindowFormModel';
import type { ChatWindowFormModelValues } from '../types/chatWindowFormModel.type';
import type ChatWindowFormView from '../view/ChatWindowFormView';

export default class ChatWindowFormController {
  constructor(
    private model: ChatWindowFormModel,
    private view: ChatWindowFormView,
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

  private handleSubmitForm(e: Event) {
    e.preventDefault();

    this.view.children.forEach((child) => {
      const textarea = child.getRef('textarea');

      if (textarea instanceof HTMLTextAreaElement) {
        const field = textarea.name as keyof ChatWindowFormModelValues;
        this.model.validateField(field);
        this.updateView();
      }
    });
    if (this.model.validate()) {
      console.log(this.model.getValues());
    }
  }

  private handleBlur(textarea: HTMLTextAreaElement): void {
    const field = textarea.name as keyof ChatWindowFormModelValues;
    this.model.setValue(field, textarea.value);
    this.model.validateField(field);
    this.updateView();
  }

  private updateView(): void {
    this.view.setProps({
      values: this.model.getValues(),
      errors: this.model.getErrors(),
    });
  }
}
