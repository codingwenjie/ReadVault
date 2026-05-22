import { useState } from "react";
import {
  BookOpen, PenLine, Compass, Search, BarChart2, LogOut,
  Star, Clock, Flame, Target, TrendingUp,
  Plus, Bell, Heart, Bookmark, X,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ── Types ────────────────────────────────────────────────────────────────────
type Page = "shelf" | "notes" | "discover" | "search" | "stats";
type ReadStatus = "reading" | "want" | "done";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  progress: number;
  status: ReadStatus;
  rating: number;
  category: string;
  notes: number;
}

interface Note {
  id: number;
  bookId: number;
  quote: string;
  annotation: string;
  date: string;
  chapter: string;
}

// ── Static data ──────────────────────────────────────────────────────────────
const books: Book[] = [
  { id: 1, title: "三体", author: "刘慈欣", cover: "from-blue-500 to-purple-700", progress: 78, status: "reading", rating: 5, category: "科幻", notes: 23 },
  { id: 2, title: "百年孤独", author: "加西亚·马尔克斯", cover: "from-amber-400 to-orange-600", progress: 100, status: "done", rating: 5, category: "文学", notes: 31 },
  { id: 3, title: "人类简史", author: "尤瓦尔·赫拉利", cover: "from-emerald-400 to-teal-600", progress: 45, status: "reading", rating: 4, category: "历史", notes: 18 },
  { id: 4, title: "小王子", author: "圣埃克苏佩里", cover: "from-rose-400 to-pink-600", progress: 100, status: "done", rating: 5, category: "文学", notes: 12 },
  { id: 5, title: "原则", author: "瑞·达利欧", cover: "from-slate-500 to-indigo-700", progress: 0, status: "want", rating: 0, category: "经济", notes: 0 },
  { id: 6, title: "活着", author: "余华", cover: "from-red-500 to-rose-700", progress: 100, status: "done", rating: 5, category: "文学", notes: 27 },
  { id: 7, title: "追风筝的人", author: "卡勒德·胡赛尼", cover: "from-sky-400 to-blue-600", progress: 62, status: "reading", rating: 4, category: "文学", notes: 15 },
  { id: 8, title: "思考，快与慢", author: "丹尼尔·卡尼曼", cover: "from-violet-500 to-purple-700", progress: 0, status: "want", rating: 0, category: "心理", notes: 0 },
  { id: 9, title: "平凡的世界", author: "路遥", cover: "from-yellow-400 to-amber-600", progress: 33, status: "reading", rating: 5, category: "文学", notes: 9 },
];

const allNotes: Note[] = [
  { id: 1, bookId: 1, quote: "给岁月以文明，而不是给文明以岁月。", annotation: "这句话让我深思，文明的意义不在于延续时间，而在于创造有价值的内容。科技的进步服务于人，而非相反。", date: "2024-01-15", chapter: "第三章 · 黑暗森林" },
  { id: 2, bookId: 1, quote: "弱小和无知不是生存的障碍，傲慢才是。", annotation: "刘慈欣通过这句话传达了深刻的哲学：谦逊才是在宇宙黑暗森林中生存的智慧。", date: "2024-01-18", chapter: "第五章 · 黑暗战役" },
  { id: 3, bookId: 2, quote: "过去都是假的，回忆是一条没有归途的路，以往的一切春天都一去不复返了。", annotation: "马尔克斯对时间和记忆的诠释极其深刻，令人反复回味，时间是不可逆的，我们只能向前走。", date: "2024-01-10", chapter: "第一章" },
  { id: 4, bookId: 3, quote: "历史上无数次的革命都是由少数精英发动的，而不是由大众推动的。", annotation: "这让我重新思考历史进程的驱动力，以及个体在其中的作用与局限。", date: "2024-01-20", chapter: "第七章 · 记忆、意识与弗洛伊德" },
  { id: 5, bookId: 6, quote: "人是为活着本身而活着的，而不是为了活着之外的任何事物所活着。", annotation: "余华以最朴素的语言触达了生命最本质的主题，读完久久无法平静。", date: "2024-01-05", chapter: "序言" },
  { id: 6, bookId: 7, quote: "为你，千千万万遍。", annotation: "这是全书最动人的一句话，友谊与救赎的主题在这七个字中浓缩到了极致。", date: "2023-12-28", chapter: "第七章" },
];

const weeklyData = [
  { day: "周一", minutes: 45 }, { day: "周二", minutes: 30 }, { day: "周三", minutes: 62 },
  { day: "周四", minutes: 20 }, { day: "周五", minutes: 75 }, { day: "周六", minutes: 90 }, { day: "周日", minutes: 55 },
];

const categoryData = [
  { name: "文学", value: 35, color: "#667eea" },
  { name: "科技", value: 25, color: "#764ba2" },
  { name: "历史", value: 20, color: "#a78bfa" },
  { name: "心理", value: 12, color: "#c4b5fd" },
  { name: "其他", value: 8, color: "#ddd6fe" },
];

const recommendations = [
  { id: 10, title: "福格行为模型", author: "BJ·福格", cover: "from-cyan-400 to-blue-500", rating: 4.7, readers: "12.3万", category: "心理", description: "斯坦福大学行为设计实验室主任揭示行为改变的核心密码，帮助你建立良好习惯，摆脱坏习惯的束缚。" },
  { id: 11, title: "被讨厌的勇气", author: "岸见一郎", cover: "from-orange-400 to-rose-500", rating: 4.9, readers: "45.6万", category: "心理", description: "阿德勒心理学的精华，用对话的形式探讨人际关系与自由的真谛，改变你看待世界的方式。" },
  { id: 12, title: "债：第一个5000年", author: "大卫·格雷伯", cover: "from-green-500 to-emerald-600", rating: 4.5, readers: "8.9万", category: "经济", description: "颠覆传统经济学叙事，从人类学视角重新审视债务的历史与本质。" },
];

const hotBooks = [
  { rank: 1, title: "蛤蟆先生去看心理医生", author: "罗伯特·戴博德", heat: 98 },
  { rank: 2, title: "纳瓦尔宝典", author: "埃里克·乔根森", heat: 95 },
  { rank: 3, title: "置身事内", author: "兰小欢", heat: 91 },
  { rank: 4, title: "内向者优势", author: "马蒂·兰尼", heat: 88 },
  { rank: 5, title: "如何阅读一本书", author: "莫提默·艾德勒", heat: 84 },
];

const searchPool = [
  { id: 13, title: "深度工作", author: "卡尔·纽波特", cover: "from-slate-500 to-gray-700", rating: 4.8, category: "效率", description: "在充满干扰的世界里，如何培养专注工作的能力？Newport 给出了系统化的方法论。" },
  { id: 14, title: "心流", author: "米哈里·契克森米哈赖", cover: "from-teal-400 to-cyan-600", rating: 4.7, category: "心理", description: "最优体验心理学，探索人类幸福的来源与创造力的巅峰状态。" },
  { id: 15, title: "刻意练习", author: "安德斯·艾利克森", cover: "from-orange-500 to-amber-600", rating: 4.6, category: "效率", description: "颠覆天才论，揭示杰出人物的成长之道——刻意练习才是关键。" },
  { id: 16, title: "富爸爸穷爸爸", author: "罗伯特·清崎", cover: "from-lime-500 to-green-600", rating: 4.3, category: "经济", description: "改变无数人财富观念的经典之作，用简单故事讲透财务自由的本质。" },
];

const searchCategories = ["全部", "文学", "历史", "科技", "心理", "经济", "哲学", "传记"];

// ── Heatmap data (computed once) ─────────────────────────────────────────────
const heatmapData: { date: Date; minutes: number }[][] = (() => {
  const weeks: { date: Date; minutes: number }[][] = [];
  const seed = [42, 0, 55, 30, 0, 80, 15, 0, 70, 45, 0, 60, 90, 10, 0, 35, 75, 0, 20, 50, 85, 0, 40, 65, 0, 55, 30, 0, 70, 15, 0, 45, 0, 80, 25, 60, 0, 50, 0, 35, 90, 0, 20, 75, 40, 0, 60, 15, 0, 55, 80, 0, 45, 30, 0, 70, 90, 0, 25, 55, 0, 40, 85, 0, 60, 15, 0, 70, 45, 30, 0, 55, 80, 0, 25, 60, 0, 90, 35, 0, 50, 75, 0, 40, 0, 65, 20, 0, 80, 45, 0, 30, 55, 0, 70, 90, 0, 15, 60, 0, 50, 35, 0, 75, 0, 40, 85, 0, 25, 60, 0, 45];
  const today = new Date(2024, 0, 21);
  const start = new Date(today);
  start.setDate(start.getDate() - 16 * 7);
  let si = 0;
  for (let w = 0; w < 16; w++) {
    const days: { date: Date; minutes: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      days.push({ date, minutes: seed[si++ % seed.length] });
    }
    weeks.push(days);
  }
  return weeks;
})();

// ── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<ReadStatus, { label: string; cls: string }> = {
  reading: { label: "在读", cls: "bg-violet-100 text-violet-700" },
  want: { label: "想读", cls: "bg-amber-100 text-amber-700" },
  done: { label: "已读", cls: "bg-emerald-100 text-emerald-700" },
};

// ── Navigation config ─────────────────────────────────────────────────────────
const navItems: { id: Page; Icon: React.FC<{ className?: string }>; label: string }[] = [
  { id: "shelf", Icon: BookOpen, label: "我的书架" },
  { id: "notes", Icon: PenLine, label: "读书笔记" },
  { id: "discover", Icon: Compass, label: "发现好书" },
  { id: "search", Icon: Search, label: "搜索书籍" },
  { id: "stats", Icon: BarChart2, label: "阅读统计" },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ current, onChange }: { current: Page; onChange: (p: Page) => void }) {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-border flex-shrink-0">
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">ReadVault</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ id, Icon, label }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-gradient-to-r from-[#667eea]/12 to-[#764ba2]/8 text-[#667eea]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {active && <div className="w-1.5 h-1.5 rounded-full bg-[#667eea]" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            陈
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">陈明远</p>
            <p className="text-xs text-muted-foreground">已读 42 本书</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          退出登录
        </button>
      </div>
    </aside>
  );
}

// ── Bottom nav (mobile) ──────────────────────────────────────────────────────
function BottomNav({ current, onChange }: { current: Page; onChange: (p: Page) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-border flex z-50 safe-area-pb">
      {navItems.map(({ id, Icon, label }) => {
        const active = current === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
              active ? "text-[#667eea]" : "text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label.slice(0, 2)}</span>
            {active && <div className="w-1 h-1 rounded-full bg-[#667eea] absolute bottom-1.5" />}
          </button>
        );
      })}
    </nav>
  );
}

// ── Page header ──────────────────────────────────────────────────────────────
function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Book card ─────────────────────────────────────────────────────────────────
function BookCard({ book }: { book: Book }) {
  const { label, cls } = statusConfig[book.status];
  return (
    <div className="bg-card rounded-[12px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer group">
      <div className={`h-36 bg-gradient-to-br ${book.cover} relative flex items-start p-3`}>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${cls}`}>
          {label}
        </span>
        {book.status === "reading" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div className="h-full bg-white/70 transition-all" style={{ width: `${book.progress}%` }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-[#667eea] transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{book.author}</p>
        <div className="flex items-center justify-between mt-2">
          {book.rating > 0 ? (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: book.rating }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">未评分</span>
          )}
          {book.notes > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <PenLine className="w-3 h-3" />{book.notes}
            </span>
          )}
        </div>
        {book.status === "reading" && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#667eea] font-medium">{book.progress}%</span>
              <span className="text-muted-foreground">{100 - book.progress}% 未读</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full" style={{ width: `${book.progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bookshelf page ────────────────────────────────────────────────────────────
function ShelfPage() {
  const [tab, setTab] = useState<ReadStatus | "all">("all");
  const tabs: { id: ReadStatus | "all"; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "reading", label: "在读" },
    { id: "want", label: "想读" },
    { id: "done", label: "已读" },
  ];
  const filtered = tab === "all" ? books : books.filter((b) => b.status === tab);

  return (
    <div>
      <PageHeader
        title="我的书架"
        subtitle={`共收录 ${books.length} 本书籍`}
        action={
          <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all">
            <Plus className="w-3.5 h-3.5" />
            添加书籍
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "本月阅读", value: "12h 30m", Icon: Clock, color: "text-[#667eea]", bg: "bg-[#667eea]/10" },
          { label: "连续天数", value: "23 天", Icon: Flame, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "本月读完", value: "3 本", Icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-[12px] p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-base font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-secondary rounded-xl p-1 w-fit">
        {tabs.map(({ id, label }) => {
          const count = id === "all" ? books.length : books.filter((b) => b.status === id).length;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {id !== "all" && <span className="ml-1 text-xs opacity-50">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}

// ── Notes page ────────────────────────────────────────────────────────────────
function NotesPage() {
  const booksWithNotes = books.filter((b) => b.notes > 0);
  const [selectedId, setSelectedId] = useState(booksWithNotes[0]?.id ?? 0);
  const selectedBook = books.find((b) => b.id === selectedId);
  const selectedNotes = allNotes.filter((n) => n.bookId === selectedId);

  return (
    <div>
      <PageHeader title="读书笔记" subtitle={`共 ${allNotes.length} 条笔记`} />
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: book list */}
        <div className="md:w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">有笔记的书籍</p>
          <div className="space-y-1">
            {booksWithNotes.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedId(book.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                  selectedId === book.id
                    ? "bg-white border border-[#667eea]/20 shadow-sm"
                    : "hover:bg-white/60"
                }`}
              >
                <div className={`w-9 h-12 rounded-lg bg-gradient-to-br ${book.cover} flex-shrink-0 shadow-sm`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${selectedId === book.id ? "text-[#667eea]" : "text-foreground"}`}>
                    {book.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{book.notes} 条笔记</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: note detail */}
        <div className="flex-1 min-w-0">
          {selectedBook && (
            <>
              <div className="flex items-center gap-4 p-4 bg-card rounded-[12px] shadow-sm mb-4">
                <div className={`w-12 h-16 rounded-xl bg-gradient-to-br ${selectedBook.cover} flex-shrink-0 shadow-md`} />
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-foreground">{selectedBook.title}</h2>
                  <p className="text-sm text-muted-foreground">{selectedBook.author}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-[#667eea] font-medium">{selectedBook.notes} 条笔记</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[selectedBook.status].cls}`}>
                      {statusConfig[selectedBook.status].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedNotes.length > 0 ? (
                  selectedNotes.map((note) => (
                    <div key={note.id} className="bg-card rounded-[12px] shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
                          {note.chapter}
                        </span>
                        <span className="text-xs text-muted-foreground">{note.date}</span>
                      </div>
                      <blockquote className="border-l-[3px] border-[#667eea] pl-4 mb-3.5">
                        <p className="text-sm text-foreground leading-relaxed font-medium">"{note.quote}"</p>
                      </blockquote>
                      <p className="text-sm text-muted-foreground leading-relaxed">{note.annotation}</p>
                      <div className="flex gap-4 mt-4 pt-3.5 border-t border-border">
                        <button className="text-xs text-muted-foreground hover:text-rose-500 flex items-center gap-1.5 transition-colors">
                          <Heart className="w-3.5 h-3.5" /> 喜欢
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-[#667eea] flex items-center gap-1.5 transition-colors">
                          <Bookmark className="w-3.5 h-3.5" /> 收藏
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <PenLine className="w-10 h-10 mx-auto mb-3 opacity-25" />
                    <p className="text-sm">这本书还没有笔记</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Discover page ─────────────────────────────────────────────────────────────
function DiscoverPage() {
  const featured = recommendations[0];
  return (
    <div className="space-y-5">
      <PageHeader title="发现好书" subtitle="为你精选推荐" />

      {/* Featured hero card */}
      <div className={`bg-gradient-to-br ${featured.cover} rounded-[16px] p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-8" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium border border-white/20">
              ✦ 编辑精选
            </span>
            <span className="text-xs opacity-70">{featured.category}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{featured.title}</h2>
          <p className="text-sm opacity-75 mb-3">{featured.author}</p>
          <p className="text-sm opacity-90 leading-relaxed max-w-sm">{featured.description}</p>
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span className="text-sm font-semibold">{featured.rating}</span>
            </div>
            <span className="text-sm opacity-65">{featured.readers} 人在读</span>
          </div>
          <button className="mt-5 px-6 py-2.5 bg-white text-[#667eea] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors shadow-sm">
            加入书架
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Hot rankings */}
        <div className="lg:col-span-2 bg-card rounded-[12px] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#667eea]" />
            <h3 className="text-sm font-semibold text-foreground">热门榜单</h3>
          </div>
          <div className="space-y-3">
            {hotBooks.map(({ rank, title, author, heat }) => (
              <div key={rank} className="flex items-center gap-3 group cursor-pointer">
                <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg flex-shrink-0 ${
                  rank === 1 ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-sm"
                  : rank === 2 ? "bg-slate-200 text-slate-600"
                  : rank === 3 ? "bg-amber-100 text-amber-600"
                  : "bg-secondary text-muted-foreground"
                }`}>
                  {rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-[#667eea] transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground">{author}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-10 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full" style={{ width: `${heat}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-5 text-right">{heat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More picks */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">相似推荐</h3>
          {recommendations.slice(1).map((rec) => (
            <div key={rec.id} className="bg-card rounded-[12px] shadow-sm p-4 flex gap-4 hover:shadow-md transition-all cursor-pointer group">
              <div className={`w-12 h-16 rounded-xl bg-gradient-to-br ${rec.cover} flex-shrink-0 shadow-sm`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-[#667eea] transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.author}</p>
                  </div>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                    {rec.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{rec.description}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">{rec.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">{rec.readers}人在读</span>
                  </div>
                  <button className="text-xs text-[#667eea] font-semibold hover:underline">+ 加入书架</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Search page ───────────────────────────────────────────────────────────────
function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("全部");

  const results = query
    ? searchPool.filter((b) =>
        b.title.includes(query) || b.author.includes(query) || b.category.includes(query)
      )
    : searchPool;

  return (
    <div>
      <PageHeader title="搜索书籍" />

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索书名、作者或关键词..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3.5 bg-card border border-border rounded-[12px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea]/60 shadow-sm transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        {searchCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 text-sm rounded-full font-medium transition-all ${
              selectedCat === cat
                ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border border-border shadow-sm hover:shadow-md"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {query ? `"${query}" 的搜索结果` : "猜你喜欢"}
          <span className="ml-2 font-normal normal-case">{results.length} 本</span>
        </p>
      </div>

      <div className="space-y-3">
        {results.map((book) => (
          <div key={book.id} className="bg-card rounded-[12px] shadow-sm p-4 flex gap-4 hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-14 h-20 rounded-xl bg-gradient-to-br ${book.cover} flex-shrink-0 shadow-md`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-[#667eea] transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                </div>
                <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                  {book.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{book.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-foreground">{book.rating}</span>
                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
                <button className="px-4 py-1.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-semibold rounded-full hover:shadow-md transition-all hover:opacity-90">
                  加入书架
                </button>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground">没有找到相关书籍</p>
            <p className="text-xs text-muted-foreground mt-1">试试其他关键词</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stats page ────────────────────────────────────────────────────────────────
function StatsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="阅读统计" subtitle="2024 年 1 月 · 数据概览" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "累计书籍", value: "42", unit: "本", Icon: BookOpen, gradient: "from-[#667eea] to-[#764ba2]" },
          { label: "本月时长", value: "12h", unit: "30分钟", Icon: Clock, gradient: "from-rose-400 to-pink-600" },
          { label: "总笔记数", value: "186", unit: "条", Icon: PenLine, gradient: "from-emerald-400 to-teal-600" },
          { label: "连续阅读", value: "23", unit: "天", Icon: Flame, gradient: "from-amber-400 to-orange-500" },
        ].map(({ label, value, unit, Icon, gradient }) => (
          <div key={label} className="bg-card rounded-[12px] shadow-sm p-4 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weekly bar chart */}
        <div className="lg:col-span-2 bg-card rounded-[12px] shadow-sm p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">本周每日阅读时长</h3>
          <p className="text-xs text-muted-foreground mb-5">单位：分钟</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barSize={28}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b6b8d" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b6b8d" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "white", border: "none", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontSize: 12 }}
                cursor={{ fill: "rgba(102,126,234,0.06)", radius: 6 }}
                formatter={(v: number) => [`${v} 分钟`, "阅读时长"]}
              />
              <Bar dataKey="minutes" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category donut */}
        <div className="bg-card rounded-[12px] shadow-sm p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">阅读分类</h3>
          <p className="text-xs text-muted-foreground mb-2">书籍类型分布</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                {categoryData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} formatter={(v: number) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {categoryData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-6 text-right">{value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reading heatmap */}
      <div className="bg-card rounded-[12px] shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">阅读热力图</h3>
            <p className="text-xs text-muted-foreground mt-0.5">过去 16 周每日阅读记录</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">少</span>
            {["bg-secondary", "bg-[#667eea]/20", "bg-[#667eea]/40", "bg-[#667eea]/65", "bg-[#667eea]"].map((c, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-muted-foreground">多</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => {
                  const level = day.minutes === 0 ? 0 : day.minutes < 20 ? 1 : day.minutes < 45 ? 2 : day.minutes < 70 ? 3 : 4;
                  const colors = ["bg-secondary", "bg-[#667eea]/20", "bg-[#667eea]/40", "bg-[#667eea]/65", "bg-[#667eea]"];
                  return (
                    <div
                      key={di}
                      title={`${day.date.getMonth() + 1}/${day.date.getDate()} · ${day.minutes} 分钟`}
                      className={`w-3.5 h-3.5 rounded-sm ${colors[level]} hover:ring-1 hover:ring-[#667eea]/40 transition-all cursor-default`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
          {[
            { label: "总阅读天数", value: "68 天" },
            { label: "最长连续", value: "23 天" },
            { label: "日均时长", value: "42 分钟" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-base font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("shelf");

  const pageMap: Record<Page, React.ReactNode> = {
    shelf: <ShelfPage />,
    notes: <NotesPage />,
    discover: <DiscoverPage />,
    search: <SearchPage />,
    stats: <StatsPage />,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar current={page} onChange={setPage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm tracking-tight">ReadVault</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-xs font-semibold shadow-sm">
              陈
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-6 pb-24 md:pb-8 max-w-6xl">
            {pageMap[page]}
          </div>
        </main>
      </div>

      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
