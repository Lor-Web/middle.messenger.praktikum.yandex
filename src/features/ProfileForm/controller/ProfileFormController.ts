import { listenerForChild } from '../../../shared/lib/setListenerForChild';
import type { ProfileFormModel } from '../models/ProfileFormModel';
import type { ProfileFormValues } from '../types/profileForm.type';
import type ProfileFormView from '../view/ProfileFormView';

export default class ProfileFormController {
  constructor(
    private model: ProfileFormModel,
    private view: ProfileFormView,
  ) {}

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const form = this.view.getRef('profileForm');

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
    const form = this.view.getRef('profileForm');

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
        const field = input.name as keyof ProfileFormValues;
        this.model.validateField(field);
        this.updateView();
      }
    });

    if (this.model.validate()) {
      console.log(this.model.getValues());
    }
  }

  private handleBlur(input: HTMLInputElement): void {
    const field = input.name as keyof ProfileFormValues;
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
