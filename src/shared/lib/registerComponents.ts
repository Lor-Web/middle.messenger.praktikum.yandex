import registerComponent from '../../core/registerComponent/registerComponent';
import AuthFormView from '../../features/AuthForm/view/AuthFormView';
import ChatWindowFormView from '../../features/ChatWindowForm/view/ChatWindowFormView';
import ProfileFormView from '../../features/ProfileForm/view/ProfileFormView';
import RegisterFormView from '../../features/RegisterForm/view/RegisterFormView';
import AuthCard from '../../widgets/AuthCard';
import ChatWindow from '../../widgets/ChatWindow';
import Profile from '../../widgets/Profile';
import RegisterCard from '../../widgets/RegisterCard';
import Sidebar from '../../widgets/Sidebar';
import Button from '../ui/Button';
import ChatItem from '../ui/ChatItem';
import Counter from '../ui/Counter';
import Icon from '../ui/Icon';
import Input from '../ui/Input';
import MessageItem from '../ui/MessageItem';
import Textarea from '../ui/Texarea';

const SHARED_UI = [Input, Textarea, Button, Icon, ChatItem, Counter, MessageItem];
const WIDGETS = [AuthCard, RegisterCard, Sidebar, ChatWindow, Profile];
const FEATURES = [AuthFormView, RegisterFormView, ChatWindowFormView, ProfileFormView];

export const registerComponents = () => {
  const allComponents = [...SHARED_UI, ...WIDGETS, ...FEATURES];
  allComponents.forEach((c) => registerComponent(c));
};
