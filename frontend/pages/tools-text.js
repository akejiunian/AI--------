const ToolsText = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">智能文审中心</h1>
                    <p class="page-desc">本地部署的文本审核引擎，解决合同审查耗时久、文本校审依赖经验、涉密数据不能上公有云的问题</p>
                </div>
            </div>

            <!-- Alert -->
            <div class="alert alert-success">
                <span style="font-size: 16px; flex-shrink: 0;">&#128274;</span>
                <span>本系统全部本地化部署，数据不出院内网络，满足涉密项目审查要求</span>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <div v-for="(tab, index) in tabs" :key="index"
                     :class="['tab-item', { active: activeTab === index }]"
                     @click="activeTab = index">
                    {{ tab }}
                </div>
            </div>

            <!-- Tab 1: 合同审查 -->
            <div v-show="activeTab === 0">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128196;</div>
                    <div class="upload-text">上传合同文件</div>
                    <div class="upload-hint">支持 PDF、Word 格式，单文件不超过 100MB</div>
                </div>

                <!-- 审查配置 -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <span class="card-title">审查配置</span>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">合同类型</label>
                                <select class="form-select" v-model="contractType">
                                    <option value="">请选择合同类型</option>
                                    <option v-for="t in contractTypes" :key="t" :value="t">{{ t }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">审查模式</label>
                                <select class="form-select" v-model="reviewMode">
                                    <option value="">请选择审查模式</option>
                                    <option v-for="m in reviewModes" :key="m" :value="m">{{ m }}</option>
                                </select>
                            </div>
                            <div class="form-group" style="display: flex; align-items: flex-end;">
                                <button class="btn btn-primary" style="width: 100%;">开始审查</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 合同解析结果 -->
                <div class="card" style="margin-bottom: 24px;">
                    <div class="card-header">
                        <span class="card-title">合同解析结果</span>
                    </div>
                    <div class="card-body">
                        <div class="grid-3">
                            <div class="stat-card">
                                <div class="stat-icon blue">&#128220;</div>
                                <div class="stat-info">
                                    <div class="stat-value">48条</div>
                                    <div class="stat-label">合同条款总数</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon red">&#9888;</div>
                                <div class="stat-info">
                                    <div class="stat-value" style="color: var(--danger);">5条</div>
                                    <div class="stat-label">风险条款</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon orange">&#128465;</div>
                                <div class="stat-info">
                                    <div class="stat-value" style="color: var(--warning);">2条</div>
                                    <div class="stat-label">缺失条款</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon blue">&#128179;</div>
                                <div class="stat-info">
                                    <div class="stat-value">6个</div>
                                    <div class="stat-label">付款节点</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon purple">&#9878;</div>
                                <div class="stat-info">
                                    <div class="stat-value">8处</div>
                                    <div class="stat-label">违约责任</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon green">&#128197;</div>
                                <div class="stat-info">
                                    <div class="stat-value">365天</div>
                                    <div class="stat-label">有效期</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 风险条款详情 -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">风险条款详情</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ riskClauses.length }} 条风险条款</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>条款编号</th>
                                    <th>条款类型</th>
                                    <th>风险描述</th>
                                    <th>风险等级</th>
                                    <th>修改建议</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(clause, index) in riskClauses" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ clause.id }}</td>
                                    <td>{{ clause.type }}</td>
                                    <td>{{ clause.desc }}</td>
                                    <td><span :class="['tag', 'tag-' + clause.levelColor]">{{ clause.level }}</span></td>
                                    <td>{{ clause.suggestion }}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">查看</button>
                                            <button class="btn btn-ghost btn-sm">修改</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 文本校审 -->
            <div v-show="activeTab === 1">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128221;</div>
                    <div class="upload-text">上传待校审文件</div>
                    <div class="upload-hint">支持 PDF、Word 格式，系统将自动进行全面校审</div>
                </div>

                <!-- 校审结果统计 -->
                <div class="grid-4" style="margin-bottom: 24px;">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon orange" style="width: 36px; height: 36px; font-size: 18px;">&#9998;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">错别字</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">发现 3处</p>
                            <span class="tag tag-orange">需要修正</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon red" style="width: 36px; height: 36px; font-size: 18px;">&#128214;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">规范引用</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">1处过期</p>
                            <span class="tag tag-red">需立即替换</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon green" style="width: 36px; height: 36px; font-size: 18px;">&#9989;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">格式规范</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">已检查全部格式项</p>
                            <span class="tag tag-green">通过</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon orange" style="width: 36px; height: 36px; font-size: 18px;">&#128260;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">一致性检查</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">2处不一致</p>
                            <span class="tag tag-orange">需要修正</span>
                        </div>
                    </div>
                </div>

                <!-- 校审问题清单 -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">校审问题清单</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ proofIssues.length }} 项问题</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>问题类型</th>
                                    <th>问题描述</th>
                                    <th>所在位置</th>
                                    <th>严重等级</th>
                                    <th>修改建议</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(issue, index) in proofIssues" :key="index">
                                    <td><span :class="['tag', 'tag-' + issue.typeColor]">{{ issue.type }}</span></td>
                                    <td>{{ issue.desc }}</td>
                                    <td>{{ issue.location }}</td>
                                    <td><span :class="['tag', 'tag-' + issue.levelColor]">{{ issue.level }}</span></td>
                                    <td>{{ issue.suggestion }}</td>
                                    <td><span :class="['tag', 'tag-' + issue.statusColor]">{{ issue.status }}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 审查报告 -->
            <div v-show="activeTab === 2">
                <!-- Filter Bar -->
                <div class="filter-bar">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">日期范围</label>
                        <input type="date" class="form-input" style="min-width: 160px;" />
                    </div>
                    <span style="line-height: 38px; color: var(--gray-400);">至</span>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">&nbsp;</label>
                        <input type="date" class="form-input" style="min-width: 160px;" />
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">报告类型</label>
                        <select class="form-select" style="min-width: 160px;">
                            <option value="">全部类型</option>
                            <option value="合同审查">合同审查</option>
                            <option value="文本校审">文本校审</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">审查人</label>
                        <input type="text" class="form-input" style="min-width: 140px;" placeholder="请输入审查人" />
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-primary">查询</button>
                    </div>
                </div>

                <!-- Report Table -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">审查报告列表</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ reports.length }} 份报告</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>报告编号</th>
                                    <th>报告名称</th>
                                    <th>文件名称</th>
                                    <th>审查类型</th>
                                    <th>问题总数</th>
                                    <th>致命/严重</th>
                                    <th>审查日期</th>
                                    <th>审查人</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(report, index) in reports" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ report.id }}</td>
                                    <td>{{ report.name }}</td>
                                    <td>{{ report.fileName }}</td>
                                    <td><span :class="['tag', 'tag-' + report.typeColor]">{{ report.type }}</span></td>
                                    <td>{{ report.totalIssues }}</td>
                                    <td><span style="color: var(--danger); font-weight: 600;">{{ report.critical }}</span></td>
                                    <td>{{ report.date }}</td>
                                    <td>{{ report.reviewer }}</td>
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

                <!-- Pagination -->
                <div class="pagination">
                    <button class="page-btn">&laquo;</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">&raquo;</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            activeTab: 0,
            tabs: ['合同审查', '文本校审', '审查报告'],

            // Tab 1: 合同审查
            contractType: '',
            contractTypes: ['工程总承包合同', '设计合同', '咨询合同', '施工合同'],
            reviewMode: '',
            reviewModes: ['全面审查', '风险条款重点审查', '格式审查'],

            riskClauses: [
                {
                    id: 'HT-3.2.1',
                    type: '违约金条款',
                    desc: '合同约定违约金比例为合同总价的30%，超出法律规定的上限',
                    level: '高',
                    levelColor: 'red',
                    suggestion: '建议将违约金比例调整为不超过合同总价的20%，符合《民法典》相关规定'
                },
                {
                    id: 'HT-5.1.3',
                    type: '付款条款',
                    desc: '预付款比例为5%，低于行业通常标准的10%~30%',
                    level: '中',
                    levelColor: 'orange',
                    suggestion: '建议与甲方协商将预付款比例提高至10%~30%，改善项目现金流'
                },
                {
                    id: 'HT-7.2.1',
                    type: '责任限制条款',
                    desc: '合同中乙方赔偿责任上限仅为合同总价，未包含间接损失赔偿',
                    level: '高',
                    levelColor: 'red',
                    suggestion: '建议增加间接损失的赔偿范围说明，明确不可抗力情形下的责任分担'
                },
                {
                    id: 'HT-8.1.2',
                    type: '知识产权条款',
                    desc: '合同未明确设计成果的知识产权归属，存在权属纠纷风险',
                    level: '高',
                    levelColor: 'red',
                    suggestion: '建议补充知识产权归属条款，明确设计成果的著作权归设计方所有'
                },
                {
                    id: 'HT-9.3.1',
                    type: '争议解决条款',
                    desc: '争议解决方式仅约定诉讼，未约定仲裁等替代方式',
                    level: '中',
                    levelColor: 'orange',
                    suggestion: '建议增加仲裁条款作为争议解决的备选方式，缩短争议解决周期'
                }
            ],

            // Tab 2: 文本校审
            proofIssues: [
                { type: '错别字', typeColor: 'orange', desc: '"勘察"误写为"堪察"', location: '第2页 第3段', level: '一般', levelColor: 'orange', suggestion: '将"堪察"修正为"勘察"', status: '待修改', statusColor: 'orange' },
                { type: '错别字', typeColor: 'orange', desc: '"钢筋混凝土"误写为"钢筋砼凝土"', location: '第5页 第1段', level: '一般', levelColor: 'orange', suggestion: '将"钢筋砼凝土"修正为"钢筋混凝土"', status: '待修改', statusColor: 'orange' },
                { type: '错别字', typeColor: 'orange', desc: '"抗震设防烈度"误写为"抗震设防裂度"', location: '第8页 表3-2', level: '一般', levelColor: 'orange', suggestion: '将"裂度"修正为"烈度"', status: '已修改', statusColor: 'green' },
                { type: '规范引用', typeColor: 'red', desc: '引用的 GB 50011-2010 已被 GB 50011-2010(2016年版) 替代', location: '第1页 第2.1节', level: '严重', levelColor: 'red', suggestion: '将 GB 50011-2010 更新为 GB 50011-2010(2016年版)', status: '待修改', statusColor: 'orange' },
                { type: '一致性', typeColor: 'blue', desc: '设计说明中道路总长度为3.2km，图纸标注为3.5km，数据不一致', location: '设计说明 / 道路平面图', level: '严重', levelColor: 'red', suggestion: '核对道路总长度数据，确保设计说明与图纸标注一致', status: '待修改', statusColor: 'orange' },
                { type: '一致性', typeColor: 'blue', desc: '工程量清单中路基挖方量为12500m³，说明中为12000m³', location: '工程量清单 / 设计说明', level: '一般', levelColor: 'orange', suggestion: '核对路基挖方量数据，统一工程量清单与设计说明中的数据', status: '已修改', statusColor: 'green' },
                { type: '格式规范', typeColor: 'green', desc: '全部格式检查项均已通过，符合院标文件格式要求', location: '全文', level: '无', levelColor: 'gray', suggestion: '-', status: '通过', statusColor: 'green' },
                { type: '格式规范', typeColor: 'green', desc: '图纸图签信息完整，签章齐全，日期填写规范', location: '全部图纸', level: '无', levelColor: 'gray', suggestion: '-', status: '通过', statusColor: 'green' }
            ],

            // Tab 3: 审查报告
            reports: [
                { id: 'RPT-2026-0401', name: 'XX道路改造工程合同审查报告', fileName: 'XX道路改造工程施工合同.pdf', type: '合同审查', typeColor: 'blue', totalIssues: 12, critical: 3, date: '2026-04-01', reviewer: '张工' },
                { id: 'RPT-2026-0328', name: 'XX桥梁工程施工图文本校审报告', fileName: 'XX桥梁工程施工图设计说明.docx', type: '文本校审', typeColor: 'purple', totalIssues: 8, critical: 1, date: '2026-03-28', reviewer: '李工' },
                { id: 'RPT-2026-0325', name: 'XX排水管网设计合同审查报告', fileName: 'XX排水管网设计合同.pdf', type: '合同审查', typeColor: 'blue', totalIssues: 6, critical: 2, date: '2026-03-25', reviewer: '王工' },
                { id: 'RPT-2026-0320', name: 'XX照明工程施工图文本校审报告', fileName: 'XX照明工程施工图设计说明.pdf', type: '文本校审', typeColor: 'purple', totalIssues: 4, critical: 0, date: '2026-03-20', reviewer: '赵工' },
                { id: 'RPT-2026-0315', name: 'XX综合管廊工程合同审查报告', fileName: 'XX综合管廊工程总承包合同.pdf', type: '合同审查', typeColor: 'blue', totalIssues: 15, critical: 5, date: '2026-03-15', reviewer: '张工' },
                { id: 'RPT-2026-0310', name: 'XX污水处理厂可研报告校审报告', fileName: 'XX污水处理厂可研报告.docx', type: '文本校审', typeColor: 'purple', totalIssues: 10, critical: 2, date: '2026-03-10', reviewer: '李工' }
            ]
        };
    }
};

window.ToolsText = ToolsText;
