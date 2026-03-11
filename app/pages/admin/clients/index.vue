<script setup lang="ts">
import {useTemplateRef} from 'vue'

const table = useTemplateRef('table')
const {t} = useI18n()

const {
  clients,
  loading,
  totalItems,
  fetchClients,
  createClient,
  updateClient,
  deactivateClient,
  resetPassword
} = useAppClients()

const perPage = ref(10)
const apiPage = ref(1)

const columns = computed(() => [
  {
    id: 'companyName',
    accessorKey: 'companyName',
    header: createSortableHeader(t('clients.company_name')),
    sortable: true
  },
  {id: 'name', accessorKey: 'name', header: createSortableHeader(t('clients.contact')), sortable: true},
  {id: 'email', accessorKey: 'email', header: createSortableHeader(t('team.email')), sortable: true},
  {id: 'status', accessorKey: 'status', header: createSortableHeader(t('clients.status')), sortable: true},
  {id: 'actions', accessorKey: 'id', header: ''}
])

const createSortableHeader = (label: string) => {
  return ({column}: any) => {
    const isSorted = column.getIsSorted()
    return h(resolveComponent('UButton'), {
      color: 'neutral',
      variant: 'ghost',
      label,
      icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down') : 'i-lucide-arrow-up-down',
      class: '-mx-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white',
      onClick: () => {
        const nextDesc = column.getIsSorted() !== 'desc'
        column.toggleSorting(nextDesc)
      }
    })
  }
}

const sorting = ref([{id: 'isActive', desc: false}])

const isModalOpen = ref(false)
const isDeactivateModalOpen = ref(false)
const isResetPasswordModalOpen = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const selectedClient = ref<any>(null)
const searchQuery = ref('')

const buildParams = () => {
  const sort = sorting.value[0]
  const fieldMap: Record<string, string> = {
    companyName: 'company_name',
    name: 'name',
    email: 'email',
    status: 'client_status',
    isActive: 'is_active'
  }

  const params: Record<string, any> = {
    page: apiPage.value,
    per_page: perPage.value,
    sort_by: sort ? (fieldMap[sort.id] || sort.id) : 'is_active',
    sort_order: sort ? (sort.desc ? 'desc' : 'asc') : 'asc'
  }

  if (searchQuery.value) params.search = searchQuery.value
  return params
}

const loadData = () => fetchClients(buildParams())

onMounted(() => loadData())

watch(apiPage, loadData)
watch(perPage, () => {
  apiPage.value = 1
  loadData()
})
watch(searchQuery, () => {
  apiPage.value = 1;
  loadData()
})
watch(sorting, () => {
  apiPage.value = 1;
  loadData()
}, {deep: true})

const formState = reactive({
  name: '',
  email: '',
  company_name: '',
  tax_id: ''
})


const confirmDeactivate = (client: any) => {
  selectedClient.value = client
  isDeactivateModalOpen.value = true
}

const confirmResetPassword = (client: any) => {
  selectedClient.value = client
  isResetPasswordModalOpen.value = true
}

const openCreateModal = () => {
  isEditing.value = false
  selectedClient.value = null
  Object.assign(formState, {
    name: '',
    email: '',
    company_name: '',
    tax_id: ''
  })
  isModalOpen.value = true
}

const editClient = (client: any) => {
  isEditing.value = true
  selectedClient.value = client
  Object.assign(formState, {
    name: client.name,
    email: client.email,
    company_name: client.companyName,
    tax_id: client.taxId
  })
  isModalOpen.value = true
}

const handleSaveClient = async () => {
  formLoading.value = true
  try {
    if (isEditing.value && selectedClient.value) {
      await updateClient(selectedClient.value.id, formState)
    } else {
      await createClient(formState)
    }
    isModalOpen.value = false
  } catch (err) {
    // Error handled by composable
  } finally {
    formLoading.value = false
  }
}

const handleDeactivate = async () => {
  if (!selectedClient.value) return
  formLoading.value = true
  try {
    await deactivateClient(selectedClient.value.id)
    isDeactivateModalOpen.value = false
  } catch (err) {
    // Error handled by composable
  } finally {
    formLoading.value = false
  }
}

const handleResetPassword = async () => {
  if (!selectedClient.value) return
  formLoading.value = true
  try {
    await resetPassword(selectedClient.value.id)
    isResetPasswordModalOpen.value = false
  } catch (err) {
    // Error handled by composable
  } finally {
    formLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
          {{ $t('clients.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {{ $t('clients.subtitle') }}
        </p>
      </div>

      <UButton
          size="md"
          class="rounded-md px-5 h-10 font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all text-white"
          icon="i-lucide-plus-circle"
          @click="openCreateModal"
      >
        {{ $t('clients.create_client') }}
      </UButton>
    </header>

    <div>
      <!-- Filter Toolbar -->
      <div
          class="flex flex-col sm:flex-row items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-3 px-4 rounded-t-2xl rounded-b-none border border-white/60 dark:border-slate-800/60">
        <div class="flex-1 w-full">
          <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              :placeholder="$t('common.search')"
              size="md"
              class="w-full sm:w-72"
              :ui="{
              base: 'rounded-md bg-white/50 dark:bg-slate-800/50 border-0 ring-1 ring-slate-200 dark:ring-slate-700 font-medium'
            }"
          />
        </div>
      </div>

      <!-- Clients Table Section -->
      <div
          class="rounded-b-lg rounded-t-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-800/60 shadow-sm overflow-hidden"
      >
        <UTable
            ref="table"
            v-model:sorting="sorting"
            :data="clients"
            :columns="columns"
            :loading="loading"
            sticky
            class="w-full max-h-[600px]"
            :ui="{
          base: 'table-fixed',
          th: 'px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
          td: 'px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800/50'
        }"
        >
          <!-- Company Cell -->
          <template #companyName-cell="{ row }">
            <div class="flex items-center gap-3">
              <div
                  class="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-600/20">
                {{ row.original.companyName?.charAt(0) || 'C' }}
              </div>
              <span class="font-bold text-slate-900 dark:text-white">{{ row.original.companyName || 'N/A' }}</span>
            </div>
          </template>

          <!-- Contact Cell -->
          <template #name-cell="{ row }">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ row.original.name }}</span>
            </div>
          </template>

          <!-- Status Cell -->
          <template #status-cell="{ row }">
            <UBadge
                :color="row.original.status === 'active' ? 'success' : 'neutral'"
                variant="subtle"
                class="rounded-lg px-2.5 py-0.5 font-black uppercase tracking-wider text-[9px]"
            >
              {{ $t(`clients.${row.original.status}`) }}
            </UBadge>
          </template>

          <!-- Actions Cell -->
          <template #actions-cell="{ row }">
            <div class="flex justify-end gap-2">
              <UTooltip :text="$t('clients.reset_password')" v-if="row.original.status === 'active'">
                <UButton
                    color="neutral"
                    variant="ghost"
                    size="md"
                    class="rounded-md hover:bg-amber-500/10 text-slate-400 hover:text-amber-500"
                    icon="i-lucide-key"
                    @click="confirmResetPassword(row.original)"
                />
              </UTooltip>

              <UTooltip :text="$t('clients.edit_client')">
                <UButton
                    color="neutral"
                    variant="ghost"
                    size="md"
                    class="rounded-md font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    icon="i-lucide-pencil"
                    @click="editClient(row.original)"
                />
              </UTooltip>

              <UTooltip :text="$t('clients.deactivate_client')">
                <UButton
                    v-if="row.original.status === 'active'"
                    color="error"
                    variant="ghost"
                    size="md"
                    class="rounded-md font-bold hover:bg-error-50 dark:hover:bg-error-900/20"
                    icon="i-lucide-user-minus"
                    @click="confirmDeactivate(row.original)"
                />
              </UTooltip>
            </div>
          </template>
        </UTable>

        <!-- Pagination Footer -->
        <div v-if="totalItems > 0"
             class="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {{ $t('common.showing') }} {{ (apiPage - 1) * perPage + 1 }} {{
                $t('common.to')
              }} {{ Math.min(apiPage * perPage, totalItems) }} {{ $t('common.of') }} {{
                totalItems
              }} {{ $t('common.results') }}
            </span>
            
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ $t('common.rows_per_page') || 'Rows' }}</span>
              <USelect
                v-model="perPage"
                :options="[5, 10, 15, 20, 50, 100]"
                size="xs"
                variant="subtle"
                class="w-16"
              />
            </div>
          </div>

          <UPagination
              v-if="totalItems > perPage"
              :page="apiPage"
              :items-per-page="perPage"
              :total="totalItems"
              @update:page="(p) => { apiPage = p }"
              color="neutral"
              variant="subtle"
              active-color="primary"
              active-variant="solid"
              size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Modal for Create Client -->
    <UModal
        v-model:open="isModalOpen"
        :title="isEditing ? $t('clients.edit_client') : $t('clients.create_client')"
        :ui="{ content: 'rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-white/40 dark:border-slate-800/40 max-w-lg' }"
    >
      <template #body>
        <UForm :state="formState" class="space-y-6 p-2" @submit="handleSaveClient">
          <UFormField :label="$t('clients.contact_name')" name="name" required>
            <UInput v-model="formState.name" icon="i-lucide-user" class="w-full" size="lg"/>
          </UFormField>

          <UFormField :label="$t('clients.company_name')" name="company_name" required>
            <UInput v-model="formState.company_name" icon="i-lucide-building-2" class="w-full" size="lg"/>
          </UFormField>

          <UFormField :label="$t('team.email')" name="email" required>
            <UInput v-model="formState.email" type="email" icon="i-lucide-mail" class="w-full" size="lg"/>
          </UFormField>

          <UFormField :label="$t('clients.tax_id')" name="tax_id" required>
            <UInput v-model="formState.tax_id" icon="i-lucide-file-text" class="w-full" size="lg"/>
          </UFormField>

          <div class="pt-8 flex gap-4">
            <UButton
                type="submit"
                block
                size="md"
                class="rounded-md h-10 font-bold flex-1"
                :loading="formLoading"
            >
              {{ $t('common.save') }}
            </UButton>
            <UButton
                color="neutral"
                variant="ghost"
                size="md"
                class="rounded-md h-10 font-bold"
                @click="isModalOpen = false"
            >
              {{ $t('common.cancel') }}
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Confirmation Modal for Deactivation -->
    <UModal
        v-model:open="isDeactivateModalOpen"
        :title="$t('clients.deactivate_client')"
        :description="$t('clients.deactivate_warning')"
        :ui="{ content: 'rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-white/40 dark:border-slate-800/40' }"
    >
      <template #footer>
        <div class="flex gap-4 w-full">
          <UButton
              color="error"
              size="md"
              class="flex-1 rounded-md h-10 font-bold"
              :loading="formLoading"
              @click="handleDeactivate"
          >
            {{ $t('common.confirm') }}
          </UButton>
          <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="flex-1 rounded-md h-10 font-bold"
              @click="isDeactivateModalOpen = false"
          >
            {{ $t('common.cancel') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Confirmation Modal for Password Reset -->
    <UModal
        v-model:open="isResetPasswordModalOpen"
        :title="$t('clients.reset_password')"
        :description="$t('clients.reset_password_warning')"
        :ui="{ content: 'rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-white/40 dark:border-slate-800/40' }"
    >
      <template #footer>
        <div class="flex gap-4 w-full">
          <UButton
              color="primary"
              size="md"
              class="flex-1 rounded-md h-10 font-bold text-white shadow-lg shadow-blue-500/20"
              :loading="formLoading"
              @click="handleResetPassword"
          >
            {{ $t('common.confirm') }}
          </UButton>
          <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="flex-1 rounded-md h-10 font-bold"
              @click="isResetPasswordModalOpen = false"
          >
            {{ $t('common.cancel') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>


