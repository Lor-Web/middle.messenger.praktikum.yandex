import Handlebars from 'handlebars';

export type EventListType = Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;

export interface BlockOwnProps {
  __children?: Array<{
    component: Block<object>;
    embed(node: DocumentFragment): void;
  }>;
  __refs?: Record<string, Element>;
}

export default abstract class Block<Props extends BlockOwnProps = object> {
  static componentName: string;
  /** Шаблонная строка, из которой будет формироваться компонент */
  /** Это обязательное свойство для всех компонентов, поэтому объявим его защищённым и абстрактным */
  protected abstract template: string;

  /** Cвойства шаблона: текст для кнопки, плейсхолдер для поля ввода и прочее */
  protected props = {} as Props;

  /** DOM-элемент, созданный из шаблонной строки */
  private domElement: Element | null = null;

  /** В этом объекте ключ — это название метода, а значение — обработчик */
  protected events: EventListType = {};

  // protected refs: Record<string, Element> = {};
  protected refs: Record<string, Element> = {};

  children: Block<object>[] = [];

  /** Если у компонента нет свойств, задаём пустой объект */
  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);

    const templateElement = document.createElement('template');
    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    if (this.props.__children) {
      /** Сохраняем все дочерние компоненты */
      this.children = this.props.__children.map((child) => child.component);

      /** Для каждого элемента массива вызываем метод embed, который заменит заглушку на соответствующий дочерний компонент */
      this.props.__children.forEach((child) => {
        child.embed(fragment);
      });
    }

    const defaultRefs = this.props?.__refs ?? {};
    /** Инициализация списка ссылок на элементы */
    this.refs = Array.from(fragment.querySelectorAll('[ref]')).reduce((list, element) => {
      const key = element.getAttribute('ref') as string;
      list[key] = element as HTMLElement;
      element.removeAttribute('ref');
      return list;
    }, defaultRefs);

    return templateElement.content.firstElementChild;
  }

  /** Метод добавления обработчиков событий на элемент */
  private attachListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events?.[eventName as keyof HTMLElementEventMap];

      if (typeof eventCallback == 'function' && this.domElement) {
        this.domElement.addEventListener(eventName, eventCallback);
      }
    }
  }

  /** Метод, удаляющий добавленные ранее события */
  private removeListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events?.[eventName as keyof HTMLElementEventMap];

      if (typeof eventCallback === 'function' && this.domElement) {
        this.domElement.removeEventListener(eventName, eventCallback);
      }
    }
  }

  /** Метод для переопределения в классе-наследнике */
  protected componentDidMount() {
    /** В базовом классе здесь ничего нет */
  }

  /** Метод подключает обработчики и вызывает componentDidMount */
  private mountComponent() {
    /** Здесь можно будет реализовать общую для всех компонентов логику */

    this.attachListeners();
    /** Вызов метода, который мог быть переопределён в классе-наследнике */
    this.componentDidMount();
  }

  /** Метод для переопределения в классе-наследнике */
  protected componentWillUnmount() {
    /** В базовом классе здесь ничего нет */
  }

  /** Метод для общей unmount-логики и вызова componentWillUnmount */
  private unmountComponent() {
    /** Проверка наличия элемента, нужно для первого рендера */
    if (this.domElement) {
      /** Вызов метода, который мог быть переопределён в классе-наследнике */
      //Вызываем очистку в порядке, обратном созданию
      this.children.reverse().forEach((child) => child.unmountComponent());

      this.componentWillUnmount();
      this.removeListeners();

      /** Здесь можно будет реализовать общую для всех компонентов логику */
    }
  }

  protected render() {
    this.unmountComponent();
    const fragment = this.compile();

    /** Если элемент уже существовал, обновляем его по имеющейся ссылке */
    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment);
    }

    this.domElement = fragment;
    this.mountComponent();
  }

  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }

    return this.domElement;
  }

  public getRef(name: string): Element | undefined {
    return this.refs[name];
  }

  public setProps(props: Partial<Props>) {
    /** Мёржим обновляемые свойства */
    this.props = { ...this.props, ...props, __children: [], __refs: {} };
    /** Вызываем метод render, обновляя представление в DOM-дереве */
    this.render();
  }
}
