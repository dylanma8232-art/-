import React from 'react';
import CompanyIntro from '../components/demos/CompanyIntro';
import HomeDashboard from '../components/HomeDashboard';
import SupplyMapDemo from '../components/demos/SupplyMapDemo';
import AISalesDemo from '../components/demos/AISalesDemo';
import AIGuideDemo from '../components/demos/AIGuideDemo';
import PrivateDomainDemo from '../components/demos/PrivateDomainDemo';

// --- 类型定义 ---

// 开场白配置：控制进入模块前的全屏文字介绍
export interface IntroConfig {
  title: string;
  role: string;
  goal: string;
  duration?: number; // 开场白页面停留时间（默认约3.5秒，可在此覆盖）
}

// 场景配置：每个模块的核心定义
export interface SceneConfig {
  id: string;
  title: string;
  component: React.FC<any>;
  
  // 1. 模块总停留时间 (毫秒)
  // 决定 DemoController 何时自动切换到下一个模块。
  // 注意：这个时间通常应该大于 timeline 中最后一个动作的时间，以留出观看余地。
  duration: number; 
  
  // 2. 开场白配置 (可选)
  intro?: IntroConfig; 
  
  // 3. 内部时间轴配置 (毫秒)
  // 统一管理组件内部动画、弹窗、消息发送的具体时间点。
  // 组件代码中将直接读取这些值，不再写死数字。
  timeline?: Record<string, number>;
}

// --- 播放列表配置 ---

export const DEMO_PLAYLIST: SceneConfig[] = [
  { 
    id: 'intro', 
    title: '1. 公司介绍 (开场)', 
    component: CompanyIntro, 
    duration: 15000, // 本模块总停留 15秒
    // 此模块主要依靠 CSS 动画，暂无复杂内部时间轴配置
  },
  
  { 
    id: 'dashboard', 
    title: '2. O2O 全域指挥舱', 
    component: HomeDashboard, 
    duration: 15000, // 本模块总停留 秒
    intro: {
      title: "O2O 全域生意指挥舱",
      role: "运营总监",
      goal: "全盘生意复盘与决策制定",
      duration: 1000 // 开场白停留 1秒
    },
    timeline: {
      showPrompt: 2000,      // 2秒后：右上角显示“试试用 AI 解读”气泡
      autoTrigger: 5000,     // 5秒后：自动模拟点击 AI 解读按钮
      generationTime: 2000,  // 2秒：AI 报告生成的 Loading 动画持续时间
      readingTime: 12000,    // 12秒：报告生成后，留给用户阅读的时间 (之后模块结束)
    }
  },

  { 
    id: 'supply', 
    title: '3. 供给热力图', 
    component: SupplyMapDemo, 
    duration: 18000, // 本模块总停留 18秒
    intro: {
      title: "全域供给热力图",
      role: "供应链经理",
      goal: "识别全域需求热点与缺货风险",
       duration: 1000 // 开场白停留 1秒
    },
    timeline: {
      switchCategory1: 2000, // 2秒后：切换到“防晒清凉”热力图
      switchCategory2: 4000, // 4秒后：切换到“功能饮料”热力图
      showMobile: 6000,      // 6秒后：弹出手机端调度界面
      analysisDone: 8000,    // 8秒后：手机端显示“AI 分析完成”文字
      routeSelect: 10000,    // 10秒后：自动选中推荐路线方案
      finish: 18000          // 18秒：本模块逻辑结束
    }
  },

  { 
    id: 'sales', 
    title: '4. AI 业务员', 
    component: AISalesDemo, 
    duration: 20000, // 本模块总停留 22秒
    intro: {
      title: "AI 业务助手",
      role: "业务员",
      goal: "执行智能补货与巡店任务",
      duration: 1000 // 开场白停留 1秒
    },
    timeline: {
      msg1: 1000,     // 1秒后：发送第一条消息 (早报)
      msg2: 3000,     // 3秒后：发送第二条消息 (GMV下跌)
      card: 5000,     // 6秒后：发送第三条消息 (排程卡片) - 这里延后一点确保阅读
      openMap: 12000, // 10秒后：模拟点击卡片，跳转到地图界面
      finish: 20000   // 22秒：本模块逻辑结束
    }
  },

  { 
    id: 'guide', 
    title: '5. AI 导购赋能', 
    component: AIGuideDemo, 
    duration: 30000, // INCREASED to 30000 (30s) to fit full sequence
    intro: {
      title: "AI 智能陪练",
      role: "导购员",
      goal: "提升产品知识销售技巧和服务能力",
      duration: 1000 // 开场白停留 1秒
    },
    timeline: {
      workbenchStay: 2500, // 2.5秒：停留看“今日必修任务”
      intro: 1000,         // 进入对话 1秒后：AI 开始说开场白 (耗时约4s)
      userSpeech: 5500,    // 5.5秒后：轮到用户回答 (模拟录音 耗时约6s)
      thinking: 8000,     // 12秒后：AI 开始思考分析 (耗时1.5s)
      feedback: 12500,     // 13.5秒后：AI 给出语音点评 (耗时约7s)
      report: 18500,       // 20.5秒后：切换到“培训诊断报告”页面
      complete: 25000
    }
  },

  { 
    id: 'eye', 
    title: '6. 智慧导购', 
    component: PrivateDomainDemo, 
    duration: 25000, // 本模块总停留 25秒
    intro: {
      title: "私域即时触达",
      role: "导购员",
      goal: "O2O即时转化",
      duration: 1000 // 开场白停留 1秒
    },
    timeline: {
      userMsg: 1500,     // 1.5秒后：模拟用户提问
      aiHint: 3500,      // 3.5秒后：显示 AI 话术推荐气泡
      typing: 6000,      // 6秒后：客服显示“输入中...”
      agentMsg: 8000,    // 8秒后：客服发送回复消息
      cardMsg: 11000,    // 11秒后：客服发送商品卡片
      commission: 15000, // 15秒后：顶部显示佣金到账通知
      userReply: 18000,  // 18秒后：用户回复“已下单”
      finish: 24000      // 25秒：本模块逻辑结束
    }
  }
];