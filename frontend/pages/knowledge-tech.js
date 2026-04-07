const KnowledgeTech = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">技术库</h1>
                    <p class="page-desc">整合所有技术规范、标准图集及材料数据库，构建标准化知识底座</p>
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

            <!-- Tab 1: 规范标准 -->
            <div v-show="activeTab === 0">
                <!-- Toolbar -->
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAdd">&#43; 新增规范</button>
                        <button class="btn btn-outline">&#8635; 同步更新</button>
                    </div>
                    <div class="toolbar-right">
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ standards.length }} 条记录</span>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="filterLevel" style="min-width: 140px;">
                        <option value="">全部级别</option>
                        <option value="国标">国标</option>
                        <option value="行标">行标</option>
                        <option value="地标">地标</option>
                        <option value="企标">企标</option>
                    </select>
                    <select class="form-select" v-model="filterMajor" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option value="道路">道路</option>
                        <option value="桥梁">桥梁</option>
                        <option value="排水">排水</option>
                        <option value="规划">规划</option>
                        <option value="照明">照明</option>
                    </select>
                    <select class="form-select" v-model="filterStatus" style="min-width: 140px;">
                        <option value="">全部状态</option>
                        <option value="现行">现行</option>
                        <option value="废止">废止</option>
                        <option value="即将实施">即将实施</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索标准编号或名称..." v-model="searchText" style="min-width: 220px;">
                </div>

                <!-- Table -->
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>标准编号</th>
                                <th>标准名称</th>
                                <th>级别</th>
                                <th>状态</th>
                                <th>适用专业</th>
                                <th>实施日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredStandards" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.level }}</td>
                                <td><span :class="['tag', getStatusTagClass(item.status)]">{{ item.status }}</span></td>
                                <td>{{ item.major }}</td>
                                <td>{{ item.date }}</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleView(item)">查看</button>
                                    <button class="btn btn-primary btn-sm" @click="handleDownload(item)">下载</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button v-for="p in 5" :key="p" :class="['page-btn', { active: p === 1 }]" @click="currentPage = p">{{ p }}</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 2: 标准图集 -->
            <div v-show="activeTab === 1">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAdd">&#43; 新增图集</button>
                    </div>
                    <div class="toolbar-right">
                        <input class="form-input" type="text" placeholder="搜索图集编号或名称..." v-model="atlasSearch" style="min-width: 220px;">
                    </div>
                </div>

                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>图集编号</th>
                                <th>图集名称</th>
                                <th>专业</th>
                                <th>版本</th>
                                <th>图幅数</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredAtlas" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td><span class="tag tag-blue">{{ item.major }}</span></td>
                                <td>{{ item.version }}</td>
                                <td>{{ item.sheets }} 幅</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleView(item)">查看</button>
                                    <button class="btn btn-primary btn-sm" @click="handleDownload(item)">下载</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button :class="['page-btn', { active: true }]">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 3: 材料数据库 -->
            <div v-show="activeTab === 2">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <input class="form-input" type="text" placeholder="搜索材料名称..." style="min-width: 260px;">
                    </div>
                </div>
                <div class="feature-grid">
                    <div class="feature-item" v-for="cat in materialCategories" :key="cat.name" style="cursor: pointer; padding: 24px;" @click="handleCategoryClick(cat)">
                        <div :class="['feature-item-icon']" :style="{ background: cat.bg, color: cat.color }" v-html="cat.icon"></div>
                        <div>
                            <h4>{{ cat.name }}</h4>
                            <p>{{ cat.desc }}</p>
                            <p style="margin-top: 4px; color: var(--primary); font-weight: 500; font-size: 12px;">共 {{ cat.count }} 项</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 4: 智能检索 -->
            <div v-show="activeTab === 3">
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-body" style="padding: 40px 24px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">&#128270;</div>
                        <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-800); margin-bottom: 8px;">智能知识检索</h3>
                        <p style="font-size: 13px; color: var(--gray-500); margin-bottom: 24px;">基于AI技术，为您快速定位规范条文、标准要求及技术参数</p>
                        <div style="max-width: 640px; margin: 0 auto; position: relative;">
                            <input class="form-input" type="text" v-model="aiQuery"
                                   placeholder="请输入问题，如：市政道路沥青面层厚度要求"
                                   style="height: 48px; font-size: 15px; padding: 0 120px 0 20px; border-radius: 24px; border: 2px solid var(--gray-300);"
                                   @keyup.enter="handleSearch">
                            <button class="btn btn-primary" @click="handleSearch"
                                    style="position: absolute; right: 4px; top: 4px; height: 40px; border-radius: 20px; padding: 0 20px;">
                                搜索
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search Results -->
                <div v-if="searchResults.length > 0">
                    <h3 style="font-size: 15px; font-weight: 600; color: var(--gray-800); margin-bottom: 16px;">检索结果</h3>
                    <div class="card" v-for="(result, index) in searchResults" :key="index" style="margin-bottom: 12px; cursor: pointer;" @click="handleView(result)">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <span class="tag tag-blue">Q</span>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">{{ result.question }}</span>
                            </div>
                            <div style="display: flex; align-items: flex-start; gap: 8px;">
                                <span class="tag tag-green">A</span>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8;">{{ result.answer }}</p>
                            </div>
                            <div style="margin-top: 8px; font-size: 12px; color: var(--gray-400);">
                                来源：{{ result.source }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Default Q&A samples -->
                <div v-else>
                    <h3 style="font-size: 15px; font-weight: 600; color: var(--gray-800); margin-bottom: 16px;">热门检索</h3>
                    <div class="card" v-for="(result, index) in sampleQA" :key="index" style="margin-bottom: 12px; cursor: pointer;" @click="handleView(result)">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                <span class="tag tag-blue">Q</span>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">{{ result.question }}</span>
                            </div>
                            <div style="display: flex; align-items: flex-start; gap: 8px;">
                                <span class="tag tag-green">A</span>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8;">{{ result.answer }}</p>
                            </div>
                            <div style="margin-top: 8px; font-size: 12px; color: var(--gray-400);">
                                来源：{{ result.source }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            activeTab: 0,
            tabs: ['规范标准', '标准图集', '材料数据库', '智能检索'],
            currentPage: 1,
            filterLevel: '',
            filterMajor: '',
            filterStatus: '',
            searchText: '',
            atlasSearch: '',
            aiQuery: '',
            standards: [
                { id: 1, code: 'GB 50220-95', name: '城市道路交通规划设计规范', level: '国标', status: '现行', major: '道路', date: '1995-09-01' },
                { id: 2, code: 'CJJ 1-2008', name: '城镇道路工程技术标准', level: '行标', status: '现行', major: '道路', date: '2008-09-01' },
                { id: 3, code: 'GB 50014-2021', name: '室外排水设计标准', level: '国标', status: '现行', major: '排水', date: '2021-10-01' },
                { id: 4, code: 'CJJ 37-2012', name: '城市道路工程设计规范', level: '行标', status: '现行', major: '道路', date: '2012-05-01' },
                { id: 5, code: 'GB 50289-2016', name: '城市工程管线综合规划规范', level: '国标', status: '即将实施', major: '规划', date: '2016-12-01' },
                { id: 6, code: 'CJJ 45-2015', name: '城市道路照明设计标准', level: '行标', status: '现行', major: '照明', date: '2016-06-01' },
                { id: 7, code: 'JTG D60-2015', name: '公路桥涵设计通用规范', level: '行标', status: '废止', major: '桥梁', date: '2015-12-01' },
                { id: 8, code: 'GB 50763-2012', name: '无障碍设计规范', level: '国标', status: '现行', major: '道路', date: '2012-09-01' }
            ],
            atlases: [
                { id: 1, code: 'MR1', name: '城市道路-路面', major: '道路', version: '2012版', sheets: 186 },
                { id: 2, code: 'MR2', name: '城市道路-路基', major: '道路', version: '2008版', sheets: 124 },
                { id: 3, code: 'MS1', name: '给水排水标准图集', major: '排水', version: '2019版', sheets: 320 },
                { id: 4, code: 'MZ1', name: '城市道路照明', major: '照明', version: '2015版', sheets: 98 },
                { id: 5, code: 'MB1', name: '市政桥梁标准图集', major: '桥梁', version: '2020版', sheets: 256 },
                { id: 6, code: 'MR3', name: '道路交叉口设计图集', major: '道路', version: '2018版', sheets: 142 }
            ],
            materialCategories: [
                { name: '沥青材料', desc: '道路沥青、改性沥青、乳化沥青等各类沥青材料的性能参数与规格', icon: '&#128738;', count: 256, bg: 'var(--gray-100)', color: 'var(--gray-700)' },
                { name: '混凝土材料', desc: '普通混凝土、钢筋混凝土、预应力混凝土等配合比及性能指标', icon: '&#9632;', count: 389, bg: 'var(--primary-bg)', color: 'var(--primary)' },
                { name: '管材管件', desc: '给排水管道、燃气管道、电力管道等管材规格与技术参数', icon: '&#9679;', count: 178, bg: 'var(--info-bg)', color: 'var(--info)' },
                { name: '路基材料', desc: '路基填料、基层材料、垫层材料等路基工程材料参数', icon: '&#9650;', count: 145, bg: 'var(--success-bg)', color: 'var(--success)' },
                { name: '照明器材', desc: '路灯、隧道灯、景观灯等照明灯具的技术参数与选型指南', icon: '&#128161;', count: 203, bg: 'var(--warning-bg)', color: 'var(--warning)' },
                { name: '交通安全设施', desc: '护栏、标志标线、信号灯等交通安全设施标准与规格', icon: '&#9888;', count: 167, bg: 'var(--danger-bg)', color: 'var(--danger)' }
            ],
            sampleQA: [
                {
                    question: '市政道路沥青面层厚度要求是什么？',
                    answer: '根据CJJ 37-2012《城市道路工程设计规范》，快速路沥青面层厚度不宜小于70mm，主干路不宜小于60mm，次干路不宜小于50mm，支路不宜小于30mm。对于重交通路段，沥青面层厚度应适当增加。',
                    source: 'CJJ 37-2012 第12.3.2条'
                },
                {
                    question: '城市排水管道最小覆土深度要求？',
                    answer: '根据GB 50014-2021《室外排水设计标准》，排水管道的最小覆土深度应根据道路荷载、管材强度、土壤冰冻深度等因素综合确定。车行道下管顶最小覆土深度一般不小于0.7m，非车行道下不小于0.3m。',
                    source: 'GB 50014-2021 第4.3.7条'
                },
                {
                    question: '城市道路照明标准值要求？',
                    answer: '根据CJJ 45-2015《城市道路照明设计标准》，快速路平均照度不低于20lx，主干路不低于15lx，次干路不低于10lx，支路不低于8lx。交会区照明标准应高于路段标准，平均照度不低于30lx。',
                    source: 'CJJ 45-2015 第3.3节'
                }
            ],
            searchResults: []
        };
    },
    computed: {
        filteredStandards() {
            return this.standards.filter(item => {
                if (this.filterLevel && item.level !== this.filterLevel) return false;
                if (this.filterMajor && item.major !== this.filterMajor) return false;
                if (this.filterStatus && item.status !== this.filterStatus) return false;
                if (this.searchText) {
                    const keyword = this.searchText.toLowerCase();
                    return item.code.toLowerCase().includes(keyword) || item.name.includes(this.searchText);
                }
                return true;
            });
        },
        filteredAtlas() {
            if (!this.atlasSearch) return this.atlases;
            const keyword = this.atlasSearch.toLowerCase();
            return this.atlases.filter(item =>
                item.code.toLowerCase().includes(keyword) || item.name.includes(this.atlasSearch)
            );
        }
    },
    methods: {
        getStatusTagClass(status) {
            const map = { '现行': 'tag-green', '废止': 'tag-red', '即将实施': 'tag-orange' };
            return map[status] || 'tag-gray';
        },
        handleAdd() {
            alert('打开新增规范对话框');
        },
        handleView(item) {
            alert('查看详情：' + (item.code || item.question));
        },
        handleDownload(item) {
            alert('下载文件：' + item.code);
        },
        handleSearch() {
            if (this.aiQuery.trim()) {
                this.searchResults = this.sampleQA.filter(qa =>
                    qa.question.includes(this.aiQuery) || qa.answer.includes(this.aiQuery)
                );
            } else {
                this.searchResults = [];
            }
        },
        handleCategoryClick(cat) {
            alert('进入材料分类：' + cat.name);
        }
    }
};

window.KnowledgeTech = KnowledgeTech;
