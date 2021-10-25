
const __ANY_SCROLL = '.any-scroll';
const TRACK_WIDTH = `8px`;
const TRACK_COLOR = 'rgba(177,177,177,0.6)';
const THUMB_COLOR = 'rgba(55,55,55,0.6)';

export const TRACK_CLASS_NAME = 'scroll-bar-track';
export const THUMB_CLASS_NAME = 'scroll-bar-thumb';
export const BAR_CSS = `
${__ANY_SCROLL} {
    display: block;
    position: relative;
    overflow:hidden;
}

${__ANY_SCROLL} > .${TRACK_CLASS_NAME}{
    position:absolute;
    right:0;
    bottom:0;
    background: ${TRACK_COLOR};
}

${__ANY_SCROLL} >.${TRACK_CLASS_NAME} > .${THUMB_CLASS_NAME}{
    width: ${TRACK_WIDTH};
    height: ${TRACK_WIDTH};
    background: ${THUMB_COLOR};
    border-radius:4px;
}

${__ANY_SCROLL} > .${TRACK_CLASS_NAME}-x{
    left:0;
    height:${TRACK_WIDTH};
}

${__ANY_SCROLL} > .${TRACK_CLASS_NAME}-y{
    top:0;
    width:${TRACK_WIDTH};
}
`;
export const enum DIRECTION { X = 'x', Y = 'y' };