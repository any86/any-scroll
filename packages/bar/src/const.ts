const TRACK_WIDTH = `8px`;
const TRACK_COLOR = 'rgba(177,177,177,0.6)';
const THUMB_COLOR = 'rgba(55,55,55,0.6)';

export const TRACK_CLASS_NAME = 'scroll-bar-track';
export const THUMB_CLASS_NAME = 'scroll-bar-thumb';
export const BAR_CSS = `
.${TRACK_CLASS_NAME}{
    right:0;
    bottom:0;
    background: ${TRACK_COLOR};
    transition:opacity .5s ease-out;
}

.${TRACK_CLASS_NAME} > .${THUMB_CLASS_NAME}{
    width: ${TRACK_WIDTH};
    height: ${TRACK_WIDTH};
    background: ${THUMB_COLOR};
    border-radius:4px;
}

.${TRACK_CLASS_NAME}-x{
    left:0;
    height:${TRACK_WIDTH};
}

.${TRACK_CLASS_NAME}-y{
    top:0;
    width:${TRACK_WIDTH};
}
`;
