import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FileUpload, type UploadFile } from '.'

function fakeFile(name: string, type: string, contents = 'contents') {
  return new File([contents], name, { type })
}

/**
 * `FileUpload` is a hand-rolled drag-and-drop dropzone with a native
 * click-to-browse fallback (a `<label>` wrapping a visually-hidden
 * `<input type="file">`, so keyboard access and screen readers work for
 * free). The component only handles selection, client-side validation, and
 * per-file removal — the parent owns the `v-model` list of `UploadFile`
 * entries and drives the actual upload, updating `.progress` / `.error` on
 * each one.
 */
const meta = {
  title: 'Forms/FileUpload',
  component: FileUpload,
  argTypes: {
    modelValue: {
      control: false,
      description:
        'Selected files (`v-model`, array of `UploadFile`). The component adds/removes entries; the parent updates `.progress` / `.error` as upload proceeds.',
      table: { defaultValue: { summary: '[]' } },
    },
    accept: {
      control: 'text',
      description:
        'Native `accept` attribute (e.g. `.pem,.crt` or `image/*`). Also drives client-side type validation.',
      table: { defaultValue: { summary: 'undefined' } },
    },
    multiple: {
      control: 'boolean',
      description:
        'Allow selecting/dropping more than one file. When false, a new file replaces the current selection.',
      table: { defaultValue: { summary: 'false' } },
    },
    maxSizeBytes: {
      control: 'number',
      description:
        'Reject files larger than this many bytes — emits `reject` instead of adding them to the model.',
      table: { defaultValue: { summary: 'undefined' } },
    },
    maxFiles: {
      control: 'number',
      description:
        'Cap the total number of files the model can hold (only enforced when `multiple`).',
      table: { defaultValue: { summary: 'undefined' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropzone and native input.',
      table: { defaultValue: { summary: 'false' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the dropzone invalid: status-error border + `aria-invalid` on the input.',
      table: { defaultValue: { summary: 'false' } },
    },
    hint: {
      control: 'text',
      description: 'Helper text under the dropzone caption, e.g. "PEM or CRT, up to 5MB".',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  args: {
    modelValue: [],
    multiple: false,
    disabled: false,
    invalid: false,
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground — drag/drop or click to browse, remove rows, drive props from Controls. */
export const Playground: Story = {}

/** Prefilled selection — each row shows name, size, and a remove action. */
export const WithSelectedFiles: Story = {
  args: {
    multiple: true,
    modelValue: [
      { id: '1', file: fakeFile('server.pem', 'application/x-pem-file') },
      { id: '2', file: fakeFile('ca-bundle.crt', 'application/x-x509-ca-cert') },
    ] satisfies UploadFile[],
  },
}

/** A file mid-upload — the parent updates `.progress` as bytes are sent. */
export const UploadProgress: Story = {
  args: {
    modelValue: [
      { id: '1', file: fakeFile('kubeconfig.yaml', 'application/x-yaml'), progress: 62 },
    ] satisfies UploadFile[],
  },
}

/** A file the parent's upload rejected after the fact (e.g. server-side validation). */
export const WithError: Story = {
  args: {
    modelValue: [
      {
        id: '1',
        file: fakeFile('cert.pem', 'application/x-pem-file'),
        error: 'Certificate could not be parsed. Check the file is a valid PEM.',
      },
    ] satisfies UploadFile[],
  },
}

/** Invalid state — pair with a FormField error message. */
export const Invalid: Story = {
  args: { invalid: true, hint: 'PEM or CRT, up to 5MB' },
}

/** Disabled dropzone. */
export const Disabled: Story = {
  args: { disabled: true, hint: 'PEM or CRT, up to 5MB' },
}

/** Realistic creation-flow usage: uploading a TLS certificate for a load balancer listener. */
export const UploadTlsCertificate: Story = {
  args: {
    accept: '.pem,.crt',
    hint: 'PEM or CRT, up to 5MB',
    maxSizeBytes: 5 * 1024 * 1024,
  },
}
