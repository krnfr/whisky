import mitt from 'mitt'

type Events = {
    finished?: null,
    update?: string,
    updatePrice?: number,
};

const emitter = mitt<Events>()

export {
    emitter as mitt,
}
