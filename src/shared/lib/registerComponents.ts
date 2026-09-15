import type { BlockOwnProps } from '@/core/Block/Block';
import type { ComponentClass } from '@/core/registerComponent/registerComponent';
import registerComponent from '@/core/registerComponent/registerComponent';
import AuthFormView from '@/features/AuthForm/view/AuthFormView';
import ChatWindowFormView from '@/features/ChatWindowForm/view/ChatWindowFormView';
import DashboardFormView from '@/features/DashboardForm/view/DashboardFormView';
import ProfileFormView from '@/features/ProfileForm/view/ProfileFormView';
import RegisterFormView from '@/features/RegisterForm/view/RegisterFormView';
import AuthCard from '@/widgets/AuthCard';
import ChatWindow from '@/widgets/ChatWindow';
import Profile from '@/widgets/Profile';
import RegisterCard from '@/widgets/RegisterCard';
import Sidebar from '@/widgets/Sidebar';

import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import ChatItem from '../ui/ChatItem';
import Counter from '../ui/Counter';
import Icon from '../ui/Icon';
import Input from '../ui/Input';
import MessageItem from '../ui/MessageItem';
import Textarea from '../ui/Texarea';

const SHARED_UI = [Avatar, Input, Textarea, Button, Icon, ChatItem, Counter, MessageItem];
const WIDGETS = [AuthCard, RegisterCard, Sidebar, ChatWindow, Profile];
const FEATURES = [
  AuthFormView,
  RegisterFormView,
  ChatWindowFormView,
  ProfileFormView,
  DashboardFormView,
];

export const registerComponents = () => {
  const allComponents = [...SHARED_UI, ...WIDGETS, ...FEATURES] as ComponentClass<BlockOwnProps>[];

  allComponents.forEach((component) => registerComponent(component));
};
