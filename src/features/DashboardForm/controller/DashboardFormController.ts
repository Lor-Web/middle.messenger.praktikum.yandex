import GlobalStore from '@/core/GlobalStore/GlobalStore';
import ChatsApi from '@/shared/api/ChatsApi';
import { blurActiveElement } from '@/shared/lib/blurActiveElement';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import type { DashboardFormModel } from '../models/DashboardFormModel';
import type { DashboardFormValues } from '../types/dashboardForm.type';
import type DashboardFormView from '../view/DashboardFormView';

export default class DashboardFormController extends ChatsApi {
  constructor(
    private model: DashboardFormModel,
    private view: DashboardFormView,
  ) {
    super();
  }

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const form = this.view.getRef('dashboardForm');

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
    const form = this.view.getRef('dashboardForm');

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
    blurActiveElement();
    this.syncValuesFromView();
    this.updateView();

    if (this.model.validate()) {
      this.createChat({ title: this.model.getValues().chatName })
        .then(() => this.chats({}))
        .then((chats) => {
          GlobalStore.setState('chats', chats);
        })
        .catch((error: { response?: string }) => {
          this.view.setProps({
            values: this.model.getValues(),
            errors: { ...this.model.getErrors(), createChat: error.response },
          });
        });
    }
  }

  private handleBlur(input: HTMLInputElement): void {
    const field = input.name as keyof DashboardFormValues;

    this.model.setValue(field, input.value);
    this.model.validateField(field);
    this.updateView();
  }

  private syncValuesFromView(): void {
    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        const field = input.name as keyof DashboardFormValues;
        this.model.setValue(field, input.value);
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
