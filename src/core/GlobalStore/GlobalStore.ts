import { type Indexed, merge, set } from '@/shared/lib/utility';

export type Listener = () => void;

class GlobalStore {
  private state: Indexed = {};
  private listeners: Set<Listener> = new Set();

  public getState(path?: string) {
    return path ? this.state[path] : this.state;
  }

  public setState(path: string, value: unknown) {
    // Создаем новый объект состояния вместо изменения существующего
    this.state = merge(this.state, set({}, path, value) as Indexed);

    // Уведомляем всех подписчиков об изменении
    this.emit();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);

    // Возвращаем функцию для отписки
    return () => {
      this.listeners.delete(listener);
    };
  }

  public reset() {
    this.state = {};
    this.emit();
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }
}

export default new GlobalStore();
