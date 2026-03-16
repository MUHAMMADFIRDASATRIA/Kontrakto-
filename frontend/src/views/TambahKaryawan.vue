<template>
  <div class="dashboard-root">

    <!-- ───── SIDEBAR ───── -->
    <AppSidebar v-model="activeNav" @logout="handleLogout" />

    <!-- ───── MAIN ───── -->
    <div class="main-wrap">

      <!-- TOPBAR -->
      <AppTopbar username="Admin (HRD)" />

      <!-- CONTENT -->
      <div class="content-area">

        <!-- Breadcrumb + Action -->
        <div class="top-row">
          <div class="breadcrumb">
            <span class="bc-link" @click="activeNav = 'karyawan'">Data Karyawan</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="bc-current">Tambah Karyawan</span>
          </div>
          <button class="btn-tambah-top">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tambah Karyawan
          </button>
        </div>

        <!-- Page Title -->
        <h1 class="page-title">Tambah Karyawan</h1>

        <!-- ─── FORM CARD ─── -->
        <div class="form-card">

          <!-- Progress Steps -->
          <div class="steps-bar">
            <div class="step" :class="{ 'step--active': currentStep >= 1, 'step--done': currentStep > 1 }">
              <div class="step-circle">
                <svg v-if="currentStep > 1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span v-else>1</span>
              </div>
              <span class="step-label">Identitas</span>
            </div>
            <div class="step-line" :class="{ 'step-line--done': currentStep > 1 }"></div>
            <div class="step" :class="{ 'step--active': currentStep >= 2, 'step--done': currentStep > 2 }">
              <div class="step-circle">
                <svg v-if="currentStep > 2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span v-else>2</span>
              </div>
              <span class="step-label">Kontak</span>
            </div>
            <div class="step-line" :class="{ 'step-line--done': currentStep > 2 }"></div>
            <div class="step" :class="{ 'step--active': currentStep >= 3 }">
              <div class="step-circle"><span>3</span></div>
              <span class="step-label">Pekerjaan</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="form-divider"></div>

          <!-- ─── STEP 1: Identitas ─── -->
          <div v-if="currentStep === 1" class="form-body">
            <div class="form-cols">

              <!-- Left: Photo + Nama -->
              <div class="col-left">
                <div class="section-label">
                  <div class="section-dot"></div>
                  Foto & Nama
                </div>

                <div class="photo-upload-area" @click="triggerFileInput">
                  <div v-if="!photoPreview" class="photo-placeholder">
                    <div class="photo-icon-wrap">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                    <p class="photo-hint">Klik untuk upload foto</p>
                    <p class="photo-sub">JPG, PNG maks. 2MB</p>
                  </div>
                  <img v-else :src="photoPreview" class="photo-preview" alt="Preview"/>
                </div>
                <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onPhotoChange"/>

                <div class="field-group">
                  <label class="field-label">Nama Lengkap <span class="required">*</span></label>
                  <input
                    v-model="form.namaLengkap"
                    type="text"
                    class="field-input"
                    :class="{ 'field-input--error': errors.namaLengkap }"
                    placeholder="Masukkan nama lengkap"
                  />
                  <p v-if="errors.namaLengkap" class="field-error">{{ errors.namaLengkap }}</p>
                </div>

                <div class="field-group">
                  <label class="field-label">Tanggal Lahir <span class="required">*</span></label>
                  <div class="input-icon-wrap">
                    <input
                      v-model="form.tanggalLahir"
                      type="date"
                      class="field-input"
                      :class="{ 'field-input--error': errors.tanggalLahir }"
                    />
                  </div>
                  <p v-if="errors.tanggalLahir" class="field-error">{{ errors.tanggalLahir }}</p>
                </div>
              </div>

              <!-- Right: Personal Info -->
              <div class="col-right">
                <div class="section-label">
                  <div class="section-dot"></div>
                  Informasi Pribadi
                </div>

                <div class="two-col-fields">
                  <div class="field-group">
                    <label class="field-label">Jenis Kelamin <span class="required">*</span></label>
                    <div class="radio-group">
                      <label class="radio-option" :class="{ 'radio-option--active': form.jenisKelamin === 'Laki-laki' }">
                        <input type="radio" v-model="form.jenisKelamin" value="Laki-laki" class="radio-input"/>
                        <div class="radio-dot"></div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="10" cy="10" r="6"/><line x1="14.5" y1="14.5" x2="20" y2="20"/>
                          <line x1="20" y1="14" x2="20" y2="20"/><line x1="14" y1="20" x2="20" y2="20"/>
                        </svg>
                        Laki-laki
                      </label>
                      <label class="radio-option" :class="{ 'radio-option--active': form.jenisKelamin === 'Perempuan' }">
                        <input type="radio" v-model="form.jenisKelamin" value="Perempuan" class="radio-input"/>
                        <div class="radio-dot"></div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="8" r="6"/><line x1="12" y1="14" x2="12" y2="20"/>
                          <line x1="9" y1="17" x2="15" y2="17"/>
                        </svg>
                        Perempuan
                      </label>
                    </div>
                    <p v-if="errors.jenisKelamin" class="field-error">{{ errors.jenisKelamin }}</p>
                  </div>

                  <div class="field-group">
                    <label class="field-label">Status Pernikahan <span class="required">*</span></label>
                    <div class="select-wrap">
                      <select v-model="form.statusPernikahan" class="field-select" :class="{ 'field-input--error': errors.statusPernikahan }">
                        <option value="">Pilih status</option>
                        <option value="Belum Menikah">Belum Menikah</option>
                        <option value="Menikah">Menikah</option>
                        <option value="Cerai">Cerai</option>
                      </select>
                      <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <p v-if="errors.statusPernikahan" class="field-error">{{ errors.statusPernikahan }}</p>
                  </div>
                </div>

                <div class="two-col-fields">
                  <div class="field-group">
                    <label class="field-label">Agama <span class="required">*</span></label>
                    <div class="select-wrap">
                      <select v-model="form.agama" class="field-select" :class="{ 'field-input--error': errors.agama }">
                        <option value="">Pilih agama</option>
                        <option>Islam</option>
                        <option>Kristen</option>
                        <option>Katolik</option>
                        <option>Hindu</option>
                        <option>Buddha</option>
                        <option>Konghucu</option>
                      </select>
                      <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <p v-if="errors.agama" class="field-error">{{ errors.agama }}</p>
                  </div>

                  <div class="field-group">
                    <label class="field-label">Pendidikan Terakhir</label>
                    <div class="select-wrap">
                      <select v-model="form.pendidikan" class="field-select">
                        <option value="">Pilih pendidikan</option>
                        <option>SMA/SMK</option>
                        <option>D3</option>
                        <option>S1</option>
                        <option>S2</option>
                        <option>S3</option>
                      </select>
                      <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label">Alamat <span class="required">*</span></label>
                  <div class="select-wrap">
                    <input
                      v-model="form.alamat"
                      type="text"
                      class="field-input"
                      :class="{ 'field-input--error': errors.alamat }"
                      placeholder="Masukkan alamat lengkap"
                    />
                    <svg class="input-icon-right" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <p v-if="errors.alamat" class="field-error">{{ errors.alamat }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ─── STEP 2: Kontak ─── -->
          <div v-else-if="currentStep === 2" class="form-body">
            <div class="form-cols">
              <div class="col-left">
                <div class="section-label">
                  <div class="section-dot"></div>
                  Informasi Kontak
                </div>

                <div class="field-group">
                  <label class="field-label">Email <span class="required">*</span></label>
                  <div class="input-with-icon">
                    <div class="input-prefix-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4db89e" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <input
                      v-model="form.email"
                      type="email"
                      class="field-input field-input--icon"
                      :class="{ 'field-input--error': errors.email }"
                      placeholder="contoh@email.com"
                    />
                  </div>
                  <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
                </div>

                <div class="field-group">
                  <label class="field-label">Nomor Telepon <span class="required">*</span></label>
                  <div class="input-with-icon">
                    <div class="input-prefix-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4db89e" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.82 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <input
                      v-model="form.telp"
                      type="tel"
                      class="field-input field-input--icon"
                      :class="{ 'field-input--error': errors.telp }"
                      placeholder="+62 8xx xxxx xxxx"
                    />
                  </div>
                  <p v-if="errors.telp" class="field-error">{{ errors.telp }}</p>
                </div>

                <div class="field-group">
                  <label class="field-label">NIK (KTP)</label>
                  <input
                    v-model="form.nik"
                    type="text"
                    class="field-input"
                    placeholder="16 digit nomor KTP"
                    maxlength="16"
                  />
                </div>
              </div>

              <div class="col-right">
                <div class="section-label">
                  <div class="section-dot"></div>
                  Media Sosial & Lainnya
                </div>

                <div class="field-group">
                  <label class="field-label">LinkedIn</label>
                  <div class="input-with-icon">
                    <div class="input-prefix-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </div>
                    <input v-model="form.linkedin" type="text" class="field-input field-input--icon" placeholder="linkedin.com/in/username"/>
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label">Kontak Darurat</label>
                  <input v-model="form.kontakDarurat" type="text" class="field-input" placeholder="Nama kontak darurat"/>
                </div>

                <div class="field-group">
                  <label class="field-label">Nomor Kontak Darurat</label>
                  <div class="input-with-icon">
                    <div class="input-prefix-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e07a10" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.82 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <input v-model="form.telpDarurat" type="tel" class="field-input field-input--icon" placeholder="+62 8xx xxxx xxxx"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ─── STEP 3: Pekerjaan ─── -->
          <div v-else-if="currentStep === 3" class="form-body">
            <div class="form-cols">
              <div class="col-left">
                <div class="section-label">
                  <div class="section-dot"></div>
                  Penempatan
                </div>

                <div class="field-group">
                  <label class="field-label">Departemen <span class="required">*</span></label>
                  <div class="select-row-item">
                    <div class="select-row-icon select-row-icon--teal">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                    </div>
                    <div class="select-wrap select-wrap--flex">
                      <select
                        v-model="form.departemen"
                        class="field-select"
                        :class="{ 'field-input--error': errors.departemen }"
                        :disabled="isLoading || isSaving"
                      >
                        <option value="">Pilih Departemen</option>
                        <option
                          v-for="dept in departmentList"
                          :key="dept.id"
                          :value="String(dept.id)"
                        >
                          {{ dept.name }}
                        </option>
                      </select>
                      <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  <p v-if="errors.departemen" class="field-error">{{ errors.departemen }}</p>
                </div>

                <div class="field-group">
                  <label class="field-label">Jabatan <span class="required">*</span></label>
                  <div class="select-row-item">
                    <div class="select-row-icon select-row-icon--blue">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div class="select-wrap select-wrap--flex">
                      <select
                        v-model="form.jabatan"
                        class="field-select"
                        :class="{ 'field-input--error': errors.jabatan }"
                        :disabled="isLoading || isSaving || !form.departemen"
                      >
                        <option value="">Pilih Jabatan</option>
                        <option
                          v-for="jabatanItem in filteredJabatanList"
                          :key="jabatanItem.id"
                          :value="String(jabatanItem.id)"
                        >
                          {{ jabatanItem.title }}
                        </option>
                      </select>
                      <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  <p v-if="errors.jabatan" class="field-error">{{ errors.jabatan }}</p>
                </div>
              </div>

              <div class="col-right">
                <div class="section-label">
                  <div class="section-dot"></div>
                  Ringkasan Data
                </div>

                <div class="summary-preview">
                  <div class="summary-row">
                    <span class="summary-key">Nama</span>
                    <span class="summary-val">{{ form.namaLengkap || '—' }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-key">Email</span>
                    <span class="summary-val">{{ form.email || '—' }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-key">Telepon</span>
                    <span class="summary-val">{{ form.telp || '—' }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-key">Jenis Kelamin</span>
                    <span class="summary-val">{{ form.jenisKelamin || '—' }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-key">Agama</span>
                    <span class="summary-val">{{ form.agama || '—' }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-key">Departemen</span>
                    <span class="summary-val">{{ selectedDepartmentName }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-key">Jabatan</span>
                    <span class="summary-val">{{ selectedJabatanName }}</span>
                  </div>
                </div>

                <div class="info-notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d55" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p>Pastikan semua data sudah benar sebelum menyimpan.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Footer -->
          <div class="form-footer">
            <button class="btn-batal" :disabled="isSaving" @click="handleBatal">Batal</button>
            <div class="footer-right">
              <button v-if="currentStep > 1" class="btn-back" :disabled="isSaving" @click="currentStep--">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Kembali
              </button>
              <button v-if="currentStep < 3" class="btn-next" :disabled="isSaving" @click="nextStep">
                Lanjut
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button v-else class="btn-submit" :disabled="isSaving" @click="handleSubmit">
                <span v-if="isSaving" class="btn-spinner"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ isSaving ? 'Menyimpan...' : 'Tambah Karyawan' }}
              </button>
            </div>
          </div>

        </div>
        <!-- END FORM CARD -->

      </div>
    </div>

    <Teleport to="body">
      <div class="toast-container">
        <TransitionGroup name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast"
            :class="'toast--' + toast.type"
          >
            <div class="toast-icon">
              <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <span class="toast-msg">{{ toast.message }}</span>
            <button class="toast-close" @click="removeToast(toast.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AppSidebar from '@/components/Appsidebar.vue'
import AppTopbar from '@/components/Apptopbar.vue'
import { useCreateKaryawan } from '@/composables/useCreate'

// ─── Types ─────────────────────────────────────
interface FormData {
  namaLengkap: string
  tanggalLahir: string
  jenisKelamin: string
  statusPernikahan: string
  agama: string
  pendidikan: string
  alamat: string
  email: string
  telp: string
  nik: string
  linkedin: string
  kontakDarurat: string
  telpDarurat: string
  departemen: string
  jabatan: string
}

interface FormErrors {
  namaLengkap?: string
  tanggalLahir?: string
  jenisKelamin?: string
  statusPernikahan?: string
  agama?: string
  alamat?: string
  email?: string
  telp?: string
  departemen?: string
  jabatan?: string
}

// ─── State ─────────────────────────────────────
const activeNav   = ref<string>('karyawan')
const currentStep = ref<number>(1)
const photoPreview = ref<string | null>(null)
const fileInput    = ref<HTMLInputElement | null>(null)

const {
  formData,
  isLoading,
  isSaving,
  jabatanList,
  departmentList,
  toasts,
  removeToast,
  getDepartmentName,
  getJabatanName,
  loadData,
  resetFormData,
  saveData,
  handleLogout,
} = useCreateKaryawan()

const form = reactive<FormData>({
  namaLengkap:      '',
  tanggalLahir:     '',
  jenisKelamin:     '',
  statusPernikahan: '',
  agama:            '',
  pendidikan:       '',
  alamat:           '',
  email:            '',
  telp:             '',
  nik:              '',
  linkedin:         '',
  kontakDarurat:    '',
  telpDarurat:      '',
  departemen:       '',
  jabatan:          '',
})

const errors = reactive<FormErrors>({})

const filteredJabatanList = computed(() => {
  const departmentId = Number(form.departemen)
  if (!departmentId) return jabatanList.value
  return jabatanList.value.filter((item) => item.department_id === departmentId)
})

const selectedDepartmentName = computed(() => {
  const departmentId = Number(form.departemen)
  return departmentId ? getDepartmentName(departmentId) : '—'
})

const selectedJabatanName = computed(() => {
  const jabatanId = Number(form.jabatan)
  return jabatanId ? getJabatanName(jabatanId) : '—'
})

watch(() => form.departemen, () => {
  if (!form.jabatan) return
  const selectedJabatanId = Number(form.jabatan)
  const exists = filteredJabatanList.value.some((item) => item.id === selectedJabatanId)
  if (!exists) form.jabatan = ''
})

onMounted(() => {
  loadData()
})

// ─── Validation ────────────────────────────────
function validateStep(step: number): boolean {
  // Clear all errors
  Object.keys(errors).forEach(k => delete (errors as Record<string, string | undefined>)[k])

  if (step === 1) {
    if (!form.namaLengkap.trim())   errors.namaLengkap = 'Nama lengkap wajib diisi'
    if (!form.tanggalLahir)         errors.tanggalLahir = 'Tanggal lahir wajib diisi'
    if (!form.jenisKelamin)         errors.jenisKelamin = 'Jenis kelamin wajib dipilih'
    if (!form.statusPernikahan)     errors.statusPernikahan = 'Status pernikahan wajib dipilih'
    if (!form.agama)                errors.agama = 'Agama wajib dipilih'
    if (!form.alamat.trim())        errors.alamat = 'Alamat wajib diisi'
  }

  if (step === 2) {
    if (!form.email.trim())         errors.email = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Format email tidak valid'
    if (!form.telp.trim())          errors.telp = 'Nomor telepon wajib diisi'
  }

  if (step === 3) {
    if (!form.departemen)   errors.departemen = 'Departemen wajib dipilih'
    if (!form.jabatan)      errors.jabatan    = 'Jabatan wajib dipilih'
  }

  return Object.keys(errors).length === 0
}

// ─── Methods ───────────────────────────────────
function nextStep(): void {
  if (validateStep(currentStep.value)) currentStep.value++
}

function mapGender(value: string): 'male' | 'female' | '' {
  if (value === 'Laki-laki') return 'male'
  if (value === 'Perempuan') return 'female'
  return ''
}

function mapMaritalStatus(value: string): 'single' | 'married' | 'divorced' | '' {
  if (value === 'Belum Menikah') return 'single'
  if (value === 'Menikah') return 'married'
  if (value === 'Cerai') return 'divorced'
  return ''
}

async function handleSubmit(): Promise<void> {
  if (!validateStep(3)) return

  formData.value = {
    name: form.namaLengkap.trim(),
    email: form.email.trim(),
    phone: form.telp.trim(),
    address: form.alamat.trim(),
    gender: mapGender(form.jenisKelamin),
    location_of_birth: '',
    agama: form.agama,
    marital_status: mapMaritalStatus(form.statusPernikahan),
    date_of_birth: form.tanggalLahir,
    position_id: Number(form.jabatan),
    department_id: Number(form.departemen),
  }

  await saveData()
}

function handleBatal(): void {
  currentStep.value = 1
  Object.assign(form, {
    namaLengkap:'', tanggalLahir:'', jenisKelamin:'', statusPernikahan:'',
    agama:'', pendidikan:'', alamat:'', email:'', telp:'', nik:'',
    linkedin:'', kontakDarurat:'', telpDarurat:'', departemen:'', jabatan:'',
  })
  resetFormData()
  photoPreview.value = null
}

function triggerFileInput(): void {
  fileInput.value?.click()
}

function onPhotoChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { photoPreview.value = ev.target?.result as string }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ══════════ ROOT ══════════ */
.dashboard-root {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f0f2f8;
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow: hidden;
}

/* ══════════ MAIN ══════════ */
.main-wrap { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* CONTENT */
.content-area {
  flex: 1; overflow-y: auto;
  padding: 24px 28px 40px;
  display: flex; flex-direction: column; gap: 16px;
  min-height: 0;
}
.content-area::-webkit-scrollbar { width: 5px; }
.content-area::-webkit-scrollbar-track { background: transparent; }
.content-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }

/* Top row */
.top-row { display: flex; align-items: center; justify-content: space-between; }
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.bc-link { color: #888; cursor: pointer; transition: color 0.15s; }
.bc-link:hover { color: #2e7d55; }
.bc-current { color: #1a2e25; font-weight: 600; }

.btn-tambah-top {
  display: flex; align-items: center; gap: 8px;
  height: 42px; padding: 0 20px;
  background: #2e7d55; color: #fff;
  border: none; border-radius: 11px;
  font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer;
  box-shadow: 0 4px 14px rgba(46,125,85,0.22);
  transition: background 0.15s, transform 0.1s;
}
.btn-tambah-top:hover { background: #256647; transform: translateY(-1px); }

.page-title { font-size: 22px; font-weight: 800; color: #1a2e25; letter-spacing: -0.4px; }

/* ══════════ FORM CARD ══════════ */
.form-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* ─── Steps bar ─── */
.steps-bar {
  display: flex; align-items: center;
  padding: 22px 28px 18px;
  gap: 0;
}

.step { display: flex; align-items: center; gap: 10px; }

.step-circle {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 2px solid #e0e4ea;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #bbb;
  transition: all 0.25s;
  flex-shrink: 0;
}

.step--active .step-circle {
  border-color: #2e7d55;
  background: #2e7d55;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46,125,85,0.25);
}

.step--done .step-circle {
  border-color: #4db89e;
  background: #4db89e;
  color: #fff;
}

.step-label { font-size: 13px; font-weight: 600; color: #bbb; transition: color 0.25s; }
.step--active .step-label { color: #1a2e25; }
.step--done .step-label   { color: #4db89e; }

.step-line { flex: 1; height: 2px; background: #e8ecf0; margin: 0 12px; border-radius: 2px; transition: background 0.25s; }
.step-line--done { background: #4db89e; }

.form-divider { height: 1px; background: #f0f2f6; }

/* ─── Form body ─── */
.form-body { padding: 24px 28px 4px; }

.form-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.col-left, .col-right { display: flex; flex-direction: column; gap: 16px; }

.section-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 700; color: #2e7d55;
  text-transform: uppercase; letter-spacing: 0.5px;
  padding-bottom: 4px;
  border-bottom: 2px solid #e8f5ee;
  margin-bottom: 4px;
}

.section-dot { width: 8px; height: 8px; border-radius: 50%; background: #4db89e; flex-shrink: 0; }

/* Photo upload */
.photo-upload-area {
  width: 100px; height: 100px;
  border-radius: 16px;
  border: 2px dashed #d0dde6;
  background: #f7fafb;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
}
.photo-upload-area:hover { border-color: #4db89e; background: #f0faf6; }
.photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.photo-icon-wrap { width: 40px; height: 40px; border-radius: 12px; background: #eef2f6; display: flex; align-items: center; justify-content: center; }
.photo-hint { font-size: 9.5px; font-weight: 600; color: #aaa; text-align: center; line-height: 1.3; }
.photo-sub  { font-size: 8.5px; color: #ccc; }
.photo-preview { width: 100%; height: 100%; object-fit: cover; }
.hidden-input { display: none; }

/* Fields */
.field-group { display: flex; flex-direction: column; gap: 5px; }

.field-label { font-size: 12.5px; font-weight: 600; color: #4a5568; }

.required { color: #e05050; margin-left: 2px; }

.field-input {
  height: 42px;
  padding: 0 14px;
  border: 1.5px solid #e4e8ef;
  border-radius: 10px;
  font-size: 13.5px; color: #333;
  background: #fafbfd;
  outline: none; font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus { border-color: #4db89e; box-shadow: 0 0 0 3px rgba(77,184,158,0.12); background: #fff; }
.field-input::placeholder { color: #c0c8d4; }
.field-input--error { border-color: #e05050 !important; }
.field-input--icon { padding-left: 44px; }

.field-select {
  width: 100%;
  height: 42px;
  padding: 0 36px 0 14px;
  border: 1.5px solid #e4e8ef;
  border-radius: 10px;
  font-size: 13.5px; color: #333;
  background: #fafbfd;
  outline: none; font-family: inherit;
  appearance: none; cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-select:focus { border-color: #4db89e; box-shadow: 0 0 0 3px rgba(77,184,158,0.12); background: #fff; }

.select-wrap { position: relative; }
.select-wrap--flex { flex: 1; }
.select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.input-icon-right { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }

.field-error { font-size: 11.5px; color: #e05050; font-weight: 500; }

.two-col-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* Radio */
.radio-group { display: flex; gap: 10px; }

.radio-option {
  flex: 1; display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border: 1.5px solid #e4e8ef; border-radius: 10px;
  cursor: pointer; font-size: 13px; font-weight: 500; color: #555;
  background: #fafbfd; transition: border-color 0.15s, background 0.15s, color 0.15s;
  user-select: none;
}
.radio-option--active { border-color: #4db89e; background: #f0faf6; color: #1a7a56; }

.radio-input { display: none; }

.radio-dot {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid #d0dde6; background: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: border-color 0.15s, background 0.15s;
}
.radio-option--active .radio-dot { border-color: #4db89e; background: #4db89e; box-shadow: inset 0 0 0 3px #fff; }

/* Input with icon */
.input-with-icon { position: relative; }
.input-prefix-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; pointer-events: none;
}

/* Select row item (Pekerjaan step) */
.select-row-item { display: flex; align-items: center; gap: 10px; }
.select-row-icon {
  width: 38px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.select-row-icon--teal { background: #e6f9f4; color: #2e7d55; }
.select-row-icon--blue { background: #e8f2ff; color: #2563eb; }

/* Summary preview */
.summary-preview {
  background: #f7f9fc; border: 1px solid #e8ecf4; border-radius: 12px;
  padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
}

.summary-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.summary-key { font-size: 12px; font-weight: 600; color: #9aa5b4; min-width: 100px; }
.summary-val { font-size: 13px; font-weight: 600; color: #2a3548; text-align: right; }

/* Info notice */
.info-notice {
  display: flex; align-items: flex-start; gap: 8px;
  background: #eef8f2; border: 1px solid #c8e8d8; border-radius: 10px;
  padding: 12px 14px; margin-top: 4px;
}
.info-notice p { font-size: 12.5px; color: #2e7d55; line-height: 1.5; }

/* ─── Form footer ─── */
.form-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 28px 22px; border-top: 1px solid #f0f2f6; margin-top: 8px;
}

.footer-right { display: flex; align-items: center; gap: 10px; }

.btn-batal {
  height: 42px; padding: 0 22px;
  border: 1.5px solid #e0e4ea; border-radius: 11px;
  background: #fff; color: #666;
  font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.btn-batal:hover { background: #fdecea; border-color: #f0c0c0; color: #d05050; }

.btn-back {
  height: 42px; padding: 0 18px;
  border: 1.5px solid #d8e8de; border-radius: 11px;
  background: #fff; color: #2e7d55;
  font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: background 0.15s;
}
.btn-back:hover { background: #f0f8f4; }

.btn-next {
  height: 42px; padding: 0 22px;
  border: none; border-radius: 11px;
  background: #2e7d55; color: #fff;
  font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 14px rgba(46,125,85,0.22);
  transition: background 0.15s, transform 0.1s;
}
.btn-next:hover { background: #256647; transform: translateY(-1px); }

.btn-submit {
  height: 42px; padding: 0 24px;
  border: none; border-radius: 11px;
  background: linear-gradient(135deg, #2e7d55, #4db89e);
  color: #fff;
  font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 18px rgba(46,125,85,0.28);
  transition: opacity 0.15s, transform 0.1s;
}
.btn-submit:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-batal:disabled,
.btn-back:disabled,
.btn-next:disabled,
.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* ══════════ TOAST ══════════ */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.13);
  font-size: 13.5px;
  font-weight: 500;
  min-width: 260px;
  max-width: 360px;
  pointer-events: auto;
  border-left: 4px solid transparent;
}

.toast--success { border-left-color: #2e7d5e; color: #1a2e25; }
.toast--success .toast-icon { color: #2e7d5e; }

.toast--error { border-left-color: #d05050; color: #5c1a1a; }
.toast--error .toast-icon { color: #d05050; }

.toast-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.toast-msg { flex: 1; }

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #bbb;
  display: flex;
  align-items: center;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.15s;
}
.toast-close:hover { color: #666; }

@keyframes spin { to { transform: rotate(360deg); } }

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}

.toast-enter-from  { opacity: 0; transform: translateX(30px); }
.toast-enter-active { transition: opacity 0.25s, transform 0.25s; }
.toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-leave-to    { opacity: 0; transform: translateX(30px); }
</style>