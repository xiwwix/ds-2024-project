console.log("data_management.js loaded!");

const uploadInput = document.getElementById('upload-data');
const downloadBtn = document.getElementById('download-json-btn');
const applyBtn = document.getElementById('apply-json-btn');
const statusText = document.getElementById('upload-status');

let formattedData = null;

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
            formattedDat(csvData);
            statusText.textContent = "状态：数据上传成功！可以下载或应用数据。";
            console.log("Formatted Data:", formattedData); 
        } catch (error) {
            statusText.textContent = `状态：上传失败 - ${error.message}`;
            // console.error("Upload Error:", error);
        }
    };
    reader.readAsText(file);
});

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

applyBtn.addEventListener('click', () => {
    if (!formattedData) {
        alert("请先上传有效数据！");
        return;
    }
    if (window.parseAndDrawGraph) {
        window.parseAndDrawGraph(formattedData, window.cy, window.graphData);
        window.cy.layout({
            name: 'breadthfirst',
            directed: true,
            spacingFactor: 1.5,
            avoidOverlap: true
        }).run();
        statusText.textContent = "状态：数据已成功应用到图形！";
    } else {
        alert("应用数据失败，请检查系统功能！");
    }
});

function CSVToJson(csvData) {
    const rows = csvData.trim().split("\n").map(row => row.split(","));
    const size = rows.length;

    if (rows.some(row => row.length !== size)) {
        throw new Error("数据格式错误：必须为 (n+1)*(n+1) 矩阵！");
    }

    const members = [];
    for (let i = 1; i < size; i++) {
        members.push({ id: i.toString(), name: rows[i][0].trim() });
    }

    const relationships = [];
    const addedEdges = new Set();

    for (let i = 1; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            const weight1 = parseInt(rows[i][j], 10); // A->B
            const weight2 = parseInt(rows[j][i], 10); // B->A

            if (isNaN(weight1) || isNaN(weight2) || weight1 < 0 || weight1 > 5 || weight2 < 0 || weight2 > 5) {
                throw new Error(`数据错误：第 ${i} 行, 第 ${j} 列的权值不合法！`);
            }

            const avgWeight = Math.ceil((weight1 + weight2) / 2);

            if (avgWeight > 0) {
                const edgeId = `${i}-${j}`;
                if (!addedEdges.has(edgeId)) {
                    relationships.push({
                        source: i.toString(),
                        target: j.toString(),
                        weight: avgWeight
                    });
                    addedEdges.add(edgeId);
                }
            }
        }
    }

    return {
        members: members,
        relationships: relationships
    };
}
