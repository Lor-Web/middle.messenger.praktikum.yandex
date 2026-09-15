import UserApi from '@/shared/api/UserApi';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import type { ProfileFormModel } from '../models/ProfileFormModel';
import type { ProfileFormErrors, ProfileFormValues } from '../types/profileForm.type';
import type ProfileFormView from '../view/ProfileFormView';

export default class ProfileFormController extends UserApi {
  constructor(
    private model: ProfileFormModel,
    private view: ProfileFormView,
  ) {
    super();
  }

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
        if (input.type === 'file') {
          listenerForChild.set({
            element: input,
            eventName: 'change',
            eventCallback: () => {
              this.handleAvatarChange(input);
            },
          });
        } else {
          listenerForChild.set({
            element: input,
            eventName: 'blur',
            eventCallback: () => {
              this.handleBlur(input);
            },
          });
        }
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
        if (input.type === 'file') {
          listenerForChild.remove({
            element: input,
            eventName: 'change',
            eventCallback: () => {
              this.handleAvatarChange(input);
            },
          });
        } else {
          listenerForChild.remove({
            element: input,
            eventName: 'blur',
            eventCallback: () => {
              this.handleBlur(input);
            },
          });
        }
      }
    });
  }

  private handleSubmitForm(e: Event) {
    e.preventDefault();
    this.syncValuesFromView();

    const shouldEditProfile = this.model.hasProfileChanged();
    const shouldEditPassword = this.model.hasPasswordsFilled();

    let isProfileValid = true;
    let isPasswordValid = true;

    if (shouldEditProfile) {
      isProfileValid = this.model.validateProfile();
    } else {
      this.model.clearProfileErrors();
    }

    if (shouldEditPassword) {
      isPasswordValid = this.model.validatePassword();
    } else {
      this.model.clearPasswordErrors();
    }

    if (!isProfileValid || !isPasswordValid) {
      this.updateView();
      return;
    }

    const requests: Promise<void>[] = [];
    const nextValues: ProfileFormValues = { ...this.model.getValues() };
    const nextErrors: ProfileFormErrors = { ...this.model.getErrors() };
    let nextUser = this.view.getUser();

    if (shouldEditProfile) {
      requests.push(
        this.editProfile(this.model.getProfileRequest())
          .then((user) => {
            nextUser = user;
            nextErrors.editProfile = undefined;
          })
          .catch((error: { response?: string }) => {
            nextErrors.editProfile = error.response;
          }),
      );
    }

    if (shouldEditPassword) {
      requests.push(
        this.editPassword(this.model.getPasswordRequest())
          .then(() => {
            nextValues.old_password = '';
            nextValues.new_password = '';
            nextErrors.old_password = undefined;
            nextErrors.new_password = undefined;
            nextErrors.editPassword = undefined;
          })
          .catch((error: { response?: string }) => {
            nextErrors.editPassword = error.response;
          }),
      );
    }

    if (requests.length === 0) {
      this.updateView();
      return;
    }

    Promise.all(requests).then(() => {
      this.view.setProps({
        user: nextUser,
        values: nextValues,
        errors: nextErrors,
      });
    });
  }

  private handleAvatarChange(input: HTMLInputElement): void {
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.editAvatar(file)
      .then((user) => {
        this.view.setProps({
          user,
          values: this.model.getValues(),
          errors: { ...this.model.getErrors(), editAvatar: undefined },
        });
      })
      .catch((error: { response?: string }) => {
        this.view.setProps({
          values: this.model.getValues(),
          errors: { ...this.model.getErrors(), editAvatar: error.response },
        });
      });
  }

  private handleBlur(input: HTMLInputElement): void {
    if (input.type === 'file' || !this.model.isEditableField(input.name)) {
      return;
    }

    const field = input.name;
    this.model.setValue(field, input.value);

    if (this.model.shouldValidateField(field)) {
      this.model.validateField(field);
    } else {
      this.model.clearFieldError(field);
    }

    this.updateView();
  }

  private syncValuesFromView(): void {
    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (!(input instanceof HTMLInputElement) || input.type === 'file') {
        return;
      }

      if (this.model.isEditableField(input.name)) {
        this.model.setValue(input.name, input.value);
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
