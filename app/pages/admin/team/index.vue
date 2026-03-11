<script setup lang="ts">
import {h, resolveComponent, useTemplateRef} from 'vue'

const table = useTemplateRef('table')
const {t} = useI18n()

const {team, loading, totalItems, fetchTeam, addMember, updateMember, offboardMember, resetPassword} = useAppTeam()
const {user} = useAppAuth()

const isAdmin = computed(() => (user.value as any)?.role === 'admin')
const searchQuery = ref('')

const perPage = ref(10)
const apiPage = ref(1)


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

const sorting = ref([{id: 'name', desc: false}])

const columns = computed(() => [
  {id: 'name', accessorKey: 'name', header: createSortableHeader(t('team.name')), sortable: true},
  {id: 'role', accessorKey: 'role', header: createSortableHeader(t('team.role')), sortable: true},
  {id: 'jobTitle', accessorKey: 'jobTitle', header: createSortableHeader(t('team.header_title')), sortable: true},
  {id: 'hourlyRate', accessorKey: 'hourlyRate', header: t('team.hourly_rate'), sortable: false},
  {id: 'isActive', accessorKey: 'isActive', header: createSortableHeader(t('clients.status')), sortable: true},
  {id: 'actions', header: '', sortable: false}
])

const buildParams = (extra: Record<string, any> = {}) => {
  const sort = sorting.value[0]
  const fieldMap: Record<string, string> = {
    name: 'name',
    role: 'role',
    jobTitle: 'job_title',
    isActive: 'is_active'
  }

  const params: Record<string, any> = {
    page: apiPage.value,
    per_page: perPage.value,
    sort_by: sort ? (fieldMap[sort.id] || sort.id) : 'created_at',
    sort_order: sort ? (sort.desc ? 'desc' : 'asc') : 'desc',
    ...extra
  }

  if (searchQuery.value) params.search = searchQuery.value
  return params
}

const loadData = () => fetchTeam(buildParams())

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
}, { deep: true })


const isSlideoverOpen = ref(false)
const isModalOpen = ref(false)
const isResetPasswordModalOpen = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const selectedMember = ref<any>(null)

const formState = reactive({
  name: '',
  email: '',
  role: 'team_member',
  job_title: '',
  hourly_rate: 0
})


const roleOptions = ['admin', 'team_member']

onMounted(() => {
  fetchTeam()
})

const openAddSlideover = () => {
  isEditing.value = false
  selectedMember.value = null
  Object.assign(formState, {
    name: '',
    email: '',
    role: 'team_member',
    job_title: '',
    hourly_rate: 0
  })
  isSlideoverOpen.value = true
}

const openEditSlideover = (member: any) => {
  isEditing.value = true
  selectedMember.value = member
  formState.name = member.name
  formState.email = member.email
  formState.role = member.role
  formState.job_title = member.jobTitle || ''
  formState.hourly_rate = member.hourlyRate || 0
  isSlideoverOpen.value = true
}

const confirmOffboard = (member: any) => {
  selectedMember.value = member
  isModalOpen.value = true
}

const confirmResetPassword = (member: any) => {
  selectedMember.value = member
  isResetPasswordModalOpen.value = true
}

const handleFormSubmit = async () => {
  formLoading.value = true
  try {
    if (isEditing.value && selectedMember.value) {
      await updateMember(selectedMember.value.id, formState)
    } else {
      await addMember(formState)
    }
    isSlideoverOpen.value = false
  } catch (err) {
    // Error handled by composable
  } finally {
    formLoading.value = false
  }
}

const handleOffboard = async () => {
  if (!selectedMember.value) return
  formLoading.value = true
  try {
    await offboardMember(selectedMember.value.id)
    isModalOpen.value = false
  } catch (err) {
    // Error handled by composable (422 etc)
  } finally {
    formLoading.value = false
  }
}

const handleResetPassword = async () => {
  if (!selectedMember.value) return
  formLoading.value = true
  try {
    await resetPassword(selectedMember.value.id)
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
          {{ $t('team.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {{ $t('team.subtitle') }}
        </p>
      </div>

      <UButton
          size="md"
          class="rounded-md px-5 h-10 font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all text-white"
          icon="i-lucide-plus"
          @click="openAddSlideover"
      >
        {{ $t('team.add_member') }}
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

      <!-- Team Table -->
      <div
          class="rounded-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <UTable
            ref="table"
            :data="team"
            v-model:sorting="sorting"
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
          <!-- Member Name Cell -->
          <template #name-cell="{ row }">
            <div class="flex items-center gap-3">
              <div
                  class="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm border border-blue-600/20">
                {{ row.original.name?.charAt(0) || 'U' }}
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {{ row.original.name }}
                  <UIcon
                      v-if="row.original.jobTitle === 'Agency Owner'"
                      name="i-lucide-crown"
                      class="w-3.5 h-3.5 text-amber-500 fill-amber-500/20"
                  />
                </span>
                <span class="text-[10px] text-slate-500 font-medium">{{ row.original.email }}</span>
              </div>
            </div>
          </template>

          <!-- Role Cell -->
          <template #role-cell="{ row }">
            <UBadge
                :color="row.original.role === 'admin' ? 'primary' : 'neutral'"
                variant="subtle"
                class="rounded-md px-2 py-0.5 font-bold uppercase tracking-wider text-[9px]"
            >
              {{ row.original.role }}
            </UBadge>
          </template>

          <!-- Job Title Cell -->
          <template #jobTitle-cell="{ row }">
            <span
                :class="row.original.jobTitle === 'Agency Owner' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-slate-600 dark:text-slate-400'">
              {{ row.original.jobTitle || 'N/A' }}
            </span>
          </template>

          <template #hourlyRate-cell="{ row }">
            <span v-if="isAdmin" class="font-bold text-slate-900 dark:text-white">
              ${{ row.original.hourlyRate }}
            </span>
            <span v-else class="text-slate-400 italic text-xs">Protected</span>
          </template>

          <!-- Status Cell -->
          <template #isActive-cell="{ row }">
            <UBadge
                :color="row.original.isActive ? 'success' : 'neutral'"
                variant="subtle"
                class="rounded-md px-2 py-0.5 font-bold uppercase tracking-wider text-[9px]"
            >
              {{ row.original.isActive ? 'Active' : 'Deactivated' }}
            </UBadge>
          </template>

          <!-- Actions Cell -->
          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-1">
              <UTooltip :text="$t('team.reset_password')" v-if="row.original.jobTitle !== 'Agency Owner'">
                <UButton
                    color="neutral"
                    variant="ghost"
                    size="md"
                    class="rounded-md hover:bg-amber-500/10 text-slate-400 hover:text-amber-500"
                    icon="i-lucide-key"
                    @click="confirmResetPassword(row.original)"
                />
              </UTooltip>
              <UButton
                  color="neutral"
                  variant="ghost"
                  size="md"
                  class="rounded-md hover:bg-blue-500/10"
                  icon="i-lucide-pencil"
                  @click="openEditSlideover(row.original)"
              />
              <UButton
                  v-if="row.original.isActive"
                  color="error"
                  variant="ghost"
                  size="md"
                  class="rounded-md hover:bg-red-500/10"
                  icon="i-lucide-user-x"
                  @click="confirmOffboard(row.original)"
              />
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

    <!-- Slideover for Add/Edit -->
    <USlideover
        v-model:open="isSlideoverOpen"
        :title="isEditing ? $t('team.edit_member') : $t('team.add_member')"
        :ui="{ content: 'rounded-l-md border-l border-white/40 dark:border-slate-800/40 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 shadow-2xl' }"
    >
      <template #body>
        <UForm :state="formState" class="space-y-6 p-2" @submit="handleFormSubmit">
          <UFormField :label="$t('team.name')" name="name" required>
            <UInput v-model="formState.name" icon="i-lucide-user" class="w-full" size="lg"/>
          </UFormField>

          <UFormField :label="$t('team.email')" name="email" required>
            <UInput v-model="formState.email" type="email" icon="i-lucide-mail" class="w-full" size="lg"/>
          </UFormField>

          <UFormField :label="$t('team.role')" name="role" required>
            <USelectMenu
                v-model="formState.role"
                :options="roleOptions"
                class="w-full"
                size="lg"
            />
          </UFormField>

          <UFormField :label="$t('team.job_title')" name="job_title" required>
            <UInput v-model="formState.job_title" icon="i-lucide-briefcase" class="w-full" size="lg"/>
          </UFormField>

          <UFormField v-if="isAdmin" :label="$t('team.hourly_rate')" name="hourly_rate">
            <UInput v-model="formState.hourly_rate" type="number" icon="i-lucide-banknote" class="w-full" size="lg"/>
          </UFormField>

          <div class="pt-8 flex gap-4">
            <UButton
                type="submit"
                block
                size="md"
                class="rounded-md h-10 font-bold flex-1"
                :loading="formLoading"
            >
              {{ isEditing ? $t('common.save') : $t('common.add') }}
            </UButton>
            <UButton
                color="neutral"
                variant="ghost"
                size="md"
                class="rounded-md h-10 font-bold"
                @click="isSlideoverOpen = false"
            >
              {{ $t('common.cancel') }}
            </UButton>
          </div>
        </UForm>
      </template>
    </USlideover>

    <!-- Modal for Offboard Confirmation -->
    <UModal
        v-model:open="isModalOpen"
        :title="$t('team.offboard_member')"
        :description="$t('team.offboard_warning')"
        :ui="{ content: 'rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-white/40 dark:border-slate-800/40' }"
    >
      <template #footer>
        <div class="flex gap-4 w-full">
          <UButton
              color="error"
              size="md"
              class="flex-1 rounded-md h-10 font-bold"
              :loading="formLoading"
              @click="handleOffboard"
          >
            {{ $t('common.confirm') }}
          </UButton>
          <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="flex-1 rounded-md h-10 font-bold"
              @click="isModalOpen = false"
          >
            {{ $t('common.cancel') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal for Password Reset Confirmation -->
    <UModal
        v-model:open="isResetPasswordModalOpen"
        :title="$t('team.reset_password')"
        :description="$t('team.reset_password_warning')"
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

