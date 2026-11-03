<template>
  <div class="dashboard">
    <section class="welcome-row">
      <div>
        <div class="eyebrow"><span class="live-dot"></span> PERFORMANCE OVERVIEW</div>
        <h1>Good morning, Jahid <span>✦</span></h1>
        <p>Your growth engine is looking healthy. Here’s the latest across your portfolio.</p>
      </div>
      <div class="welcome-actions">
        <v-select
          v-model="period"
          :items="periods"
          dense
          outlined
          hide-details
          class="period-select"
          aria-label="Reporting period"
        />
        <v-btn color="primary" depressed class="action-button" @click="$router.push('/clients/add')">
          <v-icon left small>mdi-plus</v-icon> Add a client
        </v-btn>
      </div>
    </section>

    <v-alert dense text color="primary" class="demo-alert">
      <v-icon small color="primary" class="mr-2">mdi-flask-outline</v-icon>
      Interactive demo · Your changes stay in this browser session.
      <span class="ml-1">No account or live connection needed.</span>
    </v-alert>

    <section class="metric-grid">
      <v-card v-for="metric in metrics" :key="metric.label" class="metric-card" flat>
        <div class="metric-top">
          <span class="metric-label">{{ metric.label }}</span>
          <span class="metric-icon" :class="metric.tone"><v-icon small>{{ metric.icon }}</v-icon></span>
        </div>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-bottom">
          <span class="metric-change"><v-icon x-small>mdi-trending-up</v-icon> {{ metric.change }}</span>
          <span class="metric-caption">vs. previous period</span>
        </div>
        <svg class="sparkline" viewBox="0 0 116 32" preserveAspectRatio="none" aria-hidden="true">
          <path :d="metric.spark" :class="metric.tone + '-line'" fill="none" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </v-card>
    </section>

    <section class="content-grid">
      <v-card class="panel performance-panel" flat>
        <div class="panel-heading">
          <div>
            <div class="eyebrow">MOMENTUM</div>
            <h2>Lead performance</h2>
            <p>Qualified inquiries across your channels</p>
          </div>
          <v-btn-toggle v-model="chartMetric" mandatory class="chart-toggle" dense>
            <v-btn value="leads" small>Leads</v-btn>
            <v-btn value="spend" small>Spend</v-btn>
          </v-btn-toggle>
        </div>
        <div class="chart-legend">
          <span><i class="legend-dot blue"></i> This period</span>
          <span><i class="legend-dot pale"></i> Previous period</span>
          <strong>{{ chartSummary }} <small>↗ 18.6%</small></strong>
        </div>
        <div class="chart-wrap">
          <div class="chart-axis"><span v-for="tick in chartTicks" :key="tick">{{ tick }}</span></div>
          <svg class="line-chart" viewBox="0 0 720 210" preserveAspectRatio="none" role="img" aria-label="Lead performance trend chart">
            <defs>
              <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#4776f5" stop-opacity=".20" />
                <stop offset="100%" stop-color="#4776f5" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g class="grid-lines">
              <path d="M0 10H720 M0 57H720 M0 104H720 M0 151H720 M0 198H720" />
            </g>
            <path class="area-path" :d="`${currentPath} V205 H0Z`" />
            <path class="previous-line" :d="previousPath" />
            <path class="current-line" :d="currentPath" />
            <circle cx="720" cy="20" r="5" class="chart-end" />
          </svg>
        </div>
        <div class="chart-months"><span>Oct 1</span><span>Oct 5</span><span>Oct 10</span><span>Oct 15</span><span>Oct 20</span><span>Oct 25</span><span>Oct 30</span></div>
      </v-card>

      <v-card class="panel channels-panel" flat>
        <div class="panel-heading">
          <div><div class="eyebrow">ATTRIBUTION MIX</div><h2>Where leads come from</h2><p>Channel contribution this period</p></div>
          <v-btn icon small aria-label="Open call reports" @click="$router.push('/calls')"><v-icon small>mdi-arrow-top-right</v-icon></v-btn>
        </div>
        <div v-for="channel in channels" :key="channel.name" class="channel-row">
          <div class="channel-meta">
            <span class="channel-symbol" :class="channel.tone"><v-icon small>{{ channel.icon }}</v-icon></span>
            <span class="channel-name">{{ channel.name }}</span>
            <span class="channel-count">{{ channel.leads }} leads</span>
          </div>
          <div class="channel-track"><span :class="channel.tone" :style="{ width: channel.share + '%' }"></span></div>
          <div class="channel-summary"><span>{{ channel.share }}% of leads</span><strong>{{ channel.cpl }} CPL</strong></div>
        </div>
        <v-btn text color="primary" class="channel-link" @click="$router.push('/calls')">
          Explore channel insights <v-icon right small>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card>
    </section>

    <section class="content-grid lower-grid">
      <v-card class="panel lead-panel" flat>
        <div class="panel-heading">
          <div><div class="eyebrow">YOUR PORTFOLIO</div><h2>Top performing clients</h2><p>A quick look at the practices driving growth</p></div>
          <v-btn text color="primary" small @click="$router.push('/clients')">View all <v-icon right small>mdi-arrow-right</v-icon></v-btn>
        </div>
        <div class="client-list">
          <button v-for="(client, index) in topClients" :key="client.id" class="client-row" @click="$router.push(`/clients/${client.id}`)">
            <span class="client-avatar" :class="'avatar-' + index">{{ client.initials }}</span>
            <span class="client-identity"><strong>{{ client.name }}</strong><small>{{ client.city }} · {{ client.manager }}</small></span>
            <span class="client-leads"><strong>{{ client.leads }}</strong><small>new leads</small></span>
            <span class="client-growth">↗ {{ client.growth }}%</span>
            <v-icon x-small class="client-arrow">mdi-chevron-right</v-icon>
          </button>
        </div>
      </v-card>

      <v-card class="panel activity-panel" flat>
        <div class="panel-heading">
          <div><div class="eyebrow">LIVE PULSE</div><h2>Recent activity</h2><p>Things moving across your accounts</p></div>
          <span class="activity-live"><i></i> LIVE</span>
        </div>
        <div v-for="item in activity" :key="item.title" class="activity-row">
          <span class="activity-icon" :class="item.tone"><v-icon small>{{ item.icon }}</v-icon></span>
          <span class="activity-copy"><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></span>
          <time>{{ item.when }}</time>
        </div>
        <v-btn text color="primary" class="activity-link" @click="$router.push('/calls')">Open activity report <v-icon right small>mdi-arrow-right</v-icon></v-btn>
      </v-card>
    </section>

    <section class="insight-strip">
      <span class="insight-icon"><v-icon color="white">mdi-lightbulb-on-outline</v-icon></span>
      <div><strong>Your next growth opportunity</strong><p>Paid search is bringing in your highest-intent leads. Consider shifting 10% of social spend to search this month to capture more ready-to-book patients.</p></div>
      <v-btn outlined color="white" small @click="$router.push('/calls')">Review channels <v-icon right small>mdi-arrow-right</v-icon></v-btn>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AttributionDashboard',
  setup() {
    const period = ref('Last 30 days')
    const periods = ['Last 7 days', 'Last 30 days', 'Last 90 days']
    const chartMetric = ref('leads')
    const currentPath = computed(() => chartMetric.value === 'leads'
      ? 'M0 165 C42 154 52 140 90 147 S140 164 180 128 S230 135 270 112 S320 124 360 95 S410 102 450 79 S500 94 540 60 S590 80 630 45 S680 56 720 20'
      : 'M0 177 C42 164 52 171 90 148 S140 155 180 132 S230 140 270 117 S320 122 360 108 S410 116 450 83 S500 95 540 69 S590 75 630 50 S680 61 720 30')
    const previousPath = computed(() => chartMetric.value === 'leads'
      ? 'M0 173 C45 165 56 162 90 158 S140 164 180 150 S230 158 270 139 S320 151 360 132 S410 139 450 122 S500 132 540 104 S590 117 630 93 S680 104 720 78'
      : 'M0 180 C45 175 56 168 90 163 S140 169 180 157 S230 162 270 145 S320 155 360 138 S410 147 450 126 S500 139 540 112 S590 121 630 98 S680 109 720 87')
    const chartTicks = computed(() => chartMetric.value === 'leads'
      ? ['400', '300', '200', '100', '0']
      : ['$50k', '$40k', '$30k', '$20k', '$0'])
    const chartSummary = computed(() => chartMetric.value === 'leads' ? '1,284 leads' : '$42.8k spend')
    const multiplier = computed(() => period.value === 'Last 7 days' ? 0.3 : period.value === 'Last 90 days' ? 2.8 : 1)
    const metrics = computed(() => [
      { label: 'Total leads', value: Math.round(1284 * multiplier.value).toLocaleString(), change: '+18.6%', icon: 'mdi-account-multiple-outline', tone: 'blue-tone', spark: 'M2 25 C16 22 17 10 29 18 S42 23 54 13 S71 20 82 9 S100 12 114 3' },
      { label: 'Qualified leads', value: Math.round(842 * multiplier.value).toLocaleString(), change: '+12.4%', icon: 'mdi-check-decagram-outline', tone: 'green-tone', spark: 'M2 27 C13 19 17 22 28 17 S43 21 55 12 S71 18 82 10 S102 13 114 4' },
      { label: 'Marketing spend', value: `$${(42.8 * multiplier.value).toFixed(1)}k`, change: '+6.2%', icon: 'mdi-wallet-outline', tone: 'violet-tone', spark: 'M2 23 C17 24 20 18 32 20 S44 15 56 17 S72 10 84 14 S101 8 114 5' },
      { label: 'Avg. cost per lead', value: '$33.33', change: '−8.1%', icon: 'mdi-bullseye-arrow', tone: 'amber-tone', spark: 'M2 5 C14 9 20 7 30 12 S43 10 56 16 S72 14 84 20 S101 19 114 26' },
    ])
    const channels = [
      { name: 'Google Ads', icon: 'mdi-google', tone: 'blue-tone', leads: 742, share: 58, cpl: '$28.40' },
      { name: 'Organic search', icon: 'mdi-magnify', tone: 'green-tone', leads: 308, share: 24, cpl: '$12.10' },
      { name: 'Social media', icon: 'mdi-instagram', tone: 'violet-tone', leads: 154, share: 12, cpl: '$41.80' },
      { name: 'Direct & referral', icon: 'mdi-link-variant', tone: 'amber-tone', leads: 80, share: 6, cpl: '$18.60' },
    ]
    const topClients = [
      { id: 100, name: 'Northstar Dental Studio', city: 'Portland, OR', manager: 'Morgan Reed', initials: 'NS', leads: 148, growth: 24 },
      { id: 101, name: 'Willow Creek Dentistry', city: 'Austin, TX', manager: 'Taylor Brooks', initials: 'WC', leads: 126, growth: 18 },
      { id: 102, name: 'Juniper Family Dental', city: 'Denver, CO', manager: 'Jordan Parker', initials: 'JF', leads: 112, growth: 15 },
      { id: 103, name: 'Cedar Grove Smiles', city: 'Raleigh, NC', manager: 'Morgan Reed', initials: 'CG', leads: 98, growth: 12 },
    ]
    const activity = [
      { title: 'New lead attributed', detail: 'Northstar Dental · Google Ads', when: '2m ago', icon: 'mdi-account-plus-outline', tone: 'blue-tone' },
      { title: 'Weekly report is ready', detail: 'Willow Creek Dentistry', when: '18m ago', icon: 'mdi-file-chart-outline', tone: 'green-tone' },
      { title: 'Campaign hit its target', detail: 'Juniper Family Dental · Search', when: '1h ago', icon: 'mdi-target', tone: 'violet-tone' },
      { title: 'New call conversion', detail: 'Brightline Dental Care', when: '2h ago', icon: 'mdi-phone-incoming-outline', tone: 'amber-tone' },
    ]
    return { activity, channels, chartMetric, chartSummary, chartTicks, currentPath, metrics, period, periods, previousPath, topClients }
  },
})
</script>

<style lang="scss" scoped>
.dashboard { max-width: 1440px; margin: 0 auto; padding: 28px 34px 42px; color: #17233d; }
.welcome-row, .welcome-actions, .panel-heading, .metric-top, .metric-bottom, .chart-legend, .channel-meta, .channel-summary, .client-row, .activity-row, .insight-strip { display: flex; align-items: center; }
.welcome-row, .panel-heading { justify-content: space-between; }
.eyebrow { color: #8490a6; font-size: 10px; font-weight: 800; letter-spacing: 1.25px; }
.live-dot, .activity-live i { display: inline-block; width: 7px; height: 7px; margin-right: 7px; border-radius: 50%; background: #10ae83; box-shadow: 0 0 0 3px #10ae831c; }
h1 { margin: 10px 0 4px; font-size: clamp(26px, 3vw, 36px); font-weight: 760; letter-spacing: -1.3px; }
h1 span { color: #f1ad35; font-size: 24px; }
.welcome-row p, .panel-heading p { margin: 0; color: #8590a4; font-size: 13px; }
.welcome-actions { gap: 12px; }
.period-select { width: 150px; margin: 0; font-size: 12px; }
.action-button { height: 40px !important; border-radius: 10px; text-transform: none; font-weight: 700; }
.demo-alert { margin: 22px 0; border-radius: 10px; font-size: 12px; }
.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.metric-card, .panel { position: relative; overflow: hidden; border: 1px solid #e8edf5; border-radius: 15px !important; background: #fff; }
.metric-card { min-height: 146px; padding: 18px 20px; }
.metric-top { justify-content: space-between; }
.metric-label { color: #758197; font-size: 12px; font-weight: 650; }
.metric-icon, .channel-symbol, .activity-icon { display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; }
.metric-icon { width: 34px; height: 34px; }
.metric-value { margin: 9px 0 5px; font-size: 27px; font-weight: 760; letter-spacing: -.8px; }
.metric-bottom { gap: 7px; }
.metric-change { color: #0a9b71; font-size: 11px; font-weight: 750; }
.metric-caption { color: #9aa4b6; font-size: 10px; }
.sparkline { position: absolute; right: 16px; bottom: 18px; width: 86px; height: 26px; opacity: .8; }
.blue-tone { color: #396bf1; background: #edf2ff; }
.green-tone { color: #0ca77b; background: #e8f8f2; }
.violet-tone { color: #895be8; background: #f3edff; }
.amber-tone { color: #d89016; background: #fff5e3; }
.blue-tone-line { stroke: #396bf1; }.green-tone-line { stroke: #0ca77b; }.violet-tone-line { stroke: #895be8; }.amber-tone-line { stroke: #d89016; }
.content-grid { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(330px, 1fr); gap: 16px; margin-top: 16px; }
.panel { padding: 22px; }
.panel-heading { align-items: flex-start; margin-bottom: 20px; }
.panel-heading h2 { margin: 5px 0 3px; font-size: 17px; font-weight: 730; letter-spacing: -.25px; }
.panel-heading p { font-size: 11px; }
.chart-toggle { border: 1px solid #e7ebf3; border-radius: 8px; }
.chart-toggle .v-btn { min-width: 54px !important; padding: 0 8px !important; color: #748099; font-size: 10px; text-transform: none; }
.chart-legend { gap: 18px; margin-bottom: 9px; color: #7e899e; font-size: 10px; }
.legend-dot { display: inline-block; width: 7px; height: 7px; margin-right: 5px; border-radius: 50%; }.legend-dot.blue { background: #4776f5; }.legend-dot.pale { background: #cbd6f3; }
.chart-legend strong { margin-left: auto; color: #263551; font-size: 13px; }.chart-legend small { color: #0a9b71; font-size: 10px; }
.chart-wrap { display: flex; height: 190px; }
.chart-axis { display: flex; flex-direction: column; justify-content: space-between; padding: 0 12px 0 0; color: #a0a9b8; font-size: 9px; }
.line-chart { width: 100%; height: 100%; overflow: visible; }
.grid-lines path { fill: none; stroke: #edf0f5; stroke-dasharray: 3 5; stroke-width: 1; }
.area-path { fill: url(#area-fill); }.current-line, .previous-line { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.current-line { stroke: #4776f5; stroke-width: 3; }.previous-line { stroke: #bac8e9; stroke-width: 2; stroke-dasharray: 5 5; }.chart-end { fill: #4776f5; stroke: #fff; stroke-width: 3; }
.chart-months { display: flex; justify-content: space-between; padding: 7px 0 0 27px; color: #a0a9b8; font-size: 9px; }
.channel-row { margin: 17px 0 20px; }
.channel-meta { gap: 9px; }.channel-symbol { width: 28px; height: 28px; border-radius: 8px; }.channel-name { color: #34425c; font-size: 11px; font-weight: 650; }.channel-count { margin-left: auto; color: #8792a6; font-size: 10px; }
.channel-track { height: 6px; margin: 9px 0 6px; overflow: hidden; border-radius: 6px; background: #f0f2f7; }.channel-track span { display: block; height: 100%; border-radius: inherit; }.channel-track .blue-tone { background: #4776f5; }.channel-track .green-tone { background: #18b887; }.channel-track .violet-tone { background: #9c72f0; }.channel-track .amber-tone { background: #f1b347; }
.channel-summary { justify-content: space-between; color: #9aa4b6; font-size: 9px; }.channel-summary strong { color: #66738a; font-size: 9px; font-weight: 650; }
.channel-link, .activity-link { margin: 4px 0 0 -8px; font-size: 11px; text-transform: none; }
.lower-grid { margin-top: 16px; }.lower-grid .panel-heading { margin-bottom: 11px; }
.client-row { width: 100%; padding: 11px 3px; border: 0; border-bottom: 1px solid #f0f2f6; background: transparent; text-align: left; cursor: pointer; gap: 11px; }.client-row:hover { background: #f8faff; }
.client-avatar { display: grid; width: 34px; height: 34px; flex: 0 0 34px; place-items: center; border-radius: 10px; color: #fff; background: #5279e9; font-size: 10px; font-weight: 750; }.avatar-1 { background: #20a889; }.avatar-2 { background: #8969db; }.avatar-3 { background: #d89138; }
.client-identity, .client-leads { display: flex; flex-direction: column; min-width: 0; }.client-identity { flex: 1; }.client-identity strong { overflow: hidden; color: #293650; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }.client-identity small, .client-leads small { margin-top: 3px; color: #97a1b2; font-size: 9px; }
.client-leads { min-width: 54px; text-align: right; }.client-leads strong { color: #293650; font-size: 12px; }.client-growth { min-width: 43px; color: #0b9e73; font-size: 10px; font-weight: 700; text-align: right; }.client-arrow { color: #aab3c1; }
.activity-live { color: #0ba77a; font-size: 9px; font-weight: 800; letter-spacing: .5px; }.activity-live i { width: 6px; height: 6px; }
.activity-row { gap: 10px; padding: 11px 0; border-bottom: 1px solid #f0f2f6; }.activity-icon { width: 30px; height: 30px; flex: 0 0 30px; border-radius: 9px; }.activity-copy { display: flex; flex: 1; flex-direction: column; min-width: 0; }.activity-copy strong { color: #35425b; font-size: 10px; }.activity-copy small { overflow: hidden; margin-top: 3px; color: #929daf; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }.activity-row time { color: #9ca6b7; font-size: 9px; white-space: nowrap; }
.insight-strip { gap: 15px; margin-top: 16px; padding: 17px 20px; border-radius: 14px; color: #fff; background: linear-gradient(110deg, #1d3768, #284f8b 65%, #32649b); }.insight-icon { display: grid; width: 38px; height: 38px; flex: 0 0 38px; place-items: center; border-radius: 11px; background: #ffffff20; }.insight-strip div { flex: 1; }.insight-strip strong { font-size: 12px; }.insight-strip p { margin: 4px 0 0; color: #d7e2f5; font-size: 10px; line-height: 1.5; }.insight-strip .v-btn { flex: 0 0 auto; border-radius: 8px; font-size: 10px; text-transform: none; }
@media (max-width: 1000px) { .dashboard { padding: 22px 18px 32px; }.metric-grid { grid-template-columns: repeat(2, 1fr); }.content-grid { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .dashboard { padding: 16px 10px 28px; }.welcome-row { align-items: flex-start; flex-direction: column; gap: 14px; }.welcome-actions { width: 100%; }.period-select { flex: 1; }.metric-card { padding: 14px; }.metric-value { font-size: 23px; }.panel { padding: 16px; }.chart-toggle .v-btn { min-width: 45px !important; }.insight-strip { align-items: flex-start; flex-wrap: wrap; }.insight-strip div { min-width: calc(100% - 55px); }.insight-strip .v-btn { margin-left: 52px; } }
</style>
