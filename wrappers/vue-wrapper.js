import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';

export default defineComponent({
  name: 'BjPassAuthWidget',
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    onSuccess: {
      type: Function,
      default: () => {}
    },
    onError: {
      type: Function,
      default: () => {}
    },
    onLogout: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const container = ref(null);
    let widget = null;

    onMounted(async () => {
      const BjPass = (await import('bj-pass-auth-widget')).default;
      
      widget = new BjPass({
        ...props.config,
        ui: {
          ...props.config.ui,
          container: `#${container.value.id}`
        },
        onSuccess: props.onSuccess,
        onError: props.onError,
        onLogout: props.onLogout
      });
    });

    onBeforeUnmount(() => {
      if (widget) {
        widget.destroy();
      }
    });

    return { container };
  },
  template: '<div id="bjpass-auth-container" ref="container"></div>'
});