<template>
	<div class="card">
		<div style="margin-bottom: 15px">
			<el-button type="success" @click="handleOpenSendMessageDialog">发送系统消息</el-button>
			<el-button type="warning" @click="handleOpenSendNotificationDialog">发送系统公告</el-button>
		</div>

		<el-form :inline="true" :model="params" class="demo-form-inline">
			<el-form-item label="接收用户ID">
				<el-input v-model="params.userId" placeholder="请输入接收消息的用户ID" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
		</el-form>

		<el-alert v-if="!params.userId" type="info" show-icon title="提示：不输入用户ID将查询所有消息" style="margin-bottom: 10px" />

		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
				<el-table-column prop="id" label="消息ID" width="220" show-overflow-tooltip />

				<el-table-column prop="fromNickname" label="发送方昵称" width="160" show-overflow-tooltip />

				<el-table-column prop="fromFace" label="发送方头像" width="120">
					<template #default="{ row }">
						<el-image
							v-if="row.fromFace"
							:src="row.fromFace"
							style="width: 50px; height: 50px; border-radius: 50%"
							fit="cover"
							:preview-src-list="[row.fromFace]"
						/>
						<span v-else>无头像</span>
					</template>
				</el-table-column>

				<el-table-column prop="fromUserId" label="发送方ID" width="220" show-overflow-tooltip />

				<el-table-column prop="toUserId" label="接收方ID" width="220" show-overflow-tooltip />

				<el-table-column prop="msgType" label="消息类型" width="120">
					<template #default="{ row }">
						<el-tag type="info">{{ getMsgTypeText(row.msgType) }}</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="msgContent" label="消息内容" min-width="260">
					<template #default="{ row }">
						<pre style="margin: 0; white-space: pre-wrap">{{ formatMsgContent(row.msgContent, row.msgType) }}</pre>
					</template>
				</el-table-column>

				<el-table-column prop="createTime" label="创建时间" width="190">
					<template #default="{ row }">
						<span>{{ row.createTime ? new Date(row.createTime).toLocaleString() : "-" }}</span>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" :loading="editLoadingMap[row.id]" @click="handleOpenEditDialog(row)">
							编辑
						</el-button>
						<el-button type="danger" size="small" :loading="deleteLoadingMap[row.id]" @click="handleDelete(row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 编辑消息对话框 -->
		<el-dialog v-model="editDialogVisible" title="编辑消息" width="700px" :close-on-click-modal="false">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px">
				<el-form-item label="消息ID" prop="id">
					<el-input v-model="editForm.id" disabled />
				</el-form-item>
				<el-form-item label="发送者用户ID" prop="fromUserId">
					<el-input v-model="editForm.fromUserId" placeholder="请输入发送者用户ID（留空则不更新）" clearable />
				</el-form-item>
				<el-form-item label="发送者昵称" prop="fromNickname">
					<el-input v-model="editForm.fromNickname" placeholder="请输入发送者昵称（留空则不更新）" clearable />
				</el-form-item>
				<el-form-item label="发送者头像" prop="fromFace">
					<el-input v-model="editForm.fromFace" placeholder="请输入发送者头像URL（留空则不更新）" clearable />
					<el-image
						v-if="editForm.fromFace"
						:src="editForm.fromFace"
						style="width: 50px; height: 50px; border-radius: 50%; margin-top: 5px"
						fit="cover"
						:preview-src-list="[editForm.fromFace]"
					/>
				</el-form-item>
				<el-form-item label="接收者用户ID" prop="toUserId">
					<el-input v-model="editForm.toUserId" placeholder="请输入接收者用户ID（留空则不更新）" clearable />
				</el-form-item>
				<el-form-item label="消息类型" prop="msgType">
					<el-input-number v-model="editForm.msgType" :min="0" placeholder="请输入消息类型（留空则不更新）" style="width: 100%" />
				</el-form-item>
				<el-form-item label="消息内容" prop="msgContent">
					<el-input
						v-model="editForm.msgContentStr"
						type="textarea"
						:rows="6"
						placeholder='请输入消息内容（JSON格式，例如：{"key": "value"}，留空则不更新）'
						clearable
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">提示：消息内容为 JSON 格式，留空则不更新此字段</div>
				</el-form-item>
				<el-form-item label="合并消息内容" prop="mergeContent">
					<el-switch v-model="editForm.mergeContent" />
					<div style="font-size: 12px; color: #999; margin-top: 5px">
						提示：开启后将新内容合并到原有内容中，关闭则完全替换原有内容
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="editSubmitLoading" @click="handleEditSubmit">确定</el-button>
			</template>
		</el-dialog>

		<!-- 发送系统消息对话框 -->
		<el-dialog v-model="sendMessageDialogVisible" title="发送系统消息" width="700px" :close-on-click-modal="false">
			<el-form ref="sendMessageFormRef" :model="sendMessageForm" :rules="sendMessageFormRules" label-width="120px">
				<el-form-item label="接收用户ID" prop="toUserId">
					<el-input v-model="sendMessageForm.toUserId" placeholder="请输入接收消息的用户ID" clearable />
				</el-form-item>
				<el-form-item label="消息标题" prop="title">
					<el-input v-model="sendMessageForm.title" placeholder="请输入消息标题" clearable />
				</el-form-item>
				<el-form-item label="消息内容" prop="content">
					<el-input v-model="sendMessageForm.content" type="textarea" :rows="4" placeholder="请输入消息详细内容" clearable />
				</el-form-item>
				<el-form-item label="消息类型" prop="type">
					<el-input
						v-model="sendMessageForm.type"
						placeholder="请输入消息子类型（如：account_update、order_notify、system_alert）"
						clearable
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">提示：用于前端区分不同类型的系统消息</div>
				</el-form-item>
				<el-form-item label="跳转链接" prop="link">
					<el-input v-model="sendMessageForm.link" placeholder="请输入跳转链接（可选，如：/user/profile）" clearable />
				</el-form-item>
				<el-form-item label="图片URL" prop="imageUrl">
					<el-input v-model="sendMessageForm.imageUrl" placeholder="请输入图片URL（可选）" clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="sendMessageDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="sendMessageSubmitLoading" @click="handleSendMessageSubmit">确定发送</el-button>
			</template>
		</el-dialog>

		<!-- 发送系统公告对话框 -->
		<el-dialog v-model="sendNotificationDialogVisible" title="发送系统公告" width="700px" :close-on-click-modal="false">
			<el-form ref="sendNotificationFormRef" :model="sendNotificationForm" :rules="sendNotificationFormRules" label-width="120px">
				<el-form-item label="公告标题" prop="title">
					<el-input v-model="sendNotificationForm.title" placeholder="请输入公告标题" clearable />
				</el-form-item>
				<el-form-item label="公告内容" prop="content">
					<el-input v-model="sendNotificationForm.content" type="textarea" :rows="4" placeholder="请输入公告详细内容" clearable />
				</el-form-item>
				<el-form-item label="公告类型" prop="type">
					<el-input
						v-model="sendNotificationForm.type"
						placeholder="请输入公告类型（如：maintenance、activity、policy、update）"
						clearable
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">提示：用于前端区分不同类型的系统公告</div>
				</el-form-item>
				<el-form-item label="跳转链接" prop="link">
					<el-input v-model="sendNotificationForm.link" placeholder="请输入跳转链接（可选，如：/announcement/123）" clearable />
				</el-form-item>
				<el-form-item label="图片URL" prop="imageUrl">
					<el-input v-model="sendNotificationForm.imageUrl" placeholder="请输入图片URL（可选）" clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="sendNotificationDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="sendNotificationSubmitLoading" @click="handleSendNotificationSubmit"
					>确定发送</el-button
				>
			</template>
		</el-dialog>

		<div style="display: flex; justify-content: flex-end; margin-top: 10px">
			<div style="margin-right: 20px; font-size: 12px; color: #999">
				总数: {{ tableTotal }} | 当前页: {{ params.page }} | 每页: {{ params.pageSize }} | 数据条数: {{ tableData.length }}
			</div>
			<el-pagination
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-size="params.pageSize"
				:page-sizes="[10, 20, 50, 100]"
				v-model:current-page="params.page"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableTotal"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script setup name="msgMgt">
import { onMounted, onActivated, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getMsgAdminList, deleteMsg, updateMsg, sendSystemMessage, sendSystemNotification } from "@/api/msgMgt";
import { useTable } from "@/utils/tableMethod";
import { GlobalStore } from "@/stores/index";

// 包一层 API，加调试日志，方便确认是否有请求和返回什么数据
const getMsgAdminListWithDebug = async params => {
	console.log("【msgMgt】发起请求参数:", params);
	try {
		const res = await getMsgAdminList(params);
		console.log("【msgMgt】完整响应对象:", res);
		console.log("【msgMgt】res.data:", res?.data);
		console.log("【msgMgt】res.data.data (消息数组):", res?.data?.data);
		if (Array.isArray(res?.data?.data)) {
			console.log("【msgMgt】消息条数:", res.data.data.length);
		}
		return res;
	} catch (e) {
		console.error("【msgMgt】请求报错:", e);
		console.error("【msgMgt】错误详情:", e.response?.data || e.message);
		throw e;
	}
};

// 使用 useTable 统一管理分页、loading 等
const {
	params,
	tableTotal,
	tableData,
	tableLoading,
	handleSearch: baseHandleSearch,
	handleReset,
	handleSizeChange,
	handleCurrentChange
} = useTable({
	request: {
		api: getMsgAdminListWithDebug,
		// /admin/msg/list 返回的是 PagedGridResult
		// axios res.data = { status, msg, success, data: { rows: [...], records: 30, page: 1, total: 3 } }
		tableDataKey: "data.rows", // 从 res.data.data.rows 获取数据列表
		totalKey: "data.records", // 从 res.data.data.records 获取总记录数
		params: {
			userId: "", // 可选：接收消息的用户 ID，为空则查询所有消息
			page: 1, // 前端从 1 开始
			pageSize: 10
		}
	}
});

// 包一层，允许 userId 为空时查询所有消息
const handleSearch = () => {
	console.log("【msgMgt】当前查询参数 params.value:", params.value);
	console.log("【msgMgt】开始调用 baseHandleSearch");
	baseHandleSearch();
};

// 每个消息删除操作的 loading 状态
const deleteLoadingMap = reactive({});

// 编辑消息对话框相关
const editDialogVisible = ref(false);
const editFormRef = ref();
const editSubmitLoading = ref(false);
const editForm = reactive({
	id: "",
	fromUserId: "",
	fromNickname: "",
	fromFace: "",
	toUserId: "",
	msgType: undefined,
	msgContentStr: "", // 用于输入的 JSON 字符串
	mergeContent: false
});

// 编辑表单验证规则
const editFormRules = {
	id: [{ required: true, message: "消息ID不能为空", trigger: "blur" }]
};

// 每个消息编辑操作的 loading 状态
const editLoadingMap = reactive({});

// 删除消息
const handleDelete = async row => {
	if (!row || !row.id) {
		ElMessage.error("消息ID不能为空");
		return;
	}

	try {
		await ElMessageBox.confirm("确定要删除这条消息吗？删除后无法恢复。", "确认删除", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		deleteLoadingMap[row.id] = true;
		const res = await deleteMsg(row.id);

		if (res.data && res.data.success) {
			ElMessage.success("删除成功");
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "删除失败");
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error("删除消息失败:", error);
			ElMessage.error(error.response?.data?.msg || "删除失败，请稍后重试");
		}
	} finally {
		deleteLoadingMap[row.id] = false;
	}
};

// 消息内容字段映射（键名 -> 中文标签）
const MSG_CONTENT_FIELD_MAP = {
	// 关注消息
	isFriend: "是否为朋友",
	// 点赞视频
	vlogId: "视频ID",
	vlogCover: "视频封面",
	vlogTitle: "视频标题",
	// 评论相关
	commentId: "评论ID",
	commentContent: "评论内容",
	// 举报处理
	reportId: "举报ID",
	handleResult: "处理结果",
	// 系统消息/公告
	title: "标题",
	content: "内容",
	type: "类型",
	link: "跳转链接",
	imageUrl: "图片URL"
};

// 格式化 msgContent（Map）为更易读的键值对展示
const formatMsgContent = (content, msgType) => {
	if (!content) return "-";
	try {
		// 如果是字符串，尝试解析为 JSON
		if (typeof content === "string") {
			try {
				const parsed = JSON.parse(content);
				return formatMsgContent(parsed, msgType);
			} catch {
				return content;
			}
		}

		// 如果是对象，转换为键值对展示
		if (typeof content === "object" && content !== null) {
			const lines = [];
			for (const [key, value] of Object.entries(content)) {
				const label = MSG_CONTENT_FIELD_MAP[key] || key;
				let displayValue = value;

				// 处理布尔值
				if (typeof value === "boolean") {
					displayValue = value ? "是" : "否";
				}
				// 处理 null 或 undefined
				else if (value === null || value === undefined) {
					displayValue = "-";
				}
				// 处理对象或数组
				else if (typeof value === "object") {
					displayValue = JSON.stringify(value);
				}

				lines.push(`${label}：${displayValue}`);
			}
			return lines.join("\n");
		}

		return String(content);
	} catch {
		return String(content);
	}
};

// 消息类型枚举映射
const MSG_TYPE_MAP = {
	1: "关注",
	2: "点赞视频",
	3: "评论视频",
	4: "回复评论",
	5: "点赞评论",
	6: "举报处理",
	7: "系统消息",
	8: "系统公告"
};

// 获取消息类型文字
const getMsgTypeText = msgType => {
	if (msgType === null || msgType === undefined) return "-";
	return MSG_TYPE_MAP[msgType] || `未知类型(${msgType})`;
};

// 全局 store
const globalStore = GlobalStore();

// 发送系统消息对话框相关
const sendMessageDialogVisible = ref(false);
const sendMessageFormRef = ref();
const sendMessageSubmitLoading = ref(false);
const sendMessageForm = reactive({
	toUserId: "",
	title: "",
	content: "",
	type: "",
	link: "",
	imageUrl: ""
});

// 发送系统消息表单验证规则
const sendMessageFormRules = {
	toUserId: [{ required: true, message: "接收用户ID不能为空", trigger: "blur" }],
	title: [{ required: true, message: "消息标题不能为空", trigger: "blur" }],
	content: [{ required: true, message: "消息内容不能为空", trigger: "blur" }],
	type: [{ required: true, message: "消息类型不能为空", trigger: "blur" }]
};

// 发送系统公告对话框相关
const sendNotificationDialogVisible = ref(false);
const sendNotificationFormRef = ref();
const sendNotificationSubmitLoading = ref(false);
const sendNotificationForm = reactive({
	title: "",
	content: "",
	type: "",
	link: "",
	imageUrl: ""
});

// 发送系统公告表单验证规则
const sendNotificationFormRules = {
	title: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
	content: [{ required: true, message: "公告内容不能为空", trigger: "blur" }],
	type: [{ required: true, message: "公告类型不能为空", trigger: "blur" }]
};

// 打开发送系统消息对话框
const handleOpenSendMessageDialog = () => {
	sendMessageForm.toUserId = "";
	sendMessageForm.title = "";
	sendMessageForm.content = "";
	sendMessageForm.type = "";
	sendMessageForm.link = "";
	sendMessageForm.imageUrl = "";
	sendMessageDialogVisible.value = true;
	// 重置表单验证状态
	if (sendMessageFormRef.value) {
		sendMessageFormRef.value.clearValidate();
	}
};

// 打开发送系统公告对话框
const handleOpenSendNotificationDialog = () => {
	sendNotificationForm.title = "";
	sendNotificationForm.content = "";
	sendNotificationForm.type = "";
	sendNotificationForm.link = "";
	sendNotificationForm.imageUrl = "";
	sendNotificationDialogVisible.value = true;
	// 重置表单验证状态
	if (sendNotificationFormRef.value) {
		sendNotificationFormRef.value.clearValidate();
	}
};

// 提交发送系统消息
const handleSendMessageSubmit = async () => {
	if (!sendMessageFormRef.value) return;

	try {
		await sendMessageFormRef.value.validate();

		// 获取管理员ID
		const handlerId = globalStore.adminInfo?.id;
		if (!handlerId) {
			ElMessage.error("无法获取管理员信息，请重新登录");
			return;
		}

		sendMessageSubmitLoading.value = true;

		// 构建 msgContent 对象（只包含有值的字段）
		const msgContent = {};
		if (sendMessageForm.title) {
			msgContent.title = sendMessageForm.title;
		}
		if (sendMessageForm.content) {
			msgContent.content = sendMessageForm.content;
		}
		if (sendMessageForm.type) {
			msgContent.type = sendMessageForm.type;
		}
		if (sendMessageForm.link) {
			msgContent.link = sendMessageForm.link;
		}
		if (sendMessageForm.imageUrl) {
			msgContent.imageUrl = sendMessageForm.imageUrl;
		}

		// 将 msgContent 对象序列化为 JSON 字符串
		const msgContentStr = Object.keys(msgContent).length > 0 ? JSON.stringify(msgContent) : undefined;

		const res = await sendSystemMessage(handlerId, sendMessageForm.toUserId, msgContentStr);

		if (res.data && res.data.success) {
			ElMessage.success("系统消息已发送（异步处理）");
			sendMessageDialogVisible.value = false;
			// 可选：刷新列表
			// handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "发送失败");
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error("发送系统消息失败:", error);
			ElMessage.error(error.response?.data?.msg || "发送失败，请稍后重试");
		}
	} finally {
		sendMessageSubmitLoading.value = false;
	}
};

// 提交发送系统公告
const handleSendNotificationSubmit = async () => {
	if (!sendNotificationFormRef.value) return;

	try {
		await sendNotificationFormRef.value.validate();

		// 获取管理员ID
		const handlerId = globalStore.adminInfo?.id;
		if (!handlerId) {
			ElMessage.error("无法获取管理员信息，请重新登录");
			return;
		}

		// 确认发送给所有用户
		try {
			await ElMessageBox.confirm("确定要发送系统公告给所有用户吗？此操作将向所有未删除的用户发送消息。", "确认发送系统公告", {
				confirmButtonText: "确定发送",
				cancelButtonText: "取消",
				type: "warning"
			});
		} catch (error) {
			if (error === "cancel") {
				return;
			}
			throw error;
		}

		sendNotificationSubmitLoading.value = true;

		// 构建 msgContent 对象（只包含有值的字段）
		const msgContent = {};
		if (sendNotificationForm.title) {
			msgContent.title = sendNotificationForm.title;
		}
		if (sendNotificationForm.content) {
			msgContent.content = sendNotificationForm.content;
		}
		if (sendNotificationForm.type) {
			msgContent.type = sendNotificationForm.type;
		}
		if (sendNotificationForm.link) {
			msgContent.link = sendNotificationForm.link;
		}
		if (sendNotificationForm.imageUrl) {
			msgContent.imageUrl = sendNotificationForm.imageUrl;
		}

		// 将 msgContent 对象序列化为 JSON 字符串
		const msgContentStr = Object.keys(msgContent).length > 0 ? JSON.stringify(msgContent) : undefined;

		const res = await sendSystemNotification(handlerId, msgContentStr);

		if (res.data && res.data.success) {
			ElMessage.success("系统公告已发送（异步处理，将发送给所有用户）");
			sendNotificationDialogVisible.value = false;
			// 可选：刷新列表
			// handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "发送失败");
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error("发送系统公告失败:", error);
			ElMessage.error(error.response?.data?.msg || "发送失败，请稍后重试");
		}
	} finally {
		sendNotificationSubmitLoading.value = false;
	}
};

// 打开编辑对话框
const handleOpenEditDialog = row => {
	if (!row || !row.id) {
		ElMessage.error("消息ID不能为空");
		return;
	}

	// 填充表单数据
	editForm.id = row.id || "";
	editForm.fromUserId = row.fromUserId || "";
	editForm.fromNickname = row.fromNickname || "";
	editForm.fromFace = row.fromFace || "";
	editForm.toUserId = row.toUserId || "";
	editForm.msgType = row.msgType !== undefined && row.msgType !== null ? row.msgType : undefined;
	// 将 msgContent 转换为 JSON 字符串
	if (row.msgContent) {
		try {
			editForm.msgContentStr = typeof row.msgContent === "string" ? row.msgContent : JSON.stringify(row.msgContent, null, 2);
		} catch {
			editForm.msgContentStr = String(row.msgContent);
		}
	} else {
		editForm.msgContentStr = "";
	}
	editForm.mergeContent = false;

	editDialogVisible.value = true;

	// 重置表单验证状态
	if (editFormRef.value) {
		editFormRef.value.clearValidate();
	}
};

// 提交编辑
const handleEditSubmit = async () => {
	if (!editFormRef.value) return;

	try {
		await editFormRef.value.validate();

		if (!editForm.id) {
			ElMessage.error("消息ID不能为空");
			return;
		}

		editSubmitLoading.value = true;
		editLoadingMap[editForm.id] = true;

		// 构建提交数据，只包含有值的字段
		const submitData = {
			id: editForm.id
		};

		// 只添加有值的字段
		if (editForm.fromUserId) {
			submitData.fromUserId = editForm.fromUserId;
		}
		if (editForm.fromNickname) {
			submitData.fromNickname = editForm.fromNickname;
		}
		if (editForm.fromFace) {
			submitData.fromFace = editForm.fromFace;
		}
		if (editForm.toUserId) {
			submitData.toUserId = editForm.toUserId;
		}
		if (editForm.msgType !== undefined && editForm.msgType !== null) {
			submitData.msgType = editForm.msgType;
		}
		// 处理 msgContent
		if (editForm.msgContentStr && editForm.msgContentStr.trim()) {
			try {
				// 尝试解析 JSON 字符串
				submitData.msgContent = JSON.parse(editForm.msgContentStr);
			} catch (error) {
				ElMessage.error("消息内容格式错误，请输入有效的 JSON 格式");
				return;
			}
		}
		// 添加 mergeContent（即使为 false 也传递）
		submitData.mergeContent = editForm.mergeContent;

		const res = await updateMsg(submitData);

		if (res.data && res.data.success) {
			ElMessage.success("编辑成功");
			editDialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "编辑失败");
		}
	} catch (error) {
		if (error !== false) {
			// error !== false 表示不是表单验证失败
			console.error("编辑消息失败:", error);
			ElMessage.error(error.response?.data?.msg || "编辑失败，请稍后重试");
		}
	} finally {
		editSubmitLoading.value = false;
		editLoadingMap[editForm.id] = false;
	}
};

onMounted(() => {
	// 自动查询所有消息（userId 为空时查询所有）
	handleSearch();
});

// 使用 onActivated 确保每次激活页面时都自动请求（适用于 keep-alive 缓存的页面）
onActivated(() => {
	// 每次激活页面时自动请求列表
	handleSearch();
});
</script>
<style scoped>
.table-wrapper {
	overflow-x: auto;
	overflow-y: visible;
}
.table-wrapper :deep(.el-table__body-wrapper) {
	overflow-y: visible !important;
	overflow-x: auto !important;
}
</style>
