/**
 * s = (v₁² - v₀²) / (2 * a), 
 * 获取位移
 * @param {Number} a, 加速度
 * @param {Number} vt, 截止速度
 * @param {Number} v0, 起始速度
 * @return {Number} 位移
 */
export const s = ({
    a,
    vt,
    v0
}) => (vt ** 2 - v0 ** 2) / (2 * a);

/**
 * t = (v₁ - v₀) / a
 * 求速度变化所需的时间
 */
export const t = ({
    vt,
    v0,
    a
}) => (vt - v0) / a;

/**
 * 减速时间, 单位ms
 * s = (v₁² - v₀²) / (2 * a)
 * 求指定距离的滑动时间
 * t = (v₁ - v₀) / a
 */
export const vt = ({
    a,
    s,
    v0
}) => Math.sqrt(2 * a * s + Math.pow(v0, 2));



// 上标: º ¹ ² ³ ⁴⁵ ⁶ ⁷ ⁸ ⁹ ⁺ ⁻ ⁼ ⁽ ⁾ ⁿ ′ ½
// 下标:₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₊ ₋ ₌ ₍ ₎