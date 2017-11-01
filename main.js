class Zoopic {
  constructor(el) {
    if (typeof el === 'string') el = document.querySelector(el)
    el.style.position = 'relative'
    const img = el.querySelector('img')
    img.style.cursor = 'none'

    // 创建一个元素，用来当镜片
    const glass = document.createElement('div')
    // 设置镜片样式
    const style = glass.style
    style.position = 'absolute'
    style.top = '-75px'
    style.left = '-75px'
    // style.top = `${img.offsetTop - 75}px`
    // style.left = `${img.offsetLeft - 75}px`
    style.display = 'none'
    style.width = '150px'
    style.height = '150px'
    style.borderRadius = '50%'
    style.boxShadow = '0 0 10px gray'
    style.backgroundImage = `url(${img.src})`
    style.backgroundColor = '#fff'
    style.backgroundRepeat = 'no-repeat'
    style.transition = 'width .3s, height .3s'
    style.zIndex = 1
    style.pointerEvents = 'none'
    style.cursor = 'none'
    el.appendChild(glass) // 插入dom

    // 监视img的src变化，在变化时重新设置放大镜里的图片
    const mo = new MutationObserver(record => {
      const rd = record[0]
      if (rd.attributeName === 'src') style.backgroundImage = `url(${img.src})`
    })
    mo.observe(img, { attributes: true })

    const initImg = () => {

      // 用image对象获取图片原始尺寸
      const _img = new Image()
      _img.src = img.src
      _img.onload = () => {
        // 记录缩小比例
        const zoom = _img.width / img.width
        img.addEventListener('mouseenter', () => {
          style.display = 'block'
        })
        img.addEventListener('mousemove', e => {
          // 以图片左上角为原点的光标坐标
          const x = e.pageX - el.offsetLeft - img.offsetLeft
          const y = e.pageY - el.offsetTop - img.offsetTop

          // 移动镜片里图片的位置
          style.backgroundPositionX = `${-x * zoom + glass.offsetWidth / 2}px`
          style.backgroundPositionY = `${-y * zoom + glass.offsetHeight / 2}px`

          // 移动镜片位置
          style.transform = `translate(${x + img.offsetLeft}px, ${y + img.offsetTop}px)`
        })

        // 滚轮缩放
        img.addEventListener('wheel', e => {
          e.preventDefault()
          // 校准基础位置
          style.top = `${-glass.offsetHeight / 2}px`
          style.left = `${-glass.offsetWidth / 2}px`

          // 根据滚轮方向判断缩放
          if (e.deltaY < 0 && glass.offsetWidth < 300) {
            style.width = `${glass.offsetWidth + 10}px`
            style.height = `${glass.offsetHeight + 10}px`
          } else if (e.deltaY > 0 && glass.offsetWidth > 160) {
            style.width = `${glass.offsetWidth - 10}px`
            style.height = `${glass.offsetHeight - 10}px`
          }
        })
        img.addEventListener('mouseleave', () => {
          style.display = 'none'
        })
      }
    }
    initImg()

    img.onload = initImg

  }
}
if (document.querySelector('[data-plugin="zoopic"]')) new Zoopic('[data-plugin="zoopic"]')
