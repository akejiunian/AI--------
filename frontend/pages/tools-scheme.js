const ToolsScheme = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">智能方案设计引擎</h1>
                    <p class="page-desc">专业方案AI辅助设计系统，建立"专业设计数据库+规则引擎+LLM方案生成"三层架构，各专业模块统一接入</p>
                </div>
            </div>

            <!-- 三层架构 Section -->
            <div style="display: flex; flex-direction: column; gap: 0; margin-bottom: 24px;">
                <!-- 第三层: LLM方案生成 -->
                <div class="stat-card" style="border-left: 4px solid var(--info); border-radius: 0; padding: 20px 24px; position: relative;">
                    <div style="position: absolute; top: 20px; right: 20px; background: var(--info-bg); color: var(--info); padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">第三层</div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <div class="stat-icon purple" style="width: 40px; height: 40px; font-size: 20px;">&#129302;</div>
                        <span style="font-size: 16px; font-weight: 700; color: var(--gray-900);">LLM方案生成</span>
                    </div>
                    <p style="font-size: 13px; color: var(--gray-600); line-height: 1.6;">基于RAG检索增强生成技术，结合专业设计数据库中的历史方案和规范知识，利用大语言模型智能生成专业设计方案，支持多轮交互优化与方案评审</p>
                </div>
                <!-- 第二层: 规则引擎 -->
                <div class="stat-card" style="border-left: 4px solid var(--warning); border-radius: 0; padding: 20px 24px; border-top: none; position: relative;">
                    <div style="position: absolute; top: 20px; right: 20px; background: var(--warning-bg); color: var(--warning); padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">第二层</div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <div class="stat-icon orange" style="width: 40px; height: 40px; font-size: 20px;">&#9881;</div>
                        <span style="font-size: 16px; font-weight: 700; color: var(--gray-900);">规则引擎</span>
                    </div>
                    <p style="font-size: 13px; color: var(--gray-600); line-height: 1.6;">内置行业规范校验规则与设计约束条件，对生成方案进行自动合规验证，确保方案满足现行标准与设计要求，降低人为错误风险</p>
                </div>
                <!-- 第一层: 专业设计数据库 -->
                <div class="stat-card" style="border-left: 4px solid var(--success); border-radius: 0; padding: 20px 24px; border-top: none; position: relative;">
                    <div style="position: absolute; top: 20px; right: 20px; background: var(--success-bg); color: var(--success); padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">第一层</div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <div class="stat-icon green" style="width: 40px; height: 40px; font-size: 20px;">&#128451;</div>
                        <span style="font-size: 16px; font-weight: 700; color: var(--gray-900);">专业设计数据库</span>
                    </div>
                    <p style="font-size: 13px; color: var(--gray-600); line-height: 1.6;">汇聚各专业历史设计方案、规范标准库、参数指标体系与造价数据，构建统一的专业知识底座，为方案生成提供可靠的数据支撑</p>
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

            <!-- Tab 1: 专业模块 -->
            <div v-show="activeTab === 0">
                <div class="module-grid">
                    <div v-for="(mod, index) in modules" :key="index"
                         :class="['module-card', mod.color]">
                        <div :class="['module-icon', mod.color]">{{ mod.icon }}</div>
                        <h3>{{ mod.title }}</h3>
                        <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 4px;">承接单位：{{ mod.company }}</p>
                        <p>{{ mod.description }}</p>
                        <div class="module-features" style="margin-bottom: 16px;">
                            <span v-for="(tag, ti) in mod.tags" :key="ti" :class="['tag', 'tag-' + mod.color]">{{ tag }}</span>
                        </div>
                        <button class="btn btn-primary btn-sm">进入模块</button>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 设计参数 -->
            <div v-show="activeTab === 1">
                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" v-model="filterMajor" style="min-width: 160px;">
                        <option value="">全部专业</option>
                        <option v-for="m in majorOptions" :key="m" :value="m">{{ m }}</option>
                    </select>
                    <select class="form-select" v-model="filterCategory" style="min-width: 160px;">
                        <option value="">全部参数类别</option>
                        <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
                    </select>
                </div>

                <!-- Parameter Table -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">设计参数库</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ filteredParams.length }} 条参数</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>参数编号</th>
                                    <th>参数名称</th>
                                    <th>所属专业</th>
                                    <th>参数类别</th>
                                    <th>取值范围</th>
                                    <th>单位</th>
                                    <th>数据来源</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(param, index) in filteredParams" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ param.id }}</td>
                                    <td>{{ param.name }}</td>
                                    <td><span :class="['tag', 'tag-' + param.majorColor]">{{ param.major }}</span></td>
                                    <td>{{ param.category }}</td>
                                    <td>{{ param.range }}</td>
                                    <td>{{ param.unit }}</td>
                                    <td>{{ param.source }}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">查看</button>
                                            <button class="btn btn-ghost btn-sm">编辑</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 方案生成 -->
            <div v-show="activeTab === 2">
                <!-- 生成配置 Card -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <span class="card-title">生成配置</span>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">专业模块</label>
                                <select class="form-select" v-model="generateConfig.module">
                                    <option value="">请选择专业模块</option>
                                    <option v-for="m in generateModules" :key="m" :value="m">{{ m }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">项目名称</label>
                                <input class="form-input" v-model="generateConfig.projectName" placeholder="请输入项目名称" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">设计阶段</label>
                                <select class="form-select" v-model="generateConfig.stage">
                                    <option value="">请选择设计阶段</option>
                                    <option v-for="s in designStages" :key="s" :value="s">{{ s }}</option>
                                </select>
                            </div>
                        </div>
                        <div style="margin-top: 8px;">
                            <button class="btn btn-primary btn-lg">开始生成方案</button>
                        </div>
                    </div>
                </div>

                <!-- 生成历史 Card -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">生成历史</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ historyList.length }} 条记录</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>方案名称</th>
                                    <th>专业模块</th>
                                    <th>项目名称</th>
                                    <th>生成日期</th>
                                    <th>方案页数</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in historyList" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ item.name }}</td>
                                    <td><span :class="['tag', 'tag-' + item.moduleColor]">{{ item.module }}</span></td>
                                    <td>{{ item.project }}</td>
                                    <td>{{ item.date }}</td>
                                    <td>{{ item.pages }}</td>
                                    <td><span :class="['tag', 'tag-' + item.statusColor]">{{ item.status }}</span></td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">查看</button>
                                            <button class="btn btn-ghost btn-sm">下载</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            activeTab: 0,
            tabs: ['专业模块', '设计参数', '方案生成'],

            // Tab 1: 专业模块
            modules: [
                {
                    title: '桥梁维修加固方案设计',
                    company: '一院',
                    description: '基于桥梁病害检测数据，智能生成维修加固方案，包含加固方法推荐、工程量计算与造价估算',
                    icon: '\uD83C\uDF09',
                    color: 'blue',
                    tags: ['病害识别', '加固方案', '计算书生成', '造价估算']
                },
                {
                    title: '道路照明设计AI智能体',
                    company: '六院',
                    description: '依据道路类型与照明标准，自动完成照度计算、灯具选型与布置优化，输出合规的照明设计方案',
                    icon: '\uD83D\uDCA1',
                    color: 'green',
                    tags: ['照度计算', '灯具选型', '节能分析', '标准合规']
                },
                {
                    title: '污水厂工艺方案AI设计',
                    company: '四院',
                    description: '根据进水水质与处理目标，智能推荐污水处理工艺路线，完成构筑物选型与设备配置方案',
                    icon: '\uD83C\uDFED',
                    color: 'orange',
                    tags: ['工艺推荐', '构筑物选型', '设备选型', '经济分析']
                },
                {
                    title: '埋地管道抗震验算',
                    company: '六院',
                    description: '依据抗震设计规范，对埋地管道进行地震作用分析与验算，自动生成抗震验算报告与预警提示',
                    icon: '\uD83D\uDD04',
                    color: 'red',
                    tags: ['参数输入', '抗震计算', '报告生成', '预警提示']
                },
                {
                    title: 'AI造价指标分析助手',
                    company: '造价院',
                    description: '基于历史项目造价数据，智能分析造价指标与趋势，辅助编制投资估算与设计概算',
                    icon: '\uD83D\uDCCA',
                    color: 'purple',
                    tags: ['数据积累', '指标分析', '造价估算', '趋势分析']
                }
            ],

            // Tab 2: 设计参数
            filterMajor: '',
            filterCategory: '',
            majorOptions: ['桥梁', '照明', '排水', '管道', '造价'],
            categoryOptions: ['结构参数', '荷载参数', '设计标准', '布置参数', '工艺参数', '材料参数', '抗震参数', '经济参数'],
            paramList: [
                { id: 'QL-001', name: '桥梁跨度', major: '桥梁', majorColor: 'blue', category: '结构参数', range: '5-200', unit: 'm', source: 'GB 50010-2010' },
                { id: 'QL-002', name: '设计荷载等级', major: '桥梁', majorColor: 'blue', category: '荷载参数', range: 'A级/B级', unit: '-', source: 'JTG D60-2015' },
                { id: 'QL-003', name: '混凝土强度等级', major: '桥梁', majorColor: 'blue', category: '材料参数', range: 'C30-C60', unit: 'MPa', source: 'GB 50010-2010' },
                { id: 'ZM-001', name: '道路照明标准', major: '照明', majorColor: 'green', category: '设计标准', range: 'CJJ 45', unit: '-', source: 'CJJ 45-2015' },
                { id: 'ZM-002', name: '灯具安装高度', major: '照明', majorColor: 'green', category: '布置参数', range: '6-12', unit: 'm', source: 'CJJ 45-2015' },
                { id: 'ZM-003', name: '路面平均照度', major: '照明', majorColor: 'green', category: '布置参数', range: '15-50', unit: 'lx', source: 'CJJ 45-2015' },
                { id: 'PS-001', name: '污水处理规模', major: '排水', majorColor: 'orange', category: '工艺参数', range: '1000-100000', unit: 'm\u00B3/d', source: 'GB 50014-2021' },
                { id: 'PS-002', name: '进出水COD浓度', major: '排水', majorColor: 'orange', category: '工艺参数', range: '200-500', unit: 'mg/L', source: 'GB 50014-2021' },
                { id: 'GD-001', name: '管道设计压力', major: '管道', majorColor: 'red', category: '结构参数', range: '0.4-1.6', unit: 'MPa', source: 'GB 50251-2015' },
                { id: 'GD-002', name: '场地抗震设防烈度', major: '管道', majorColor: 'red', category: '抗震参数', range: '6-9', unit: '度', source: 'GB 50011-2010' }
            ],

            // Tab 3: 方案生成
            generateConfig: {
                module: '',
                projectName: '',
                stage: ''
            },
            generateModules: ['桥梁维修加固', '道路照明', '污水厂工艺', '埋地管道抗震', '造价指标分析'],
            designStages: ['方案设计', '初步设计', '施工图设计'],

            historyList: [
                { name: 'XX桥梁维修加固方案', module: '桥梁维修加固', moduleColor: 'blue', project: 'XX跨河大桥维修工程', date: '2026-03-28', pages: 86, status: '已完成', statusColor: 'green' },
                { name: 'XX道路照明设计方案', module: '道路照明', moduleColor: 'green', project: 'XX城市主干道照明工程', date: '2026-03-25', pages: 52, status: '已完成', statusColor: 'green' },
                { name: 'XX污水厂工艺方案', module: '污水厂工艺', moduleColor: 'orange', project: 'XX污水处理厂扩容工程', date: '2026-03-22', pages: 124, status: '已审核', statusColor: 'blue' },
                { name: 'XX管道抗震验算报告', module: '埋地管道抗震', moduleColor: 'red', project: 'XX天然气管道工程', date: '2026-03-18', pages: 38, status: '已完成', statusColor: 'green' },
                { name: 'XX造价指标分析报告', module: '造价指标分析', moduleColor: 'purple', project: 'XX市政道路改造工程', date: '2026-03-15', pages: 45, status: '生成中', statusColor: 'orange' },
                { name: 'XX桥梁维修加固方案(二期)', module: '桥梁维修加固', moduleColor: 'blue', project: 'XX大桥引桥加固工程', date: '2026-03-10', pages: 72, status: '已审核', statusColor: 'blue' }
            ]
        };
    },
    computed: {
        filteredParams() {
            return this.paramList.filter(p => {
                if (this.filterMajor && p.major !== this.filterMajor) return false;
                if (this.filterCategory && p.category !== this.filterCategory) return false;
                return true;
            });
        }
    }
};

window.ToolsScheme = ToolsScheme;
