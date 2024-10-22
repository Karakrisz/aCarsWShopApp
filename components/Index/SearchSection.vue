<script lang="ts" setup>
  const config = useRuntimeConfig()
  const data = await GqlProducts()
  const imageBaseUrl = config.public.IMAGE_BASE_URL

  // function truncateContent(content: string, maxLength: number): string {
  //   const textContent = content.replace(/<[^>]*>/g, '')
  //   if (textContent.length <= maxLength) {
  //     return textContent
  //   }
  //   return textContent.slice(0, maxLength) + '...'
  // }

  const topBrands = [
    'audi',
    'bmw',
    'citroen',
    'ford',
    'honda',
    'hyundai',
    'kia',
    'landrover',
    'mazda',
    'mercedes',
    'mitsubishi',
    'nissan',
    'opel',
    'peugeot',
    'renault',
    'seat',
    'skoda',
    'toyota',
    'volkswagen',
    'volvo',
  ]

  const brandsByLetter = {
    A: [
      'Audi',
      'Aixam',
      'Alfa Romeo',
      'AMC',
      'Aston Martin',
      'Austin',
      'Acura',
      'Alpine',
      'ARO',
      'Artega',
      'Asia',
      'Autobianchi',
      'AC',
      'Aiways',
      'Alpina',
      'Addax MTN',
      'Alke',
    ],
    B: [
      'BMW',
      'Bedford',
      'Bentley',
      'BMC',
      'Buick',
      'Brilliance',
      'Bugatti',
      'Borgward',
      'Bellier',
      'BYD',
      'Bertone',
      'Bee Bee',
      'Bollore',
    ],
    C: [
      'Cadillac',
      'Casalini',
      'Checker',
      'Chevrolet',
      'Chrysler',
      'Citroen',
      'Crosley',
      'Changan',
      'Carbodies',
      'Chery',
      'Asia',
      'Caterham',
      'Cupra',
      'Chatenet',
    ],
  }

  const posts = [
    {
      title: 'How to Easily Find the Right Car Part Online with Acarparts',
      description:
        "Navigating the world of car parts can be daunting. Our step-by-step guide shows you how to quickly and easily find the exact car parts you need using Acarparts' user-friendly webshop.",
      link: '/',
      imgSrc: '/blog-1.jpg',
    },
    {
      title: 'Why Quality Matters: The Benefits of Choosing Premium Car Parts',
      description:
        'Not all car parts are created equal. Learn why investing in high-quality car parts from Acarparts can save you time, money, and ensure your vehicle stays in optimal condition.',
      link: '/',
      imgSrc: '/blog-2.jpg',
    },
    {
      title: 'Top 5 Must-Have Car Parts for Every Vehicle Owner',
      description:
        'Ensuring your vehicle runs smoothly requires the right parts. Discover the top five essential car parts every vehicle owner should have on hand to maintain peak performance and safety.',
      link: '/',
      imgSrc: '/blog-3.jpg',
    },
  ]
</script>

<template>
  <section class="container px-4 py-16 bg-white">
    <div class="mx-auto space-y-[50px] max-w-7xl">
      <h2 class="mb-6 text-2xl font-bold">Search by brand</h2>
      <div class="flex flex-wrap gap-[24px] mb-8 justify-between">
        <div
          v-for="brand in topBrands"
          :key="brand"
          class="w-[71px] h-[71px] card"
        >
          <NuxtImg
            :src="`/img/car-logos/${brand}.svg`"
            :alt="brand"
            class="w-auto h-8 max-w-8"
          />
        </div>
        <div class="px-10 h-[71px] card">
          <span class="text-gray-600">All brands</span>
          <PhosphorIconCaretRight class="ml-2 text-gray-600" />
        </div>
      </div>

      <div class="divide-y divide-gray">
        <div class="pb-6">
          <h3 class="mb-4 text-xl font-extrabold text-primary">A</h3>
          <div class="flex flex-wrap gap-x-14 gap-y-[25px]">
            <span
              v-for="brand in brandsByLetter.A"
              :key="brand"
              class="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-primary"
            >
              {{ brand }}
            </span>
          </div>
        </div>
        <div class="py-6">
          <h3 class="mb-4 text-xl font-extrabold text-primary">B</h3>
          <div class="flex flex-wrap gap-x-14 gap-y-[25px]">
            <span
              v-for="brand in brandsByLetter.B"
              :key="brand"
              class="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-primary"
            >
              {{ brand }}
            </span>
          </div>
        </div>
        <div class="pt-6">
          <h3 class="mb-4 text-xl font-extrabold text-primary">C</h3>
          <div class="flex flex-wrap gap-x-14 gap-y-[25px]">
            <span
              v-for="brand in brandsByLetter.C"
              :key="brand"
              class="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-primary"
            >
              {{ brand }}
            </span>
          </div>
        </div>
      </div>

      <h2 class="mb-6 text-xl font-bold text-center sm:text-2xl sm:text-left">
        Search by category
      </h2>
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="flex items-center justify-center gap-4 p-2 sm:p-4 card"
        >
          <NuxtImg
            :src="`/img/categories/cat-${i}.svg`"
            :alt="`Category ${i}`"
            class="w-12 h-12 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]"
          />
          <span class="text-sm text-center text-gray-600 sm:text-base"
            >Lorem Ipsum</span
          >
        </div>
      </div>
    </div>
    <section class="container py-[50px]">
      <h2
        class="mb-[25px] text-2xl lg:text-left text-center leading-[160%] font-semibold"
      >
        Top products
      </h2>
      <!-- <pre> {{ data }} </pre> -->
      <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-[24px]">
        <div
          v-for="product in data.products.data.slice(0, 3)"
          :key="product.id"
          class="rounded-[10px] overflow-hidden shadow-big flex flex-col"
        >
          <div class="h-[181px] w-full relative overflow-hidden">
            <NuxtImg
              class="absolute inset-0 object-cover w-full h-full"
              :src="`${imageBaseUrl}${product.images[0]?.path}`"
              alt="Product Image"
            />
          </div>
          <div class="p-[25px] bg-white flex flex-col gap-[15px] flex-1">
            <h3 class="text-xl font-semibold">{{ product.name }}</h3>
            <div class="h-[1px] bg-gray/50 w-full"></div>
            <div
              class="text-sm leading-[160%] flex-1"
              v-html="product.shortDescription"
            ></div>

            <p class="text-sm leading-[160%] flex-1">
              {{ product.price }}
            </p>
            <NuxtLink
              :to="`/product/${product.id}`"
              class="flex items-center justify-center px-[25px] py-[15px] text-white rounded-[7px] text-sm bg-primary hover:bg-red-800 transition"
              >Read More</NuxtLink
            >
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
  /* Add any additional component-specific styles here */
</style>
