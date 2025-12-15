<template>
  <VCard elevation="10" class="pa-6" rounded="xl">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <div class="text-caption text-medium-emphasis">Campaign</div>
        <h2 class="text-h4 font-weight-bold">Email composer</h2>
      </div>
      <VChip color="primary" variant="tonal" prepend-icon="mdi-email-edit-outline">
        Live preview
      </VChip>
    </div>

    <VRow class="g-6">
      <VCol cols="12" md="7">
        <VCard variant="tonal" color="primary" class="pa-4" rounded="lg">
          <VCardTitle class="text-h6 font-weight-bold">Compose</VCardTitle>
          <VCardText>
            <VRow class="g-4 mb-1">
              <VCol cols="12" md="8">
                <VSelect
                  v-model="selectedTemplateId"
                  :items="templateOptions"
                  label="Templates"
                  variant="solo-filled"
                  color="primary"
                  item-title="name"
                  item-value="id"
                  hide-details
                  prepend-inner-icon="mdi-file-outline"
                  placeholder="Choose a template to start"
                />
              </VCol>
              <VCol cols="12" md="4" class="d-flex align-center justify-end gap-2">
                <VBtn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-content-copy"
                  :disabled="!selectedTemplateId"
                  @click="applySelectedTemplate"
                >
                  Use template
                </VBtn>
                <VBtn color="secondary" variant="tonal" prepend-icon="mdi-content-save" @click="dialog.saveTemplate = true">
                  Save as template
                </VBtn>
              </VCol>
            </VRow>

            <VTextField
              v-model="form.subject"
              label="Subject"
              variant="solo-filled"
              color="primary"
              hide-details
              class="mb-4"
              placeholder="Welcome to the summer launch"
            />

            <VCombobox
              v-model="form.recipients"
              :items="recipientSuggestions"
              label="Recipients"
              variant="solo-filled"
              color="primary"
              chips
              multiple
              hide-details
              closable-chips
              class="mb-4"
              prepend-inner-icon="mdi-account-multiple"
              placeholder="Add emails and press enter"
            />

            <VTextarea
              v-model="form.body"
              label="Body"
              variant="solo-filled"
              color="primary"
              rows="10"
              auto-grow
              placeholder="Share your announcement, include links, and keep it engaging."
              hide-details
            />

            <VRow class="mt-4" align="center">
              <VCol cols="12" md="8">
                <VFileInput
                  v-model="form.attachments"
                  label="Attachments"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  show-size
                  counter
                  multiple
                  color="primary"
                  hide-details
                />
              </VCol>
              <VCol cols="12" md="4" class="d-flex justify-end">
                <VBtn color="primary" class="mr-3" prepend-icon="mdi-content-save" @click="handleSave">
                  Save draft
                </VBtn>
                <VBtn color="secondary" variant="tonal" prepend-icon="mdi-send" @click="handleSend">
                  Send now
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="5">
        <VCard class="pa-4" rounded="lg" elevation="4">
          <VCardTitle class="d-flex align-center justify-space-between">
            <span class="text-h6 font-weight-bold">Preview</span>
            <VChip color="success" variant="flat" size="small" prepend-icon="mdi-lightning-bolt-outline">
              Real time
            </VChip>
          </VCardTitle>
          <VCardText>
            <div class="text-caption text-medium-emphasis mb-1">Subject</div>
            <div class="text-body-1 font-weight-medium mb-4">{{ form.subject || 'No subject yet' }}</div>

            <div class="text-caption text-medium-emphasis mb-1">Recipients</div>
            <div class="mb-4">
              <VChip
                v-for="(recipient, index) in form.recipients"
                :key="`${recipient}-${index}`"
                color="primary"
                variant="tonal"
                size="small"
                class="ma-1"
              >
                {{ recipient }}
              </VChip>
              <span v-if="!form.recipients.length" class="text-medium-emphasis">No recipients</span>
            </div>

            <div class="text-caption text-medium-emphasis mb-1">Body</div>
            <VSheet class="pa-4 rounded-lg text-body-2" color="grey-lighten-4" min-height="200">
              <p v-if="form.body">{{ form.body }}</p>
              <p v-else class="text-medium-emphasis">Start typing to see the live preview of your message.</p>
            </VSheet>

            <div class="text-caption text-medium-emphasis mt-4 mb-2">Attachments</div>
            <div>
              <VChip
                v-for="(file, index) in form.attachments"
                :key="`${file.name}-${index}`"
                color="secondary"
                variant="tonal"
                size="small"
                class="ma-1"
                prepend-icon="mdi-paperclip"
              >
                {{ file.name }}
              </VChip>
              <span v-if="!form.attachments.length" class="text-medium-emphasis">No attachments added</span>
            </div>

            <VDivider class="my-4" />

            <div class="text-caption text-medium-emphasis mb-1">Active template</div>
            <div class="text-body-2">
              <strong>{{ activeTemplateLabel }}</strong>
              <p class="text-medium-emphasis mb-0">{{ activeTemplateDescription }}</p>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VDialog v-model="dialog.saveTemplate" max-width="480">
      <VCard>
        <VCardTitle class="text-h6 font-weight-bold">Save as template</VCardTitle>
        <VCardText>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Save your current subject and body for future use. Attachments and recipients are not stored in templates.
          </p>
          <VTextField
            v-model="newTemplate.name"
            label="Template name"
            variant="solo-filled"
            color="primary"
            placeholder="Summer welcome sequence"
            autofocus
          />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="text" color="primary" @click="dialog.saveTemplate = false">Cancel</VBtn>
          <VBtn color="primary" :disabled="!newTemplate.name.trim()" @click="saveTemplate">Save template</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface EmailForm {
  subject: string
  recipients: string[]
  body: string
  attachments: File[]
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  description?: string
}

const recipientSuggestions = [
  'marketing@acme.io',
  'customers@acme.io',
  'partners@acme.io',
  'team@acme.io'
]

const form = reactive<EmailForm>({
  subject: '',
  recipients: [],
  body: '',
  attachments: []
})

const templates = ref<EmailTemplate[]>([
  {
    id: 'welcome-new-subscribers',
    name: 'Welcome new subscribers',
    subject: 'Welcome to our community! 🎉',
    body: "Thanks for joining us! We're thrilled to have you on board. Here are a few quick links to help you get started:",
    description: 'Greets new contacts with quick start links.'
  },
  {
    id: 'product-launch',
    name: 'Product launch spotlight',
    subject: 'Introducing our newest release',
    body: 'We just shipped something new! Here is what changed and why it matters to you.',
    description: 'Announce launches with highlights and benefits.'
  },
  {
    id: 'promo-offer',
    name: 'Promo offer',
    subject: 'Exclusive offer just for you',
    body: 'Use code SAVE20 to enjoy 20% off. This offer ends soon—claim it today!',
    description: 'Quick promotional call-to-action with a discount.'
  }
])

const selectedTemplateId = ref<string | null>(templates.value[0]?.id ?? null)

const templateOptions = computed(() => templates.value)

const dialog = reactive({ saveTemplate: false })
const newTemplate = reactive({ name: '' })

const selectedTemplate = computed(() =>
  templates.value.find((template) => template.id === selectedTemplateId.value) ?? null
)

const activeTemplateLabel = computed(() => selectedTemplate.value?.name ?? 'No template selected')
const activeTemplateDescription = computed(
  () => selectedTemplate.value?.description ?? 'Pick a template to prefill your subject and body.'
)

const handleSave = () => {
  // In a real app we would persist this draft to an API.
  // For now we simply log to the console.
  console.info('Draft saved', { ...form })
}

const handleSend = () => {
  // Replace with an API call to deliver the email.
  console.info('Send email', { ...form })
}

const applySelectedTemplate = () => {
  if (!selectedTemplate.value) return

  form.subject = selectedTemplate.value.subject
  form.body = selectedTemplate.value.body
}

const saveTemplate = () => {
  const name = newTemplate.name.trim()
  if (!name) return

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50) || `template-${Date.now()}`

  templates.value.unshift({
    id,
    name,
    subject: form.subject || 'Untitled subject',
    body: form.body || 'Draft body goes here.',
    description: 'Saved from the composer'
  })

  selectedTemplateId.value = id
  dialog.saveTemplate = false
  newTemplate.name = ''
}
</script>
