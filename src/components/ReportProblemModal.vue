<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: { description: string }): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const description = ref('')

const handleSubmit = () => {
  if (description.value.trim()) {
    emit('submit', { description: description.value })
    description.value = ''
  }
}

const handleClose = () => {
  description.value = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="handleClose">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Reportar un Problema</h2>
          <button class="close-button" @click="handleClose">
            <X class="close-icon" />
          </button>
        </div>

        <div class="modal-content">
          <div class="form-group">
            <label for="description">Descripción del Problema</label>
            <div class="input-wrapper">
              <textarea
                id="description"
                v-model="description"
                rows="6"
                placeholder="Describa el problema que está experimentando..."
                class="description-input"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="handleClose">
            Cancelar
          </button>
          <button 
            class="submit-button"
            :disabled="!description.trim()"
            @click="handleSubmit"
          >
            Enviar Reporte
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

:global(.dark) .modal-container {
  background: #1a1a1a;
  border-color: #2d2d2d;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:global(.dark) .modal-header {
  border-color: #2d2d2d;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

:global(.dark) .modal-header h2 {
  color: #ffffff;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: var(--color-primary);
}

:global(.dark) .close-button:hover {
  background: #2d2d2d;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-content {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

:global(.dark) .form-group label {
  color: #e5e7eb;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.description-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 120px;
  max-height: 300px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  display: block;
  margin: 0;
  font-family: inherit;
}

:global(.dark) .description-input {
  background: #1a1a1a;
  border-color: #2d2d2d;
  color: #ffffff;
}

.description-input:hover {
  border-color: var(--color-primary);
}

.description-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-shadow);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f9fafb;
}

:global(.dark) .modal-footer {
  background: #1a1a1a;
  border-color: #2d2d2d;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
}

:global(.dark) .cancel-button {
  background: #1a1a1a;
  border-color: #2d2d2d;
  color: #e5e7eb;
}

.cancel-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.submit-button {
  background: var(--color-primary);
  border: none;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1rem;
  }

  .cancel-button,
  .submit-button {
    padding: 0.625rem 1.25rem;
  }
}
</style>
