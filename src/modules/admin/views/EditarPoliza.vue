<template>
  <div class="edit-policy-page">
    <div class="content">
      <div class="content-wrapper">
        <div class="edit-card glass">
          <div class="card-header">
            <h1>Editar Póliza</h1>
          </div>

          <form @submit.prevent="handleSubmit" class="edit-form">
            <div class="form-section">
              <label class="section-label">Tipo de Póliza</label>
              <div class="policy-types">
                <button
                  v-for="type in policyTypes"
                  :key="type.id"
                  type="button"
                  class="type-button"
                  :class="{ active: policy.type === type.id }"
                  @click="policy.type = type.id as Policy['type']"
                >
                  <component :is="type.icon" class="type-icon" />
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </div>

            <div class="form-section">
              <div class="input-row">
                <div class="input-group">
                  <label for="insurer">Aseguradora</label>
                  <select
                    id="insurer"
                    v-model="policy.insurer"
                    class="form-input glass-input"
                    required
                  >
                    <option value="" disabled>{{ insurers.length === 0 ? 'No hay aseguradoras disponibles' : 'Seleccione una aseguradora' }}</option>
                    <option v-for="insurer in insurers" :key="insurer.id" :value="insurer.name">
                      {{ insurer.name }}
                    </option>
                  </select>
                  <!-- Mensaje de ayuda -->
                  <div v-if="insurers.length === 0" class="mt-2 flex items-center gap-2 text-sm text-yellow-600">
                    <AlertTriangle class="w-4 h-4" />
                    <span class="flex items-center gap-1">
                      No hay aseguradoras disponibles
                      <span class="cursor-help relative group">
                        <AlertCircle class="w-4 h-4 text-text/60" />
                        <span class="absolute left-0 bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                          Debe haber una aseguradora para poder crear una póliza
                        </span>
                      </span>
                    </span>
                  </div>
                </div>

                <div class="input-group">
                  <label for="policyNumber">Número de Póliza</label>
                  <input
                    type="text"
                    id="policyNumber"
                    v-model="policy.policyNumber"
                    class="form-input glass-input"
                    placeholder="Ingrese el número"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="input-group">
                <label for="name">Nombre de la Póliza</label>
                <input
                  type="text"
                  id="name"
                  v-model="policy.name"
                  class="form-input glass-input"
                  placeholder="Ingrese el nombre de la póliza"
                  required
                />
              </div>
            </div>

            <div class="form-section">
              <div class="input-group">
                <label for="startDate">Fecha de Inicio</label>
                <input
                  type="date"
                  id="startDate"
                  v-model="policy.startDate"
                  class="form-input glass-input"
                  required
                />
              </div>
            </div>

            <div class="form-section">
              <div class="input-group">
                <label for="description">Descripción</label>
                <textarea
                  id="description"
                  v-model="policy.description"
                  class="form-input glass-input"
                  placeholder="Ingrese una descripción detallada de la póliza"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-button" @click="handleCancel">Cancelar</button>
              <button type="submit" class="submit-button glass">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Car, Home, Heart, Umbrella, Shield } from 'lucide-vue-next';

  const route = useRoute();
  const router = useRouter();
  const policyId = route.params.id as string;

  interface Policy {
    id: string;
    type: 'auto' | 'home' | 'life' | 'health' | 'business';
    name: string;
    description: string;
    insurer: string;
    policyNumber: string;
    startDate: string;
  }

  const policy = ref<Policy>({
    id: '',
    type: 'auto',
    name: '',
    description: '',
    insurer: '',
    policyNumber: '',
    startDate: '',
  });

  const insurers = [
    { id: 1, name: 'Seguros XYZ' },
    { id: 2, name: 'Aseguradora ABC' },
    { id: 3, name: 'Seguros 123' },
  ];

  const policyTypes = [
    { id: 'auto', label: 'Automóvil', icon: Car },
    { id: 'home', label: 'Hogar', icon: Home },
    { id: 'life', label: 'Vida', icon: Heart },
    { id: 'health', label: 'Salud', icon: Umbrella },
    { id: 'business', label: 'Negocio', icon: Shield },
  ];

  onMounted(() => {
    // Simular carga de datos
    // En una implementación real, aquí cargarías los datos de la API
    policy.value = {
      id: policyId,
      type: 'auto',
      name: 'Seguro de Vehículo Total',
      description:
        'Cobertura completa para su vehículo incluyendo daños por colisión, robo y responsabilidad civil.',
      insurer: 'Seguros XYZ',
      policyNumber: 'AUTO-2024-001',
      startDate: '2024-01-15',
    };
  });

  const handleSubmit = () => {
    // Aquí implementarías la lógica para guardar los cambios
    console.log('Guardando cambios:', policy.value);
    router.push('/polizas');
  };

  const handleCancel = () => {
    router.push('/polizas');
  };
</script>

<style scoped>
  .edit-policy-page {
    min-height: 100vh;
    width: 100%;
    background-color: var(--color-background);
  }

  .content {
    width: 100%;
    min-height: calc(100vh - 120px);
    display: flex;
    justify-content: center;
    padding: 11rem 1rem 2rem;
  }

  .content-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .edit-card {
    background: var(--container-bg);
    border-radius: 24px;
    border: 1px solid var(--container-border);
    overflow: hidden;
  }

  .card-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--container-border);
  }

  h1 {
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  .edit-form {
    padding: 2rem;
  }

  .form-section {
    margin-bottom: 1.5rem;
  }

  .section-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 0.75rem;
  }

  .policy-types {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
  }

  .type-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    color: var(--color-text);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .type-button:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .type-button.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  .type-button.active .type-icon {
    color: white;
  }

  .type-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-text);
    transition: color 0.3s ease;
  }

  .input-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    color: var(--color-text);
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }

  .form-input:hover {
    border-color: var(--color-primary);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-hover);
  }

  textarea.form-input {
    resize: vertical;
    min-height: 100px;
  }

  select.form-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--container-border);
  }

  .cancel-button,
  .submit-button {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cancel-button {
    background: transparent;
    color: var(--color-text);
    border: 1px solid var(--input-border);
  }

  .cancel-button:hover {
    background: var(--input-bg);
    border-color: var(--color-primary);
  }

  .submit-button {
    background: var(--color-primary);
    color: white;
    border: none;
  }

  .submit-button:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--container-shadow);
  }

  @media (max-width: 768px) {
    .content {
      padding: 9rem 0.5rem 1rem;
    }

    .content-wrapper {
      padding: 0 0.5rem;
    }

    .card-header {
      padding: 1.25rem;
    }

    .edit-form {
      padding: 1.25rem;
    }

    .policy-types {
      grid-template-columns: repeat(2, 1fr);
    }

    .input-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .cancel-button,
    .submit-button {
      width: 100%;
    }
  }
</style>
