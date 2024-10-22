<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useState } from 'nuxt/app'

// Kosár állapot beállítása
const cartItems = useState<number>('cartItems', () => 0)
const cartProducts = useState<any[]>('cartProducts', () => [])

// onMounted: Biztosítjuk, hogy a localStorage-ből betöltés csak a kliens oldalon történjen meg
onMounted(() => {
  const storedCartItems = localStorage.getItem('cartItems')
  const storedCartProducts = localStorage.getItem('cartProducts')

  if (storedCartItems) {
    cartItems.value = JSON.parse(storedCartItems)
  }
  
  if (storedCartProducts) {
    cartProducts.value = JSON.parse(storedCartProducts)
  }
})

// Figyelés és mentés `localStorage`-ba, amikor a kosár állapota változik
watch(cartItems, (newVal) => {
  if (import.meta.client) {
    localStorage.setItem('cartItems', JSON.stringify(newVal))
  }
})

watch(cartProducts, (newVal) => {
  if (import.meta.client) {
    localStorage.setItem('cartProducts', JSON.stringify(newVal))
  }
})

// Kosár panel nyitása/zárása
const isCartOpen = ref(false)
const toggleCartPanel = () => {
  isCartOpen.value = !isCartOpen.value
}
</script>
<template>
  <div class="flex flex-col">
    <!-- Top header - hidden on mobile, visible on lg and up -->
    <header class="hidden py-4 text-sm text-white bg-dark lg:block">
      <div class="container px-4 mx-auto">
        <div class="flex items-center justify-between">
          <nav>
            <ul class="flex space-x-6">
              <li><a href="#" class="hover:text-gray">Request a Quote</a></li>
              <li><a href="#" class="hover:text-gray">Prices</a></li>
              <li><a href="#" class="hover:text-gray">About Us</a></li>
            </ul>
          </nav>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <PhosphorIconPhone class="mr-2" />
              <span>0670 37 71 506</span>
            </div>
            <div class="flex items-center">
              <PhosphorIconEnvelope class="mr-2" />
              <span>lengyelmarket@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main navigation -->
    <nav class="py-4 text-white bg-primary">
      <div class="container px-4 mx-auto">
        <div
          class="flex flex-col items-center justify-between md:gap-14 lg:flex-row"
        >
          <div
            class="flex items-center justify-between w-full mb-4 lg:w-auto lg:mb-0"
          >
            <div class="flex items-center shrink-0">
              <NuxtImg
                src="/img/logo.svg"
                alt="Acarparts Logo"
                class="w-[150px] mr-[50px] shrink-0"
              />
            </div>
            <!-- Mobile menu button -->
            <MobileMenu class="lg:hidden">
              <template #trigger>
                <button class="text-white focus:outline-none">
                  <PhosphorIconList :size="24" weight="bold" />
                </button>
              </template>
              <div class="p-6">
                <div class="flex justify-center gap-10 mb-8">
                  <button
                    class="transition-colors text-primary hover:text-primary-dark"
                  >
                    <PhosphorIconUser size="28" weight="bold" />
                  </button>
                  <button
                    class="transition-colors text-primary hover:text-primary-dark"
                  >
                    <PhosphorIconHeart size="28" weight="bold" />
                  </button>
                  <button
                    class="transition-colors text-primary hover:text-primary-dark"
                  >
                    <PhosphorIconShoppingCart size="28" weight="bold" />
                  </button>
                </div>
                <div class="flex flex-col gap-4">
                  <NuxtLink
                    to="/"
                    class="py-2 font-semibold uppercase transition-colors border-b border-gray-200 text-dark hover:text-primary"
                    >Request a Quote</NuxtLink
                  >
                  <NuxtLink
                    to="/"
                    class="py-2 font-semibold uppercase transition-colors border-b border-gray-200 text-dark hover:text-primary"
                    >Prices</NuxtLink
                  >
                  <NuxtLink
                    to="/"
                    class="py-2 font-semibold uppercase transition-colors border-b border-gray-200 text-dark hover:text-primary"
                    >About Us</NuxtLink
                  >
                </div>
                <div class="mt-8 space-y-4">
                  <div class="flex items-center text-dark">
                    <PhosphorIconPhone
                      weight="bold"
                      class="mr-3 text-primary"
                      size="20"
                    />
                    <span class="text-sm">0670 37 71 506</span>
                  </div>
                  <div class="flex items-center text-dark">
                    <PhosphorIconEnvelope
                      weight="bold"
                      class="mr-3 text-primary"
                      size="20"
                    />
                    <span class="text-sm">lengyelmarket@gmail.com</span>
                  </div>
                </div>
              </div>
            </MobileMenu>
          </div>

          <div class="w-full mb-4 lg:mb-0">
            <div
              class="flex items-center p-1 bg-white rounded-[11px] shadow-big"
            >
              <button class="p-2 mr-2 text-white bg-black rounded-[7px]">
                <PhosphorIconList :size="24" weight="bold" />
              </button>
              <input
                type="text"
                placeholder="Alkatrész, gyártó vagy modell neve"
                class="flex-grow bg-transparent border-transparent placeholder-dark/50 text-dark focus:border-transparent"
              />
              <button
                class="p-2 text-white rounded-[7px] bg-primary w-[91px] flex items-center justify-center hover:bg-red-800 transition"
              >
                <PhosphorIconMagnifyingGlass :size="24" weight="bold" />
              </button>
            </div>
          </div>

          <div class="items-center hidden space-x-4 lg:flex">
            <PhosphorIconUser size="24" />
            <PhosphorIconHeart size="24" />
            <div class="relative">
              <PhosphorIconShoppingCart size="24" @click="toggleCartPanel" />
              <span
                v-if="cartItems > 0"
                class="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1"
              >
                {{ cartItems }}
              </span>
            </div>
          </div>

          <!-- Kosár panel -->
          <div
            v-if="isCartOpen"
            class="fixed top-0 right-0 w-80 h-full bg-pageRed shadow-lg p-4"
          >
            <h2 class="text-xl font-bold">Kosár tartalma</h2>
            <ul v-if="cartProducts.length > 0">
              <li v-for="product in cartProducts" :key="product.id">
                {{ product.name }} - Mennyiség: {{ product.quantity }}
              </li>
            </ul>
            <p v-else>A kosár üres</p>
            <button @click="toggleCartPanel" class="text-red-600">
              Bezárás
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
