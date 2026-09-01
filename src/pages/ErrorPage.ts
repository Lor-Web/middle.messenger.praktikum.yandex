import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';

export interface ErrorPageProps extends BlockOwnProps {
  title: string;
  description: string;
}

export default class ErrorPage extends Block<ErrorPageProps> {
  protected template = `
    <main class="error page">
      <div class="card">
        <h1 class="card__title">
          {{title}}
        </h1>

        <p class="error__description">
          {{description}}
        </p>

        <a class="" href="/dashboard">Назад к чатам</a>
      </div>
    </main>
  `;
}
