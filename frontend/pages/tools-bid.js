const ToolsBid = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">智能标书中心</h1>
                    <p class="page-desc">投标文件自动编制系统，解决投标文件编制耗时长、质量参差不齐、经验难以复用的核心痛点</p>
                </div>
            </div>

            <!-- Steps -->
            <div class="steps">
                <div class="step active">
                    <div class="step-num">1</div>
                    <div class="step-text">上传招标文件</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-num">2</div>
                    <div class="step-text">AI解析与生成</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-num">3</div>
                    <div class="step-text">人工审核修改</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-num">4</div>
                    <div class="step-text">质量检查导出</div>
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

            <!-- Tab 1: 标书生成 -->
            <div v-show="activeTab === 0">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128196;</div>
                    <div class="upload-text">上传招标文件</div>
                    <div class="upload-hint">支持 PDF、Word 格式，单文件不超过 100MB</div>
                </div>

                <!-- 生成配置 -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <span class="card-title">生成配置</span>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">项目类型</label>
                                <select class="form-select" v-model="config.projectType">
                                    <option value="">请选择项目类型</option>
                                    <option v-for="t in projectTypes" :key="t" :value="t">{{ t }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">标书模板</label>
                                <select class="form-select" v-model="config.template">
                                    <option value="">请选择标书模板</option>
                                    <option v-for="t in templates" :key="t" :value="t">{{ t }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">技术方案风格</label>
                                <select class="form-select" v-model="config.style">
                                    <option value="">请选择风格</option>
                                    <option v-for="s in styles" :key="s" :value="s">{{ s }}</option>
                                </select>
                            </div>
                        </div>
                        <div style="margin-top: 8px;">
                            <button class="btn btn-primary btn-lg">开始生成</button>
                        </div>
                    </div>
                </div>

                <!-- 生成进度 -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">生成进度</span>
                    </div>
                    <div class="card-body">
                        <div v-for="(item, index) in progressItems" :key="index"
                             style="margin-bottom: 20px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 14px; font-weight: 500; color: var(--gray-800);">{{ item.name }}</span>
                                <span style="font-size: 13px; color: var(--gray-500);">{{ item.percent }}%</span>
                            </div>
                            <div class="progress-bar">
                                <div :class="['progress-fill', item.color]" :style="{ width: item.percent + '%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 模板管理 -->
            <div v-show="activeTab === 1">
                <!-- Filter Bar -->
                <div class="filter-bar">
                    <select class="form-select" style="min-width: 160px;">
                        <option value="">全部项目类型</option>
                        <option v-for="t in projectTypes" :key="t" :value="t">{{ t }}</option>
                    </select>
                    <button class="btn btn-primary">+ 新建模板</button>
                </div>

                <!-- Template Table -->
                <div class="card">
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>模板名称</th>
                                    <th>项目类型</th>
                                    <th>章节数</th>
                                    <th>创建日期</th>
                                    <th>更新日期</th>
                                    <th>使用次数</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(tpl, index) in templateList" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ tpl.name }}</td>
                                    <td><span :class="['tag', 'tag-' + tpl.tagColor]">{{ tpl.type }}</span></td>
                                    <td>{{ tpl.chapters }}</td>
                                    <td>{{ tpl.createDate }}</td>
                                    <td>{{ tpl.updateDate }}</td>
                                    <td>{{ tpl.useCount }}次</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">编辑</button>
                                            <button class="btn btn-ghost btn-sm">预览</button>
                                            <button class="btn btn-ghost btn-sm" style="color: var(--danger);">删除</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 质量检查 -->
            <div v-show="activeTab === 2">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128196;</div>
                    <div class="upload-text">上传已完成的标书文件</div>
                    <div class="upload-hint">支持 PDF、Word 格式，系统将自动进行质量检查</div>
                </div>

                <!-- Check Result Cards -->
                <div class="grid-3" style="margin-bottom: 24px;">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon orange" style="width: 36px; height: 36px; font-size: 18px;">&#9888;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">响应性检查</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">已检查 48/52 项</p>
                            <span class="tag tag-orange">4项未响应</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon green" style="width: 36px; height: 36px; font-size: 18px;">&#9989;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">废标条款排查</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">已检查全部废标条款</p>
                            <span class="tag tag-green">未发现废标风险</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon orange" style="width: 36px; height: 36px; font-size: 18px;">&#9998;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">格式规范性</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">已检查格式要求</p>
                            <span class="tag tag-orange">3处格式问题</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon green" style="width: 36px; height: 36px; font-size: 18px;">&#128200;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">内容一致性</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">已检查前后数据一致性</p>
                            <span class="tag tag-green">数据一致性良好</span>
                        </div>
                    </div>
                </div>

                <!-- Issues Table -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">检查问题清单</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ issues.length }} 项</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>检查项</th>
                                    <th>问题描述</th>
                                    <th>严重等级</th>
                                    <th>所在章节</th>
                                    <th>修改建议</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(issue, index) in issues" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ issue.item }}</td>
                                    <td>{{ issue.desc }}</td>
                                    <td><span :class="['tag', 'tag-' + issue.levelColor]">{{ issue.level }}</span></td>
                                    <td>{{ issue.chapter }}</td>
                                    <td>{{ issue.suggestion }}</td>
                                    <td><span :class="['tag', 'tag-' + issue.statusColor]">{{ issue.status }}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 4: 标书管理 -->
            <div v-show="activeTab === 3">
                <!-- Toolbar -->
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary">+ 新建标书</button>
                    </div>
                    <div class="toolbar-right">
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ bidList.length }} 份标书</span>
                    </div>
                </div>

                <!-- Bid List Table -->
                <div class="card">
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>标书名称</th>
                                    <th>项目名称</th>
                                    <th>项目类型</th>
                                    <th>编制人</th>
                                    <th>创建日期</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(bid, index) in bidList" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ bid.name }}</td>
                                    <td>{{ bid.project }}</td>
                                    <td><span class="tag tag-blue">{{ bid.type }}</span></td>
                                    <td>{{ bid.author }}</td>
                                    <td>{{ bid.date }}</td>
                                    <td><span :class="['tag', 'tag-' + bid.statusColor]">{{ bid.status }}</span></td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">查看</button>
                                            <button class="btn btn-ghost btn-sm">编辑</button>
                                            <button class="btn btn-ghost btn-sm">导出</button>
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
            tabs: ['标书生成', '模板管理', '质量检查', '标书管理'],

            // Tab 1: 标书生成
            projectTypes: ['市政道路', '桥梁工程', '排水工程', '城市规划', '照明工程'],
            templates: ['通用市政标书模板', '道路工程专用模板', '桥梁工程专用模板'],
            styles: ['详细技术型', '简明实用型', '创新突出型'],
            config: {
                projectType: '',
                template: '',
                style: ''
            },
            progressItems: [
                { name: '招标文件解析', percent: 100, color: 'green' },
                { name: '技术方案生成', percent: 75, color: 'blue' },
                { name: '商务文件编制', percent: 40, color: 'blue' },
                { name: '资格审查整理', percent: 10, color: 'blue' },
                { name: '标书排版与整合', percent: 0, color: '' }
            ],

            // Tab 2: 模板管理
            templateList: [
                { name: '通用市政标书模板', type: '市政道路', tagColor: 'blue', chapters: 28, createDate: '2026-01-15', updateDate: '2026-03-20', useCount: 56 },
                { name: '道路工程专用模板', type: '市政道路', tagColor: 'blue', chapters: 32, createDate: '2026-02-10', updateDate: '2026-03-28', useCount: 38 },
                { name: '桥梁工程专用模板', type: '桥梁工程', tagColor: 'orange', chapters: 35, createDate: '2025-11-20', updateDate: '2026-03-15', useCount: 29 },
                { name: '排水工程标书模板', type: '排水工程', tagColor: 'green', chapters: 26, createDate: '2025-12-05', updateDate: '2026-02-18', useCount: 22 },
                { name: '照明工程投标模板', type: '照明工程', tagColor: 'purple', chapters: 24, createDate: '2026-01-28', updateDate: '2026-03-25', useCount: 15 }
            ],

            // Tab 3: 质量检查
            issues: [
                { item: '响应性检查', desc: '未提供项目经理安全生产考核合格证书扫描件', level: '严重', levelColor: 'red', chapter: '第六章 资格审查', suggestion: '补充上传项目经理安全生产考核合格证书扫描件', status: '待修改', statusColor: 'orange' },
                { item: '响应性检查', desc: '技术方案中缺少施工组织设计中的安全文明施工措施', level: '严重', levelColor: 'red', chapter: '第三章 技术方案', suggestion: '在施工组织设计中补充安全文明施工措施专节', status: '待修改', statusColor: 'orange' },
                { item: '格式规范性', desc: '目录页码与正文页码不一致，第三章页码标注错误', level: '一般', levelColor: 'orange', chapter: '目录', suggestion: '更新目录页码，确保与正文一致', status: '待修改', statusColor: 'orange' },
                { item: '格式规范性', desc: '投标函落款处缺少法定代表人签字或盖章', level: '严重', levelColor: 'red', chapter: '第八章 投标函', suggestion: '在投标函落款处补充法定代表人签字或加盖公章', status: '已修改', statusColor: 'green' },
                { item: '响应性检查', desc: '工期承诺未按照招标文件要求的格式填写', level: '一般', levelColor: 'orange', chapter: '第六章 资格审查', suggestion: '按照招标文件要求的工期承诺格式重新填写', status: '已修改', statusColor: 'green' },
                { item: '内容一致性', desc: '技术方案中工程量与商务报价清单中数量不一致', level: '一般', levelColor: 'orange', chapter: '第三章 / 第四章', suggestion: '核对技术方案与商务报价中的工程量数据，保持一致', status: '已确认', statusColor: 'blue' }
            ],

            // Tab 4: 标书管理
            bidList: [
                { name: 'XX市政道路改造工程标书', project: 'XX市政道路改造工程', type: '市政道路', author: '张工', date: '2026-03-25', status: '编制中', statusColor: 'orange' },
                { name: 'XX跨河大桥施工标书', project: 'XX跨河大桥新建工程', type: '桥梁工程', author: '李工', date: '2026-03-20', status: '审核中', statusColor: 'blue' },
                { name: 'XX排水管网完善工程标书', project: 'XX排水管网完善工程', type: '排水工程', author: '王工', date: '2026-03-15', status: '已完成', statusColor: 'green' },
                { name: 'XX道路照明提升工程标书', project: 'XX道路照明提升工程', type: '照明工程', author: '赵工', date: '2026-03-10', status: '已完成', statusColor: 'green' },
                { name: 'XX城市综合管廊工程标书', project: 'XX城市综合管廊工程', type: '市政道路', author: '张工', date: '2026-02-28', status: '已归档', statusColor: 'gray' },
                { name: 'XX污水处理厂扩容工程标书', project: 'XX污水处理厂扩容工程', type: '排水工程', author: '李工', date: '2026-02-15', status: '已归档', statusColor: 'gray' }
            ]
        };
    }
};

window.ToolsBid = ToolsBid;
