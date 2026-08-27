import { listenerForChild } from '../../../shared/lib/setListenerForChild';
import type { AuthFormModel } from '../models/AuthFormModel';
import type { AuthFormValues } from '../types/authForm.type';
import type AuthFormView from '../view/AuthFormView';

export default class AuthFormController {
  constructor(
    private model: AuthFormModel,
    private view: AuthFormView,
  ) {}

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const form = this.view.getRef('authForm');

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
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        listenerForChild.set({
          element: input,
          eventName: 'blur',
          eventCallback: () => {
            this.handleBlur(input);
          },
        });
      }
    });
  }

  private removeListeners() {
    const form = this.view.getRef('authForm');

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
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        listenerForChild.remove({
          element: input,
          eventName: 'blur',
          eventCallback: () => {
            this.handleBlur(input);
          },
        });
      }
    });
  }

  private handleSubmitForm(e: Event) {
    e.preventDefault();

    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        const field = input.name as keyof AuthFormValues;
        this.model.validateField(field);
        this.updateView();
      }
    });

    if (this.model.validate()) {
      console.log(this.model.getValues());
    }
  }

  private handleBlur(input: HTMLInputElement): void {
    const field = input.name as keyof AuthFormValues;
    this.model.setValue(field, input.value);
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
