// ==========================================
// AI设计质量提升平台 - 主应用入口
// ==========================================

const { createApp, ref, computed, watch } = Vue;
const { createRouter, createWebHashHistory, useRouter, useRoute } = VueRouter;

// ==========================================
// 页面组件引用（已在 index.html 中通过 script 标签加载到 window 上）
// ==========================================
const _Dashboard = window.Dashboard;
const _KnowledgeTech = window.KnowledgeTech;
const _KnowledgeReview = window.KnowledgeReview;
const _KnowledgeProject = window.KnowledgeProject;
const _ToolsBid = window.ToolsBid;
const _ToolsDrawing = window.ToolsDrawing;
const _ToolsText = window.ToolsText;
const _ToolsCad = window.ToolsCad;
const _ToolsScheme = window.ToolsScheme;
const _SystemPage = window.System;

// ==========================================
// 路由配置
// ==========================================
const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: _Dashboard,
        meta: { title: '工作台', icon: '🏠', section: 'home' }
    },
    // AI知识库
    {
        path: '/knowledge/tech',
        name: 'KnowledgeTech',
        component: _KnowledgeTech,
        meta: { title: '技术库', icon: '📚', section: 'knowledge', group: '技术库' }
    },
    {
        path: '/knowledge/review',
        name: 'KnowledgeReview',
        component: _KnowledgeReview,
        meta: { title: '校审库', icon: '✅', section: 'knowledge', group: '校审库' }
    },
    {
        path: '/knowledge/project',
        name: 'KnowledgeProject',
        component: _KnowledgeProject,
        meta: { title: '项目库', icon: '📁', section: 'knowledge', group: '项目库' }
    },
    // AI工具库
    {
        path: '/tools/bid',
        name: 'ToolsBid',
        component: _ToolsBid,
        meta: { title: '智能标书中心', icon: '📝', section: 'tools', group: '智能标书中心' }
    },
    {
        path: '/tools/drawing',
        name: 'ToolsDrawing',
        component: _ToolsDrawing,
        meta: { title: '智能图审工场', icon: '🔍', section: 'tools', group: '智能图审工场' }
    },
    {
        path: '/tools/text',
        name: 'ToolsText',
        component: _ToolsText,
        meta: { title: '智能文审中心', icon: '📋', section: 'tools', group: '智能文审中心' }
    },
    {
        path: '/tools/cad',
        name: 'ToolsCad',
        component: _ToolsCad,
        meta: { title: 'CAD智能设计助手', icon: '✏️', section: 'tools', group: 'CAD智能设计助手' }
    },
    {
        path: '/tools/scheme',
        name: 'ToolsScheme',
        component: _ToolsScheme,
        meta: { title: '智能方案设计引擎', icon: '🧠', section: 'tools', group: '智能方案设计引擎' }
    },
    // 系统管理
    {
        path: '/system',
        name: 'System',
        component: _SystemPage,
        meta: { title: '系统管理', icon: '⚙️', section: 'system' }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// ==========================================
// 主应用组件
// ==========================================
const App = {
    template: `
    <div class="layout">
        <!-- 侧边栏 -->
        <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
            <div class="sidebar-logo">
                <div class="logo-icon">AI</div>
                <div class="logo-text">AI设计质量提升平台</div>
            </div>
            <nav class="sidebar-nav">
                <!-- 首页 -->
                <div class="nav-section">
                    <div
                        class="nav-item"
                        :class="{ active: $route.path === '/' }"
                        @click="$router.push('/')"
                    >
                        <span class="nav-icon">🏠</span>
                        <span class="nav-label">工作台</span>
                    </div>
                </div>

                <!-- AI知识库 -->
                <div class="nav-section">
                    <div class="nav-section-title">AI知识库</div>
                    <div class="nav-item" :class="{ active: isKnowledgeActive }">
                        <span class="nav-icon">📚</span>
                        <span class="nav-label">知识管理</span>
                        <span class="nav-arrow" :class="{ open: knowledgeOpen }">▶</span>
                    </div>
                    <div class="nav-sub" :class="{ open: knowledgeOpen }">
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/knowledge/tech' }"
                            @click="navigate('/knowledge/tech')"
                        >
                            <span class="nav-label">技术库</span>
                        </div>
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/knowledge/review' }"
                            @click="navigate('/knowledge/review')"
                        >
                            <span class="nav-label">校审库</span>
                        </div>
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/knowledge/project' }"
                            @click="navigate('/knowledge/project')"
                        >
                            <span class="nav-label">项目库</span>
                        </div>
                    </div>
                </div>

                <!-- AI工具库 -->
                <div class="nav-section">
                    <div class="nav-section-title">AI工具库</div>
                    <div class="nav-item" :class="{ active: isToolsActive }">
                        <span class="nav-icon">🛠️</span>
                        <span class="nav-label">智能工具</span>
                        <span class="nav-arrow" :class="{ open: toolsOpen }">▶</span>
                    </div>
                    <div class="nav-sub" :class="{ open: toolsOpen }">
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/tools/bid' }"
                            @click="navigate('/tools/bid')"
                        >
                            <span class="nav-label">智能标书中心</span>
                        </div>
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/tools/drawing' }"
                            @click="navigate('/tools/drawing')"
                        >
                            <span class="nav-label">智能图审工场</span>
                        </div>
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/tools/text' }"
                            @click="navigate('/tools/text')"
                        >
                            <span class="nav-label">智能文审中心</span>
                        </div>
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/tools/cad' }"
                            @click="navigate('/tools/cad')"
                        >
                            <span class="nav-label">CAD智能设计助手</span>
                        </div>
                        <div
                            class="nav-item"
                            :class="{ active: $route.path === '/tools/scheme' }"
                            @click="navigate('/tools/scheme')"
                        >
                            <span class="nav-label">智能方案设计引擎</span>
                        </div>
                    </div>
                </div>

                <!-- 系统 -->
                <div class="nav-section">
                    <div class="nav-section-title">系统</div>
                    <div
                        class="nav-item"
                        :class="{ active: $route.path === '/system' }"
                        @click="navigate('/system')"
                    >
                        <span class="nav-icon">⚙️</span>
                        <span class="nav-label">系统管理</span>
                    </div>
                </div>
            </nav>
        </aside>

        <!-- 主内容区 -->
        <div class="main-area">
            <!-- 顶部栏 -->
            <header class="header">
                <div class="header-left">
                    <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
                        {{ sidebarCollapsed ? '☰' : '✕' }}
                    </button>
                    <div class="breadcrumb">
                        <a @click="$router.push('/')">首页</a>
                        <template v-if="$route.meta.group">
                            <span class="sep">/</span>
                            <a>{{ $route.meta.group }}</a>
                        </template>
                        <span class="sep">/</span>
                        <span class="current">{{ $route.meta.title }}</span>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-search">
                        <span class="search-icon">🔍</span>
                        <input type="text" placeholder="搜索规范、项目、功能..." />
                    </div>
                    <div class="header-actions">
                        <button class="header-btn" title="消息通知">
                            🔔
                            <span class="badge">3</span>
                        </button>
                        <button class="header-btn" title="帮助文档">❓</button>
                    </div>
                    <div class="user-menu">
                        <div class="avatar">张</div>
                        <span class="user-name">张建国</span>
                    </div>
                </div>
            </header>

            <!-- 内容区 -->
            <div class="content">
                <router-view />
            </div>
        </div>
    </div>
    `,
    setup() {
        const sidebarCollapsed = ref(false);
        const knowledgeOpen = ref(true);
        const toolsOpen = ref(true);
        const route = useRoute();
        const router = useRouter();

        // 知识库菜单是否高亮
        const isKnowledgeActive = computed(() => {
            return route.path.startsWith('/knowledge');
        });

        // 工具库菜单是否高亮
        const isToolsActive = computed(() => {
            return route.path.startsWith('/tools');
        });

        // 导航时自动展开对应菜单
        const navigate = (path) => {
            if (path.startsWith('/knowledge')) {
                knowledgeOpen.value = true;
            } else if (path.startsWith('/tools')) {
                toolsOpen.value = true;
            }
            router.push(path);
        };

        // 监听路由变化，自动展开菜单
        watch(() => route.path, (newPath) => {
            if (newPath.startsWith('/knowledge')) {
                knowledgeOpen.value = true;
            } else if (newPath.startsWith('/tools')) {
                toolsOpen.value = true;
            }
        });

        return {
            sidebarCollapsed,
            knowledgeOpen,
            toolsOpen,
            isKnowledgeActive,
            isToolsActive,
            navigate
        };
    }
};

// ==========================================
// 创建并挂载应用
// ==========================================
const app = createApp(App);
app.use(router);
app.mount('#app');

// 更新页面标题
router.afterEach((to) => {
    document.title = `${to.meta.title} - AI设计质量提升平台`;
});
