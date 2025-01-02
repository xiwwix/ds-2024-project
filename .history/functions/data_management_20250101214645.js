console.log("data_management.js loaded!"); // 确保脚本加载成功

// 获取 DOM 元素
const uploadInput = document.getElementById('upload-data');
const downloadBtn = document.getElementById('download-json-btn');
const applyBtn = document.getElementById('apply-json-btn');
const statusText = document.getElementById('upload-status');

// 全局变量存储 JSON 数据
let formattedData = null;

// 上传数据
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        statusText.textContent = "状态：未选择文件";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvData = e.target.result;
            formattedData = parseCSVToJson(csvData); // 调用转换函数
            statusText.textContent = "状态：数据上传成功！可以下载或应用数据。";
            console.log("Formatted Data:", formattedData); // 控制台输出转换结果
        } catch (error) {
            statusText.textContent = `状态：上传失败 - ${error.message}`;
            console.error("Upload Error:", error); // 打印具体错误信息
        }
    };
    reader.readAsText(file);
});

// 下载 JSON 数据
downloadBtn.addEventListener('click', () => {
    if (!formattedData) {
        alert("请先上传有效数据！");
        return;
    }
    const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted_data.json';
    link.click();
});

// 应用 JSON 数据到图
applyBtn.addEventListener('click', () => {
    if (!formattedData) {
        alert("请先上传有效数据！");
        return;
    }
    if (window.parseAndDrawGraph) {
        // 应用数据并设置布局
        window.parseAndDrawGraph(formattedData, window.cy, window.graphData);
        window.cy.layout({
            name: 'breadthfirst', // 使用层次布局
            directed: true,
            spacingFactor: 1.5,
            avoidOverlap: true
        }).run(); // 强制执行布局
        statusText.textContent = "状态：数据已成功应用到图形！";
    } else {
        alert("应用数据失败，请检查系统功能！");
    }
});


// CSV 转 JSON 转换函数
function parseCSVToJson(csvData) {
    const rows = csvData.trim().split("\n").map(row => row.split(","));

    // 获取矩阵大小
    const size = rows.length;

    // 检查格式是否符合要求
    if (rows.some(row => row.length !== size)) {
        throw new Error("数据格式错误：必须为 (n+1)*(n+1) 矩阵！");
    }

    // 提取成员名称
    const members = [];
    for (let i = 1; i < size; i++) {
        members.push({ id: i.toString(), name: rows[i][0].trim() });
    }

    // 提取关系数据
    const relationships = [];
    const addedEdges = new Set(); // 记录已处理的边，防止重复

    for (let i = 1; i < size; i++) {
        for (let j = i + 1; j < size; j++) { // 只处理上三角矩阵，确保双向边只添加一次
            const weight1 = parseInt(rows[i][j], 10); // A->B
            const weight2 = parseInt(rows[j][i], 10); // B->A

            // 检查权值是否合法
            if (isNaN(weight1) || isNaN(weight2) || weight1 < 0 || weight1 > 5 || weight2 < 0 || weight2 > 5) {
                throw new Error(`数据错误：第 ${i} 行, 第 ${j} 列的权值不合法！`);
            }

            // 计算平均值（上取整）
            const avgWeight = Math.ceil((weight1 + weight2) / 2);

            // 如果平均值大于 0，则建立边
            if (avgWeight > 0) {
                const edgeId = `${i}-${j}`; // 使用组合键记录已处理的边
                if (!addedEdges.has(edgeId)) {
                    relationships.push({
                        source: i.toString(),
                        target: j.toString(),
                        weight: avgWeight
                    });
                    addedEdges.add(edgeId); // 标记边已处理
                }
            }
        }
    }

    // 返回 JSON 数据
    return {
        members: members,
        relationships: relationships
    };
}
