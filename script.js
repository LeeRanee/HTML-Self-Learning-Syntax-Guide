// Enable smooth scrolling when clicking on anchor links
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll to anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Offset for the sticky header
      const headerHeight = document.querySelector('header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
  
  // Add active class to current section in nav
  const observeSection = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Find the corresponding nav link
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const targetId = `#${entry.target.id}`;
            
            if (href === targetId) {
              link.classList.add('text-gray-900', 'font-semibold');
              link.classList.remove('text-gray-600');
            } else {
              link.classList.remove('text-gray-900', 'font-semibold');
              link.classList.add('text-gray-600');
            }
          });
        }
      });
    }, {
      rootMargin: '-100px 0px -70% 0px',
      threshold: [0.1, 0.5]
    });
    
    // Observe each section
    sections.forEach(section => {
      observer.observe(section);
    });
  };
  
  // Call the function if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    observeSection();
  }
  
  // Show/hide back-to-top button
  const scrollFunction = () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  };
  
  window.addEventListener('scroll', scrollFunction);
});

// INITIALIZATION OF BOOTSTRAP COMPONENTS
// Add any interactive functionality below

// Copy code snippet functionality
const addCopyButtons = () => {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(codeBlock => {
    if (codeBlock.parentNode.querySelector('.copy-button')) return;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '复制';
    
    copyButton.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止冒泡，避免触发其他事件
      
      const code = codeBlock.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.innerHTML = '已复制!';
        setTimeout(() => {
          copyButton.innerHTML = '复制';
        }, 2000);
      }).catch(err => {
        console.error('复制失败:', err);
        copyButton.innerHTML = '复制失败';
        setTimeout(() => {
          copyButton.innerHTML = '复制';
        }, 2000);
      });
    });
    
    // 确保pre标签有正确的样式以支持绝对定位
    const preElement = codeBlock.parentNode;
    preElement.style.position = 'relative';
    preElement.style.overflow = 'auto';
    
    // 将按钮添加到pre标签内，确保其绝对定位正确
    preElement.appendChild(copyButton);
    
    // 在移动端添加特殊处理
    if (window.innerWidth <= 768) {
      // 确保代码块有足够空间放置按钮
      preElement.style.paddingTop = '35px';
    } else {
      preElement.style.paddingTop = '30px';
    }
  });
};

// Call once the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addCopyButtons);
} else {
  addCopyButtons();
}

// 处理窗口大小变化
window.addEventListener('resize', function() {
  const preElements = document.querySelectorAll('pre');
  
  preElements.forEach(pre => {
    if (window.innerWidth <= 768) {
      // 移动端模式
      pre.style.paddingTop = '35px';
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.wordWrap = 'break-word';
    } else {
      // 桌面端模式
      pre.style.paddingTop = '30px';
      pre.style.whiteSpace = 'pre';
      pre.style.wordWrap = 'normal';
    }
  });
});

// Prevent zooming
window.addEventListener("wheel", (e)=> {
  const isPinching = e.ctrlKey
  if(isPinching) e.preventDefault()
}, { passive: false });

// 悬浮按钮组功能
document.addEventListener('DOMContentLoaded', () => {
  // 获取元素
  const floatingBtnContainer = document.getElementById('floatingBtnContainer');
  const floatingBtn = document.getElementById('floatingBtn');
  const floatingMenu = document.getElementById('floatingMenu');
  const toTopBtn = document.getElementById('toTopBtn');
  const prevSectionBtn = document.getElementById('prevSectionBtn');
  const nextSectionBtn = document.getElementById('nextSectionBtn');
  const toBottomBtn = document.getElementById('toBottomBtn');
  
  // 状态变量
  let isDragging = false;
  let startX, startY, startPosX, startPosY;
  let menuOpen = false;
  
  // 获取所有h3标题
  const getH3Headers = () => {
    const headers = Array.from(document.querySelectorAll('h3'));
    console.log(`找到 ${headers.length} 个h3标题`);
    return headers;
  };
  
  // 获取当前可见的h3标题索引
  const getCurrentVisibleH3 = () => {
    const h3Headers = getH3Headers();
    if (h3Headers.length === 0) return -1;
    
    const headerHeight = document.querySelector('header').offsetHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const viewportCenter = scrollTop + viewportHeight / 2;
    
    // 首先查找距离视口中心最近的h3
    let closestIndex = 0;
    let minDistance = Infinity;
    
    h3Headers.forEach((header, index) => {
      const rect = header.getBoundingClientRect();
      const headerTop = rect.top + scrollTop;
      const distance = Math.abs(headerTop - viewportCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    // 如果最近的标题在视口上方且不是第一个标题，选择下一个
    const closestRect = h3Headers[closestIndex].getBoundingClientRect();
    if (closestRect.top < 0 && closestIndex < h3Headers.length - 1) {
      closestIndex++;
    }
    
    console.log(`当前位置最接近的h3标题索引: ${closestIndex}`);
    return closestIndex;
  };
  
  // 滚动到指定h3标题
  const scrollToH3 = (index) => {
    const h3Headers = getH3Headers();
    if (index >= 0 && index < h3Headers.length) {
      const targetHeader = h3Headers[index];
      const headerHeight = document.querySelector('header').offsetHeight;
      
      // 使用元素的offsetTop计算绝对位置，更加可靠
      let target = targetHeader;
      let offsetTop = 0;
      
      while (target) {
        offsetTop += target.offsetTop;
        target = target.offsetParent;
      }
      
      // 考虑固定导航栏的高度
      const scrollPosition = offsetTop - headerHeight - 20;
      
      console.log(`滚动到索引 ${index} 的h3标题，位置: ${scrollPosition}px`);
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`无效的h3索引: ${index}`);
    }
  };
  
  // 到顶部
  toTopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // 到底部
  toBottomBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });
  
  // 上一节
  prevSectionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentIndex = getCurrentVisibleH3();
    console.log(`当前索引: ${currentIndex}, 尝试跳转到上一节`);
    
    if (currentIndex > 0) {
      scrollToH3(currentIndex - 1);
    } else {
      console.log('已经是第一节，无法跳转到上一节');
    }
  });
  
  // 下一节
  nextSectionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentIndex = getCurrentVisibleH3();
    const h3Headers = getH3Headers();
    console.log(`当前索引: ${currentIndex}, 尝试跳转到下一节, 总节数: ${h3Headers.length}`);
    
    if (currentIndex >= 0 && currentIndex < h3Headers.length - 1) {
      scrollToH3(currentIndex + 1);
    } else {
      console.log('已经是最后一节，无法跳转到下一节');
    }
  });
  
  // 展开/收起菜单
  floatingBtn.addEventListener('click', (e) => {
    if (!isDragging) {
      menuOpen = !menuOpen;
      if (menuOpen) {
        floatingMenu.classList.add('show');
        floatingBtn.classList.add('active');
      } else {
        floatingMenu.classList.remove('show');
        floatingBtn.classList.remove('active');
      }
    }
  });
  
  // 拖动功能 - 鼠标
  floatingBtnContainer.addEventListener('mousedown', (e) => {
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = floatingBtnContainer.getBoundingClientRect();
    startPosX = rect.left;
    startPosY = rect.top;
    
    const onMouseMove = (e) => {
      // 如果移动超过5px才视为拖动开始
      if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
        isDragging = true;
        floatingBtnContainer.classList.add('dragging');
      }
      
      if (isDragging) {
        const newX = startPosX + (e.clientX - startX);
        const newY = startPosY + (e.clientY - startY);
        
        // 确保按钮不会超出视窗边界
        const maxX = window.innerWidth - floatingBtnContainer.offsetWidth;
        const maxY = window.innerHeight - floatingBtnContainer.offsetHeight;
        
        const boundedX = Math.min(Math.max(0, newX), maxX);
        const boundedY = Math.min(Math.max(0, newY), maxY);
        
        floatingBtnContainer.style.left = `${boundedX}px`;
        floatingBtnContainer.style.top = `${boundedY}px`;
        // 移除之前设置的right和bottom属性
        floatingBtnContainer.style.right = 'auto';
        floatingBtnContainer.style.bottom = 'auto';
      }
    };
    
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      floatingBtnContainer.classList.remove('dragging');
      
      // 如果是拖动而不是点击，则不触发展开/收起
      if (isDragging) {
        setTimeout(() => {
          isDragging = false;
        }, 10);
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });
  
  // 拖动功能 - 触摸设备
  floatingBtnContainer.addEventListener('touchstart', (e) => {
    isDragging = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    const rect = floatingBtnContainer.getBoundingClientRect();
    startPosX = rect.left;
    startPosY = rect.top;
    
    const onTouchMove = (e) => {
      // 如果移动超过5px才视为拖动开始
      if (Math.abs(e.touches[0].clientX - startX) > 5 || Math.abs(e.touches[0].clientY - startY) > 5) {
        isDragging = true;
        floatingBtnContainer.classList.add('dragging');
      }
      
      if (isDragging) {
        const newX = startPosX + (e.touches[0].clientX - startX);
        const newY = startPosY + (e.touches[0].clientY - startY);
        
        // 确保按钮不会超出视窗边界
        const maxX = window.innerWidth - floatingBtnContainer.offsetWidth;
        const maxY = window.innerHeight - floatingBtnContainer.offsetHeight;
        
        const boundedX = Math.min(Math.max(0, newX), maxX);
        const boundedY = Math.min(Math.max(0, newY), maxY);
        
        floatingBtnContainer.style.left = `${boundedX}px`;
        floatingBtnContainer.style.top = `${boundedY}px`;
        // 移除之前设置的right和bottom属性
        floatingBtnContainer.style.right = 'auto';
        floatingBtnContainer.style.bottom = 'auto';
        
        // 防止页面滚动
        e.preventDefault();
      }
    };
    
    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      floatingBtnContainer.classList.remove('dragging');
      
      // 如果是拖动而不是点击，则不触发展开/收起
      if (isDragging) {
        setTimeout(() => {
          isDragging = false;
        }, 10);
      }
    };
    
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  });
  
  // 点击页面其他区域时关闭菜单
  document.addEventListener('click', (e) => {
    if (menuOpen && !floatingBtnContainer.contains(e.target)) {
      menuOpen = false;
      floatingMenu.classList.remove('show');
      floatingBtn.classList.remove('active');
    }
  });
});

// 侧边栏功能
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarCollapse = document.getElementById('sidebar-collapse');
  const sidebarSections = document.querySelectorAll('.sidebar-section');
  const sidebarLinks = document.querySelectorAll('.sidebar-section-menu a');
  
  // 初始化侧边栏状态
  let sidebarActive = window.innerWidth >= 768; // 大屏幕默认显示，小屏幕默认隐藏
  let sidebarCollapsed = false;
  
  // 在桌面设备上初始显示侧边栏
  if (window.innerWidth >= 768) {
    sidebar.classList.add('active');
  }
  
  // 处理窗口大小变化
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      // 不再自动显示/隐藏侧边栏，保持当前状态
    } else if (!sidebarActive) {
      sidebar.classList.remove('active');
    }
  });
  
  // 任何屏幕尺寸下都通过按钮切换侧边栏
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      sidebarActive = sidebar.classList.contains('active');
    });
  }
  
  // 关闭侧边栏按钮
  if (sidebarClose) {
    sidebarClose.addEventListener('click', function() {
      sidebar.classList.remove('active');
      sidebarActive = false;
    });
  }
  
  // 折叠/展开侧边栏
  if (sidebarCollapse) {
    sidebarCollapse.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      sidebarCollapsed = sidebar.classList.contains('collapsed');
      
      // 折叠时关闭所有子菜单
      if (sidebarCollapsed) {
        sidebarSections.forEach(section => {
          section.classList.remove('active');
        });
      }
    });
  }
  
  // 子菜单展开/收起
  sidebarSections.forEach(section => {
    const header = section.querySelector('.sidebar-section-header');
    if (header) {
      header.addEventListener('click', function() {
        // 如果侧边栏处于折叠状态，先展开侧边栏
        if (sidebarCollapsed) {
          sidebar.classList.remove('collapsed');
          sidebarCollapsed = false;
        }
        
        // 切换当前部分的活动状态
        section.classList.toggle('active');
        
        // 在移动设备上，关闭其他展开的部分
        if (window.innerWidth < 768) {
          sidebarSections.forEach(otherSection => {
            if (otherSection !== section) {
              otherSection.classList.remove('active');
            }
          });
        }
      });
    }
  });
  
  // 处理侧边栏链接点击
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 在小屏幕上点击链接后关闭侧边栏
      if (window.innerWidth < 768) {
        sidebar.classList.remove('active');
        sidebarActive = false;
      }
      
      // 高亮当前链接
      sidebarLinks.forEach(otherLink => {
        otherLink.classList.remove('active');
      });
      link.classList.add('active');
      
      // 平滑滚动到目标位置
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // 考虑固定导航栏的高度
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 高亮当前滚动位置对应的侧边栏链接
  const highlightSidebarLink = () => {
    // 获取所有带ID的标题元素
    const headingElements = document.querySelectorAll('h2[id], h3[id]');
    if (headingElements.length === 0) return;
    
    // 找到当前视口中的元素
    const headerHeight = document.querySelector('header').offsetHeight;
    let currentElement = null;
    
    // 查找当前滚动位置附近的标题
    for (let i = 0; i < headingElements.length; i++) {
      const element = headingElements[i];
      const rect = element.getBoundingClientRect();
      
      // 标题在可视区域内或刚刚超出顶部
      if ((rect.top >= headerHeight && rect.top <= window.innerHeight) || 
          (i === 0 && rect.top < headerHeight)) {
        currentElement = element;
        break;
      }
      
      // 如果已经超出了视口底部，使用前一个标题
      if (rect.top > window.innerHeight && i > 0) {
        currentElement = headingElements[i - 1];
        break;
      }
    }
    
    // 如果没有找到合适的标题，使用最后一个低于顶部的标题
    if (!currentElement) {
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const rect = headingElements[i].getBoundingClientRect();
        if (rect.top < headerHeight) {
          currentElement = headingElements[i];
          break;
        }
      }
    }
    
    // 如果找到了当前元素，高亮对应的侧边栏链接
    if (currentElement) {
      const currentId = currentElement.id;
      const targetLink = document.querySelector(`.sidebar-section-menu a[href="#${currentId}"]`);
      
      if (targetLink) {
        // 移除所有活动状态
        sidebarLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // 添加活动状态
        targetLink.classList.add('active');
        
        // 展开包含该链接的部分
        const parentSection = targetLink.closest('.sidebar-section');
        if (parentSection && !sidebarCollapsed) {
          sidebarSections.forEach(section => {
            if (section === parentSection) {
              section.classList.add('active');
            }
          });
        }
      }
    }
  };
  
  // 页面滚动时高亮对应的侧边栏链接
  window.addEventListener('scroll', debounce(highlightSidebarLink, 100));
  
  // 页面加载时执行一次高亮
  highlightSidebarLink();
  
  // 辅助函数：防抖
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
});

// 目录收起/展开功能
document.addEventListener('DOMContentLoaded', function() {
  const tocToggle = document.getElementById('toc-toggle');
  const tocContent = document.getElementById('toc-content');
  const collapseText = tocToggle.querySelector('.collapse-text');
  const expandText = tocToggle.querySelector('.expand-text');
  const collapseIcon = tocToggle.querySelector('.collapse-icon');
  const expandIcon = tocToggle.querySelector('.expand-icon');
  
  // 从本地存储获取目录状态
  let isTocCollapsed = localStorage.getItem('tocCollapsed') === 'true';
  let isMobile = window.innerWidth < 768;
  
  // 设置初始状态：移动端默认收起，桌面端默认展开（除非用户之前已收起）
  if (isMobile) {
    // 移动端默认收起
    isTocCollapsed = true;
    // 立即设置状态，避免延迟导致闪烁
    tocContent.classList.add('collapsed');
    tocContent.classList.remove('expanded');
    collapseText.classList.add('hidden');
    expandText.classList.remove('hidden');
    collapseIcon.classList.add('hidden');
    expandIcon.classList.remove('hidden');
  } else if (localStorage.getItem('tocCollapsed') === null) {
    // 桌面端首次访问，默认展开
    isTocCollapsed = false;
    // 立即设置状态，避免延迟导致闪烁
    tocContent.classList.remove('collapsed');
    tocContent.classList.add('expanded');
    collapseText.classList.remove('hidden');
    expandText.classList.add('hidden');
    collapseIcon.classList.remove('hidden');
    expandIcon.classList.add('hidden');
  } else {
    // 应用保存的状态
    updateTocState(isTocCollapsed);
  }
  
  // 目录按钮点击事件
  tocToggle.addEventListener('click', function() {
    isTocCollapsed = !isTocCollapsed;
    updateTocState(isTocCollapsed);
    
    // 保存到本地存储
    localStorage.setItem('tocCollapsed', isTocCollapsed);
  });
  
  // 窗口大小改变时调整状态
  window.addEventListener('resize', function() {
    const currentIsMobile = window.innerWidth < 768;
    
    // 当视口大小从移动端切换到桌面端时
    if (isMobile && !currentIsMobile) {
      // 如果用户没有明确设置状态，则桌面端默认展开
      if (localStorage.getItem('tocCollapsed') === null) {
        isTocCollapsed = false;
        updateTocState(isTocCollapsed);
      }
    } else if (!isMobile && currentIsMobile) {
      // 当视口大小从桌面端切换到移动端时，且用户没有明确设置状态
      if (localStorage.getItem('tocCollapsed') === null) {
        isTocCollapsed = true;
        updateTocState(isTocCollapsed);
      }
    }
    
    isMobile = currentIsMobile;
  });
  
  // 更新目录状态的函数
  function updateTocState(collapsed) {
    if (collapsed) {
      tocContent.classList.add('collapsed');
      tocContent.classList.remove('expanded');
      collapseText.classList.add('hidden');
      expandText.classList.remove('hidden');
      collapseIcon.classList.add('hidden');
      expandIcon.classList.remove('hidden');
    } else {
      tocContent.classList.remove('collapsed');
      tocContent.classList.add('expanded');
      collapseText.classList.remove('hidden');
      expandText.classList.add('hidden');
      collapseIcon.classList.remove('hidden');
      expandIcon.classList.add('hidden');
    }
  }
});
