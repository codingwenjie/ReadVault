import dotenv from 'dotenv'

dotenv.config()

const API_URL = process.env.WEREAD_API_URL || 'https://i.weread.qq.com/api/agent/gateway'
const SKILL_VERSION = process.env.SKILL_VERSION || '1.0.3'

let cachedApiKey = process.env.WEREAD_API_KEY || ''

export interface WereadResponse<T = unknown> {
  errcode: number
  errmsg?: string
  data?: T
  upgrade_info?: {
    message: string
  }
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
  mp?: {
    show: number
    book: {
      bookId: string
      title: string
      cover: string
      secret: number
      payType: number
      paid: number
      updateTime: number
      readUpdateTime: number
      isTop: boolean
    }
  }
  archive?: {
    name: string
    bookIds: string[]
  }[]
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

export interface BookInfoResponse {
  bookId: string
  title: string
  author: string
  cover: string
  intro: string
  category: string
  rating: number
  ratingCount: number
}

export interface BookProgressResponse {
  bookId: string
  readProgress: number
  readTime: number
  pageNum: number
  totalPageNum: number
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

export interface BestBookmarkItem {
  bookId: string
  userVid: number
  bookmarkId: string
  chapterUid: number
  range: string
  markText: string
  totalCount: number
  simplifiedRange?: string
  traditionalRange?: string
}

export interface BestBookmarksResponse {
  synckey: number
  totalCount: number
  items: BestBookmarkItem[]
  chapters: Chapter[]
}

export interface ChapterAnchor {
  title: string
  offset: number
}

export interface ChapterItem {
  chapterUid: number
  chapterIdx: number
  title: string
  wordCount: number
  level: number
  updateTime: number
  price: number
  paid: number
  isMPChapter: number
  anchors?: ChapterAnchor[]
}

export interface ChapterInfoResponse {
  bookId: string
  synckey: number
  chapterUpdateTime: number
  chapters: ChapterItem[]
}

export interface PublicReviewAuthor {
  userVid: number
  name: string
  avatar: string
}

export interface PublicReviewItem {
  idx: number
  review: {
    reviewId: string
    review: {
      content: string
      htmlContent: string
      star: number
      isFinish: number
      createTime: number
      chapterName: string
      author: {
        userVid: number
        name: string
        avatar: string
      }
      book: {
        bookId: string
        title: string
        author: string
      }
    }
  }
}

export interface PublicReviewsResponse {
  synckey: number
  reviewsCnt: number
  recentTotalCnt: number
  reviewsHasMore: number
  reviewsHas5Star: number
  reviewsHas1Star: number
  reviewsHasRecent: number
  friendCommentCount: number
  friendUniqueCount: number
  friendCommentUsers: {
    userVid: number
    name: string
    avatar: string
  }[]
  deepVRecommendInfo?: {
    title: string
    subtitle: string
  }
  deepVRecommendValue?: number
  deepVUniqueCount?: number
  reviews: PublicReviewItem[]
}

export interface ReadReviewsResponse {
  bookId: string
  chapterUid: number
  reviews: {
    range: string
    totalCount: number
    hasMore: number
    maxIdx: number
    synckey: number
    pageReviews: {
      reviewId: string
      review: {
        abstract: string
        content: string
        range: string
        createTime: number
        author: PublicReviewAuthor
      }
    }[]
  }[]
}

export const wereadClient = {
  setApiKey(apiKey: string) {
    cachedApiKey = apiKey
  },

  async request<T = unknown>(apiName: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!cachedApiKey) {
      throw new Error('API Key not set')
    }

    const body = {
      api_name: apiName,
      skill_version: SKILL_VERSION,
      ...params
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cachedApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(body)
    })

    const result: WereadResponse<T> = await response.json()

    if (result.upgrade_info) {
      throw new Error(`Need upgrade: ${result.upgrade_info.message}`)
    }

    if (result.errcode !== undefined && result.errcode !== 0) {
      throw new Error(result.errmsg || `API error: ${result.errcode}`)
    }

    if (result.data !== undefined) {
      return result.data as T
    }
    
    return result as unknown as T
  },

  async shelf(): Promise<ShelfResponse> {
    return this.request('/shelf/sync')
  },

  async notebooks(count: number = 20, lastSort?: number): Promise<NotebooksResponse> {
    const params: Record<string, unknown> = { count }
    if (lastSort !== undefined) {
      params.lastSort = lastSort
    }
    return this.request('/user/notebooks', params)
  },

  async bookmarks(bookId: string): Promise<BookmarksResponse> {
    return this.request('/book/bookmarklist', { bookId })
  },

  async reviews(bookId: string, synckey: number = 0, count: number = 20): Promise<ReviewsResponse> {
    return this.request('/review/list/mine', { bookid: bookId, synckey, count })
  },

  async readdata(mode: string = 'monthly', baseTime?: number): Promise<ReadDataResponse> {
    const params: Record<string, unknown> = { mode }
    if (baseTime !== undefined) {
      params.baseTime = baseTime
    }
    return this.request('/readdata/detail', params)
  },

  async bookInfo(bookId: string): Promise<BookInfoResponse> {
    return this.request('/book/info', { bookId })
  },

  async bookProgress(bookId: string): Promise<BookProgressResponse> {
    return this.request('/book/getprogress', { bookId })
  },

  async search(keyword: string, scope: number = 10, maxIdx: number = 0, count?: number): Promise<SearchResult> {
    const params: Record<string, unknown> = { keyword, scope, maxIdx }
    if (count !== undefined) {
      params.count = count
    }
    return this.request('/store/search', params)
  },

  async recommend(count: number = 12, maxIdx: number = 0): Promise<RecommendResponse> {
    return this.request('/book/recommend', { count, maxIdx })
  },

  async similar(bookId: string, count: number = 12, maxIdx: number = 0, sessionId?: string): Promise<SimilarResponse> {
    const params: Record<string, unknown> = { bookId, count, maxIdx }
    if (sessionId !== undefined) {
      params.sessionId = sessionId
    }
    return this.request('/book/similar', params)
  },

  async hotmarks(bookId: string, chapterUid: number = 0, synckey: number = 0): Promise<BestBookmarksResponse> {
    return this.request('/book/bestbookmarks', { bookId, chapterUid, synckey })
  },

  async chapterInfo(bookId: string): Promise<ChapterInfoResponse> {
    return this.request('/book/chapterinfo', { bookId })
  },

  async publicReviews(bookId: string, reviewListType: number = 0, count: number = 20, maxIdx: number = 0, synckey: number = 0): Promise<PublicReviewsResponse> {
    return this.request('/review/list', { bookId, reviewListType, count, maxIdx, synckey })
  },

  async readReviews(bookId: string, chapterUid: number, reviews: { range: string; maxIdx?: number; count?: number; synckey?: number }[]): Promise<ReadReviewsResponse> {
    return this.request('/book/readreviews', { bookId, chapterUid, reviews })
  },

  async verifyApiKey(apiKey: string): Promise<boolean> {
    const oldKey = cachedApiKey
    cachedApiKey = apiKey
    try {
      const result = await this.shelf()
      return Array.isArray(result?.books) && result.books.length > 0
    } catch {
      cachedApiKey = oldKey
      return false
    }
  }
}