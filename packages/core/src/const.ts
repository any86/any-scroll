export const STYLE: Partial<CSSStyleDeclaration> = {
    overflow: 'hidden',
};

export const CONTENT_STYLE: Partial<CSSStyleDeclaration> = {
    width: '100%',
};

export const SCROLL_END_DELAY = 16;

export const CLASS_NAME_ANY_SCROLL = 'any-scroll';

export const TYPE_BEFORE_DESTROY = 'beforeDestroy';
/**
 * wrap内部事件
 * as.update()时触发,
 * 用来通知子content更新"可滑动范围"
 */
export const TYPE_BEFORE_UPDATED = 'beforeUpdate';
export const TYPE_UPDATED = 'updated';
