const ToolsCad = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">CAD智能设计助手</h1>
                    <p class="page-desc">统一CAD插件开发框架与自然语言交互接口，解决不同专业重复开发CAD插件效率低、出图标准不统一的问题</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <div v-for="(tab, index) in tabs" :key="index"
                     :class="['tab-item', { active: activeTab === index }]"
                     @click="activeTab = index">
                    {{ tab }}
                </div>
            </div>

            <!-- Tab 1: 插件管理 -->
            <div v-show="activeTab === 0">
                <!-- 插件框架概览 -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <span class="card-title">插件框架概览</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-grid">
                            <div class="stat-card">
                                <div class="stat-icon blue">&#128268;</div>
                                <div class="stat-info">
                                    <div class="stat-value">12个</div>
                                    <div class="stat-label">已安装插件</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon green">&#9989;</div>
                                <div class="stat-info">
                                    <div class="stat-value">10个</div>
                                    <div class="stat-label">运行中</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon orange">&#128260;</div>
                                <div class="stat-info">
                                    <div class="stat-value">2个</div>
                                    <div class="stat-label">待更新</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon purple">&#128722;</div>
                                <div class="stat-info">
                                    <div class="stat-value">18个</div>
                                    <div class="stat-label">插件市场</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 已安装插件列表 -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">已安装插件</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ plugins.length }} 个插件</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>插件名称</th>
                                    <th>专业</th>
                                    <th>版本</th>
                                    <th>状态</th>
                                    <th>作者</th>
                                    <th>更新日期</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(plugin, index) in plugins" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ plugin.name }}</td>
                                    <td><span class="tag tag-blue">{{ plugin.category }}</span></td>
                                    <td>{{ plugin.version }}</td>
                                    <td><span :class="['tag', plugin.status === '运行中' ? 'tag-green' : 'tag-gray']">{{ plugin.status }}</span></td>
                                    <td>{{ plugin.author }}</td>
                                    <td>{{ plugin.updateDate }}</td>
                                    <td>
                                        <div class="actions">
                                            <button v-if="plugin.status === '运行中'" class="btn btn-ghost btn-sm" @click="togglePlugin(index)">停止</button>
                                            <button v-else class="btn btn-ghost btn-sm" @click="togglePlugin(index)">启动</button>
                                            <button class="btn btn-ghost btn-sm">卸载</button>
                                            <button class="btn btn-ghost btn-sm">更新</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 绘图规则 -->
            <div v-show="activeTab === 1">
                <!-- 筛选栏 -->
                <div class="filter-bar">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">专业筛选</label>
                        <select class="form-select" style="min-width: 160px;" v-model="ruleFilter">
                            <option value="">全部</option>
                            <option value="道路">道路</option>
                            <option value="桥梁">桥梁</option>
                            <option value="排水">排水</option>
                            <option value="勘测">勘测</option>
                        </select>
                    </div>
                </div>

                <!-- 规则分类卡片 -->
                <div v-for="(category, catIndex) in filteredRuleCategories" :key="catIndex" style="margin-bottom: 28px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: var(--gray-800); margin-bottom: 12px; padding-left: 4px;">{{ category.name }}</h3>
                    <div class="feature-grid">
                        <div v-for="(rule, ruleIndex) in category.rules" :key="ruleIndex" class="feature-item">
                            <div class="feature-item-icon" :style="{ background: category.iconBg, color: category.iconColor }">
                                {{ rule.icon }}
                            </div>
                            <div>
                                <h4>{{ rule.title }}</h4>
                                <p>{{ rule.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 自然语言交互 -->
            <div v-show="activeTab === 2">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">AI命令面板</span>
                        <span class="tag tag-green">在线</span>
                    </div>
                    <div class="card-body">
                        <!-- 聊天记录 -->
                        <div style="max-height: 480px; overflow-y: auto; margin-bottom: 20px; padding-right: 4px;">
                            <div v-for="(chat, index) in chatHistory" :key="index" style="margin-bottom: 20px;">
                                <!-- 用户消息 -->
                                <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                                    <div style="max-width: 70%; background: var(--primary); color: #fff; padding: 12px 16px; border-radius: 12px 12px 2px 12px; font-size: 13px; line-height: 1.6;">
                                        {{ chat.user }}
                                    </div>
                                </div>
                                <!-- AI回复 -->
                                <div style="display: flex; justify-content: flex-start;">
                                    <div style="max-width: 70%; background: var(--gray-100); color: var(--gray-800); padding: 12px 16px; border-radius: 12px 12px 12px 2px; font-size: 13px; line-height: 1.6;">
                                        <div style="font-size: 11px; font-weight: 600; color: var(--primary); margin-bottom: 6px;">AI助手</div>
                                        {{ chat.ai }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 输入区域 -->
                        <div style="display: flex; gap: 12px; align-items: flex-end; border-top: 1px solid var(--gray-200); padding-top: 16px;">
                            <div style="flex: 1;">
                                <textarea class="form-textarea" rows="2" placeholder="请输入命令或描述您的设计需求" v-model="chatInput" style="min-height: 60px; resize: none;"></textarea>
                            </div>
                            <button class="btn btn-primary btn-lg" style="height: 60px; padding: 0 24px;">发送</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 4: 出图标准 -->
            <div v-show="activeTab === 3">
                <div class="grid-2">
                    <!-- 左侧：标准模板库 -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">标准模板库</span>
                            <button class="btn btn-outline btn-sm">导入标准</button>
                        </div>
                        <div class="card-body" style="padding: 0;">
                            <div v-for="(tpl, index) in templates" :key="index"
                                 :style="{
                                     padding: '16px 20px',
                                     borderBottom: index < templates.length - 1 ? '1px solid var(--gray-100)' : 'none',
                                     cursor: 'pointer',
                                     background: selectedTemplate === index ? 'var(--primary-bg)' : 'transparent',
                                     transition: 'var(--transition)'
                                 }"
                                 @click="selectedTemplate = index">
                                <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">{{ tpl.name }}</span>
                                        <span v-if="tpl.isDefault" class="tag tag-green">默认</span>
                                    </div>
                                </div>
                                <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 10px; line-height: 1.5;">{{ tpl.desc }}</p>
                                <div class="actions">
                                    <button class="btn btn-sm" :class="selectedTemplate === index ? 'btn-primary' : 'btn-outline'">应用</button>
                                    <button class="btn btn-ghost btn-sm">编辑</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧：当前标准详情 -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">当前标准详情</span>
                            <span class="tag tag-blue">{{ currentTemplate.name }}</span>
                        </div>
                        <div class="card-body">
                            <!-- 标准配置项 -->
                            <div v-for="(item, index) in currentTemplate.details" :key="index"
                                 style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div class="stat-icon" :class="item.color" style="width: 40px; height: 40px; font-size: 18px;">{{ item.icon }}</div>
                                    <div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--gray-800);">{{ item.title }}</div>
                                        <div style="font-size: 12px; color: var(--gray-500); margin-top: 2px;">{{ item.count }}</div>
                                    </div>
                                </div>
                                <button class="btn btn-ghost btn-sm">查看</button>
                            </div>

                            <!-- 应用按钮 -->
                            <button class="btn btn-primary btn-lg" style="width: 100%; margin-top: 8px;">一键应用到当前图纸</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            activeTab: 0,
            tabs: ['插件管理', '绘图规则', '自然语言交互', '出图标准'],

            // Tab 1: 插件管理
            plugins: [
                { name: '道路平面设计', category: '道路', version: 'v2.3.1', status: '运行中', author: '张工', updateDate: '2025-12-15' },
                { name: '纵断面设计', category: '道路', version: 'v1.8.0', status: '运行中', author: '李工', updateDate: '2025-11-28' },
                { name: '桥型布置', category: '桥梁', version: 'v2.0.0', status: '运行中', author: '王工', updateDate: '2025-12-01' },
                { name: '管道设计', category: '排水', version: 'v1.5.2', status: '运行中', author: '赵工', updateDate: '2025-10-20' },
                { name: '地形处理', category: '勘测', version: 'v3.1.0', status: '运行中', author: '陈工', updateDate: '2025-12-10' },
                { name: '标注工具', category: '通用', version: 'v1.2.0', status: '已停止', author: '刘工', updateDate: '2025-08-15' },
                { name: '图框管理', category: '通用', version: 'v2.0.0', status: '运行中', author: '周工', updateDate: '2025-11-30' },
                { name: '工程量统计', category: '通用', version: 'v1.0.0', status: '已停止', author: '吴工', updateDate: '2025-07-22' }
            ],

            // Tab 2: 绘图规则
            ruleFilter: '',
            ruleCategories: [
                {
                    name: '道路绘图规则',
                    filter: '道路',
                    iconBg: 'var(--primary-bg)',
                    iconColor: 'var(--primary)',
                    rules: [
                        { icon: '\uD83D\uDDFA\uFE0F', title: '平面图绘制规则', desc: '定义道路平面线形绘制标准，包括路线偏位、曲线要素标注规范' },
                        { icon: '\uD83D\uDCC9', title: '纵断面图绘制规则', desc: '规范纵断面地面线、设计线绘制比例及变坡点标注要求' },
                        { icon: '\uD83E\uDDF0', title: '横断面图绘制规则', desc: '统一横断面图幅布置、路基路面结构层标注及比例规范' },
                        { icon: '\uD83D\uDDBC\uFE0F', title: '标准图框规则', desc: '规定道路专业图框格式、图签栏内容与签字盖章区域' }
                    ]
                },
                {
                    name: '桥梁绘图规则',
                    filter: '桥梁',
                    iconBg: 'var(--success-bg)',
                    iconColor: 'var(--success)',
                    rules: [
                        { icon: '\uD83D\uDECB\uFE0F', title: '桥型布置图规则', desc: '规范桥梁立面、平面、横断面布置图的绘制图层与标注' },
                        { icon: '\uD83D\uDEE0\uFE0F', title: '结构构造图规则', desc: '定义桥梁上下部结构详图的绘制比例、截面标注标准' },
                        { icon: '\uD83E\uDE9A', title: '钢筋构造图规则', desc: '统一钢筋大样绘制方式、钢筋表格式及材料数量标注' }
                    ]
                },
                {
                    name: '排水绘图规则',
                    filter: '排水',
                    iconBg: 'var(--warning-bg)',
                    iconColor: 'var(--warning)',
                    rules: [
                        { icon: '\uD83D\uDCA7', title: '管道平面图规则', desc: '规范排水管线平面布置图的图层、管径标注及节点编号' },
                        { icon: '\uD83D\uDCC8', title: '管道纵断面图规则', desc: '定义排水管道纵断面绘制比例、标高标注及坡度标注' },
                        { icon: '\uD83D\uDD39', title: '节点大样图规则', desc: '规定检查井、雨水口等节点大样的绘制尺寸与标注要求' }
                    ]
                },
                {
                    name: '勘测绘图规则',
                    filter: '勘测',
                    iconBg: 'var(--info-bg)',
                    iconColor: 'var(--info)',
                    rules: [
                        { icon: '\u26F0\uFE0F', title: '地形图处理规则', desc: '统一地形图等高线绘制、高程点标注及图例标准' },
                        { icon: '\uD83E\uDEA8', title: '地质剖面图规则', desc: '规范地质剖面图地层分界线绘制、岩土描述标注' },
                        { icon: '\uD83D\uDCCC', title: '勘探点布置图规则', desc: '定义勘探点平面布置图的绘制符号、编号及参数标注' }
                    ]
                }
            ],

            // Tab 3: 自然语言交互
            chatInput: '',
            chatHistory: [
                {
                    user: '画一段200m的城市主干路',
                    ai: '已识别命令：绘制道路平面线。请确认参数：道路等级=城市主干路，长度=200m，设计速度=60km/h。是否执行？'
                },
                {
                    user: '自动标注纵断面图',
                    ai: '正在处理纵断面标注...已完成。标注了12个变坡点，5个竖曲线。'
                },
                {
                    user: '切换到XX市出图标准',
                    ai: '已切换出图标准。已应用：图层颜色方案、标注样式、图框模板。'
                },
                {
                    user: '统计本图工程量',
                    ai: '工程量统计完成：沥青面层 12,400m\u00B2，基层 12,800m\u00B2，挖方 8,500m\u00B3，填方 6,200m\u00B3。'
                }
            ],

            // Tab 4: 出图标准
            selectedTemplate: 0,
            templates: [
                { name: '通用出图标准', isDefault: true, desc: '基于国家标准的基础出图规范，适用于大多数市政工程项目' },
                { name: 'XX市住建局出图要求', isDefault: false, desc: '适用于XX市住建局审批项目的专项出图标准，包含地方性补充要求' },
                { name: 'XX省交通厅出图要求', isDefault: false, desc: '适用于XX省交通厅管理的公路及桥梁工程出图标准' },
                { name: 'XX市排水管理处要求', isDefault: false, desc: '适用于XX市排水管理处审批的排水管网工程专项出图标准' },
                { name: 'XX新区管委会要求', isDefault: false, desc: '适用于XX新区管委会管辖范围内基础设施项目的出图规范' }
            ]
        };
    },
    computed: {
        filteredRuleCategories() {
            if (!this.ruleFilter) return this.ruleCategories;
            return this.ruleCategories.filter(cat => cat.filter === this.ruleFilter);
        },
        currentTemplate() {
            var tpl = this.templates[this.selectedTemplate];
            return {
                name: tpl.name,
                details: [
                    { icon: '\uD83C\uDFA8', title: '图层标准', count: '10个图层规则', color: 'blue' },
                    { icon: '\uD83D\uDCDD', title: '标注样式', count: '5种标注样式', color: 'green' },
                    { icon: '\uD83D\uDDBC\uFE0F', title: '图框模板', count: '3套图框', color: 'orange' },
                    { icon: '\uD83D\uDCDC', title: '字体标准', count: '2种字体配置', color: 'purple' }
                ]
            };
        }
    },
    methods: {
        togglePlugin(index) {
            var plugin = this.plugins[index];
            plugin.status = plugin.status === '运行中' ? '已停止' : '运行中';
        }
    }
};

window.ToolsCad = ToolsCad;
