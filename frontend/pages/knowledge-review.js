const KnowledgeReview = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">校审库</h1>
                    <p class="page-desc">建立校审要点清单与常见错误案例库，明确质量红线与标准</p>
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

            <!-- Tab 1: 校审要点 -->
            <div v-show="activeTab === 0">
                <div class="grid-2">
                    <!-- Tree Panel -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">校审要点分类</span>
                            <button class="btn btn-primary btn-sm" @click="handleAddPoint">&#43; 新增要点</button>
                        </div>
                        <div class="card-body">
                            <div class="tree-list">
                                <div class="tree-node" v-for="(cat, cIndex) in reviewCategories" :key="cIndex">
                                    <div class="tree-node-header" @click="toggleTree(cIndex)">
                                        <span :class="['tree-node-arrow', { open: expandedNodes[cIndex] }]">&#9654;</span>
                                        <span class="tree-node-icon">{{ cat.icon }}</span>
                                        <span class="tree-node-title">{{ cat.name }}</span>
                                        <span class="tree-node-count">{{ cat.children.length }}</span>
                                    </div>
                                    <div class="tree-node-children" v-show="expandedNodes[cIndex]">
                                        <div class="tree-leaf" v-for="(leaf, lIndex) in cat.children" :key="lIndex"
                                             :style="{ background: selectedLeaf === cIndex + '-' + lIndex ? 'var(--primary-bg)' : '' }"
                                             @click="selectLeaf(cIndex, lIndex, leaf)">
                                            <span class="tree-leaf-icon">&#9679;</span>
                                            <span class="tree-leaf-title">{{ leaf.name }}</span>
                                            <span :class="['tag', 'tag-' + (leaf.importance === '高' ? 'red' : leaf.importance === '中' ? 'orange' : 'gray'), 'tree-leaf-tag']">{{ leaf.importance }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Detail Panel -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">要点详情</span>
                        </div>
                        <div class="card-body" v-if="selectedPoint">
                            <h3 style="font-size: 16px; font-weight: 600; color: var(--gray-800); margin-bottom: 12px;">{{ selectedPoint.name }}</h3>
                            <div style="margin-bottom: 16px;">
                                <span :class="['tag', 'tag-' + (selectedPoint.importance === '高' ? 'red' : selectedPoint.importance === '中' ? 'orange' : 'gray')]">重要程度：{{ selectedPoint.importance }}</span>
                                <span class="tag tag-blue" style="margin-left: 8px;">适用专业：{{ selectedPoint.major }}</span>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px;">检查依据</h4>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8; background: var(--gray-50); padding: 12px; border-radius: 6px;">{{ selectedPoint.basis }}</p>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px;">检查内容</h4>
                                <p style="font-size: 13px; color: var(--gray-600); line-height: 1.8;">{{ selectedPoint.content }}</p>
                            </div>
                            <div>
                                <h4 style="font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px;">常见问题</h4>
                                <ul style="padding-left: 16px; list-style: disc;">
                                    <li v-for="(issue, iIdx) in selectedPoint.issues" :key="iIdx" style="font-size: 13px; color: var(--gray-600); line-height: 1.8;">{{ issue }}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body" v-else>
                            <div class="empty-state">
                                <div class="empty-icon">&#128203;</div>
                                <div class="empty-text">请从左侧选择一个校审要点查看详情</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 错误案例 -->
            <div v-show="activeTab === 1">
                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="caseFilter.major" style="min-width: 140px;">
                        <option value="">全部专业</option>
                        <option value="道路">道路</option>
                        <option value="桥梁">桥梁</option>
                        <option value="排水">排水</option>
                        <option value="规划">规划</option>
                        <option value="照明">照明</option>
                    </select>
                    <select class="form-select" v-model="caseFilter.type" style="min-width: 140px;">
                        <option value="">全部类型</option>
                        <option value="设计错误">设计错误</option>
                        <option value="计算错误">计算错误</option>
                        <option value="规范违反">规范违反</option>
                        <option value="制图错误">制图错误</option>
                    </select>
                    <select class="form-select" v-model="caseFilter.severity" style="min-width: 140px;">
                        <option value="">全部等级</option>
                        <option value="致命">致命</option>
                        <option value="严重">严重</option>
                        <option value="一般">一般</option>
                    </select>
                    <input class="form-input" type="text" placeholder="搜索案例关键词..." v-model="caseFilter.search" style="min-width: 220px;">
                </div>

                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>案例编号</th>
                                <th>案例标题</th>
                                <th>专业</th>
                                <th>错误类型</th>
                                <th>严重等级</th>
                                <th>提交日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredCases" :key="item.id">
                                <td style="font-weight: 600; color: var(--gray-800);">{{ item.code }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.major }}</td>
                                <td><span :class="['tag', getTypeTagClass(item.type)]">{{ item.type }}</span></td>
                                <td><span :class="['tag', getSeverityTagClass(item.severity)]">{{ item.severity }}</span></td>
                                <td>{{ item.date }}</td>
                                <td class="actions">
                                    <button class="btn btn-ghost btn-sm" @click="handleViewCase(item)">查看</button>
                                    <button class="btn btn-outline btn-sm">引用</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button :class="['page-btn', { active: true }]">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>

            <!-- Tab 3: 质量红线 -->
            <div v-show="activeTab === 2">
                <!-- Alert -->
                <div class="alert alert-danger" style="margin-bottom: 24px;">
                    <span style="font-size: 16px;">&#9888;</span>
                    <span>质量红线为设计工作的零容忍项，触碰红线将触发系统预警并阻止流程推进</span>
                </div>

                <!-- Red Line Cards Grid -->
                <div class="stat-grid">
                    <div class="stat-card" v-for="line in redLines" :key="line.name" style="cursor: pointer;" @click="handleViewLine(line)">
                        <div :class="['stat-icon', line.color]" v-html="line.icon"></div>
                        <div class="stat-info">
                            <div style="font-size: 16px; font-weight: 600; color: var(--gray-800); margin-bottom: 4px;">{{ line.name }}</div>
                            <div class="stat-label" style="line-height: 1.6;">{{ line.desc }}</div>
                            <div style="margin-top: 8px; font-size: 13px;">
                                <span :class="['tag', 'tag-' + line.color]">违规记录：{{ line.violations }} 次</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Red Line Detail -->
                <div class="card" style="margin-top: 24px;">
                    <div class="card-header">
                        <span class="card-title">红线条款详情</span>
                    </div>
                    <div class="card-body">
                        <div class="feature-grid">
                            <div class="feature-item" v-for="(item, index) in redLineDetails" :key="index" style="border-left: 3px solid var(--danger);">
                                <div>
                                    <h4 style="color: var(--danger);">{{ item.title }}</h4>
                                    <p>{{ item.desc }}</p>
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
            tabs: ['校审要点', '错误案例', '质量红线'],
            expandedNodes: {},
            selectedLeaf: null,
            selectedPoint: null,
            reviewCategories: [
                {
                    name: '通用校审要点', icon: '&#128736;', children: [
                        { name: '设计文件完整性检查', importance: '高', major: '通用', basis: '《建筑工程设计文件编制深度规定》', content: '检查设计文件是否包含封面、目录、设计说明、设计图纸、计算书等完整性内容，确认各部分文件之间的对应关系和一致性。', issues: ['缺少计算书附件', '目录与图纸内容不对应', '设计说明版本不一致'] },
                        { name: '图纸图签与编号规范', importance: '中', major: '通用', basis: '《市政工程设计文件编制深度规定》', content: '检查图纸标题栏信息是否完整，包括项目名称、图纸名称、设计阶段、图号、比例尺、日期、设计审核人员签字等。', issues: ['图签信息填写不全', '图纸编号不符合企业标准', '比例尺标注错误'] },
                        { name: '设计说明规范性审查', importance: '高', major: '通用', basis: '各专业设计文件编制深度要求', content: '审查设计说明内容是否完整、准确，包括工程概况、设计依据、设计参数、技术标准、主要材料等关键信息。', issues: ['引用已废止规范', '设计参数与图纸不符', '工程概况描述不完整'] }
                    ]
                },
                {
                    name: '道路专业', icon: '&#128739;', children: [
                        { name: '道路平面线形检查', importance: '高', major: '道路', basis: 'CJJ 37-2012 第5.2节', content: '检查道路平面线形设计是否符合规范要求，包括圆曲线半径、缓和曲线参数、平曲线最小长度、超高与加宽设置等。', issues: ['圆曲线半径小于极限值', '缓和曲线长度不足', '超高过渡段设置不合理'] },
                        { name: '纵断面设计校验', importance: '高', major: '道路', basis: 'CJJ 37-2012 第5.3节', content: '校验纵断面设计参数，包括纵坡坡度、坡长、竖曲线半径、竖曲线最小长度、凸凹竖曲线极限值等。', issues: ['最大纵坡超过规范限值', '坡长不满足要求', '竖曲线半径偏小'] },
                        { name: '横断面设计审查', importance: '中', major: '道路', basis: 'CJJ 37-2012 第5.4节', content: '审查横断面各组成部分宽度、路拱横坡、人行道设置、非机动车道布置等是否符合规范和规划要求。', issues: ['车道宽度不足', '人行道宽度不符合无障碍要求', '路拱坡度设置不当'] },
                        { name: '路面结构设计校核', importance: '高', major: '道路', basis: 'CJJ 169-2012', content: '校核路面结构层厚度、材料参数、弯沉值、抗滑性能等关键设计指标。', issues: ['面层厚度不满足最小要求', '基层材料选择不当', '未考虑交通量增长'] }
                    ]
                },
                {
                    name: '桥梁专业', icon: '&#127985;', children: [
                        { name: '桥梁荷载标准校验', importance: '高', major: '桥梁', basis: 'JTG D60-2015 第4章', content: '校验桥梁设计荷载取值是否正确，包括车道荷载、车辆荷载、人群荷载及荷载组合等。', issues: ['荷载等级选择错误', '荷载组合遗漏工况', '冲击系数计算错误'] },
                        { name: '结构计算书审核', importance: '高', major: '桥梁', basis: 'JTG D62-2004', content: '审核结构计算书的完整性、准确性，包括计算模型建立、边界条件设定、内力分析、配筋计算等。', issues: ['计算模型简化不合理', '边界条件设置错误', '配筋计算不满足要求'] }
                    ]
                },
                {
                    name: '排水专业', icon: '&#128167;', children: [
                        { name: '管道水力计算校核', importance: '高', major: '排水', basis: 'GB 50014-2021', content: '校核排水管道水力计算，包括流量计算、管径确定、流速校验、充满度检查、管道坡度等。', issues: ['设计流量偏小', '管道流速不满足自清要求', '充满度超过规范限值'] },
                        { name: '雨水排放系统检查', importance: '中', major: '排水', basis: 'GB 50014-2021', content: '检查雨水排放系统的完整性，包括雨水口布置、连接管、雨水管网、排出口等是否满足排水需求。', issues: ['雨水口间距偏大', '雨水管连接方式不当', '排出口标高设置不合理'] }
                    ]
                },
                {
                    name: '规划专业', icon: '&#127959;', children: [
                        { name: '规划指标合规性审查', importance: '高', major: '规划', basis: 'GB 50180-2018', content: '审查规划方案的各项技术指标是否符合控制性详细规划要求，包括容积率、建筑密度、绿地率、停车配建等。', issues: ['容积率超出上限', '建筑密度超标', '绿地率不满足要求'] }
                    ]
                },
                {
                    name: '照明专业', icon: '&#128161;', children: [
                        { name: '照明计算审核', importance: '中', major: '照明', basis: 'CJJ 45-2015', content: '审核照明计算书，包括平均照度、照度均匀度、眩光控制、功率密度等指标是否符合标准。', issues: ['平均照度不达标', '眩光控制不满足要求', '功率密度超标'] }
                    ]
                }
            ],
            caseFilter: {
                major: '',
                type: '',
                severity: '',
                search: ''
            },
            errorCases: [
                { id: 1, code: 'EC-2026-001', title: '道路纵坡超过规范允许最大值', major: '道路', type: '规范违反', severity: '致命', date: '2026-03-15' },
                { id: 2, code: 'EC-2026-002', title: '桥梁桩基承载力计算参数取值错误', major: '桥梁', type: '计算错误', severity: '致命', date: '2026-03-12' },
                { id: 3, code: 'EC-2026-003', title: '排水管道管径与计算书不一致', major: '排水', type: '设计错误', severity: '严重', date: '2026-03-10' },
                { id: 4, code: 'EC-2026-004', title: '道路平面交叉角度标注错误', major: '道路', type: '制图错误', severity: '一般', date: '2026-03-08' },
                { id: 5, code: 'EC-2026-005', title: '照明灯具选型未满足防护等级要求', major: '照明', type: '规范违反', severity: '严重', date: '2026-03-05' },
                { id: 6, code: 'EC-2026-006', title: '规划方案容积率超出控规上限', major: '规划', type: '规范违反', severity: '致命', date: '2026-03-02' }
            ],
            redLines: [
                { name: '强制性条文违反', desc: '违反国家及行业强制性标准条文，属于零容忍项', icon: '&#9888;', color: 'red', violations: 3 },
                { name: '工程安全底线', desc: '涉及结构安全、使用安全的关键设计指标不满足最低要求', icon: '&#128737;', color: 'orange', violations: 5 },
                { name: '审批验收条件', desc: '影响项目审批、验收的设计文件缺陷及合规性问题', icon: '&#128220;', color: 'blue', violations: 8 },
                { name: '设计资质要求', desc: '超出设计单位资质范围或缺少必要执业资格签章', icon: '&#128196;', color: 'purple', violations: 2 }
            ],
            redLineDetails: [
                { title: '必须严格执行的强制性条文', desc: '所有设计必须满足GB 50220-95、CJJ 37-2012等国标行标中的强制性条文要求，不得以任何理由降低标准' },
                { title: '结构安全验算必须通过', desc: '桥梁、挡土墙、深基坑等结构物必须通过承载力极限状态和正常使用极限状态验算，安全系数不得低于规范要求' },
                { title: '消防与安全疏散', desc: '隧道、地下通道等工程必须满足消防设计要求，安全疏散通道、通风排烟系统设计必须合规' },
                { title: '无障碍设计全覆盖', desc: '城市道路及市政设施必须满足GB 50763-2012无障碍设计要求，确保盲道、坡道、无障碍电梯等设施完善' },
                { title: '环保排放达标', desc: '污水处理设施出水水质、垃圾处理设施排放指标必须满足国家环保标准要求' },
                { title: '抗震设防要求', desc: '地震区市政工程必须满足抗震设防要求，桥梁、给排水构筑物等必须进行抗震验算' }
            ]
        };
    },
    computed: {
        filteredCases() {
            return this.errorCases.filter(item => {
                if (this.caseFilter.major && item.major !== this.caseFilter.major) return false;
                if (this.caseFilter.type && item.type !== this.caseFilter.type) return false;
                if (this.caseFilter.severity && item.severity !== this.caseFilter.severity) return false;
                if (this.caseFilter.search) {
                    const keyword = this.caseFilter.search.toLowerCase();
                    return item.code.toLowerCase().includes(keyword) || item.title.includes(this.caseFilter.search);
                }
                return true;
            });
        }
    },
    methods: {
        toggleTree(index) {
            this.expandedNodes = { ...this.expandedNodes, [index]: !this.expandedNodes[index] };
        },
        selectLeaf(catIndex, leafIndex, leaf) {
            this.selectedLeaf = catIndex + '-' + leafIndex;
            this.selectedPoint = leaf;
        },
        handleAddPoint() {
            alert('打开新增校审要点对话框');
        },
        getTypeTagClass(type) {
            const map = { '设计错误': 'tag-orange', '计算错误': 'tag-red', '规范违反': 'tag-red', '制图错误': 'tag-blue' };
            return map[type] || 'tag-gray';
        },
        getSeverityTagClass(severity) {
            const map = { '致命': 'tag-red', '严重': 'tag-orange', '一般': 'tag-gray' };
            return map[severity] || 'tag-gray';
        },
        handleViewCase(item) {
            alert('查看案例详情：' + item.code + ' ' + item.title);
        },
        handleViewLine(line) {
            alert('查看红线详情：' + line.name);
        }
    }
};

window.KnowledgeReview = KnowledgeReview;
