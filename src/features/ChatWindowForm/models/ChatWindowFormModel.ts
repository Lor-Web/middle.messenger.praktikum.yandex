import type { FormErrors } from '@/shared/models/form/form.type';
import { FormModel } from '@/shared/models/form/FormModel';
import { messageValidator } from '@/shared/models/form/validators';

import type { ChatWindowFormModelValues } from '../types/chatWindowFormModel.type';

export class ChatWindowFormModel extends FormModel<ChatWindowFormModelValues> {
  protected rules = {
    message: {
      validator: messageValidator,
      message: 'Поле не должно быть пустым',
    },
  };

  constructor(values: ChatWindowFormModelValues, errors: FormErrors<ChatWindowFormModelValues>) {
    super(values, errors);
  }
}
