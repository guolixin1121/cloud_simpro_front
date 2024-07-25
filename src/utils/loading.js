let loadingEle = null

const showLoading = (tip = '加载中') => {
    if(loadingEle) return
    
    const icon = `<span class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span>`
    const element = document.createElement('div')
    element.className = 'loading-mask'
    element.innerHTML = icon + `<span style="margin-left: 8px">${tip}</span>` 
    document.body.appendChild(element)
    loadingEle = element
}

const hideLoading = () => loadingEle && document.body.removeChild(loadingEle)

export {
    showLoading,
    hideLoading
}