// 之所以不用 dataActive = boolean，是因为要区分 data-active = false data-active = '' 会比较麻烦
export type AnimeState = 'active' | 'inactive'
