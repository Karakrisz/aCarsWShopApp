<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useState } from 'nuxt/app'

const config = useRuntimeConfig()

// Kosár állapot kezelése
const cartItems = useState<number>('cartItems', () => 0)
const cartProducts = useState<any[]>('cartProducts', () => [])

// Kosár betöltése a localStorage-ból, vagy a szerverről
onMounted(async () => {
  const storedCartItems = localStorage.getItem('cartItems')
  const storedCartProducts = localStorage.getItem('cartProducts')

  if (storedCartItems && storedCartProducts) {
    cartItems.value = JSON.parse(storedCartItems)
    cartProducts.value = JSON.parse(storedCartProducts)
  } else {
    // Ha nincs adat, lekérjük a szerverről a kosár részleteit
    const response = await fetch(config.public.GQL_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query cartItems {
            cartItems {
              id
              name
              quantity
              price
              total
            }
          }
        `,
      }),
    })

    const result = await response.json()

    if (result?.data?.cartItems) {
      cartProducts.value = result.data.cartItems
      cartItems.value = cartProducts.value.length

      // Mentés a localStorage-ba
      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts.value))
    }
  }
})

// Figyelés és mentés a localStorage-ba
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

// Termék eltávolítása a kosárból GraphQL mutációval
const removeCartItem = async (cartItemId: string) => {
  try {
    console.log('Kosár tétel ID eltávolításhoz:', cartItemId)

    const mutation = `
      mutation removeCartItem($id: ID!) {
        removeCartItem(id: $id) {
          success
          cart {
            id
            items {
              id
              name
              quantity
              total
            }
            grandTotal
          }
        }
      }
    `
    const variables = { id: cartItemId }  // A kosárelem azonosítója

    const response = await fetch(config.public.GQL_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    })

    const result = await response.json()

    if (result?.data?.removeCartItem?.success) {
      // Eltávolítás után frissítjük a kosarat
      cartProducts.value = cartProducts.value.filter(
        (product) => product.id !== cartItemId
      )
      cartItems.value -= 1

      // Frissítés a localStorage-ban
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts.value))
      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    } else {
      console.error('Nem sikerült eltávolítani a kosár tételt', result.errors)
    }
  } catch (error) {
    console.error('Hiba történt a kosár tétel eltávolításakor:', error)
  }
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
            </div>
            <!-- Kosár tételek száma -->
            <span
              v-if="cartItems > 0"
              class="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1"
            >
              {{ cartItems }}
            </span>
          </div>

          <!-- Kosár panel (jobb oldalról beúszó) -->
          <div
            v-if="isCartOpen"
            class="fixed top-0 right-0 w-80 h-full bg-pageRed shadow-lg p-4"
          >
            <h2 class="text-xl font-bold">Kosár tartalma</h2>
            <ul v-if="cartProducts.length > 0">
              <li v-for="product in cartProducts" :key="product.id">
                {{ product.name }} - Mennyiség: {{ product.quantity }}
                <button
                  @click="removeCartItem(product.id)"
                  class="text-red-600"
                >
                  Eltávolítás
                </button>
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
