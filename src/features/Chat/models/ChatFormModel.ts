import type { FormErrors } from '@/shared/models/form/form.type';
import { FormModel } from '@/shared/models/form/FormModel';
import { textRequiredValidator } from '@/shared/models/form/validators';

import type { ChatFormValues } from '../types/chatForm.type';

export class ChatFormModel extends FormModel<ChatFormValues> {
  protected rules = {
    message: {
      validator: textRequiredValidator,
      message: 'Поле не должно быть пустым',
    },
  };

  constructor(values: ChatFormValues, errors: FormErrors<ChatFormValues>) {
    super(values, errors);
  }
}
