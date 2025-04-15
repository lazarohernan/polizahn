<template>
  <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
    <!-- Información del Pago -->
    <div class="p-5 bg-input-bg rounded-xl flex flex-col gap-5">
      <div class="grid grid-cols-[1.5fr_1fr] gap-4">
        <!-- Monto del Abono -->
        <div class="flex flex-col gap-2">
          <label for="amount" class="text-sm font-medium text-text">Monto del Abono</label>
          <div class="relative flex items-center">
            <div class="absolute left-4 text-text/50">L</div>
            <input
              id="amount"
              v-model="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Fecha de Pago -->
        <div class="flex flex-col gap-2">
          <label for="date" class="text-sm font-medium text-text">Fecha de Pago</label>
          <div class="relative flex items-center">
            <input
              id="date"
              v-model="date"
              type="date"
              required
              class="w-full px-4 py-3 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <!-- Método de Pago -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text">Método de Pago</label>
        <div class="flex gap-3">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex-1 relative flex flex-col items-center gap-2 p-4 rounded-xl border border-input-border bg-background cursor-pointer transition-all duration-300 hover:border-primary"
            :class="{ 'border-primary bg-primary/10': selectedMethod === method.id }"
          >
            <input
              v-model="selectedMethod"
              type="radio"
              :value="method.id"
              name="paymentMethod"
              required
              class="absolute opacity-0"
            />
            <component
              :is="method.icon"
              class="w-6 h-6 text-text/70 transition-colors duration-300"
              :class="{ 'text-primary': selectedMethod === method.id }"
            />
            <span class="text-sm text-text">{{ method.label }}</span>
          </label>
        </div>
      </div>

      <!-- Comprobante -->
      <div class="flex flex-col gap-3">
        <label
          class="flex items-center gap-3 p-3 border border-dashed border-input-border rounded-lg bg-background cursor-pointer transition-all duration-300 hover:border-primary"
        >
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            class="hidden"
            @change="handleFileChange"
          />
          <Upload class="w-5 h-5 text-text/70" />
          <div class="flex flex-col gap-1 overflow-hidden">
            <span class="text-sm font-medium text-text truncate">
              {{ receipt ? receipt.name : 'Subir comprobante' }}
            </span>
            <span class="text-xs text-text/70 truncate">PNG, JPG o PDF hasta 5MB</span>
          </div>
        </label>

        <!-- Muestra error en caso de seleccionar un archivo inválido (NO pdf o Word) -->
        <p v-if="fileError" class="text-red-500 text-sm mt-2">{{ fileError }}</p>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="flex gap-4 pt-5 border-t border-input-border">
      <button
        type="button"
        class="flex-1 px-6 py-3 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
      >
        Guardar Pago
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Upload, ArrowLeftRight, CreditCard, BanknoteIcon } from 'lucide-vue-next';
  import { Pago } from '../../interfaces/pagos_interface';

  const emit = defineEmits<{
    save: [payment: FormData];
    cancel: [];
  }>();

  const amount = ref<number>();
  const date = ref(new Date().toISOString().split('T')[0]);
  const selectedMethod = ref<Pago['metodo_pago']>('efectivo');
  const receipt = ref<File | null | undefined>(null);
  const fileError = ref('');

  const paymentMethods = [
    {
      id: 'efectivo' as const,
      label: 'Efectivo',
      icon: BanknoteIcon,
    },
    {
      id: 'tarjeta' as const,
      label: 'Tarjeta',
      icon: CreditCard,
    },
    {
      id: 'transferencia' as const,
      label: 'Transferencia',
      icon: ArrowLeftRight,
    },
  ];

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (file) {
      // Verificar el tipo de archivo
      let fileType = file.type;

      // Verificación adicional por extensión si el tipo MIME no es reconocido
      if (!fileType || fileType === '') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') fileType = 'application/pdf';
        else if (extension === 'png') fileType = 'image/png';
        else if (extension === 'jpg' || extension === 'jpeg') fileType = 'image/jpeg';
      }

      if (!allowedTypes.includes(fileType)) {
        fileError.value = 'Solo se permiten archivos PNG, JPG, JPEG o PDF.';
        target.value = ''; // Clear the invalid file
        receipt.value = undefined;
      } else if (file.size > maxSize) {
        fileError.value = 'El archivo no debe superar los 5MB.';
        target.value = ''; // Clear the invalid file
        receipt.value = undefined;
      } else {
        fileError.value = '';
        receipt.value = file;
      }
    }
  };

  const handleSubmit = () => {
    const uuid = localStorage.getItem('uuid');

    // Crear el FormData
    const formData = new FormData();
    formData.append('abono', amount.value!.toString());
    formData.append('fecha', date.value);
    formData.append('metodo_pago', selectedMethod.value);

    // Solo agregar el archivo si existe y es válido
    if (receipt.value instanceof File) {
      formData.append('url_comprobante', receipt.value);
    }

    formData.append('creado_por', uuid ?? '');

    emit('save', formData);
  };
</script>
