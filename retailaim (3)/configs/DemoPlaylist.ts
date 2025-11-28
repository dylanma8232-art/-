import React from 'react';
import CompanyIntro from '../components/demos/CompanyIntro';
import HomeDashboard from '../components/HomeDashboard';
import SupplyMapDemo from '../components/demos/SupplyMapDemo';
import AISalesDemo from '../components/demos/AISalesDemo';
import AIGuideDemo from '../components/demos/AIGuideDemo';
import PrivateDomainDemo from '../components/demos/PrivateDomainDemo';

export interface SceneStep {
  name: string;
  delay: number;
}

export interface IntroConfig {
  title: string;
  role: string;
  goal: string;
  duration?: number; 
}

export interface SceneConfig {
  id: string;
  title: string;
  component: React.FC<any>;
  duration: number; 
  intro?: IntroConfig; 
  steps?: SceneStep[];
  // 新增：用于组件内部的时间轴配置
  timeline?: Record<string, number>;
}

export const DEMO_PLAYLIST: SceneConfig[] = [
  { 
    id: 'intro', 
    title: '1. 公司介绍 (开场)', 
    component: CompanyIntro, 
    duration: 15000,
    steps: [
      { name: 'Logo入场', delay: 0 },
      { name: '数字滚动', delay: 1000 },
      { name: '品牌墙浮现', delay: 3000 }
    ]
  },
  { 
    id: 'dashboard', 
    title: '2. O2O 全域指挥舱', 
    component: HomeDashboard, 
    duration: 25000,
    intro: {
      title: "O2O 全域生意指挥舱",
      role: "运营总监",
      goal: "全盘生意复盘与决策制定",
      duration: 1000
    },
    steps: [
      { name: '加载图表', delay: 0 },
      { name: 'AI 气泡引导', delay: 3000 },
      { name: 'AI 报告生成', delay: 6000 }
    ]
  },
  { 
    id: 'supply', 
    title: '3. 供给热力图', 
    component: SupplyMapDemo, 
    duration: 25000,
    intro: {
      title: "全域供给热力图",
      role: "供应链经理",
      goal: "识别全域需求热点与缺货风险",
       duration: 1000
    },
    steps: [
      { name: '地图漫游', delay: 0 },
      { name: '切换品类', delay: 3000 },
      { name: '路径规划', delay: 9000 }
    ]
  },
  { 
    id: 'sales', 
    title: '4. AI 业务员', 
    component: AISalesDemo, 
    duration: 18000,
    intro: {
      title: "AI 业务助手",
      role: "业务员",
      goal: "执行智能补货与巡店任务",
      duration: 1000
    },
    steps: [
      { name: '接收预警', delay: 1000 },
      { name: '查看方案', delay: 5000 },
      { name: '确认调度', delay: 12000 }
    ]
  },
  { 
    id: 'guide', 
    title: '5. AI 导购赋能', 
    component: AIGuideDemo, 
    // 修改：总时长延长，确保播放完整
    duration: 35000
    intro: {
      title: "AI 智能陪练",
      role: "导购员",
      goal: "提升产品知识销售技巧和服务能力",
      duration: 1000
    },
    steps: [
      { name: '对话开始', delay: 1500 },
      { name: '用户模拟', delay: 10000 },
      { name: '生成报告', delay: 35000 }
    ],
    // 修改：在此处统一配置时间轴
    timeline: {
      intro: 2000,       // AI开场白开始时间
      userSpeech: 2000, // 用户开始回答时间 
      thinking: 2000,   // AI开始思考时间 )
      feedback: 3000,   // AI开始点评时间 
      report: 12000,     // 切换到报告页时间
      complete: 5000    // 模块结束时间 
    }
  },
  { 
    id: 'eye', 
    title: '6. 智慧导购', 
    component: PrivateDomainDemo, 
    duration: 18000,
    intro: {
      title: "私域即时触达",
      role: "导购员",
      goal: "O2O即时转化",
      duration: 1000
    },
    steps: [
      { name: '客户提问', delay: 1000 },
      { name: 'AI 建议', delay: 2500 },
      { name: '成交转化', delay: 10500 }
    ]
  }
];