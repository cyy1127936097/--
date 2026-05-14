import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const PREFERENCE_KEY = 'zhi_lv_preference'

export const THEME_OPTIONS = [
  { key: 'nature', label: '自然风光', icon: '🏔️' },
  { key: 'culture', label: '人文历史', icon: '🏛️' },
  { key: 'food', label: '美食探店', icon: '🍜' },
  { key: 'family', label: '亲子娱乐', icon: '🎠' },
  { key: 'outdoor', label: '户外运动', icon: '🧗' },
  { key: 'trending', label: '网红打卡', icon: '📸' },
  { key: 'artsy', label: '文艺小众', icon: '🎨' },
  { key: 'seaside', label: '海滨度假', icon: '🏖️' }
]

export const TRAVEL_STYLE_OPTIONS = [
  { key: 'free', label: '自由行', icon: '🎒' },
  { key: 'group', label: '跟团游', icon: '🚌' },
  { key: 'selfdrive', label: '自驾游', icon: '🚗' }
]

export const COMPANION_OPTIONS = [
  { key: 'solo', label: '独自旅行', icon: '🧍' },
  { key: 'couple', label: '情侣出行', icon: '💑' },
  { key: 'family', label: '家庭亲子', icon: '👨‍👩‍👧' },
  { key: 'friends', label: '朋友结伴', icon: '👯' }
]

export const BUDGET_OPTIONS = [
  { key: 'economy', label: '经济实惠', desc: '<1000', icon: '💰' },
  { key: 'comfort', label: '舒适出行', desc: '1000-3000', icon: '💎' },
  { key: 'premium', label: '品质之旅', desc: '3000-5000', icon: '👑' },
  { key: 'luxury', label: '豪华度假', desc: '>5000', icon: '🏆' }
]

function loadPreference() {
  try {
    const raw = uni.getStorageSync(PREFERENCE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function savePreference(data) {
  uni.setStorageSync(PREFERENCE_KEY, JSON.stringify(data))
}

export const usePreferenceStore = defineStore('preference', () => {
  const saved = loadPreference()

  const themes = ref(saved?.themes || [])
  const travelStyle = ref(saved?.travelStyle || [])
  const companion = ref(saved?.companion || [])
  const budget = ref(saved?.budget || [])

  const hasPreference = computed(() => {
    return themes.value.length > 0 || travelStyle.value.length > 0 ||
      companion.value.length > 0 || budget.value.length > 0
  })

  const preferenceCount = computed(() => {
    return themes.value.length + travelStyle.value.length +
      companion.value.length + budget.value.length
  })

  const preferenceSummary = computed(() => {
    if (!hasPreference.value) return ''
    const parts = []
    if (themes.value.length > 0) {
      const labels = themes.value.map(k => THEME_OPTIONS.find(t => t.key === k)?.label).filter(Boolean)
      parts.push(labels.join('、'))
    }
    if (companion.value.length > 0) {
      const labels = companion.value.map(k => COMPANION_OPTIONS.find(t => t.key === k)?.label).filter(Boolean)
      parts.push(labels.join('、'))
    }
    if (budget.value.length > 0) {
      const labels = budget.value.map(k => BUDGET_OPTIONS.find(t => t.key === k)?.label).filter(Boolean)
      parts.push(labels.join('、'))
    }
    return parts.join(' | ')
  })

  function toggleItem(listRef, key) {
    const idx = listRef.value.indexOf(key)
    if (idx > -1) {
      listRef.value.splice(idx, 1)
    } else {
      listRef.value.push(key)
    }
  }

  function toggleTheme(key) { toggleItem(themes, key) }
  function toggleTravelStyle(key) { toggleItem(travelStyle, key) }
  function toggleCompanion(key) { toggleItem(companion, key) }
  function toggleBudget(key) { toggleItem(budget, key) }

  function save() {
    savePreference({
      themes: themes.value,
      travelStyle: travelStyle.value,
      companion: companion.value,
      budget: budget.value
    })
  }

  function reset() {
    themes.value = []
    travelStyle.value = []
    companion.value = []
    budget.value = []
    save()
  }

  return {
    themes,
    travelStyle,
    companion,
    budget,
    hasPreference,
    preferenceCount,
    preferenceSummary,
    toggleTheme,
    toggleTravelStyle,
    toggleCompanion,
    toggleBudget,
    save,
    reset
  }
})
