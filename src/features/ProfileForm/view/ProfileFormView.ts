import type { BlockOwnProps } from '../../../core/Block/Block';
import Block from '../../../core/Block/Block';
import type { User } from '../../../shared/models/base.type';
import type { FormErrors } from '../../../shared/models/form/form.type';
import ProfileFormController from '../controller/ProfileFormController';
import { ProfileFormModel } from '../models/ProfileFormModel';
import type { ProfileFormValues } from '../types/profileForm.type';

export interface ProfileFormProps extends BlockOwnProps {
  user: User;
  values: ProfileFormValues;
  errors: FormErrors<ProfileFormValues>;
}

export default class ProfileFormView extends Block<ProfileFormProps> {
  static componentName = 'ProfileFormView';

  protected componentDidMount(): void {
    const initialValues = this.props.values ?? {
      first_name: this.props.user?.firstName,
      second_name: this.props.user?.secondName,
      display_name: this.props.user?.displayName,
      login: this.props.user?.login,
      email: this.props.user?.email,
      phone: this.props.user?.phone,
    };

    if (!this.props.values) {
      this.setProps({
        values: initialValues,
      });
    }

    const model = new ProfileFormModel(initialValues, this.props.errors);
    const controller = new ProfileFormController(model, this);

    controller.init();
  }

  protected template = `
    <form class="profile__data-form" ref="profileForm">
      {{{ Input type='file' label="Загрузить аватар" placeholder="Загрузить аватар" name='avatar' }}}
      {{{ Input 
        label="Имя" 
        placeholder="Имя" 
        name='first_name' 
        value=values.first_name 
        error=errors.first_name 
      }}}
      {{{ Input 
        label="Фамилия" 
        placeholder="Фамилия" 
        name='second_name' 
        value=values.second_name 
        error=errors.second_name 
      }}}
      {{{ Input 
        label="Имя в чате" 
        placeholder="Имя в чате" 
        name='display_name' 
        value=values.display_name 
        error=errors.display_name  
      }}}
      {{{ Input 
        label="Логин" 
        placeholder="Логин" 
        name='login' 
        value=values.login 
        error=errors.login 
      }}}
      {{{ Input 
        label="Почта" 
        placeholder="Почта" 
        name='email'
        value=values.email 
        error=errors.email  
      }}}
      {{{ Input 
        label="Телефон" 
        placeholder="Телефон" 
        name='phone'
        value=values.phone 
        error=errors.phone 
      }}}
      {{{ Input 
        type='password' 
        label="Пароль" 
        placeholder="Пароль" 
        name='old_password'
        value=values.old_password 
        error=errors.old_password  
      }}}
      {{{ Input 
        type='password' 
        label="Новый пароль" 
        placeholder="Новый пароль" 
        name='new_password'
        value=values.new_password 
        error=errors.new_password  
      }}}
      
      {{{ Button label="Сохранить" type='submit' }}}
    </form>
  `;
}
