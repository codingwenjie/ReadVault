export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}

export interface Book {
  bookId: string
  title: string
  author: string
  cover: string
  category: string
  readUpdateTime: number
  finishReading: number
  updateTime: number
  isTop: number
  secret: number
}

export interface Album {
  albumInfo: {
    albumId: string
    name: string
    authorName: string
    cover: string
    trackCount: number
    finishStatus: string
    finish: number
    payType: number
    intro: string
    updateTime: number
  }
  albumInfoExtra: {
    secret: number
    lecturePaid: number
    lectureReadUpdateTime: number
    isTop: number
  }
}

export interface ShelfResponse {
  books: Book[]
  albums: Album[]
  mp?: unknown
  archive?: {
    name: string
    bookIds: string[]
  }[]
  bookCount: number
}

export interface NotebookBook {
  bookId: string
  book: {
    title: string
    author: string
    cover: string
  }
  reviewCount: number
  noteCount: number
  bookmarkCount: number
  readingProgress: number
  markedStatus: number
  sort: number
}

export interface NotebooksResponse {
  totalBookCount: number
  totalNoteCount: number
  hasMore: number
  books: NotebookBook[]
}

export interface Bookmark {
  bookmarkId: string
  bookId: string
  chapterUid: number
  markText: string
  createTime: number
  type: number
  range: string
  colorStyle: string
}

export interface Chapter {
  chapterUid: number
  chapterIdx: number
  title: string
}

export interface BookmarksResponse {
  updated: Bookmark[]
  chapters: Chapter[]
  book: {
    bookId: string
    title: string
    author: string
  }
}

export interface Review {
  reviewId: string
  content: string
  createTime: number
  star: number
  chapterName: string
  isFinish: number
}

export interface ReviewsResponse {
  reviews: {
    review: Review
  }[]
  totalCount: number
  hasMore: number
  synckey: number
}

export interface ReadStat {
  stat: string
  counts: string
  scheme: string
}

export interface PreferCategory {
  categoryId: string
  categoryTitle: string
  parentCategoryId: string
  parentCategoryTitle: string
  val: number
  readingTime: number
  readingCount: number
  categoryType: number
}

export interface ReadLongestItem {
  book?: {
    bookId: string
    title: string
    author: string
    cover: string
  }
  albumInfo?: {
    albumId: string
    name: string
    authorName: string
    cover: string
  }
  readTime: number
  recordReadingTime?: number
  tags: string[]
}

export interface ReadDataResponse {
  baseTime: number
  readTimes: Record<string, number>
  dailyReadTimes?: Record<string, number>
  readDays: number
  totalReadTime: number
  dayAverageReadTime: number
  compare?: number
  readLongest: ReadLongestItem[]
  readStat: ReadStat[]
  preferCategory: PreferCategory[]
  preferCategoryWord: string
  preferTime: number[]
  preferTimeWord?: string
  preferAuthor?: {
    authorId: string
    name: string
    count: number
    readTime: string
  }[]
  rank?: {
    text: string
    scheme: string
  }
  registTime: number
}

export interface SearchBookInfo {
  bookId: string
  title: string
  author: string
  cover: string
  intro: string
  publisher: string
  category: string
  payType: number
  price: number
  soldout: number
}

export interface SearchResult {
  sid: string
  hasMore: number
  results: {
    title: string
    scope: number
    scopeCount: number
    currentCount: number
    books: {
      searchIdx: number
      bookInfo: SearchBookInfo
      readingCount?: number
      newRating?: number
      newRatingCount?: number
      newRatingDetail?: {
        title: string
      }
    }[]
  }[]
}

export interface RecommendBook {
  bookId: string
  title: string
  author: string
  cover: string
  intro: string
  category: string
  reason: string
  readingCount: number
  searchIdx: number
  newRating: number
  newRatingCount: number
  newRatingDetail?: {
    title: string
  }
  price: number
  payType: number
  type: number
}

export interface RecommendResponse {
  books: RecommendBook[]
}

export interface SimilarBook {
  idx: number
  book: {
    bookInfo: SearchBookInfo
  }
}

export interface SimilarResponse {
  booksimilar: {
    sessionId: string
    books: SimilarBook[]
  }
}

const BASE_URL = '/api/weread'

const request = async <T = unknown>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  
  const apiKey = localStorage.getItem('weread_api_key')
  if (apiKey) {
    headers['X-WEREAD-API-KEY'] = apiKey
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    headers,
    ...options
  })
  
  return response.json()
}

export const wereadApi = {
  async shelf(): Promise<ApiResponse<ShelfResponse>> {
    return request('/shelf')
  },

  async notebooks(count: number = 20, lastSort?: number): Promise<ApiResponse<NotebooksResponse>> {
    let url = `/notebooks?count=${count}`
    if (lastSort !== undefined) {
      url += `&lastSort=${lastSort}`
    }
    return request(url)
  },

  async bookmarks(bookId: string): Promise<ApiResponse<BookmarksResponse>> {
    return request(`/bookmarks/${bookId}`)
  },

  async reviews(bookId: string, synckey: number = 0, count: number = 20): Promise<ApiResponse<ReviewsResponse>> {
    return request(`/reviews/${bookId}?synckey=${synckey}&count=${count}`)
  },

  async readdata(mode: string = 'monthly', baseTime?: number): Promise<ApiResponse<ReadDataResponse>> {
    let url = `/readdata?mode=${mode}`
    if (baseTime !== undefined) {
      url += `&baseTime=${baseTime}`
    }
    return request(url)
  },

  async verifyApiKey(apiKey: string): Promise<ApiResponse<boolean>> {
    return request('/verify', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    })
  },

  async search(keyword: string, scope: number = 10, maxIdx: number = 0, count?: number): Promise<ApiResponse<SearchResult>> {
    let url = `/search?keyword=${encodeURIComponent(keyword)}&scope=${scope}&maxIdx=${maxIdx}`
    if (count !== undefined) {
      url += `&count=${count}`
    }
    return request(url)
  },

  async recommend(count: number = 12, maxIdx: number = 0): Promise<ApiResponse<RecommendResponse>> {
    return request(`/recommend?count=${count}&maxIdx=${maxIdx}`)
  },

  async similar(bookId: string, count: number = 12, maxIdx: number = 0, sessionId?: string): Promise<ApiResponse<SimilarResponse>> {
    let url = `/similar/${bookId}?count=${count}&maxIdx=${maxIdx}`
    if (sessionId !== undefined) {
      url += `&sessionId=${sessionId}`
    }
    return request(url)
  },

  setApiKey(key: string) {
    localStorage.setItem('weread_api_key', key)
  },

  getApiKey(): string {
    return localStorage.getItem('weread_api_key') || ''
  },

  clearApiKey() {
    localStorage.removeItem('weread_api_key')
  }
}