const System = {
    template: `
        <div class="page">
            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1 class="page-title">系统管理</h1>
                    <p class="page-desc">平台配置、用户管理、安全审计与系统监控</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <div :class="['tab-item', { active: activeTab === 'users' }]" @click="activeTab = 'users'">用户管理</div>
                <div :class="['tab-item', { active: activeTab === 'roles' }]" @click="activeTab = 'roles'">权限配置</div>
                <div :class="['tab-item', { active: activeTab === 'audit' }]" @click="activeTab = 'audit'">安全审计</div>
                <div :class="['tab-item', { active: activeTab === 'monitor' }]" @click="activeTab = 'monitor'">系统监控</div>
            </div>

            <!-- Tab 1: 用户管理 -->
            <div v-if="activeTab === 'users'">
                <div class="card">
                    <div class="card-body">
                        <!-- Toolbar -->
                        <div class="toolbar">
                            <div class="toolbar-left">
                                <button class="btn btn-primary">&#43; 新增用户</button>
                                <button class="btn btn-outline">批量导入</button>
                            </div>
                            <div class="toolbar-right">
                                <input class="form-input" placeholder="搜索用户姓名、用户名..." style="width: 260px;" />
                            </div>
                        </div>

                        <!-- Table -->
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>用户姓名</th>
                                    <th>用户名</th>
                                    <th>角色</th>
                                    <th>所属分院</th>
                                    <th>联系电话</th>
                                    <th>最后登录</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.username">
                                    <td><strong>{{ user.name }}</strong></td>
                                    <td>{{ user.username }}</td>
                                    <td><span :class="['tag', user.roleTag]">{{ user.role }}</span></td>
                                    <td>{{ user.branch }}</td>
                                    <td>{{ user.phone }}</td>
                                    <td>{{ user.lastLogin }}</td>
                                    <td><span :class="['tag', user.status === '启用' ? 'tag-green' : 'tag-gray']">{{ user.status }}</span></td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">编辑</button>
                                            <button class="btn btn-ghost btn-sm">重置密码</button>
                                            <button class="btn btn-ghost btn-sm" style="color: var(--danger);">禁用</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Pagination -->
                        <div class="pagination">
                            <button class="page-btn">&laquo;</button>
                            <button :class="['page-btn', { active: userPage === 1 }]" @click="userPage = 1">1</button>
                            <button class="page-btn" @click="userPage = 2">2</button>
                            <button class="page-btn">&raquo;</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: 权限配置 -->
            <div v-if="activeTab === 'roles'">
                <div class="alert alert-info">
                    <span>&#128712;</span>
                    <span>基于角色的访问控制(RBAC)，为不同角色分配功能权限与数据权限</span>
                </div>

                <div class="card">
                    <div class="card-body">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>角色名称</th>
                                    <th>角色描述</th>
                                    <th>用户数</th>
                                    <th>功能权限数</th>
                                    <th>数据范围</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="role in roles" :key="role.name">
                                    <td><strong>{{ role.name }}</strong></td>
                                    <td>{{ role.desc }}</td>
                                    <td>{{ role.userCount }}</td>
                                    <td>{{ role.permCount }}</td>
                                    <td><span :class="['tag', role.scopeTag]">{{ role.scope }}</span></td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn btn-ghost btn-sm">编辑</button>
                                            <button class="btn btn-ghost btn-sm">查看权限</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab 3: 安全审计 -->
            <div v-if="activeTab === 'audit'">
                <div class="card">
                    <div class="card-body">
                        <!-- Filter Bar -->
                        <div class="filter-bar">
                            <input class="form-input" type="date" v-model="auditDateStart" title="开始日期" />
                            <input class="form-input" type="date" v-model="auditDateEnd" title="结束日期" />
                            <select class="form-select" v-model="auditType">
                                <option value="">全部</option>
                                <option value="登录">登录</option>
                                <option value="数据修改">数据修改</option>
                                <option value="文件下载">文件下载</option>
                                <option value="系统配置">系统配置</option>
                            </select>
                            <input class="form-input" placeholder="操作人" style="width: 160px;" />
                            <button class="btn btn-primary btn-sm">查询</button>
                            <button class="btn btn-outline btn-sm">重置</button>
                        </div>

                        <!-- Table -->
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>操作人</th>
                                    <th>操作类型</th>
                                    <th>操作内容</th>
                                    <th>IP地址</th>
                                    <th>结果</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="log in auditLogs" :key="log.id">
                                    <td>{{ log.time }}</td>
                                    <td>{{ log.user }}</td>
                                    <td><span :class="['tag', log.typeTag]">{{ log.type }}</span></td>
                                    <td>{{ log.content }}</td>
                                    <td>{{ log.ip }}</td>
                                    <td><span :class="['tag', log.success ? 'tag-green' : 'tag-red']">{{ log.success ? '成功' : '失败' }}</span></td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Pagination -->
                        <div class="pagination">
                            <button class="page-btn">&laquo;</button>
                            <button :class="['page-btn', { active: auditPage === 1 }]" @click="auditPage = 1">1</button>
                            <button class="page-btn" @click="auditPage = 2">2</button>
                            <button class="page-btn" @click="auditPage = 3">3</button>
                            <button class="page-btn">&raquo;</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 4: 系统监控 -->
            <div v-if="activeTab === 'monitor'">
                <!-- Stat Grid -->
                <div class="stat-grid">
                    <div class="stat-card" v-for="s in monitorStats" :key="s.label">
                        <div :class="['stat-icon', s.color]" v-html="s.icon"></div>
                        <div class="stat-info">
                            <div class="stat-value">{{ s.value }}</div>
                            <div class="stat-label">{{ s.label }}</div>
                        </div>
                    </div>
                </div>

                <!-- Grid 2: Service Status + Recent Alerts -->
                <div class="grid-2">
                    <!-- Service Status -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">服务状态</span>
                        </div>
                        <div class="card-body">
                            <div v-for="svc in services" :key="svc.name"
                                 style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--gray-100);">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="width: 10px; height: 10px; border-radius: 50%; display: inline-block;"
                                          :style="{ background: svc.status === '正常运行' ? 'var(--success)' : 'var(--warning)' }"></span>
                                    <span style="font-size: 14px; font-weight: 500; color: var(--gray-800);">{{ svc.name }}</span>
                                </div>
                                <span :class="['tag', svc.status === '正常运行' ? 'tag-green' : 'tag-orange']">{{ svc.status }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Alerts -->
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">近期告警</span>
                        </div>
                        <div class="card-body">
                            <div class="timeline">
                                <div class="timeline-item" v-for="(alert, index) in recentAlerts" :key="index">
                                    <div :class="['timeline-dot', alert.dotClass]"></div>
                                    <div class="timeline-title">{{ alert.title }}</div>
                                    <div class="timeline-time">{{ alert.time }}</div>
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
            activeTab: 'users',
            userPage: 1,
            auditPage: 1,
            auditDateStart: '',
            auditDateEnd: '',
            auditType: '',

            // Tab 1: Users
            users: [
                { name: '张建国', username: 'zhangjianguo', role: '院长', roleTag: 'tag-blue', branch: '全院', phone: '138****1001', lastLogin: '2026-04-03 09:15', status: '启用' },
                { name: '李明华', username: 'liminghua', role: '道路分院总工', roleTag: 'tag-blue', branch: '一院', phone: '138****1002', lastLogin: '2026-04-03 08:42', status: '启用' },
                { name: '王立强', username: 'wangliqiang', role: '项目负责人', roleTag: 'tag-orange', branch: '一院', phone: '139****2003', lastLogin: '2026-04-02 17:30', status: '启用' },
                { name: '陈小红', username: 'chenxiaohong', role: '设计工程师', roleTag: 'tag-green', branch: '二院', phone: '137****3004', lastLogin: '2026-04-03 09:01', status: '启用' },
                { name: '刘志远', username: 'liuzhiyuan', role: '校审人员', roleTag: 'tag-purple', branch: '三院', phone: '136****5005', lastLogin: '2026-04-01 16:22', status: '启用' },
                { name: '赵丽', username: 'zhaoli', role: '知识管理员', roleTag: 'tag-blue', branch: '全院', phone: '135****6006', lastLogin: '2026-04-03 07:55', status: '启用' },
                { name: '周大明', username: 'zhoudaming', role: '设计工程师', roleTag: 'tag-green', branch: '四院', phone: '138****7007', lastLogin: '2026-03-28 14:10', status: '禁用' },
                { name: '吴思远', username: 'wusiyuan', role: '系统管理员', roleTag: 'tag-purple', branch: '全院', phone: '139****8008', lastLogin: '2026-04-03 09:20', status: '启用' }
            ],

            // Tab 2: Roles
            roles: [
                { name: '院长/总工', desc: '拥有全院最高管理权限，可查看所有分院项目数据', userCount: 3, permCount: 128, scope: '全院数据', scopeTag: 'tag-blue' },
                { name: '分院总工', desc: '管理本分院技术质量，可查看本分院所有项目', userCount: 8, permCount: 96, scope: '本院数据', scopeTag: 'tag-green' },
                { name: '项目负责人', desc: '负责具体项目的设计管理与进度控制', userCount: 35, permCount: 72, scope: '所属项目', scopeTag: 'tag-orange' },
                { name: '设计工程师', desc: '执行项目设计任务，使用各类智能工具', userCount: 186, permCount: 56, scope: '参与项目', scopeTag: 'tag-orange' },
                { name: '校审人员', desc: '负责图纸与文档的校对审核工作', userCount: 24, permCount: 64, scope: '待审项目', scopeTag: 'tag-green' },
                { name: '知识管理员', desc: '维护技术库、校审库与项目库的内容', userCount: 6, permCount: 88, scope: '知识库全量', scopeTag: 'tag-purple' },
                { name: '系统管理员', desc: '平台运维与系统配置管理', userCount: 2, permCount: 156, scope: '全院数据', scopeTag: 'tag-blue' }
            ],

            // Tab 3: Audit Logs
            auditLogs: [
                { id: 1, time: '2026-04-03 09:20:15', user: '吴思远', type: '系统配置', typeTag: 'tag-purple', content: '修改系统参数：最大上传文件大小调整为200MB', ip: '192.168.1.100', success: true },
                { id: 2, time: '2026-04-03 09:15:03', user: '张建国', type: '登录', typeTag: 'tag-blue', content: '用户登录系统', ip: '192.168.1.10', success: true },
                { id: 3, time: '2026-04-03 09:01:42', user: '陈小红', type: '登录', typeTag: 'tag-blue', content: '用户登录系统', ip: '192.168.2.55', success: true },
                { id: 4, time: '2026-04-03 08:58:30', user: '未知用户', type: '登录', typeTag: 'tag-blue', content: '登录失败：用户名或密码错误', ip: '10.0.5.201', success: false },
                { id: 5, time: '2026-04-03 08:42:18', user: '李明华', type: '数据修改', typeTag: 'tag-orange', content: '更新项目PRJ-2026-0389设计进度为"施工图阶段"', ip: '192.168.1.22', success: true },
                { id: 6, time: '2026-04-03 08:30:05', user: '赵丽', type: '文件下载', typeTag: 'tag-green', content: '批量下载规范文档：GB 50014-2021等12份', ip: '192.168.1.35', success: true },
                { id: 7, time: '2026-04-03 07:55:10', user: '赵丽', type: '登录', typeTag: 'tag-blue', content: '用户登录系统', ip: '192.168.1.35', success: true },
                { id: 8, time: '2026-04-02 22:15:33', user: '系统', type: '系统配置', typeTag: 'tag-purple', content: '执行自动数据库备份任务', ip: '127.0.0.1', success: true },
                { id: 9, time: '2026-04-02 18:40:22', user: '刘志远', type: '数据修改', typeTag: 'tag-orange', content: '提交校审意见：XX桥梁施工图图纸审查，3项问题', ip: '192.168.3.18', success: true },
                { id: 10, time: '2026-04-02 17:30:08', user: '王立强', type: '文件下载', typeTag: 'tag-green', content: '下载项目成果文件：XX道路初设图纸.pdf (45MB)', ip: '192.168.1.45', success: true }
            ],

            // Tab 4: Monitor Stats
            monitorStats: [
                { label: '系统运行时间', value: '128天', icon: '&#9201;', color: 'green' },
                { label: 'CPU使用率', value: '23%', icon: '&#9881;', color: 'blue' },
                { label: '内存使用', value: '64.2GB/128GB', icon: '&#128190;', color: 'blue' },
                { label: '磁盘使用', value: '2.1TB/4TB', icon: '&#128451;', color: 'orange' },
                { label: '在线用户', value: '86人', icon: '&#128101;', color: 'green' },
                { label: '今日请求', value: '12,856', icon: '&#128200;', color: 'purple' }
            ],

            // Tab 4: Services
            services: [
                { name: 'LLM推理引擎', status: '正常运行' },
                { name: '向量检索引擎', status: '正常运行' },
                { name: 'OCR识别引擎', status: '正常运行' },
                { name: '文档解析引擎', status: '维护中' }
            ],

            // Tab 4: Recent Alerts
            recentAlerts: [
                { title: '文档解析引擎响应超时', time: '10分钟前', dotClass: 'active' },
                { title: '磁盘使用率超过80%', time: '2小时前', dotClass: '' },
                { title: '用户批量导入完成', time: '1天前', dotClass: 'done' },
                { title: '系统备份完成', time: '1天前', dotClass: 'done' }
            ]
        };
    },
    computed: {},
    methods: {}
};

window.System = System;
