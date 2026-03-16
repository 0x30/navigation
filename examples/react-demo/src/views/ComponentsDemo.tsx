import { useState, type FC } from 'react'
import { animate } from 'animejs'
import { 
  NavPage, back, push, replace, SidePage, useQuietPage, Page, 
  showLoading, hideLoading, showSuccess, showError, showToast,
  useLeaveBefore, blackBoxBack,
  onWillAppear, onDidAppear, onWillDisappear, onDidDisappear,
  Popup
} from '@0x30/navigation-react'
import styles from './ComponentsDemo.module.scss'

// 底部弹出组件演示
const BottomSheet: FC = () => {
  useQuietPage()
  return (
    <SidePage position="bottom" onClickBack={back}>
      <div className={styles.bottomSheet}>
        <div className={styles.sheetHeader}>
          <span>底部弹出</span>
          <span className={styles.closeBtn} onClick={() => back()}>✕</span>
        </div>
        <div className={styles.sheetContent}>
          <p>这是一个从底部弹出的组件</p>
          <p>支持多种位置：bottom, top, left, right, center</p>
        </div>
      </div>
    </SidePage>
  )
}

// 右侧滑出组件演示
const RightDrawer: FC = () => {
  useQuietPage()
  return (
    <SidePage position="right" onClickBack={back}>
      <div className={styles.rightDrawer}>
        <div className={styles.drawerHeader}>
          <span className={styles.backBtn} onClick={() => back()}>‹</span>
          <span>右侧抽屉</span>
        </div>
        <div className={styles.drawerContent}>
          <p>从右侧滑入的抽屉组件</p>
          <p>点击遮罩或返回按钮关闭</p>
        </div>
      </div>
    </SidePage>
  )
}

// 中心弹窗组件演示
const CenterModal: FC = () => {
  useQuietPage()
  return (
    <SidePage position="center" onClickBack={back}>
      <div className={styles.centerModal}>
        <div className={styles.modalHeader}>提示</div>
        <div className={styles.modalContent}>
          这是一个居中弹窗，带有弹性动画效果
        </div>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={() => back()}>取消</button>
          <button className={styles.confirmBtn} onClick={() => {
            showToast('已确认')
            back()
          }}>确认</button>
        </div>
      </div>
    </SidePage>
  )
}

// 普通页面演示
const SimplePage: FC = () => {
  return (
    <Page className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>普通页面</span>
      </div>
      <div className={styles.simpleContent}>
        <p>这是使用 Page 组件的普通页面</p>
        <p>没有默认的进入/退出动画</p>
        <p>可以自定义动画效果</p>
      </div>
    </Page>
  )
}

// useQuietPage 演示 - 安静页面不会触发下层页面的生命周期
const QuietPageDemo: FC = () => {
  useQuietPage()
  return (
    <SidePage position="center" onClickBack={back}>
      <div className={styles.centerModal}>
        <div className={styles.modalHeader}>useQuietPage 演示</div>
        <div className={styles.modalContent}>
          <p>这个弹窗使用了 <strong>useQuietPage()</strong></p>
          <p>打开时不会触发下层页面的 onWillDisappear</p>
          <p>关闭时不会触发下层页面的 onWillAppear</p>
          <p>适用于：弹窗、Toast、Loading 等临时覆盖层</p>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.confirmBtn} onClick={() => back()}>关闭</button>
        </div>
      </div>
    </SidePage>
  )
}

// 自定义确认弹窗
const ConfirmModal: FC<{
  message: string
  onConfirm: () => void
  onCancel: () => void
}> = ({ message, onConfirm, onCancel }) => {
  useQuietPage()
  return (
    <SidePage position="center" onClickBack={onCancel}>
      <div className={styles.centerModal}>
        <div className={styles.modalHeader}>确认离开</div>
        <div className={styles.modalContent}>{message}</div>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>取消</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>确认离开</button>
        </div>
      </div>
    </SidePage>
  )
}

// useLeaveBefore 演示 - 离开前拦截
const LeaveBeforeDemo: FC = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true)
  
  useLeaveBefore(() => {
    if (hasUnsavedChanges) {
      return new Promise<boolean>((resolve) => {
        push(
          <ConfirmModal 
            message="有未保存的更改，确定离开吗？" 
            onConfirm={() => {
              back()
              resolve(true)
            }}
            onCancel={() => {
              back()
              resolve(false)
            }}
          />
        )
      })
    }
    return true
  })

  return (
    <NavPage className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>useLeaveBefore 演示</span>
      </div>
      <div className={styles.simpleContent}>
        <p>这个页面使用了 <strong>useLeaveBefore()</strong></p>
        <p>尝试返回时会弹出自定义确认弹窗</p>
        <p>适用于：表单编辑、支付流程等需要确认的场景</p>
        <div style={{ marginTop: '20px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={hasUnsavedChanges}
              onChange={(e) => setHasUnsavedChanges(e.target.checked)}
            />
            {' '}模拟有未保存的更改
          </label>
        </div>
      </div>
    </NavPage>
  )
}

// 生命周期演示
const LifecycleDemo: FC = () => {
  const [logs, setLogs] = useState<string[]>([])
  
  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`])
  }

  onWillAppear(() => addLog('onWillAppear'))
  onDidAppear(() => addLog('onDidAppear'))
  onWillDisappear(() => addLog('onWillDisappear'))
  onDidDisappear(() => addLog('onDidDisappear'))

  return (
    <NavPage className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>生命周期演示</span>
      </div>
      <div className={styles.simpleContent}>
        <p>页面生命周期钩子：</p>
        <ul style={{ textAlign: 'left', marginTop: '10px' }}>
          <li><strong>onWillAppear</strong>: 页面即将显示</li>
          <li><strong>onDidAppear</strong>: 页面已经显示</li>
          <li><strong>onWillDisappear</strong>: 页面即将消失</li>
          <li><strong>onDidDisappear</strong>: 页面已经消失</li>
        </ul>
        <div className={styles.logBox}>
          {logs.length === 0 
            ? <p style={{ color: '#999' }}>暂无日志，打开其他页面再返回试试</p>
            : logs.map((log, i) => <p key={i}>{log}</p>)
          }
        </div>
        <button 
          className={styles.confirmBtn} 
          style={{ marginTop: '10px' }}
          onClick={() => push(<QuietPageDemo />)}
        >
          打开安静页面（不触发生命周期）
        </button>
      </div>
    </NavPage>
  )
}

// blackBoxBack 演示 - 第二层页面
const BlackBoxBackPage2: FC = () => {
  return (
    <NavPage className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>blackBoxBack 第二层</span>
      </div>
      <div className={styles.simpleContent}>
        <p>当前页面栈：首页 → 组件演示 → 第一层 → <strong>第二层（当前）</strong></p>
        <p style={{ marginTop: '16px' }}>点击下方按钮测试 blackBoxBack：</p>
        <button 
          className={styles.confirmBtn}
          style={{ marginTop: '12px' }}
          onClick={() => blackBoxBack(1)}
        >
          blackBoxBack(1) - 静默返回1层
        </button>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          效果：跳过第一层，直接回到组件演示页
        </p>
        <button 
          className={styles.confirmBtn}
          style={{ marginTop: '16px' }}
          onClick={() => blackBoxBack(2)}
        >
          blackBoxBack(2) - 静默返回2层
        </button>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          效果：跳过第一层和组件演示页，直接回到首页
        </p>
      </div>
    </NavPage>
  )
}

// blackBoxBack 演示 - 第一层页面
const BlackBoxBackDemo: FC = () => {
  return (
    <NavPage className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>blackBoxBack 第一层</span>
      </div>
      <div className={styles.simpleContent}>
        <p>当前页面栈：首页 → 组件演示 → <strong>第一层（当前）</strong></p>
        <p style={{ marginTop: '16px' }}>
          <strong>blackBoxBack(n)</strong> 可以静默返回 n 层页面，
          中间的页面会被直接移除，不会触发动画和生命周期。
        </p>
        <button 
          className={styles.confirmBtn}
          style={{ marginTop: '20px' }}
          onClick={() => push(<BlackBoxBackPage2 />)}
        >
          进入第二层 →
        </button>
      </div>
    </NavPage>
  )
}

// push / replace 差异对比页
const PushReplaceLabPage: FC<{ depth: number; trace: string[] }> = ({ depth, trace }) => {
  const openByPush = () => {
    push(
      <PushReplaceLabPage
        depth={depth + 1}
        trace={[...trace, `push#${depth + 1}`]}
      />
    )
  }

  const openByReplace = () => {
    replace(
      <PushReplaceLabPage
        depth={depth + 1}
        trace={[...trace, `replace#${depth + 1}`]}
      />
    )
  }

  return (
    <NavPage className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>push / replace 对比</span>
      </div>

      <div className={styles.simpleContent}>
        <p><strong>当前层级：</strong>{depth}</p>
        <p style={{ marginTop: '8px' }}>
          <strong>进入轨迹：</strong>
          {trace.join(' -> ')}
        </p>

        <button
          className={styles.confirmBtn}
          style={{ marginTop: '16px', width: '100%' }}
          onClick={openByPush}
        >
          push 下一层（会保留当前页）
        </button>

        <button
          className={styles.confirmBtn}
          style={{ marginTop: '12px', width: '100%' }}
          onClick={openByReplace}
        >
          replace 下一层（会替换当前页）
        </button>

        <p style={{ marginTop: '14px', fontSize: '12px', color: '#999' }}>
          测试方法：连续进入几层后点击返回。push 链路会逐层返回；replace 进入的层会在栈中被替换，返回步数会更少。
        </p>
      </div>
    </NavPage>
  )
}

const PushReplaceLabEntry: FC = () => {
  return (
    <NavPage className={styles.simplePage}>
      <div className={styles.simpleHeader}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span>导航方法实验室</span>
      </div>
      <div className={styles.simpleContent}>
        <p>这个页面用于对比 <strong>push</strong> 和 <strong>replace</strong> 的页面栈行为。</p>
        <button
          className={styles.confirmBtn}
          style={{ marginTop: '16px', width: '100%' }}
          onClick={() => push(<PushReplaceLabPage depth={1} trace={['entry']} />)}
        >
          开始实验
        </button>
      </div>
    </NavPage>
  )
}

const ComponentsDemo: FC = () => {
  const handleShowLoading = async () => {
    await showLoading('加载中...')
    await new Promise(r => setTimeout(r, 1500))
    await hideLoading()
  }

  // 演示 LoadingInstance API
  const handleShowLoadingWithInstance = async () => {
    const instance = await showLoading('正在提交...')
    
    // 模拟进度更新
    await new Promise(r => setTimeout(r, 1000))
    instance.setMessage('处理数据中...')
    
    await new Promise(r => setTimeout(r, 1000))
    instance.setMessage('即将完成...')
    
    await new Promise(r => setTimeout(r, 500))
    instance.success('提交成功！')
  }

  // 演示错误状态
  const handleShowLoadingWithError = async () => {
    const instance = await showLoading('正在验证...')
    
    await new Promise(r => setTimeout(r, 1500))
    instance.error('验证失败')
  }

  const handleShowSuccess = () => {
    showSuccess('操作成功')
  }

  const handleShowError = () => {
    showError('操作失败')
  }

  const handleShowToast = () => {
    showToast('这是一条 Toast 消息')
  }

  // 演示 Popup API - 动态创建弹窗
  const handleShowPopup = () => {
    const [show, close] = Popup({
      onEnter(el, done) {
        animate(el, {
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 300,
          ease: 'outExpo',
          onComplete: done,
        })
      },
      onLeave(el, done) {
        animate(el, {
          opacity: [1, 0],
          scale: [1, 0.8],
          duration: 200,
          ease: 'inQuad',
          onComplete: done,
        })
      },
    })

    show(
      <div className={styles.popupOverlay} onClick={() => close()}>
        <div className={styles.popupDemo} onClick={(e) => e.stopPropagation()}>
          <div className={styles.popupTitle}>🎯 Popup 演示</div>
          <div className={styles.popupContent}>
            <p>这是使用 Popup() 创建的自定义弹窗</p>
            <p>无需预渲染，完全动态创建 DOM</p>
          </div>
          <button className={styles.confirmBtn} onClick={() => close()}>
            关闭
          </button>
        </div>
      </div>
    )
  }

  return (
    <NavPage className={styles.container}>
      <div className={styles.header}>
        <span className={styles.backBtn} onClick={() => back()}>‹ 返回</span>
        <span className={styles.title}>组件演示</span>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>页面组件</div>
          <div className={styles.item} onClick={() => push(<BottomSheet />)}>
            <span>📤 SidePage (bottom)</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<RightDrawer />)}>
            <span>📥 SidePage (right)</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<CenterModal />)}>
            <span>💬 SidePage (center)</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<SimplePage />)}>
            <span>📄 Page (无动画)</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Hooks API</div>
          <div className={styles.item} onClick={() => push(<QuietPageDemo />)}>
            <span>🔇 useQuietPage</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<LeaveBeforeDemo />)}>
            <span>🚫 useLeaveBefore</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<LifecycleDemo />)}>
            <span>🔄 生命周期钩子</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<BlackBoxBackDemo />)}>
            <span>⚡ blackBoxBack</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={() => push(<PushReplaceLabEntry />)}>
            <span>🧪 push / replace 对比</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Loading 组件</div>
          <div className={styles.item} onClick={handleShowLoading}>
            <span>⏳ 基础 Loading</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={handleShowLoadingWithInstance}>
            <span>📊 Loading + 状态更新</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={handleShowLoadingWithError}>
            <span>⚠️ Loading + 错误</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={handleShowSuccess}>
            <span>✅ 显示成功</span>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.item} onClick={handleShowError}>
            <span>❌ 显示失败</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Toast 组件</div>
          <div className={styles.item} onClick={handleShowToast}>
            <span>💬 显示 Toast</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Popup 工具</div>
          <div className={styles.item} onClick={handleShowPopup}>
            <span>🎯 自定义 Popup</span>
            <span className={styles.arrow}>›</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>API 说明</div>
          <div className={styles.desc}>
            <p>• <strong>showLoading(msg)</strong>: 返回 LoadingInstance</p>
            <p>• <strong>instance.setMessage(msg)</strong>: 更新消息</p>
            <p>• <strong>instance.success(msg)</strong>: 显示成功后关闭</p>
            <p>• <strong>instance.error(msg)</strong>: 显示错误后关闭</p>
            <p>• <strong>instance.hide()</strong>: 直接关闭</p>
            <p>• <strong>showToast(msg, duration?)</strong>: 显示轻提示</p>
            <p>• <strong>Popup(options)</strong>: 创建动态弹窗</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>功能说明</div>
          <div className={styles.desc}>
            <p>• <strong>NavPage</strong>: 带有默认推入/推出动画的页面</p>
            <p>• <strong>Page</strong>: 基础页面组件，无默认动画</p>
            <p>• <strong>SidePage</strong>: 侧边弹出页面，支持多种位置</p>
            <p>• <strong>useLeaveBefore</strong>: 离开页面前拦截</p>
            <p>• <strong>useQuietPage</strong>: 安静页面，不触发其他页面生命周期</p>
            <p>• <strong>手势返回</strong>: 从左侧边缘滑动可返回</p>
          </div>
        </div>
      </div>
    </NavPage>
  )
}

export default ComponentsDemo
