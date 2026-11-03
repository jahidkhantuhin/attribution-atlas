<template>
  <div class="call-detail">
    <v-btn text small color="primary" class="back-link" @click="$router.push('/calls')">
      <v-icon left small>mdi-arrow-left</v-icon> Back to call insights
    </v-btn>
    <div class="page-heading">
      <div>
        <div class="eyebrow">CALL REVIEW · DEMO RECORDING</div>
        <h1>{{ practiceName }}</h1>
        <p>Review an example call and record a qualification decision.</p>
      </div>
      <v-chip small color="green lighten-5" text-color="green darken-2">Demo sample</v-chip>
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card flat class="review-card">
          <div class="recording-top">
            <span class="recording-icon"><v-icon color="primary">mdi-phone-incoming-outline</v-icon></span>
            <div><strong>New patient inquiry</strong><small>Google Ads · Portland, OR · Today, 10:42 AM</small></div>
            <v-spacer />
            <span class="quality-tag"><i></i> Ready to review</span>
          </div>
          <div class="player">
            <div class="waveform" :class="{ 'waveform-playing': isPlaying }">
              <i v-for="(bar, index) in waveform" :key="index" :style="{ height: `${bar}%` }"></i>
            </div>
            <div class="player-controls">
              <v-btn icon small aria-label="Rewind 10 seconds" @click="seek(-10)"><v-icon>mdi-rewind</v-icon></v-btn>
              <v-btn fab color="primary" class="play-button" aria-label="Toggle sample playback" @click="togglePlayback">
                <v-icon color="white">{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
              </v-btn>
              <v-btn icon small aria-label="Forward 10 seconds" @click="seek(10)"><v-icon>mdi-fast-forward</v-icon></v-btn>
            </div>
            <v-slider
              v-model="currentTime"
              min="0"
              :max="duration"
              hide-details
              color="primary"
              track-color="#e8edf5"
              class="timeline-slider"
              aria-label="Sample playback position"
            />
            <div class="time-labels"><span>{{ formatTime(currentTime) }}</span><span>{{ formatTime(duration) }}</span></div>
            <p class="simulation-note"><v-icon x-small>mdi-information-outline</v-icon> Playback controls demonstrate the review workflow; no audio is loaded in this demo.</p>
          </div>
        </v-card>

        <v-card flat class="review-card notes-card">
          <div class="card-heading"><div><div class="eyebrow">REVIEW NOTES</div><h2>Call qualification</h2></div></div>
          <div class="qualification-options">
            <button
              v-for="option in qualifications"
              :key="option.value"
              class="qualification-option"
              :class="{ selected: qualification === option.value }"
              @click="qualification = option.value"
            >
              <v-icon small>{{ option.icon }}</v-icon><span>{{ option.label }}</span>
              <v-icon v-if="qualification === option.value" x-small class="selected-check">mdi-check-circle</v-icon>
            </button>
          </div>
          <v-textarea v-model="note" outlined rows="3" auto-grow label="Add a note for your team" hide-details />
          <div class="note-actions">
            <span v-if="saved" class="saved-note"><v-icon x-small color="success">mdi-check-circle</v-icon> Review saved locally</span>
            <v-spacer />
            <v-btn color="primary" depressed :disabled="!qualification" @click="saveReview">Save review</v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card flat class="review-card call-facts">
          <div class="eyebrow">CALL DETAILS</div>
          <h2>Attribution snapshot</h2>
          <div v-for="fact in facts" :key="fact.label" class="fact-row">
            <span>{{ fact.label }}</span><strong>{{ fact.value }}</strong>
          </div>
          <div class="value-highlight"><span>Estimated lead value</span><strong>$285</strong><small>Based on demo portfolio averages</small></div>
        </v-card>
        <div class="privacy-note"><v-icon small color="primary">mdi-shield-check-outline</v-icon><span>Sample-only data. Nothing here is sent to a live service.</span></div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
  middleware: 'isAuthenticated',
  setup() {
    const route = useRoute()
    const currentTime = ref(0)
    const duration = 185
    const isPlaying = ref(false)
    const qualification = ref('')
    const note = ref('')
    const saved = ref(false)
    let playbackTimer: ReturnType<typeof setInterval> | null = null
    const waveform = [28, 54, 35, 75, 43, 62, 30, 82, 50, 35, 68, 43, 90, 56, 32, 73, 47, 60, 38, 84, 48, 31, 65, 42, 78, 52, 33, 70, 46, 88, 39, 61, 34, 76, 49, 58, 29, 82, 44, 67, 37, 73, 50, 31, 85, 45, 64, 35]
    const qualifications = [
      { value: 'qualified', label: 'Qualified lead', icon: 'mdi-check-circle-outline' },
      { value: 'follow-up', label: 'Follow-up needed', icon: 'mdi-clock-outline' },
      { value: 'not-qualified', label: 'Not qualified', icon: 'mdi-close-circle-outline' },
    ]
    const practiceName = computed(() => Number(route.value.params.id) === 100
      ? 'Northstar Dental Studio'
      : `Practice #${route.value.params.id}`)
    const facts = [
      { label: 'Source', value: 'Google Ads' },
      { label: 'Campaign', value: 'New patient search' },
      { label: 'Call duration', value: '3 min 5 sec' },
      { label: 'Location', value: 'Portland, OR' },
    ]
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
      return `${minutes}:${remainder}`
    }
    const stopPlayback = () => {
      isPlaying.value = false
      if (playbackTimer) clearInterval(playbackTimer)
      playbackTimer = null
    }
    const togglePlayback = () => {
      if (isPlaying.value) {
        stopPlayback()
        return
      }
      if (currentTime.value >= duration) currentTime.value = 0
      isPlaying.value = true
      playbackTimer = setInterval(() => {
        if (currentTime.value >= duration) {
          stopPlayback()
        } else {
          currentTime.value += 1
        }
      }, 1000)
    }
    const seek = (amount: number) => {
      currentTime.value = Math.max(0, Math.min(duration, currentTime.value + amount))
      if (currentTime.value >= duration) stopPlayback()
    }
    const saveReview = () => {
      saved.value = true
    }
    onUnmounted(stopPlayback)
    return {
      currentTime,
      duration,
      facts,
      formatTime,
      isPlaying,
      note,
      practiceName,
      qualifications,
      qualification,
      saveReview,
      saved,
      seek,
      togglePlayback,
      waveform,
    }
  },
  head: { title: 'Call review' },
})
</script>

<style lang="scss" scoped>
.call-detail { max-width: 1240px; margin: 0 auto; padding: 28px 34px 48px; color: #17233d; }
.back-link { margin: 0 0 17px -8px; text-transform: none; }
.page-heading { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
.eyebrow { color: #8792a6; font-size: 9px; font-weight: 800; letter-spacing: 1.15px; }
h1 { margin: 7px 0 4px; font-size: 28px; letter-spacing: -.7px; }
.page-heading p { margin: 0; color: #8691a5; font-size: 12px; }
.review-card { padding: 22px; border: 1px solid #e8edf5; border-radius: 15px !important; background: #fff; }
.recording-top { display: flex; align-items: center; gap: 12px; padding-bottom: 17px; border-bottom: 1px solid #edf0f5; }
.recording-icon { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 11px; background: #edf2ff; }
.recording-top strong, .recording-top small { display: block; }.recording-top strong { color: #293650; font-size: 12px; }.recording-top small { margin-top: 4px; color: #8994a8; font-size: 10px; }
.quality-tag { padding: 6px 9px; border-radius: 20px; color: #148c68; background: #e8f8f2; font-size: 9px; font-weight: 700; }.quality-tag i { display: inline-block; width: 6px; height: 6px; margin-right: 5px; border-radius: 50%; background: #11a579; }
.player { padding: 22px 4px 0; }.waveform { display: flex; height: 70px; align-items: center; justify-content: space-between; gap: 3px; }.waveform i { width: 4px; max-height: 100%; border-radius: 4px; background: #cbd6f3; transition: background .2s ease; }.waveform-playing i:nth-child(3n) { background: #4776f5; }.play-button { width: 48px !important; height: 48px !important; }.player-controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 17px 0; }.timeline-slider { margin-top: 5px; }.time-labels { display: flex; justify-content: space-between; margin-top: -5px; color: #8e99ac; font-size: 9px; }.simulation-note { display: flex; align-items: center; gap: 5px; margin: 17px 0 0; color: #8994a8; font-size: 9px; }
.notes-card { margin-top: 16px; }.card-heading { margin-bottom: 16px; }h2 { margin: 5px 0 0; font-size: 16px; letter-spacing: -.2px; }.qualification-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-bottom: 17px; }.qualification-option { display: flex; align-items: center; gap: 7px; min-height: 42px; padding: 0 10px; border: 1px solid #e8edf5; border-radius: 9px; color: #66738a; background: #fff; font-size: 10px; text-align: left; cursor: pointer; }.qualification-option.selected { border-color: #9cb4ff; color: #315fe5; background: #f3f6ff; }.selected-check { margin-left: auto; }.note-actions { display: flex; align-items: center; margin-top: 13px; }.saved-note { color: #138b69; font-size: 10px; }.note-actions .v-btn { border-radius: 8px; font-size: 10px; text-transform: none; }
.call-facts h2 { margin: 6px 0 19px; }.fact-row { display: flex; justify-content: space-between; gap: 10px; padding: 12px 0; border-top: 1px solid #f0f2f6; color: #8994a8; font-size: 10px; }.fact-row strong { color: #35425b; font-size: 10px; text-align: right; }.value-highlight { display: flex; flex-direction: column; gap: 4px; margin-top: 17px; padding: 15px; border-radius: 11px; background: #f3f6ff; color: #758197; font-size: 10px; }.value-highlight strong { color: #315fe5; font-size: 22px; }.value-highlight small { color: #97a2b4; font-size: 9px; }.privacy-note { display: flex; align-items: flex-start; gap: 8px; margin-top: 13px; padding: 13px; border: 1px solid #e8edf5; border-radius: 11px; background: #fff; color: #8290a5; font-size: 10px; line-height: 1.5; }
@media (max-width: 700px) { .call-detail { padding: 18px 12px 30px; }.review-card { padding: 16px; }.quality-tag { display: none; }.qualification-options { grid-template-columns: 1fr; }.page-heading h1 { font-size: 24px; } }
</style>
