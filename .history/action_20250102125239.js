window.enableDragResize = function (divider, leftPane, rightPane) {
    let isDragging = false;
    let startX;
    let startLeftWidth;

    divider.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startLeftWidth = leftPane.offsetWidth;
        document.body.style.cursor = 'col-resize';
        event.preventDefault();
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - startX;
        const newLeftWidth = startLeftWidth + deltaX;

        const minWidth = 200;
        const maxWidth = window.innerWidth - 200;

        if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
            leftPane.style.flex = `0 0 ${newLeftWidth}px`;
            rightPane.style.flex = `0 0 ${window.innerWidth - newLeftWidth - divider.offsetWidth}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    });
};

window.loadSection = async function (url, queryContainerId, resultContainerId) {
    const queryContainer = document.getElementById(queryContainerId);
    const resultContainer = document.getElementById(resultContainerId);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const queryContent = doc.getElementById('query-content');
        const resultContent = doc.getElementById('result-content');

        queryContainer.innerHTML = queryContent ? queryContent.innerHTML : '';
        resultContainer.innerHTML = resultContent ? resultContent.innerHTML : '';

        const scripts = doc.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
                newScript.async = false;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            if (oldScript.type) {
                newScript.type = oldScript.type;
            }
            document.body.appendChild(newScript);
        });

        if (url.includes('visualization_options.html')) {
            initialVisual();
        }
    } catch (error) {
        console.error(error);
        queryContainer.innerHTML = '无法加载查询界面';
        resultContainer.innerHTML = '无法加载结果界面';
    }
};

function initialVisual() {
    const toggleIds = document.getElementById('toggle-ids');
    const colorBoxes = document.querySelectorAll('.color-box'); // 新增颜色选择

    // 检查开关是否存在
    if (!toggleIds) {
        console.error('Switch element not found!');
        return;
    }

    const cy = window.cy;
    if (!cy) {
        console.error('Cytoscape instance not found!');
        return;
    }

    // 序号控制功能
    toggleIds.addEventListener('change', (event) => {
        const isChecked = event.target.checked;

        // 遍历所有节点并更新标签
        cy.nodes().forEach(node => {
            const label = isChecked
                ? `${node.id()} ${node.data('label')}` // 显示序号
                : node.data('label'); // 仅显示名称
            node.style('label', label);
        });

        console.log(`显示序号状态: ${isChecked}`);
    });

    toggleIds.checked = false;
    toggleIds.dispatchEvent(new Event('change'));

    colorBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const selectedColor = box.getAttribute('data-color');
            colorBoxes.forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            cy.nodes().style('background-color', selectedColor);
            console.log(`结点颜色更新为: ${selectedColor}`);
        });
    });
}
