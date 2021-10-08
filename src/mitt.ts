import mitt from 'mitt'

type Events = {
    update?: string,
    updatePrice?: number
};

const emitter = mitt<Events>()

export {
    emitter as mitt,
}
