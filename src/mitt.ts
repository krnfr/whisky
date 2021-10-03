import mitt from 'mitt'

type Events = {
    update?: string
};

const emitter = mitt<Events>()

export {
    emitter as mitt,
}
