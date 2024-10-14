<template>
    <div>
        <button @click="toggleMenu" class="z-50 lg:hidden">
            <svg v-if="!isMenuOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>

        <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isMenuOpen" class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" @click="closeMenu"></div>
        </transition>

        <transition enter-active-class="transition duration-300 ease-in-out transform" enter-from-class="-translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition duration-300 ease-in-out transform" leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
            <nav v-if="isMenuOpen" class="fixed top-0 left-0 z-50 w-64 h-full overflow-hidden bg-white shadow-lg lg:hidden">
                <div class="flex flex-col h-full pt-16 pb-4">
                    <slot></slot>
                </div>
            </nav>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'MobileMenu',
    data() {
        return {
            isMenuOpen: false
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
            this.updateBodyScroll()
        },
        closeMenu() {
            this.isMenuOpen = false
            this.updateBodyScroll()
        },
        updateBodyScroll() {
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : ''
        }
    },
    mounted() {
        if (this.$router) {
            this.$router.afterEach(() => {
                this.closeMenu()
            })
        }
    }
}
</script>