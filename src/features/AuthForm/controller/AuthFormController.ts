import { loadAppData } from '@/core/GlobalStore/load';
import Router from '@/core/Router/Router';
import AuthApi from '@/shared/api/AuthApi';
import { MESSENGER_PATH, REGISTER_PATH } from '@/shared/constants/paths.constant';
import { blurActiveElement } from '@/shared/lib/blurActiveElement';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import type { AuthFormModel } from '../models/AuthFormModel';
import type { AuthFormValues } from '../types/authForm.type';
import type AuthFormView from '../view/AuthFormView';

export default class AuthFormController extends AuthApi {
  private _router: Router;

  constructor(
    private model: AuthFormModel,
    private view: AuthFormView,
  ) {
    super();
    this._router = new Router();
  }

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const form = this.view.getRef('authForm');
    const linkRegister = this.view.getRef('linkRegister');

    if (linkRegister instanceof HTMLAnchorElement) {
      listenerForChild.set({
        element: linkRegister,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          this._router.go(REGISTER_PATH);
        },
      });
    }

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
    const linkRegister = this.view.getRef('linkRegister');

    if (linkRegister instanceof HTMLAnchorElement) {
      listenerForChild.remove({
        element: linkRegister,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          this._router.go(REGISTER_PATH);
        },
      });
    }

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
      console.log('AUTH FORM VALUES:', this.model.getValues());

      this.signIn(this.model.getValues())
        .then(() => loadAppData())
        .then(() => this._router.go(MESSENGER_PATH))
        .catch((e) => {
          const error = e.response;
          this.view.setProps({
            values: this.model.getValues(),
            errors: { ...this.model.getErrors(), signIn: error },
          });
        });
    }
  }

  private handleBlur(input: HTMLInputElement): void {
    const field = input.name as keyof AuthFormValues;
    this.model.setValue(field, input.value);
    this.model.validateField(field);
    this.updateView();
  }

  private syncValuesFromView(): void {
    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        const field = input.name as keyof AuthFormValues;
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
