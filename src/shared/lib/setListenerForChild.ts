export type ListenerForChild = {
  element: Element;
  eventName: keyof HTMLElementEventMap;
  eventCallback: (e: Event) => void;
};

export const listenerForChild = {
  set(props: ListenerForChild) {
    const { element, eventName, eventCallback } = props;

    element.addEventListener(eventName, eventCallback);
  },

  remove(props: ListenerForChild) {
    const { element, eventName, eventCallback } = props;

    element.removeEventListener(eventName, eventCallback);
  },
};
