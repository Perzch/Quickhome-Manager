// 用法：v-debounce:time="handler"
export default {
    mounted(el, binding) {
        el.addEventListener("click", () => {
            el.classList.add("is-disabled")
            el.disabled = true
            setTimeout(() => {
                el.disabled = false
                el.classList.remove("is-disabled")
            }, binding.arg || 2000);
        });
    },
}
