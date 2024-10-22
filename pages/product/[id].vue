<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useState } from 'nuxt/app'

const config = useRuntimeConfig()

const cartItems = useState<number>('cartItems', () => {
  if (process.client) {
    return JSON.parse(localStorage.getItem('cartItems') || '0')
  }
  return 0
})

const cartProducts = useState<any[]>('cartProducts', () => {
  if (process.client) {
    return JSON.parse(localStorage.getItem('cartProducts') || '[]')
  }
  return []
})

watch(cartItems, (newVal) => {
  if (process.client) {
    localStorage.setItem('cartItems', JSON.stringify(newVal))
  }
})

watch(cartProducts, (newVal) => {
  if (process.client) {
    localStorage.setItem('cartProducts', JSON.stringify(newVal))
  }
})

const route = useRoute()
const imageBaseUrl = config.public.IMAGE_BASE_URL

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

const addToCart = async () => {
  const mutation = `
    mutation addItemToCart($productId: ID!, $quantity: Int!) {
      addItemToCart(input: {
        productId: $productId,
        quantity: $quantity
      }) {
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
  const variables = {
    productId: product.value.id,
    quantity: quantity.value,
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
  if (result.data.addItemToCart.success) {
    successMessage.value = true
    cartItems.value += 1
    cartProducts.value.push({
      id: product.value.id,
      name: product.value.name,
      quantity: quantity.value,
    })
  } else {
    successMessage.value = false
  }
}
  // const result = await response.json()
  // if (result.data.addItemToCart.success) {
  //   successMessage.value = true
  //   console.log('Sikeresen hozzáadva a kosárhoz:', result)
  // } else {
  //   successMessage.value = false
  //   console.error('Nem sikerült hozzáadni a kosárhoz:', result)
  // }
</script>

<template>
  <div v-if="pending">
    <p>Loading...</p>
  </div>
  <div v-if="error">
    <p>Error: {{ error.message }}</p>
  </div>
  <div v-if="product">
    <div class="product-details">
      <h1 class="text-3xl font-bold">{{ product.name }}</h1>
      <div class="product-image">
        <img
          :src="`${imageBaseUrl}${product.images[0]?.path}`"
          alt="Product Image"
        />
      </div>
      <div v-html="product.description"></div>

      <!-- Darabszám bevitel -->
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
  <CartDetails />
</template>
