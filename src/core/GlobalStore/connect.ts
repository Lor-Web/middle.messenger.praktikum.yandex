import type Block from '@/core/Block/Block';
import type { BlockOwnProps } from '@/core/Block/Block';
import type { Indexed } from '@/shared/lib/utility';

import GlobalStore from './GlobalStore';

type Constructable<P extends BlockOwnProps> = {
  new (props?: P): Block<P>;
};

export default function connect<P extends BlockOwnProps>(
  mapStateToProps: (state: Indexed) => Partial<P>,
) {
  return function (Component: Constructable<P>) {
    // @ts-expect-error wrapped page already implements abstract template
    return class extends Component {
      constructor(props?: P) {
        super({ ...(props as P), ...mapStateToProps(GlobalStore.getState() as Indexed) });

        GlobalStore.subscribe(() => {
          super.setProps(mapStateToProps(GlobalStore.getState() as Indexed));
        });
      }

      public setProps(props: Partial<P>) {
        super.setProps({
          ...props,
          ...mapStateToProps(GlobalStore.getState() as Indexed),
        });
      }
    };
  };
}
