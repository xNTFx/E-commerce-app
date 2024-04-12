interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      isDisabled: boolean;
      supportsFiber: boolean;
      inject: (fiber: unknown) => void;
      onCommitFiberRoot: (instance: unknown, fiber: unknown) => void;
      onCommitFiberUnmount: (fiber: unknown) => void;
    };
  }