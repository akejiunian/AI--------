const KnowledgeProject = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">项目库</h1>
                    <p class="page-desc">沉淀所有历史项目的完整信息，形成可复用的案例资源池</p>
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

            <!-- Tab 1: 项目列表 -->
            <div v-show="activeTab === 0">
                <!-- Toolbar -->
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleAddProject">&#43; 新增项目</button>
                        <button class="btn btn-outline">&#128229; 导出列表</button>
                    </div>
                    <div class="toolbar-right">
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ filteredProjects.length }} 个项目</span>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="projectFilter.major" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option value="道路">道路</option>
                        <option value="桥梁">桥梁</option>
                        <option value="排水">排水</option>
                        <option value="规划">规划</option>
                        <option value="照明">照明</option>
                    </select>
                    <select class="form-select" v-model="projectFilter.status" style="min-width: 140px;">
                        <option value="">全部状态</option>
                        <option value="进行中">进行中</option>
                        <option value="已完成">已完成</option>
                        <option value="归档">归档</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索项目编号或名称..." v-model="projectFilter.search" style="min-width: 220px;">
                </div>

                <!-- Table -->
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>项目编号</th>
                                <th>项目名称</th>
                                <th>专业</th>
                                <th>建设地点</th>
                                <th>投资额(万元)</th>
                                <th>状态</th>
                                <th>设计阶段</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredProjects" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td><span :class="['tag', getMajorTagClass(item.major)]">{{ item.major }}</span></td>
                                <td>{{ item.location }}</td>
                                <td style="font-weight: 600;">{{ item.investment.toLocaleString() }}</td>
                                <td><span :class="['tag', getStatusTagClass(item.status)]">{{ item.status }}</span></td>
                                <td>{{ item.stage }}</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleViewProject(item)">查看</button>
                                    <button class="btn btn-primary btn-sm" @click="handleReuse(item)">复用</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button v-for="p in 5" :key="p" :class="['page-btn', { active: p === 1 }]" @click="projectPage = p">{{ p }}</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 2: 项目成果 -->
            <div v-show="activeTab === 1">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" @click="handleUpload">&#43; 上传文件</button>
                        <button class="btn btn-outline">&#128230; 批量下载</button>
                    </div>
                    <div class="toolbar-right">
                        <select class="form-select" v-model="fileTypeFilter" style="min-width: 140px;">
                            <option value="">全部类型</option>
                            <option value="pdf">PDF文档</option>
                            <option value="doc">Word文档</option>
                            <option value="cad">CAD图纸</option>
                        </select>
                    </div>
                </div>

                <!-- File List -->
                <div class="card">
                    <div class="card-body">
                        <div class="file-item" v-for="file in filteredFiles" :key="file.id">
                            <div :class="['file-icon', file.type]">
                                <span v-if="file.type === 'pdf'">&#128196;</span>
                                <span v-else-if="file.type === 'doc'">&#128209;</span>
                                <span v-else-if="file.type === 'cad'">&#9999;&#65039;</span>
                            </div>
                            <div class="file-info">
                                <div class="file-name">{{ file.name }}</div>
                                <div class="file-meta">{{ file.project }} | {{ file.size }} | {{ file.date }}</div>
                            </div>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn btn-ghost btn-sm" @click="handlePreview(file)">预览</button>
                                <button class="btn btn-primary btn-sm" @click="handleDownloadFile(file)">下载</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Area -->
                <div class="upload-area" style="margin-top: 16px;" @click="handleUpload">
                    <div class="upload-icon">&#128228;</div>
                    <div class="upload-text">点击或拖拽文件到此区域上传</div>
                    <div class="upload-hint">支持 PDF、Word、CAD、图片等格式，单个文件不超过 100MB</div>
                </div>
            </div>

            <!-- Tab 3: 项目经验 -->
            <div v-show="activeTab === 2">
                <div class="toolbar">
                    <div class="toolbar-left">
                        <select class="form-select" v-model="expFilter" style="min-width: 140px;">
                            <option value="">全部专业</option>
                            <option value="道路">道路</option>
                            <option value="桥梁">桥梁</option>
                            <option value="排水">排水</option>
                            <option value="规划">规划</option>
                            <option value="照明">照明</option>
                        </select>
                        <input class="form-input" type="text" placeholder="搜索经验关键词..." style="min-width: 220px;">
                    </div>
                    <div class="toolbar-right">
                        <button class="btn btn-primary btn-sm" @click="handleAddExp">&#43; 提交经验</button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="timeline">
                            <div class="timeline-item" v-for="(exp, index) in experiences" :key="index">
                                <div :class="['timeline-dot', index === 0 ? 'active' : '']"></div>
                                <div class="timeline-title">{{ exp.title }}</div>
                                <div class="timeline-time">{{ exp.project }} | {{ exp.time }}</div>
                                <div class="timeline-desc">{{ exp.desc }}</div>
                                <div style="margin-top: 8px; display: flex; gap: 6px;">
                                    <span :class="['tag', 'tag-' + exp.color]">{{ exp.major }}</span>
                                    <span class="tag tag-gray">{{ exp.author }}</span>
                                </div>
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
            tabs: ['项目列表', '项目成果', '项目经验'],
            projectPage: 1,
            projectFilter: {
                major: '',
                status: '',
                search: ''
            },
            fileTypeFilter: '',
            expFilter: '',
            projects: [
                { id: 1, code: 'PRJ-2026-001', name: 'XX市滨河路道路改造工程', major: '道路', location: 'XX省XX市', investment: 28600, status: '进行中', stage: '施工图' },
                { id: 2, code: 'PRJ-2026-002', name: 'XX大桥维修加固工程', major: '桥梁', location: 'XX省XX市', investment: 15300, status: '已完成', stage: '竣工验收' },
                { id: 3, code: 'PRJ-2026-003', name: 'XX新区污水管网建设工程', major: '排水', location: 'XX省XX市', investment: 42100, status: '进行中', stage: '初步设计' },
                { id: 4, code: 'PRJ-2025-045', name: 'XX市城市照明节能改造项目', major: '照明', location: 'XX省XX市', investment: 8600, status: '已完成', stage: '竣工验收' },
                { id: 5, code: 'PRJ-2025-038', name: 'XX开发区道路网规划', major: '规划', location: 'XX省XX市', investment: 0, status: '已完成', stage: '规划批复' },
                { id: 6, code: 'PRJ-2025-022', name: 'XX市快速路（东段）新建工程', major: '道路', location: 'XX省XX市', investment: 86700, status: '进行中', stage: '施工图' },
                { id: 7, code: 'PRJ-2024-118', name: 'XX立交桥改造工程', major: '桥梁', location: 'XX省XX市', investment: 52400, status: '归档', stage: '竣工验收' },
                { id: 8, code: 'PRJ-2024-095', name: 'XX市雨水泵站及配套管网工程', major: '排水', location: 'XX省XX市', investment: 31200, status: '归档', stage: '竣工验收' }
            ],
            projectFiles: [
                { id: 1, name: '滨河路道路改造工程施工图设计总说明.pdf', type: 'pdf', project: 'PRJ-2026-001', size: '12.3 MB', date: '2026-03-20' },
                { id: 2, name: 'XX大桥维修加固方案设计报告.doc', type: 'doc', project: 'PRJ-2026-002', size: '8.7 MB', date: '2026-02-15' },
                { id: 3, name: '滨河路道路平面图.dwg', type: 'cad', project: 'PRJ-2026-001', size: '24.6 MB', date: '2026-03-18' },
                { id: 4, name: '新区污水管网初步设计文件.pdf', type: 'pdf', project: 'PRJ-2026-003', size: '18.9 MB', date: '2026-03-10' },
                { id: 5, name: 'XX立交桥改造工程竣工验收报告.doc', type: 'doc', project: 'PRJ-2024-118', size: '6.2 MB', date: '2025-12-05' },
                { id: 6, name: '雨水泵站工艺流程图.dwg', type: 'cad', project: 'PRJ-2024-095', size: '15.8 MB', date: '2025-10-20' }
            ],
            experiences: [
                {
                    title: '旧路改造项目中地下管线冲突的处理经验',
                    project: 'XX市滨河路道路改造工程',
                    time: '2026-03-15',
                    desc: '在旧路改造过程中，发现地下管线密集且资料缺失，通过与管线单位协调，采用探地雷达先行探测、局部开挖确认的方案，有效避免了施工中管线损坏事故。建议今后旧路改造项目前期必须安排地下管线专项调查。',
                    major: '道路',
                    author: '张工',
                    color: 'blue'
                },
                {
                    title: '大跨径桥梁加固方案比选经验总结',
                    project: 'XX大桥维修加固工程',
                    time: '2026-02-20',
                    desc: '针对大跨径预应力混凝土连续梁桥的加固方案，通过碳纤维布粘贴、体外预应力加固、增大截面法三种方案的比选分析，最终采用体外预应力加固方案。该方案在保证结构安全的同时，最大限度减少了对交通的影响。',
                    major: '桥梁',
                    author: '李工',
                    color: 'green'
                },
                {
                    title: '污水管网水力计算模型优化经验',
                    project: 'XX新区污水管网建设工程',
                    time: '2026-01-28',
                    desc: '在大型污水管网设计中，通过采用EPANET水力模型进行模拟分析，优化了管网布局和管径选择，使管网总造价降低约12%。建议在同类项目中推广水力模型辅助设计的做法。',
                    major: '排水',
                    author: '王工',
                    color: 'blue'
                },
                {
                    title: 'LED路灯改造项目节能效果评估',
                    project: 'XX市城市照明节能改造项目',
                    time: '2025-11-10',
                    desc: '通过对城区12000盏路灯的LED改造，实测节能率达到58%。关键经验：在灯具选型时不仅要考虑光效，还要关注色温、显色指数和配光曲线，确保改造后照明质量不降低。',
                    major: '照明',
                    author: '赵工',
                    color: 'orange'
                },
                {
                    title: '快速路设计中互通式立交选型经验',
                    project: 'XX市快速路（东段）新建工程',
                    time: '2025-09-25',
                    desc: '在快速路互通式立交选型中，综合考虑交通量预测、地形地貌、征地拆迁等因素，最终选择部分苜蓿叶+定向匝道的组合形式。设计经验：立交形式应结合远期交通需求预留改造条件，避免二次改造。',
                    major: '道路',
                    author: '陈工',
                    color: 'blue'
                }
            ]
        };
    },
    computed: {
        filteredProjects() {
            return this.projects.filter(item => {
                if (this.projectFilter.major && item.major !== this.projectFilter.major) return false;
                if (this.projectFilter.status && item.status !== this.projectFilter.status) return false;
                if (this.projectFilter.search) {
                    const keyword = this.projectFilter.search.toLowerCase();
                    return item.code.toLowerCase().includes(keyword) || item.name.includes(this.projectFilter.search);
                }
                return true;
            });
        },
        filteredFiles() {
            if (!this.fileTypeFilter) return this.projectFiles;
            return this.projectFiles.filter(f => f.type === this.fileTypeFilter);
        }
    },
    methods: {
        getMajorTagClass(major) {
            const map = { '道路': 'tag-blue', '桥梁': 'tag-green', '排水': 'tag-purple', '规划': 'tag-orange', '照明': 'tag-gray' };
            return map[major] || 'tag-gray';
        },
        getStatusTagClass(status) {
            const map = { '进行中': 'tag-blue', '已完成': 'tag-green', '归档': 'tag-gray' };
            return map[status] || 'tag-gray';
        },
        handleAddProject() {
            alert('打开新增项目对话框');
        },
        handleViewProject(item) {
            alert('查看项目详情：' + item.code + ' ' + item.name);
        },
        handleReuse(item) {
            alert('复用项目方案：' + item.code + ' ' + item.name);
        },
        handleUpload() {
            alert('打开文件上传对话框');
        },
        handlePreview(file) {
            alert('预览文件：' + file.name);
        },
        handleDownloadFile(file) {
            alert('下载文件：' + file.name);
        },
        handleAddExp() {
            alert('打开提交经验对话框');
        }
    }
};

window.KnowledgeProject = KnowledgeProject;
