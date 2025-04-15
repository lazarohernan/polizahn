<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Clientes</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar por nombre, identificación, teléfono o correo electrónico..."
              />
            </div>
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              @click="showAddModal = true"
            >
              <Plus class="w-5 h-5" />
              <span>Nuevo Cliente</span>
            </button>
          </div>
          <button
            title="Exportar datos"
            class="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-text dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
            @click="showExportModal = true"
          >
            <Fl class="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <!-- Estado sin clientes -->
      <div
        v-if="clientes.length === 0"
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Users class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay clientes registrados</h3>
          <p class="text-text/70 text-center max-w-md">
            Aún no hay clientes registrados en el sistema. Haz clic en el botón "Nuevo Cliente" para
            comenzar a agregar clientes.
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div
        v-else-if="searchQuery && filteredItems.length === 0"
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron clientes que coincidan con tu búsqueda. Intenta con otros términos o
            revisa la ortografía.
          </p>
        </div>
      </div>

      <!-- Tabla de clientes -->
      <div
        v-else
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] overflow-x-auto"
      >
        <!-- Indicador de carga -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10"
        >
          <div class="flex flex-col items-center gap-2">
            <div
              class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"
            ></div>
            <span class="text-sm font-medium text-text/70">Cargando datos...</span>
          </div>
        </div>

        <table class="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Cliente
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Identificación
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Contacto
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Dirección
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                # Pólizas
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="client in filteredItems"
              :key="client.id_cliente"
              class="border-b border-container-border last:border-b-0 hover:bg-input-bg"
            >
              <!-- Información del cliente -->
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <!-- Verificar si el cliente tiene una foto -->
                  <div
                    v-if="client.foto"
                    class="w-12 h-12 rounded-lg overflow-hidden shadow-md"
                    :title="client.nombres"
                  >
                    <img
                      :src="getImageSrc(client.foto)"
                      alt="Foto del cliente"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Si no hay foto, mostrar las iniciales -->
                  <div
                    v-else
                    class="w-12 h-12 rounded-lg flex items-center justify-center bg-[#8CBFCF] text-white font-bold text-xl shadow-md"
                    :title="client.nombres"
                  >
                    {{ getInitials(client.nombres) }}
                  </div>

                  <div class="font-medium text-text">{{ client.nombres }}</div>
                </div>
              </td>

              <!-- IDENTIFICACIÓN -->
              <td class="p-4">
                <div class="font-mono text-sm text-text/80 px-2 py-1 bg-input-bg rounded">
                  {{ client.identificacion }}
                </div>
              </td>

              <!-- Información de contacto -->
              <td class="p-4">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4 text-text/50" />
                    <span class="text-sm text-text">{{ client.correo }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4 text-text/50" />
                    <span class="text-sm text-text">{{ client.tel_1 }}</span>
                  </div>
                </div>
              </td>

              <!-- Dirección -->
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4 text-text/50 flex-shrink-0" />
                  <span class="text-sm text-text">{{ client.direccion }}</span>
                </div>
              </td>

              <!-- Contador de pólizas TODO: incorporarlo cuando ya esté la tabla de pólizas asignadas -->
              <td class="p-4">
                <div
                  class="flex items-center justify-center font-semibold text-primary rounded-full bg-gray-100"
                >
                  {{ 'TODO' }}
                </div>
              </td>

              <!-- Botones de acción -->
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <!-- Ver detalles del cliente -->
                  <button
                    title="Ver detalles del cliente"
                    class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                    @click="handleViewClient(client.id_cliente ?? '')"
                  >
                    <Eye class="w-4 h-4 text-text/50 group-hover:text-white" />
                    <span class="text-xs font-medium text-text group-hover:text-white">Ver</span>
                  </button>

                  <!-- Ver pólizas del cliente -->
                  <button
                    title="Ver pólizas del cliente"
                    class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                    @click="handleViewPolicies(client.id_cliente ?? '')"
                  >
                    <FileText class="w-4 h-4 text-text/50 group-hover:text-white" />
                    <span class="text-xs font-medium text-text group-hover:text-white"
                      >Pólizas</span
                    >
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación unificada -->
        <div class="mt-6 p-4">
          <PaginationButtons
            :page="page"
            :is-first-page="isFirstPage"
            :has-more-data="hasMorePages"
            :total-pages="totalPages"
            :items-per-page="itemsPerPage"
            @update:items-per-page="handleItemsPerPageChange"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Modales -->
  <ViewClientModal
    v-if="selectedClient"
    :show="showClientModal"
    :id-cliente="selectedClient.id_cliente"
    :client="selectedClient"
    @close="handleCloseModal"
    @update-client="handleUpdateClient"
    @delete-client="handleDeleteClient"
  />

  <AddClientModal :show="showAddModal" @close="showAddModal = false" @save="handleAddClient" />

  <ViewClientPaymentsModal
    v-if="selectedClient"
    :show="showPaymentsModal"
    :client="selectedClient"
    :plan-de-pago-id="selectedPlanDePagoId"
    @close="
      showPaymentsModal = false;
      showPolicyModal = true; //Para regresar al modal de pólizas
    "
  />

  <ViewClientPolicyModal
    v-if="selectedClient"
    :show="showPolicyModal"
    :client="selectedClient"
    :id-cliente="selectedClient.id_cliente"
    @close="showPolicyModal = false"
    @view-payments="handleViewPayments"
  />

  <ExportOptionsModal
    :show="showExportModal"
    :data="filteredItems"
    @close="showExportModal = false"
    @export="handleExport"
  />
</template>

<script src="./clientes.ts" lang="ts"></script>
