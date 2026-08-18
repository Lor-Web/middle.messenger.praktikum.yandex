import registerComponent from '../../core/registerComponent/registerComponent';
import AuthForm from '../../features/AuthForm';
import ChatWindowForm from '../../features/ChatWindowForm';
import ProfileForm from '../../features/ProfileForm';
import RegisterForm from '../../features/RegisterForm';
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
const FEATURES = [AuthForm, RegisterForm, ChatWindowForm, ProfileForm];

export const registerComponents = () => {
  const allComponents = [...SHARED_UI, ...WIDGETS, ...FEATURES];
  allComponents.forEach((c) => registerComponent(c));
};
