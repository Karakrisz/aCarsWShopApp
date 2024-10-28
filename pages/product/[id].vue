<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useState } from 'nuxt/app'

const config = useRuntimeConfig()

// Kosár állapotkezelés
const cartItems = useState<number>('cartItems', () => 0)
const cartProducts = useState<any[]>('cartProducts', () => [])

// Kosár betöltése localStorage-ból, ha van tárolt adat
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

// Figyelés és mentés localStorage-ba
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

const route = useRoute()
const imageBaseUrl = config.public.IMAGE_BASE_URL

// Termék lekérdezése a GraphQL-en keresztül
const { data: product, pending, error } = await useAsyncData(
  `product-${route.params.id}`,
  async () => {
    const query = `
      query product($id: ID!) {
        product(id: $id) {
          id
          name
          description
          images {
            path
          }
        }
      }
    `
    const variables = { id: route.params.id }
    const response = await fetch(config.public.GQL_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const result = await response.json()
    return result.data.product
  }
)

const quantity = ref(1)
const successMessage = ref(false)

// Kosárba helyezés
const addToCart = async () => {
  try {
    const mutation = `
      mutation addItemToCart($productId: ID!, $quantity: Int!) {
        addItemToCart(input: {
          productId: $productId,
          quantity: $quantity
        }) {
          success
          cart {
            id
            itemsCount
            itemsQty
            grandTotal
            subTotal
            items {
              id
              name
              quantity
              total
            }
          }
        }
      }
    `

    const variables = {
      productId: product.value.id,
      quantity: quantity.value
    }

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

    if (result?.data?.addItemToCart?.success) {
      // Sikeres hozzáadás esetén frissítjük a lokális kosár adatokat
      cartProducts.value = result.data.addItemToCart.cart.items
      cartItems.value = result.data.addItemToCart.cart.itemsCount

      // Mentés a localStorage-ba
      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts.value))

      successMessage.value = true
    } else {
      console.error('Nem sikerült a kosárhoz adni a terméket:', result.errors)
    }
  } catch (error) {
    console.error('Hiba történt a kosárba helyezés során:', error)
  }
}

</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-if="product">
      <h1>{{ product.name }}</h1>
      <img :src="`${imageBaseUrl}${product.images[0]?.path}`" alt="Product Image" />
      <div v-html="product.description"></div>

      <!-- Mennyiség bevitel -->
      <div class="mt-4">
        <label for="quantity" class="font-bold">Mennyiség:</label>
        <input
          type="number"
          v-model="quantity"
          id="quantity"
          class="border px-2 py-1 w-20"
          min="1"
        />
      </div>

      <!-- Kosárba gomb -->
      <button
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        @click="addToCart"
      >
        Kosárba
      </button>

      <!-- Sikeres visszajelzés -->
      <div v-if="successMessage" class="mt-4 text-green-600">
        Termék sikeresen hozzáadva a kosárhoz!
      </div>
    </div>
  </div>
</template>
