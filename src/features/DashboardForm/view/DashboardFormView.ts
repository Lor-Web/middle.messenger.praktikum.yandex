import Block, { type BlockOwnProps } from '@/core/Block/Block';
import type { FormErrors } from '@/shared/models/form/form.type';

import DashboardFormController from '../controller/DashboardFormController';
import { DashboardFormModel } from '../models/DashboardFormModel';
import type { DashboardFormValues } from '../types/dashboardForm.type';

export interface DashboardFormProps extends BlockOwnProps {
  values: DashboardFormValues;
  errors: FormErrors<DashboardFormValues>;
}

export default class DashboardFormView extends Block<DashboardFormProps> {
  static componentName = 'DashboardFormView';

  protected componentDidMount(): void {
    const model = new DashboardFormModel(this.props.values, this.props.errors);
    const controller = new DashboardFormController(model, this);

    controller.init();
  }

  protected template = `
    <form class="dashboard-form" ref="dashboardForm">
      {{{ Input 
        label="Название чата" 
        placeholder="Название чата" 
        name='chatName' 
        value=values.chatName 
        error=errors.chatName 
      }}}

      {{{ Button type='submit' icon='arrow-right' }}}

      {{#if errors.createChat}}
        <p class="error-text">{{errors.createChat}}</p>
      {{/if}}
    </form>
  `;
}
