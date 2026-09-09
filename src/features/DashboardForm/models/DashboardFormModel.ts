import type { FormErrors } from '@/shared/models/form/form.type';
import { FormModel } from '@/shared/models/form/FormModel';
import { textRequiredValidator } from '@/shared/models/form/validators';

import type { DashboardFormValues } from '../types/dashboardForm.type';

export class DashboardFormModel extends FormModel<DashboardFormValues> {
  protected rules = {
    chatName: {
      validator: textRequiredValidator,
      message: 'Поле не должно быть пустым',
    },
  };

  constructor(values: DashboardFormValues, errors: FormErrors<DashboardFormValues>) {
    super(values, errors);
  }
}
