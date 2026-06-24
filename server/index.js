const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const app = express()
const PORT = 8080

app.use(cors())
app.use(express.json())

// ==================== PostgreSQL 连接 ====================
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'tourism',
  user: 'postgres',
  password: '123456'
})

pool.query('SELECT 1').then(() => console.log('PostgreSQL connected')).catch(err => console.error('PostgreSQL connection failed:', err.message))

// ==================== 智谱AI配置 ====================
const ZHIPU_API_KEY = '39bfaec720ac45458755bcc2be4dbab0.FgMjAva0IsSX1cMi'
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const ZHIPU_MODEL = 'glm-4-flash'

// ==================== 内存临时数据（收藏、用户行程等） ====================
let favoriteIds = []
let userTrips = []
let chatHistories = {}

// ==================== 景点 API ====================

app.get('/api/poi/list', async (req, res) => {
  try {
    const { city, keyword } = req.query
    let sql = 'SELECT * FROM pois WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    if (keyword) { sql += ` AND (name LIKE $${idx} OR description LIKE $${idx})`; params.push(`%${keyword}%`); idx++ }
    sql += ' ORDER BY rating DESC'
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, openTime: r.open_time,
      ticketPrice: r.ticket_price, traffic: r.traffic, aiSummary: r.ai_summary || r.description,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id), latitude: parseFloat(r.latitude), longitude: parseFloat(r.longitude),
      category: r.category, iconType: r.icon_type, markerColor: r.marker_color
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/poi/detail/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pois WHERE id = $1', [req.params.id])
    if (!rows.length) return res.json({ code: 404, message: '景点不存在' })
    const r = rows[0]
    res.json({ code: 0, data: {
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, openTime: r.open_time,
      ticketPrice: r.ticket_price, traffic: r.traffic, aiSummary: r.ai_summary || r.description,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id), latitude: parseFloat(r.latitude), longitude: parseFloat(r.longitude),
      category: r.category, iconType: r.icon_type, markerColor: r.marker_color
    }})
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/poi/hot', async (req, res) => {
  try {
    const { limit = 10, city } = req.query
    let sql = 'SELECT * FROM pois WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    sql += ' ORDER BY rating DESC LIMIT $' + idx
    params.push(parseInt(limit))
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id)
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/poi/rating', async (req, res) => {
  try {
    const { page = 0, size = 20, city } = req.query
    let sql = 'SELECT * FROM pois WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    sql += ' ORDER BY rating DESC LIMIT $' + idx + ' OFFSET $' + (idx + 1)
    params.push(parseInt(size), parseInt(page) * parseInt(size))
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id)
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/poi/search', async (req, res) => {
  try {
    const { keyword, city } = req.query
    let sql = 'SELECT * FROM pois WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    if (keyword) { sql += ` AND (name LIKE $${idx} OR city LIKE $${idx})`; params.push(`%${keyword}%`); idx++ }
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id)
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/poi/route', async (req, res) => {
  try {
    const { city } = req.query
    let sql = 'SELECT * FROM routes WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city,
      days: typeof r.days === 'string' ? JSON.parse(r.days || '[]') : (r.days || []),
      pois: typeof r.pois === 'string' ? JSON.parse(r.pois || '[]') : (r.pois || []),
      color: r.color
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.post('/api/poi/favorite/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { rows } = await pool.query('SELECT id FROM pois WHERE id = $1', [id])
    if (!rows.length) return res.json({ code: 404, message: '景点不存在' })
    const idx = favoriteIds.indexOf(id)
    let isFavorite
    if (idx > -1) { favoriteIds.splice(idx, 1); isFavorite = false }
    else { favoriteIds.push(id); isFavorite = true }
    res.json({ code: 0, data: { isFavorite } })
  } catch (e) { console.error(e); res.json({ code: 500, message: '操作失败' }) }
})

app.get('/api/poi/favorites', async (req, res) => {
  try {
    if (!favoriteIds.length) return res.json({ code: 0, data: [] })
    const { rows } = await pool.query('SELECT * FROM pois WHERE id = ANY($1)', [favoriteIds])
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: true
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

// ==================== 社区 API ====================

app.get('/api/community/list', async (req, res) => {
  try {
    const { tag, city } = req.query
    let sql = 'SELECT * FROM communities WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    if (tag && tag !== '推荐') { sql += ` AND tag = $${idx++}`; params.push(tag) }
    sql += ' ORDER BY id DESC'
    const { rows } = await pool.query(sql, params)

    // 获取标签
    let tagSql = 'SELECT DISTINCT tag FROM communities WHERE tag IS NOT NULL'
    const tagParams = []
    if (city) { tagSql += ' AND city = $1'; tagParams.push(city) }
    const { rows: tagRows } = await pool.query(tagSql, tagParams)
    const allTags = ['推荐', ...tagRows.map(r => r.tag).filter(Boolean)]

    const list = rows.map(r => ({
      id: r.id, title: r.title, city: r.city, tag: r.tag,
      userName: r.user_name, avatar: r.avatar, cover: r.cover,
      likeCount: r.like_count, commentCount: r.comment_count,
      gradient: r.gradient,
      images: r.cover ? [r.cover] : [],
      isLiked: false, isFollowed: false,
      poiCity: r.city, poiName: '', poiId: null,
      tags: r.tag ? [r.tag] : [],
      content: r.title,
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }))
    res.json({ code: 0, data: { tags: allTags, list } })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/community/detail/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM communities WHERE id = $1', [req.params.id])
    if (!rows.length) return res.json({ code: 404, message: '帖子不存在' })
    const r = rows[0]
    res.json({ code: 0, data: {
      id: r.id, title: r.title, city: r.city, tag: r.tag,
      userName: r.user_name, avatar: r.avatar, cover: r.cover,
      likeCount: r.like_count, commentCount: r.comment_count,
      gradient: r.gradient,
      images: r.cover ? [r.cover] : [],
      isLiked: false, isFollowed: false,
      poiCity: r.city, poiName: '', poiId: null,
      tags: r.tag ? [r.tag] : [],
      content: r.title,
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }})
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.post('/api/community/like/:id', async (req, res) => {
  try {
    await pool.query('UPDATE communities SET like_count = like_count + 1 WHERE id = $1', [req.params.id])
    res.json({ code: 0, data: { isLiked: true } })
  } catch (e) { console.error(e); res.json({ code: 500, message: '操作失败' }) }
})

app.get('/api/community/comments', async (req, res) => {
  try {
    const { postId, sort = 'hot' } = req.query
    let sql = 'SELECT * FROM comments WHERE 1=1'
    const params = []
    let idx = 1
    if (postId) { sql += ` AND poi_id = $${idx++}`; params.push(parseInt(postId)) }
    if (sort === 'hot') sql += ' ORDER BY like_count DESC'
    else sql += ' ORDER BY create_time DESC'
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, userName: r.user_name, avatar: r.avatar, content: r.content,
      likeCount: r.like_count, isLiked: r.is_liked || false,
      createTime: r.create_time, rating: r.rating,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      replies: typeof r.replies === 'string' ? JSON.parse(r.replies || '[]') : (r.replies || [])
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.post('/api/community/comment', async (req, res) => {
  try {
    const { postId, content } = req.body
    if (!content) return res.json({ code: 400, message: '评论内容不能为空' })
    const result = await pool.query(
      'INSERT INTO comments (poi_id, user_name, avatar, content, like_count, is_liked, create_time) VALUES ($1, $2, $3, $4, 0, false, $5) RETURNING *',
      [parseInt(postId) || null, '我', 'https://i.pravatar.cc/100?img=60', content, new Date().toISOString().slice(0, 16).replace('T', ' ')]
    )
    await pool.query('UPDATE communities SET comment_count = comment_count + 1 WHERE id = $1', [parseInt(postId)])
    res.json({ code: 0, data: result.rows[0] })
  } catch (e) { console.error(e); res.json({ code: 500, message: '评论失败' }) }
})

// ==================== 评论 API ====================

app.get('/api/comment/list', async (req, res) => {
  try {
    const { poiId, sortBy = 'hot' } = req.query
    let sql = 'SELECT * FROM comments WHERE 1=1'
    const params = []
    let idx = 1
    if (poiId) { sql += ` AND poi_id = $${idx++}`; params.push(parseInt(poiId)) }
    if (sortBy === 'hot') sql += ' ORDER BY like_count DESC'
    else sql += ' ORDER BY create_time DESC'
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, userName: r.user_name, avatar: r.avatar, content: r.content,
      likeCount: r.like_count, isLiked: r.is_liked || false,
      createTime: r.create_time, rating: r.rating,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      replies: typeof r.replies === 'string' ? JSON.parse(r.replies || '[]') : (r.replies || [])
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.post('/api/comment/add', async (req, res) => {
  try {
    const { poiId, content } = req.body
    const result = await pool.query(
      'INSERT INTO comments (poi_id, user_name, avatar, content, like_count, is_liked, create_time) VALUES ($1, $2, $3, $4, 0, false, $5) RETURNING *',
      [parseInt(poiId) || null, '我', 'https://i.pravatar.cc/100?img=60', content, new Date().toISOString().slice(0, 16).replace('T', ' ')]
    )
    res.json({ code: 0, data: result.rows[0] })
  } catch (e) { console.error(e); res.json({ code: 500, message: '评论失败' }) }
})

app.post('/api/comment/like/:id', async (req, res) => {
  try {
    await pool.query('UPDATE comments SET like_count = like_count + 1, is_liked = true WHERE id = $1', [req.params.id])
    res.json({ code: 0, data: { isLiked: true } })
  } catch (e) { console.error(e); res.json({ code: 500, message: '操作失败' }) }
})

// ==================== 行程 API ====================

app.get('/api/trip/list', async (req, res) => {
  try {
    const { city } = req.query
    let sql = 'SELECT * FROM routes WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city,
      days: typeof r.days === 'string' ? JSON.parse(r.days || '[]') : (r.days || []),
      pois: typeof r.pois === 'string' ? JSON.parse(r.pois || '[]') : (r.pois || []),
      color: r.color
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.get('/api/trip/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM routes WHERE id = $1', [req.params.id])
    if (!rows.length) return res.json({ code: 404, message: '行程不存在' })
    const r = rows[0]
    res.json({ code: 0, data: {
      id: r.id, name: r.name, city: r.city,
      days: typeof r.days === 'string' ? JSON.parse(r.days || '[]') : (r.days || []),
      pois: typeof r.pois === 'string' ? JSON.parse(r.pois || '[]') : (r.pois || []),
      color: r.color
    }})
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

app.post('/api/trip/create', async (req, res) => {
  try {
    const { name, city, days, poiIds } = req.body
    // 存入用户行程内存
    const newTrip = {
      id: Date.now(),
      name: name || '新行程',
      city: city || '未知',
      days: days || 1,
      poiCount: (poiIds || []).length,
      cover: '',
      status: 'planned',
      createTime: new Date().toISOString().slice(0, 10),
      poiIds: poiIds || []
    }
    userTrips.push(newTrip)
    res.json({ code: 0, data: newTrip })
  } catch (e) { console.error(e); res.json({ code: 500, message: '创建失败' }) }
})

app.delete('/api/trip/:id', (req, res) => {
  userTrips = userTrips.filter(t => t.id !== parseInt(req.params.id))
  res.json({ code: 0 })
})

// ==================== 用户 API ====================

app.get('/api/user/trips', (req, res) => {
  res.json({ code: 0, data: userTrips })
})

app.delete('/api/user/trip/:id', (req, res) => {
  userTrips = userTrips.filter(t => t.id !== parseInt(req.params.id))
  res.json({ code: 0 })
})

app.get('/api/user/info', (req, res) => {
  res.json({ code: 0, data: { id: 1, nickName: '旅行者', avatar: 'https://i.pravatar.cc/100?img=60', phone: '138****8888' } })
})

app.post('/api/user/login/phone', (req, res) => {
  res.json({ code: 0, data: { token: 'mock-token-123', userInfo: { id: 1, nickName: '旅行者', avatar: 'https://i.pravatar.cc/100?img=60' } } })
})

app.put('/api/user/info', (req, res) => {
  res.json({ code: 0, data: req.body })
})

// ==================== 聊天 AI API ====================

app.post('/api/chat/send', async (req, res) => {
  const { content, messages = [], city = '厦门' } = req.body

  const systemPrompt = `你是"智旅AI"，一个专业的旅游规划助手。你的职责是：
1. 根据用户的需求，推荐旅游目的地、景点、美食
2. 帮助用户规划旅行路线和行程安排
3. 提供旅游攻略、交通建议、住宿推荐
4. 回答与旅游相关的问题

重要：用户当前所在/关注的城市是「${city}」。当用户询问旅游推荐时，请优先推荐${city}的景点和内容。如果用户明确询问其他城市，则推荐对应城市的内容。

回答要求：
- 回答简洁实用，重点突出
- 推荐景点时附带简要说明
- 行程规划按天排列，清晰明了
- 语气友好热情，像朋友一样交流`

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.filter(m => m.role === 'user' || m.role === 'assistant').slice(-20)
  ]

  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: ZHIPU_MODEL,
        messages: apiMessages,
        stream: false
      })
    })

    if (!response.ok) throw new Error(`智谱AI请求失败: ${response.status}`)

    const data = await response.json()
    const assistantMsg = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复，请稍后再试。'

    const sessionId = req.headers['x-session-id'] || 'default'
    if (!chatHistories[sessionId]) chatHistories[sessionId] = []
    chatHistories[sessionId].push(
      { role: 'user', content, timestamp: Date.now() },
      { role: 'assistant', content: assistantMsg, timestamp: Date.now() }
    )
    if (chatHistories[sessionId].length > 100) chatHistories[sessionId] = chatHistories[sessionId].slice(-60)

    res.json({ code: 0, data: { assistantMsg: { role: 'assistant', content: assistantMsg, timestamp: Date.now() } } })
  } catch (err) {
    console.error('聊天API错误:', err)
    res.json({ code: 500, message: 'AI服务暂时不可用' })
  }
})

app.get('/api/chat/history', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default'
  res.json({ code: 0, data: chatHistories[sessionId] || [] })
})

app.delete('/api/chat/history', (req, res) => {
  const sessionId = req.headers['x-session-id'] || 'default'
  chatHistories[sessionId] = []
  res.json({ code: 0 })
})

// ==================== 综合搜索 API ====================

app.get('/api/search', async (req, res) => {
  try {
    const { keyword, city } = req.query
    if (!keyword) return res.json({ code: 0, data: { pois: [], posts: [], routes: [] } })

    // 搜索景点
    let poiSql = 'SELECT * FROM pois WHERE (name LIKE $1 OR description LIKE $1)'
    const poiParams = [`%${keyword}%`]
    let idx = 2
    if (city) { poiSql += ` AND city = $${idx++}`; poiParams.push(city) }
    poiSql += ' ORDER BY rating DESC LIMIT 10'
    const { rows: poiRows } = await pool.query(poiSql, poiParams)
    const pois = poiRows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id)
    }))

    // 搜索帖子
    let postSql = 'SELECT * FROM communities WHERE (title LIKE $1 OR tag LIKE $1)'
    const postParams = [`%${keyword}%`]
    idx = 2
    if (city) { postSql += ` AND city = $${idx++}`; postParams.push(city) }
    postSql += ' ORDER BY like_count DESC LIMIT 10'
    const { rows: postRows } = await pool.query(postSql, postParams)
    const posts = postRows.map(r => ({
      id: r.id, title: r.title, city: r.city, tag: r.tag,
      userName: r.user_name, avatar: r.avatar, cover: r.cover,
      likeCount: r.like_count, commentCount: r.comment_count, gradient: r.gradient,
      images: r.cover ? [r.cover] : [], tags: r.tag ? [r.tag] : [],
      content: r.title, poiCity: r.city, poiName: '', poiId: null,
      isLiked: false, isFollowed: false,
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }))

    // 搜索路线
    let routeSql = 'SELECT * FROM routes WHERE name LIKE $1'
    const routeParams = [`%${keyword}%`]
    idx = 2
    if (city) { routeSql += ` AND city = $${idx++}`; routeParams.push(city) }
    const { rows: routeRows } = await pool.query(routeSql, routeParams)
    const routes = routeRows.map(r => ({
      id: r.id, name: r.name, city: r.city,
      days: typeof r.days === 'string' ? JSON.parse(r.days || '[]') : (r.days || []),
      pois: typeof r.pois === 'string' ? JSON.parse(r.pois || '[]') : (r.pois || []),
      color: r.color
    }))

    res.json({ code: 0, data: { pois, posts, routes } })
  } catch (e) { console.error(e); res.json({ code: 500, message: '搜索失败' }) }
})

// ==================== 热门景点推荐 API ====================

app.get('/api/poi/recommend', async (req, res) => {
  try {
    const { city, limit = 6 } = req.query
    let sql = 'SELECT * FROM pois WHERE 1=1'
    const params = []
    let idx = 1
    if (city) { sql += ` AND city = $${idx++}`; params.push(city) }
    sql += ` ORDER BY rating DESC, comment_count DESC LIMIT $${idx}`
    params.push(parseInt(limit))
    const { rows } = await pool.query(sql, params)
    const data = rows.map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id),
      category: r.category
    }))
    res.json({ code: 0, data })
  } catch (e) { console.error(e); res.json({ code: 500, message: '查询失败' }) }
})

// ==================== 天气 API ====================
const WEATHER_CACHE = {}

app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query
    const cacheKey = city || `${lat},${lon}`
    const cached = WEATHER_CACHE[cacheKey]
    if (cached && Date.now() - cached.time < 1800000) {
      return res.json({ code: 0, data: cached.data })
    }

    let weatherUrl
    if (lat && lon) {
      weatherUrl = `https://wttr.in/${lat},${lon}?format=j1`
    } else if (city) {
      weatherUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    } else {
      return res.json({ code: 400, message: '缺少城市或坐标参数' })
    }

    const weatherRes = await fetch(weatherUrl, {
      headers: { 'User-Agent': 'ZhiLvAI/1.0' }
    })
    if (!weatherRes.ok) throw new Error(`天气API请求失败: ${weatherRes.status}`)
    const weatherData = await weatherRes.json()

    const current = weatherData.current_condition?.[0] || {}
    const today = weatherData.weather?.[0] || {}
    const tomorrow = weatherData.weather?.[1] || {}

    const result = {
      city: weatherData.nearest_area?.[0]?.areaName?.[0]?.value || city || '',
      current: {
        temp: parseInt(current.tempC || 0),
        feelsLike: parseInt(current.FeelsLikeC || 0),
        humidity: parseInt(current.humidity || 0),
        weather: current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || '',
        windDir: current.winddir16Point || '',
        windSpeed: current.windspeedKmph || '0',
        visibility: current.visibility || '10',
        uvIndex: current.uvIndex || '0',
        icon: getWeatherIcon(current.weatherCode)
      },
      today: {
        maxTemp: parseInt(today.maxtempC || 0),
        minTemp: parseInt(today.mintempC || 0),
        sunHour: today.sunHour || '0',
        uvIndex: today.uvIndex || '0'
      },
      tomorrow: {
        maxTemp: parseInt(tomorrow.maxtempC || 0),
        minTemp: parseInt(tomorrow.mintempC || 0),
        weather: tomorrow.hourly?.[4]?.lang_zh?.[0]?.value || tomorrow.hourly?.[4]?.weatherDesc?.[0]?.value || ''
      },
      hourly: (weatherData.weather?.[0]?.hourly || []).slice(0, 8).map(h => ({
        time: h.time || '',
        temp: parseInt(h.tempC || 0),
        weather: h.lang_zh?.[0]?.value || h.weatherDesc?.[0]?.value || '',
        icon: getWeatherIcon(h.weatherCode),
        rainChance: h.chanceofrain || '0'
      }))
    }

    WEATHER_CACHE[cacheKey] = { data: result, time: Date.now() }
    res.json({ code: 0, data: result })
  } catch (e) {
    console.error('天气查询失败:', e.message)
    res.json({ code: 500, message: '天气查询失败', data: null })
  }
})

function getWeatherIcon(code) {
  const c = parseInt(code || 0)
  if (c === 113) return '☀️'
  if (c === 116) return '⛅'
  if (c <= 122) return '☁️'
  if (c <= 200) return '🌫️'
  if (c <= 232) return '🌧️'
  if (c <= 266) return '🌦️'
  if (c <= 323) return '❄️'
  if (c <= 395) return '🌨️'
  return '🌤️'
}

// ==================== AI 推荐 API ====================
app.get('/api/poi/ai-recommend', async (req, res) => {
  try {
    const { city, poiId, limit = 5 } = req.query
    if (!city) return res.json({ code: 400, message: '缺少城市参数' })

    // 获取当前景点信息
    let currentPoi = null
    if (poiId) {
      const { rows } = await pool.query('SELECT * FROM pois WHERE id = $1', [poiId])
      if (rows.length > 0) currentPoi = rows[0]
    }

    // 获取同城市景点
    const { rows } = await pool.query(
      'SELECT * FROM pois WHERE city = $1 ORDER BY rating DESC, comment_count DESC LIMIT 20',
      [city]
    )

    let recommended = rows
    if (currentPoi) {
      // 排除当前景点，优先推荐同分类
      const currentCats = (currentPoi.category || '').split('/')
      recommended = rows
        .filter(r => r.id !== currentPoi.id)
        .sort((a, b) => {
          const aMatch = (a.category || '').split('/').some(c => currentCats.includes(c)) ? 1 : 0
          const bMatch = (b.category || '').split('/').some(c => currentCats.includes(c)) ? 1 : 0
          return bMatch - aMatch
        })
    }

    const data = recommended.slice(0, parseInt(limit)).map(r => ({
      id: r.id, name: r.name, city: r.city, rating: parseFloat(r.rating),
      commentCount: r.comment_count, topRank: r.top_rank, ticketPrice: r.ticket_price,
      images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : (r.images || []),
      isFavorite: favoriteIds.includes(r.id),
      category: r.category,
      reason: getRecommendReason(currentPoi, r)
    }))

    res.json({ code: 0, data })
  } catch (e) {
    console.error(e)
    res.json({ code: 500, message: '推荐查询失败' })
  }
})

function getRecommendReason(currentPoi, targetPoi) {
  const reasons = []
  if (currentPoi) {
    const currentCats = (currentPoi.category || '').split('/')
    const targetCats = (targetPoi.category || '').split('/')
    const overlap = targetCats.filter(c => currentCats.includes(c))
    if (overlap.length > 0) {
      reasons.push(`同为${overlap[0]}类景点`)
    }
  }
  if (targetPoi.rating >= 4.8) reasons.push('超高评分')
  else if (targetPoi.rating >= 4.7) reasons.push('热门好评')
  if (isFreeTicket(targetPoi.ticket_price)) reasons.push('免费开放')
  return reasons.length > 0 ? reasons.join('·') : '值得一去'
}

function isFreeTicket(price) {
  if (!price) return true
  return /免费|free/i.test(String(price))
}

// ==================== 启动 ====================

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
