const ToolsDrawing = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">智能图审工场</h1>
                    <p class="page-desc">统一图纸检查与PDF处理平台，解决图纸印前错误频发、PDF处理耗时、规范过期引用难排查等问题</p>
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

            <!-- Tab 1: PDF处理 -->
            <div v-show="activeTab === 0">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128196;</div>
                    <div class="upload-text">上传图纸文件</div>
                    <div class="upload-hint">支持 PDF、DWG 格式，单文件不超过 200MB</div>
                </div>

                <!-- Grid: 处理工具箱 + 格式适配 -->
                <div class="grid-2" style="margin-bottom: 24px;">
                    <!-- Left: 处理工具箱 -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">处理工具箱</span>
                        </div>
                        <div class="card-body">
                            <div class="grid-3">
                                <div v-for="(tool, index) in toolbox" :key="index"
                                     style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 12px; border: 1px solid var(--gray-200); border-radius: var(--radius); cursor: pointer; transition: var(--transition);"
                                     onmouseover="this.style.borderColor='var(--primary)'; this.style.background='var(--primary-bg)'"
                                     onmouseout="this.style.borderColor='var(--gray-200)'; this.style.background='transparent'">
                                    <span style="font-size: 28px;">{{ tool.icon }}</span>
                                    <span style="font-size: 13px; font-weight: 500; color: var(--gray-700);">{{ tool.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: 格式适配 -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">格式适配</span>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label class="form-label">目标业主/地区</label>
                                <select class="form-select" v-model="formatTarget">
                                    <option value="">请选择目标业主/地区</option>
                                    <option v-for="t in formatTargets" :key="t" :value="t">{{ t }}</option>
                                </select>
                            </div>
                            <button class="btn btn-primary" style="width: 100%; margin-bottom: 20px;">一键适配</button>
                            <div style="font-size: 13px; color: var(--gray-600); font-weight: 600; margin-bottom: 12px;">将自动应用以下格式要求：</div>
                            <ul style="padding: 0; list-style: none;">
                                <li v-for="(req, index) in formatRequirements" :key="index"
                                    style="display: flex; align-items: center; gap: 8px; padding: 8px 0; font-size: 13px; color: var(--gray-700); border-bottom: 1px solid var(--gray-100);">
                                    <span style="color: var(--success); font-size: 14px;">&#10003;</span>
                                    {{ req }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 文件处理队列 -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">文件处理队列</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ fileQueue.length }} 个文件</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>文件名</th>
                                    <th>类型</th>
                                    <th>页数</th>
                                    <th>文件大小</th>
                                    <th>处理状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(file, index) in fileQueue" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ file.name }}</td>
                                    <td><span class="tag tag-blue">{{ file.type }}</span></td>
                                    <td>{{ file.pages }}</td>
                                    <td>{{ file.size }}</td>
                                    <td><span :class="['tag', 'tag-' + file.statusColor]">{{ file.status }}</span></td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">{{ file.status === '已完成' ? '下载' : '取消' }}</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 2: OCR识别 -->
            <div v-show="activeTab === 1">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128247;</div>
                    <div class="upload-text">上传扫描图纸</div>
                    <div class="upload-hint">支持 PDF、JPG、PNG 格式，建议分辨率不低于 300DPI</div>
                </div>

                <!-- 识别结果 -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">识别结果</span>
                        <button class="btn btn-outline btn-sm">导出识别报告</button>
                    </div>
                    <div class="card-body">
                        <!-- Stats -->
                        <div class="stat-card" style="margin-bottom: 20px; max-width: 400px;">
                            <div class="stat-icon blue">&#128270;</div>
                            <div class="stat-info">
                                <div class="stat-value">156 页</div>
                                <div class="stat-label">已识别</div>
                                <div class="stat-trend up">识别准确率 96.8%</div>
                            </div>
                        </div>

                        <!-- OCR Results Table -->
                        <table class="data-table" style="margin-top: 16px;">
                            <thead>
                                <tr>
                                    <th>页码</th>
                                    <th>识别内容摘要</th>
                                    <th>置信度</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in ocrResults" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">第 {{ item.page }} 页</td>
                                    <td>{{ item.summary }}</td>
                                    <td style="width: 200px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div class="progress-bar" style="flex: 1;">
                                                <div :class="['progress-fill', item.confidence >= 95 ? 'green' : item.confidence >= 85 ? 'orange' : 'red']"
                                                     :style="{ width: item.confidence + '%' }"></div>
                                            </div>
                                            <span style="font-size: 12px; color: var(--gray-500); min-width: 40px;">{{ item.confidence }}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">查看</button>
                                            <button class="btn btn-ghost btn-sm">校正</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 规范比对 -->
            <div v-show="activeTab === 2">
                <!-- Alert -->
                <div class="alert alert-info" style="margin-bottom: 24px;">
                    <span style="font-size: 16px; flex-shrink: 0;">&#8505;&#65039;</span>
                    <span>系统将自动从设计说明中提取引用的规范标准编号，并与规范标准库进行有效性比对</span>
                </div>

                <!-- Result Cards -->
                <div class="grid-4" style="margin-bottom: 24px;">
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 24px 20px;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--success); margin-bottom: 4px;">23条</div>
                            <div style="font-size: 14px; color: var(--gray-600); font-weight: 500; margin-bottom: 8px;">有效规范</div>
                            <span class="tag tag-green">全部有效</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 24px 20px;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--warning); margin-bottom: 4px;">2条</div>
                            <div style="font-size: 14px; color: var(--gray-600); font-weight: 500; margin-bottom: 8px;">即将废止</div>
                            <span class="tag tag-orange">需要关注</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 24px 20px;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--danger); margin-bottom: 4px;">1条</div>
                            <div style="font-size: 14px; color: var(--gray-600); font-weight: 500; margin-bottom: 8px;">已废止规范</div>
                            <span class="tag tag-red">需立即替换</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 24px 20px;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">1条</div>
                            <div style="font-size: 14px; color: var(--gray-600); font-weight: 500; margin-bottom: 8px;">新版推荐</div>
                            <span class="tag tag-blue">建议更新</span>
                        </div>
                    </div>
                </div>

                <!-- Standard Comparison Table -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">规范比对详情</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共检测到 27 条规范引用</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>引用规范编号</th>
                                    <th>规范名称</th>
                                    <th>当前状态</th>
                                    <th>所在位置</th>
                                    <th>建议</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(std, index) in standardList" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ std.code }}</td>
                                    <td>{{ std.name }}</td>
                                    <td><span :class="['tag', 'tag-' + std.statusColor]">{{ std.status }}</span></td>
                                    <td>{{ std.location }}</td>
                                    <td>{{ std.suggestion }}</td>
                                    <td>
                                        <div class="actions">
                                            <button v-if="std.statusColor !== 'green'" class="btn btn-ghost btn-sm">替换</button>
                                            <button class="btn btn-ghost btn-sm">详情</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 4: 质量检查 -->
            <div v-show="activeTab === 3">
                <!-- Upload Area -->
                <div class="upload-area" style="margin-bottom: 24px;">
                    <div class="upload-icon">&#128203;</div>
                    <div class="upload-text">上传待检查图纸</div>
                    <div class="upload-hint">支持 PDF 格式，系统将自动进行全面质量检查</div>
                </div>

                <!-- Check Result Stat Cards -->
                <div class="grid-4" style="margin-bottom: 24px;">
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon orange" style="width: 36px; height: 36px; font-size: 18px;">&#9888;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">图签完整性</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">通过 45/48</p>
                            <span class="tag tag-orange">3处缺失</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon green" style="width: 36px; height: 36px; font-size: 18px;">&#9989;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">图纸一致性</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">全部一致</p>
                            <span class="tag tag-green">通过</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon orange" style="width: 36px; height: 36px; font-size: 18px;">&#128207;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">尺寸标注</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">已检查全部标注</p>
                            <span class="tag tag-orange">2处遗漏</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                                <div class="stat-icon green" style="width: 36px; height: 36px; font-size: 18px;">&#128208;</div>
                                <span style="font-size: 14px; font-weight: 600; color: var(--gray-800);">图层规范</span>
                            </div>
                            <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 8px;">图层命名规范</p>
                            <span class="tag tag-green">通过</span>
                        </div>
                    </div>
                </div>

                <!-- Quality Issues Table -->
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">质量检查问题清单</span>
                        <span style="font-size: 13px; color: var(--gray-500);">共 {{ qualityIssues.length }} 项问题</span>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>检查项</th>
                                    <th>问题描述</th>
                                    <th>图纸编号</th>
                                    <th>严重等级</th>
                                    <th>修改建议</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(issue, index) in qualityIssues" :key="index">
                                    <td style="font-weight: 500; color: var(--gray-800);">{{ issue.item }}</td>
                                    <td>{{ issue.desc }}</td>
                                    <td><span class="tag tag-blue">{{ issue.drawing }}</span></td>
                                    <td><span :class="['tag', 'tag-' + issue.levelColor]">{{ issue.level }}</span></td>
                                    <td>{{ issue.suggestion }}</td>
                                    <td><span :class="['tag', 'tag-' + issue.statusColor]">{{ issue.status }}</span></td>
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
            tabs: ['PDF处理', 'OCR识别', '规范比对', '质量检查'],

            // Tab 1: PDF处理 - 工具箱
            toolbox: [
                { name: 'PDF拆分', icon: '\u2702\uFE0F' },
                { name: 'PDF排序', icon: '\u2195\uFE0F' },
                { name: 'PDF合并', icon: '\uD83D\uDCD1' },
                { name: '图签添加', icon: '\uD83C\uDFF7\uFE0F' },
                { name: '水印添加', icon: '\uD83D\uDCA7' },
                { name: '书签生成', icon: '\uD83D\uDD16' }
            ],

            // Tab 1: PDF处理 - 格式适配
            formatTarget: '',
            formatTargets: ['通用标准', 'XX市住建局', 'XX省交通厅'],
            formatRequirements: [
                '图纸幅面统一为 A3 横向',
                '图签栏格式符合业主要求',
                '图层命名遵循统一编码规则',
                '字体及标注样式标准化'
            ],

            // Tab 1: PDF处理 - 文件处理队列
            fileQueue: [
                { name: 'XX道路工程施工图设计-第一册.pdf', type: '施工图', pages: 86, size: '45.2MB', status: '已完成', statusColor: 'green' },
                { name: 'XX道路工程施工图设计-第二册.pdf', type: '施工图', pages: 72, size: '38.7MB', status: '已完成', statusColor: 'green' },
                { name: 'XX桥梁工程施工图设计-结构篇.pdf', type: '结构图', pages: 54, size: '28.3MB', status: '处理中', statusColor: 'blue' },
                { name: 'XX排水管网施工图设计.pdf', type: '排水图', pages: 38, size: '19.6MB', status: '处理中', statusColor: 'blue' },
                { name: 'XX照明工程施工图设计.pdf', type: '电气图', pages: 24, size: '12.1MB', status: '待处理', statusColor: 'gray' }
            ],

            // Tab 2: OCR识别 - 识别结果
            ocrResults: [
                { page: 1, summary: '设计总说明：本项目为XX市政道路改造工程，道路全长3.2km...', confidence: 98 },
                { page: 5, summary: '道路平面设计图：起点桩号K0+000，终点桩号K3+200...', confidence: 97 },
                { page: 12, summary: '路面结构设计：面层采用SMA-13沥青混凝土，厚度4cm...', confidence: 96 },
                { page: 18, summary: '排水工程设计说明：雨水管采用HDPE双壁波纹管...', confidence: 94 },
                { page: 23, summary: '桥梁结构设计：主桥采用预应力混凝土连续箱梁...', confidence: 89 }
            ],

            // Tab 3: 规范比对 - 规范列表
            standardList: [
                { code: 'GB 50220-95', name: '城市道路交通规划设计规范', status: '已废止', statusColor: 'red', location: '设计说明 第1.3节', suggestion: '替换为 GB 50220-95 或 CJJ 37-2012', },
                { code: 'CJJ 37-2012', name: '城市道路工程设计规范', status: '即将废止', statusColor: 'orange', location: '设计说明 第1.3节', suggestion: '关注 CJJ 37-2012(2016年版) 更新动态', },
                { code: 'JTG D60-2015', name: '公路桥涵设计通用规范', status: '即将废止', statusColor: 'orange', location: '桥梁设计说明 第2.1节', suggestion: '新版征求意见稿已发布，建议关注', },
                { code: 'GB 50014-2021', name: '室外排水设计标准', status: '新版推荐', statusColor: 'blue', location: '排水设计说明 第1.2节', suggestion: '已有 2024 局部修订版，建议更新引用', },
                { code: 'GB 50763-2012', name: '无障碍设计规范', status: '有效', statusColor: 'green', location: '设计说明 第1.4节', suggestion: '-', },
                { code: 'CJJ 152-2010', name: '城市道路交叉口规划规范', status: '有效', statusColor: 'green', location: '设计说明 第1.3节', suggestion: '-', }
            ],

            // Tab 4: 质量检查 - 问题清单
            qualityIssues: [
                { item: '图签完整性', desc: '图纸图签中缺少审定人签名', drawing: 'DL-03', level: '严重', levelColor: 'red', suggestion: '补充审定人签名或电子签章', status: '待修改', statusColor: 'orange' },
                { item: '图签完整性', desc: '图纸编号DL-15图签中设计阶段标注错误，标注为"初设"应为"施工图"', drawing: 'DL-15', level: '一般', levelColor: 'orange', suggestion: '修正图签中设计阶段为"施工图"', status: '待修改', statusColor: 'orange' },
                { item: '图签完整性', desc: '图纸比例标注缺失，图签中比例为空', drawing: 'DL-22', level: '一般', levelColor: 'orange', suggestion: '在图签中补充图纸比例信息', status: '待修改', statusColor: 'orange' },
                { item: '尺寸标注', desc: '道路横断面图中缺少路基宽度标注', drawing: 'DL-08', level: '严重', levelColor: 'red', suggestion: '补充路基宽度尺寸标注', status: '待修改', statusColor: 'orange' },
                { item: '尺寸标注', desc: '排水管道纵断面图中检查井井底标高标注遗漏', drawing: 'PS-05', level: '一般', levelColor: 'orange', suggestion: '补充检查井井底标高标注', status: '已修改', statusColor: 'green' },
                { item: '图纸一致性', desc: '总平面图与道路平面图中道路中线偏移2m', drawing: 'DL-02', level: '严重', levelColor: 'red', suggestion: '核对并统一总平面图与道路平面图的道路中线位置', status: '已修改', statusColor: 'green' }
            ]
        };
    }
};

window.ToolsDrawing = ToolsDrawing;
