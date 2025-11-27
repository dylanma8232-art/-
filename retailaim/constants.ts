import { 
  BarChart3, 
  Map as MapIcon, 
  Zap, 
  Users,
  Eye,
  LayoutGrid,
} from 'lucide-react';
import { ModuleType, BlockData } from './types';

// Company Intro is the Home Page.
export const MODULES: BlockData[] = [
  {
    id: ModuleType.DATA_DASHBOARD,
    title: "O2O",
    subtitle: "全域经营概览",
    icon: LayoutGrid,
    color: "from-blue-600 to-indigo-500",
    description: "实时监控全域 GMV、各平台销售占比及区域业绩排行。"
  },
  {
    id: ModuleType.SUPPLY_MAP,
    title: "全域供给地图",
    subtitle: "需求洞察 | 缺货触发",
    icon: MapIcon,
    color: "from-emerald-500 to-teal-400",
    description: "实时捕捉用户需求热点，识别供给缺口，自动触发前置仓补货任务。"
  },
  {
    id: ModuleType.AI_SALES,
    title: "AI助手",
    subtitle: "数据辅助 | 路线排程",
    icon: Zap,
    color: "from-purple-500 to-pink-400",
    description: "AI 数据辅助决策，智能规划拜访路线，提升线下团队执行效率。"
  },
  {
    id: ModuleType.AI_GUIDE_EMPOWERMENT,
    title: "AI陪练",
    subtitle: "话术演练 | 智能评分",
    icon: Users,
    color: "from-orange-500 to-amber-400",
    description: "从 AI 话术陪练到线下私域即时转化，全链路赋能终端导购。"
  },
  {
    id: ModuleType.CLAIRVOYANCE,
    title: "AI导购",
    subtitle: "私域洞察 | 即时触达",
    icon: Eye,
    color: "from-pink-500 to-rose-400",
    description: "实时透视私域流量，智能识别高意向客户并自动触发营销动作。"
  }
];