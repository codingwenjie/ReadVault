export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${minutes}分${secs}秒` : `${minutes}分钟`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`
  }
}

export function formatPercent(progress: number): string {
  return `${Math.round(progress)}%`
}

export function generateMarkdown(bookmarks: { chapterUid: number; markText: string; createTime: number }[], 
                                 reviews: { chapterName: string; content: string; createTime: number }[],
                                 chapters: { chapterUid: number; title: string }[],
                                 bookTitle: string, bookAuthor: string): string {
  let markdown = `# ${bookTitle}\n\n**作者**: ${bookAuthor}\n\n---\n\n`
  
  const chapterMap = new Map<number, string>()
  chapters.forEach(chapter => {
    chapterMap.set(chapter.chapterUid, chapter.title)
  })

  const bookmarksByChapter = new Map<number, typeof bookmarks>()
  bookmarks.forEach(bookmark => {
    if (!bookmarksByChapter.has(bookmark.chapterUid)) {
      bookmarksByChapter.set(bookmark.chapterUid, [])
    }
    bookmarksByChapter.get(bookmark.chapterUid)?.push(bookmark)
  })

  bookmarksByChapter.forEach((items, chapterUid) => {
    const chapterTitle = chapterMap.get(chapterUid) || `章节 ${chapterUid}`
    markdown += `## ${chapterTitle}\n\n`
    
    items.forEach(item => {
      markdown += `> ${item.markText}\n\n`
    })
  })

  if (reviews.length > 0) {
    markdown += `---\n\n## 我的想法\n\n`
    reviews.forEach(review => {
      if (review.chapterName) {
        markdown += `### ${review.chapterName}\n\n`
      }
      markdown += `${review.content}\n\n---\n\n`
    })
  }

  return markdown
}

export function generateTxt(bookmarks: { chapterUid: number; markText: string; createTime: number }[], 
                            reviews: { chapterName: string; content: string; createTime: number }[],
                            chapters: { chapterUid: number; title: string }[],
                            bookTitle: string, bookAuthor: string): string {
  let txt = `${bookTitle}\n`
  txt += `作者：${bookAuthor}\n`
  txt += '='.repeat(40) + '\n\n'
  
  const chapterMap = new Map<number, string>()
  chapters.forEach(chapter => {
    chapterMap.set(chapter.chapterUid, chapter.title)
  })

  const bookmarksByChapter = new Map<number, typeof bookmarks>()
  bookmarks.forEach(bookmark => {
    if (!bookmarksByChapter.has(bookmark.chapterUid)) {
      bookmarksByChapter.set(bookmark.chapterUid, [])
    }
    bookmarksByChapter.get(bookmark.chapterUid)?.push(bookmark)
  })

  bookmarksByChapter.forEach((items, chapterUid) => {
    const chapterTitle = chapterMap.get(chapterUid) || `章节 ${chapterUid}`
    txt += `${chapterTitle}\n`
    txt += '-'.repeat(20) + '\n'
    
    items.forEach((item, index) => {
      txt += `${index + 1}. ${item.markText}\n\n`
    })
  })

  if (reviews.length > 0) {
    txt += '='.repeat(40) + '\n'
    txt += '我的想法\n'
    txt += '='.repeat(40) + '\n\n'
    reviews.forEach(review => {
      if (review.chapterName) {
        txt += `${review.chapterName}\n`
        txt += '-'.repeat(20) + '\n'
      }
      txt += `${review.content}\n\n`
      txt += '-'.repeat(30) + '\n\n'
    })
  }

  return txt
}

export function downloadFile(content: string, filename: string, type: string = 'text/markdown') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
