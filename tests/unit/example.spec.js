import { shallowMount, mount } from '@vue/test-utils'
import Core from '@/components/Core.vue'

describe('Core.vue', () => {
    it('初始化Core.vue是否成功?', () => {
        const wrapper = mount(Core, {
            sync:true,
            propsData: { width: '100px' }
        })
        expect(wrapper.isVueInstance()).toBeTruthy()
        const {width, height} = getComputedStyle(wrapper.element,null);
        expect(width).toBe('100px');
        expect(height).toBe('500px');

        
        // expect(wrapper.text()).toMatch(msg)
    })
})
