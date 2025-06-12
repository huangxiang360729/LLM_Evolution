/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- START OF CONSTANTS ---
const COMPANY_THEMES = {
  anthropic: { baseColor: '#AE5630', textColor: 'text-[#AE5630]', borderColor: 'border-[#AE5630]', headerBgColor: 'bg-[#AE5630]', seriesHeaderBgColor: 'bg-[#D48A6A]', seriesHeaderTextColor: 'text-white', rowHoverBgColor: 'hover:bg-[#fdf0eb]', notesBorderColor: 'border-[#AE5630]', notesBgColor: 'bg-[#fdf5f2]', notesLinkColor: 'text-[#8C4221]', notesLinkHoverColor: 'hover:text-[#5A2A13]' },
  qwen: { baseColor: '#3498db', textColor: 'text-[#3498db]', borderColor: 'border-[#3498db]', headerBgColor: 'bg-[#3498db]', seriesHeaderBgColor: 'bg-[#5dade2]', seriesHeaderTextColor: 'text-white', rowHoverBgColor: 'hover:bg-[#eaf5ff]', notesBorderColor: 'border-[#3498db]', notesBgColor: 'bg-[#eef5f9]', notesLinkColor: 'text-[#2980b9]', notesLinkHoverColor: 'hover:text-[#1f618d]' },
  openai: { baseColor: '#10a37f', textColor: 'text-[#10a37f]', borderColor: 'border-[#10a37f]', headerBgColor: 'bg-[#10a37f]', seriesHeaderBgColor: 'bg-[#19c395]', seriesHeaderTextColor: 'text-white', rowHoverBgColor: 'hover:bg-[#e6f7f3]', notesBorderColor: 'border-[#10a37f]', notesBgColor: 'bg-[#eefaf7]', notesLinkColor: 'text-[#0b7e5e]', notesLinkHoverColor: 'hover:text-[#075c43]' },
  meta: { baseColor: '#1877f2', textColor: 'text-[#1877f2]', borderColor: 'border-[#1877f2]', headerBgColor: 'bg-[#1877f2]', seriesHeaderBgColor: 'bg-[#4a90e2]', seriesHeaderTextColor: 'text-white', rowHoverBgColor: 'hover:bg-[#e6f2ff]', notesBorderColor: 'border-[#1877f2]', notesBgColor: 'bg-[#eef5f9]', notesLinkColor: 'text-[#1877f2]', notesLinkHoverColor: 'hover:text-[#1053a8]' },
  google: { baseColor: '#34A853', textColor: 'text-[#34A853]', borderColor: 'border-[#34A853]', headerBgColor: 'bg-[#34A853]', seriesHeaderBgColor: 'bg-[#66BB6A]', seriesHeaderTextColor: 'text-white', rowHoverBgColor: 'hover:bg-[#e8f5e9]', notesBorderColor: 'border-[#34A853]', notesBgColor: 'bg-[#e8f5e9]', notesLinkColor: 'text-[#1E8E3E]', notesLinkHoverColor: 'hover:text-[#0F5A2F]' },
  default: { 
    baseColor: '#6366f1', // indigo-500
    textColor: 'text-slate-700', 
    borderColor: 'border-indigo-500', 
    headerBgColor: 'bg-indigo-600', // Active main tab background
    seriesHeaderBgColor: 'bg-indigo-500', 
    seriesHeaderTextColor: 'text-white',
    rowHoverBgColor: 'hover:bg-indigo-50',
    notesBorderColor: 'border-indigo-500',
    notesBgColor: 'bg-indigo-50',
    notesLinkColor: 'text-indigo-600',
    notesLinkHoverColor: 'hover:text-indigo-800'
  },
};

const LLM_TABLE_HEADERS_DEFAULT = ["模型系列/名称", "发布/可用时间 (状态)", "技术报告/主要文档", "主要技术特点", "架构与训练细节", "上下文窗口 (Tokens)", "多模态能力", "参数规模/版本", "训练数据量 (T)"];
const LLM_COMPANY_ORDER = ["anthropic", "qwen", "openai", "meta", "google"];

const MAIN_TAB_ORDER = ["aiHistory", "llmEvolution", "videoModels"];
// --- END OF CONSTANTS ---

// --- START OF DATA FOR LLM Evolution ---
const ModelVariant = ({ children }) => React.createElement('span', { className: "block text-xs text-slate-500 mt-1 italic" }, children);

const anthropicTableRows = [
  { isSeriesHeader: true, cells: [{ content: "Claude 1", colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Claude 1.0" }, { content: "2023年3月14日 (早期可用性) [A-1]" }, { content: "API文档/合作伙伴描述" }, { content: "注重有益、诚实和无害 (HHH)，擅长对话、内容创作、推理。" }, { content: "Transformer架构，Constitutional AI, RLAIF。" }, { content: "9K" }, { content: "文本" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Claude 1.2" }, { content: React.createElement(Fragment, null, "2023年5月 (API更新)", React.createElement("br", null), "2023年5月11日 (100K上下文宣布) [A-2]") }, { content: "API文档/博客 (100K)" }, { content: "改进性能和指令遵循能力。" }, { content: "Claude 1架构迭代。" }, { content: "100K" }, { content: "文本" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Claude Instant 1.1" }, { content: "约2023年3月/4月" }, { content: "API文档" }, { content: "更快、更经济，针对低延迟场景。" }, { content: "Claude架构的轻量级版本。" }, { content: "9K (后扩展至100K)" }, { content: "文本" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Claude Instant 1.2" }, { content: "约2023年8月 (API更新) [A-3]" }, { content: "API文档" }, { content: "提升性价比，保持Instant系列的速度优势。" }, { content: "Claude Instant架构迭代。" }, { content: "100K" }, { content: "文本" }, { content: "未公开" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: "Claude 2", colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Claude 2.0" }, { content: "2023年7月11日 [A-3]" }, { content: "博客, API文档" }, { content: "显著提升编码、数学和推理性能，更安全。" }, { content: "Claude 1.x架构的重大升级。" }, { content: "100K" }, { content: "文本 (可处理文本文件上传)" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Claude 2.1" }, { content: "2023年11月21日 [A-4]" }, { content: "博客, API文档" }, { content: "显著降低幻觉率，引入工具使用 (Tool Use) Beta。" }, { content: "Claude 2架构迭代，优化长上下文和准确性。" }, { content: "200K" }, { content: "文本 (可处理文本文件上传，支持工具使用)" }, { content: "未公开" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: "Claude 3", colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Claude 3 Opus" }, { content: "2024年3月4日 [A-5]" }, { content: "模型卡, 博客 (2024年3月4日) [A-6]" }, { content: "Anthropic最智能模型，复杂任务SOTA水平。" }, { content: "新模型架构，提升多模态理解、复杂推理、长上下文。" }, { content: "200K (常规), 高达1M (特定用例)" }, { content: "文本、图像输入，文本输出。" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Claude 3 Sonnet" }, { content: "2024年3月4日 [A-5]" }, { content: "模型卡, 博客 (2024年3月4日) [A-6]" }, { content: "智能与速度的理想平衡，高性价比，企业级应用。" }, { content: "与Opus共享架构基础，平衡性能与效率。" }, { content: "200K" }, { content: "文本、图像输入，文本输出。" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Claude 3 Haiku" }, { content: React.createElement(Fragment, null, "2024年3月4日 (宣布)", React.createElement("br", null), "2024年3月13日 (广泛可用) [A-7]") }, { content: "模型卡, 博客 (2024年3月4日) [A-6]" }, { content: "Anthropic最快、最紧凑模型，近乎实时响应，客户互动。" }, { content: "与Opus/Sonnet共享架构基础，极致优化速度与成本。" }, { content: "200K" }, { content: "文本、图像输入，文本输出。" }, { content: "未公开" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: "Claude 3.5", colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Claude 3.5 Sonnet" }, { content: "2024年6月20日 [A-8]" }, { content: "博客, API文档 (2024年6月20日)" }, { content: "优于Claude 3 Opus的推理、知识和编码能力，速度是Opus两倍。引入Artifacts功能。" }, { content: "Claude 3架构重大改进，优化推理、编码和视觉。" }, { content: "200K" }, { content: "文本、图像输入，文本输出 (包括Artifacts)。" }, { content: "未公开" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: "Claude 3.7 (Original HTML had a future date - using it as reference)", colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Claude 3.7 Sonnet" }, { content: "2025年2月24日 (基于原始HTML日期) [A-9]" }, { content: "博客, API文档" }, { content: "开创性的混合AI推理模型，可选快速响应或逐步推理。" }, { content: "混合推理模型架构。" }, { content: "200K" }, { content: "文本、图像输入，文本输出。" }, { content: "未公开" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: "Claude 4 (Hypothetical - based on provided HTML structure)", colSpan: 9, isHeader: true }] },
  { cells: [{ content: React.createElement(Fragment, null, "Claude 4 Opus", React.createElement(ModelVariant, null, "(Claude Opus 4)")) }, { content: "2025年5月22日 (基于原始HTML日期) [A-10], [A-11]" }, { content: "博客, System Card元素" }, { content: "Anthropic最强模型，顶级编码、先进推理、AI智能体能力。混合推理，AI安全等级3 (ASL-3)。" }, { content: "混合推理模型架构，支持扩展思考和并行工具使用。" }, { content: "200K" }, { content: "文本、图像输入，文本输出。支持工具使用和记忆能力。" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: React.createElement(Fragment, null, "Claude 4 Sonnet", React.createElement(ModelVariant, null, "(Claude Sonnet 4)")) }, { content: "2025年5月22日 (基于原始HTML日期) [A-10], [A-11]" }, { content: "博客, System Card元素" }, { content: "Claude 3.7 Sonnet的显著升级，卓越编码和推理，精确指令遵循。混合推理，AI安全等级2 (ASL-2)。" }, { content: "混合推理模型架构，支持扩展思考和并行工具使用。" }, { content: "200K" }, { content: "文本、图像输入，文本输出。支持工具使用。" }, { content: "未公开" }, { content: "未公开" }] },
];
const anthropicNotes = { general: [React.createElement(Fragment, { key: "gen1" }, React.createElement("strong", null, "注：")), React.createElement(Fragment, { key: "gen2" }, "- 表示信息暂缺、不适用或未明确公开。"), React.createElement(Fragment, { key: "gen3" }, "Anthropic模型的具体参数量和训练所用Token数量通常不公开。"), React.createElement(Fragment, { key: "gen4" }, "\"发布/可用时间 (状态)\" 可能指模型宣布时间、API初步可用时间、或更广泛的集成时间。"), React.createElement(Fragment, { key: "gen5" }, "Claude系列模型以其在安全性、遵循指令和减少有害输出方面的设计理念而著称。"), React.createElement(Fragment, { key: "gen6" }, "Claude 4 entries are based on the structure provided in the initial HTML and hypothetical future releases. Real release details may vary."), React.createElement(Fragment, { key: "gen7" }, "本表格信息基于当前可查证公开资料 (截至2025年初的模拟时间点及知识库更新)，Anthropic模型发展迅速，最新信息请以官方渠道为准。")], referencesTitle: "数据来源参考：", references: [{ id: "A-1", url: "https://www.anthropic.com/news/claude-now-available-in-slack", text: "Claude now available in Slack" }, { id: "A-2", url: "https://www.anthropic.com/index/100k-context-windows", text: "100K Context Windows Announcement" }, { id: "A-3", url: "https://www.anthropic.com/index/claude-2", text: "Claude 2 Announcement (also covers Instant 1.2 API update context)" }, { id: "A-4", url: "https://www.anthropic.com/news/claude-2-1-outperforms-competitors-in-long-context-reliability-test", text: "Claude 2.1 Announcement" }, { id: "A-5", url: "https://www.anthropic.com/news/claude-3-family", text: "Claude 3 Family Announcement" }, { id: "A-6", url: "https://www.anthropic.com/claude-3-model-card.pdf", text: "Claude 3 Model Card PDF" }, { id: "A-7", url: "https://www.anthropic.com/news/claude-3-haiku", text: "Claude 3 Haiku Availability" }, { id: "A-8", url: "https://www.anthropic.com/news/claude-3-5-sonnet", text: "Claude 3.5 Sonnet Announcement" }, { id: "A-9", url: "https://www.anthropic.com/news/claude-3-7-sonnet", text: "Claude 3.7 Sonnet Announcement (from original HTML reference)" }, { id: "A-10", url: "https://www.anthropic.com/news/introducing-claude-4", text: "Claude 4 Introduction (from original HTML reference)" }, { id: "A-11", url: "https://aws.amazon.com/blogs/machine-learning/anthropics-claude-4-opus-sonnet-models-now-available-in-amazon-bedrock/", text: "Claude 4 on AWS Bedrock (from original HTML reference)" }].map(ref => ({ ...ref, url: ref.url.trim() })) };

const qwenTableRows = [
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Qwen (通义千问)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Qwen (beta)" }, { content: "未开源 (内部测试阶段)" }, { content: "-" }, { content: "阿里巴巴早期大规模语言模型探索。" }, { content: "基于Transformer架构，类似LLaMA。" }, { content: "未公开" }, { content: "主要为文本处理" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "Qwen-7B" }, { content: "2023年8月3日 (开源) [Q-1]" }, { content: "技术备忘录 (2023年8月3日) [Q-2]" }, { content: "支持工具使用能力，针对中英文优化。" }, { content: "Transformer架构，RoPE, Flash Attention。" }, { content: "8K [Q-3]" }, { content: "文本" }, { content: "7B" }, { content: "2.2 (初版) / 2.4 (更新) [Q-3]" }] },
  { cells: [{ content: "Qwen-14B" }, { content: "2023年9月25日 (开源) [Q-4]" }, { content: "Qwen技术报告 (2023年9月) [Q-3]" }, { content: "增强的对话和创作能力。" }, { content: "Transformer架构。" }, { content: "8K [Q-3]" }, { content: "文本" }, { content: "14B" }, { content: "3.0 [Q-3]" }] },
  { cells: [{ content: "Qwen-1.8B" }, { content: "2023年11月30日 (开源) [Q-5]" }, { content: "Qwen技术报告 (2023年9月) [Q-3]" }, { content: "轻量级，增强系统提示和工具使用。" }, { content: "Transformer架构。" }, { content: "32K [Q-3]" }, { content: "文本" }, { content: "1.8B" }, { content: "2.2 [Q-3]" }] },
  { cells: [{ content: "Qwen-72B" }, { content: "2023年11月30日 (开源) [Q-5]" }, { content: "Qwen技术报告 (2023年9月) [Q-3]" }, { content: "旗舰级文本模型，强性能。" }, { content: "Transformer架构。" }, { content: "32K [Q-3]" }, { content: "文本" }, { content: "72B" }, { content: "3.0 [Q-3]" }] },
  { cells: [{ content: "Qwen-VL / Qwen-VL-Chat" }, { content: "Chat版2023年8月开源 [Q-6]" }, { content: "Qwen-VL技术报告 (2023年8月) [Q-7]" }, { content: "视觉语言模型，支持图像、文本、检测框输入，中英文及多语言对话。" }, { content: "视觉Transformer (ViT) + Qwen LLM。" }, { content: "2048 [Q-7]" }, { content: "图像、文本输入，文本、检测框输出" }, { content: "约9.6B (LLM 7B + ViT) [Q-7]" }, { content: "1.5B图文对 [Q-7]" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Qwen1.5"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Qwen1.5 系列" }, { content: "2024年2月5日 (开源) [Q-8]" }, { content: "Hugging Face集合 [Q-9]" }, { content: "多尺寸模型 (0.5B至110B)，改进多语言支持。" }, { content: "Transformer优化 (GQA, SwiGLU)。" }, { content: "32K [Q-8]" }, { content: "文本" }, { content: "0.5B, 1.8B, 4B, 7B, 14B, 32B, 72B, 110B" }, { content: "最高3T [Q-8]" }] },
  { cells: [{ content: "Qwen1.5-MoE-A2.7B" }, { content: "2024年3月28日 (开源) [Q-10]" }, { content: "Hugging Face模型卡" }, { content: "Qwen系列首个开源MoE模型。" }, { content: "MoE (Mixture-of-Experts) 架构。" }, { content: "32K" }, { content: "文本" }, { content: "A2.7B (激活参数) / 总参数未公开" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Qwen2"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Qwen2 系列" }, { content: "2024年6月6日 (开源) [Q-11]" }, { content: "Qwen2技术报告 (2024年6月) [Q-12]" }, { content: "密集和MoE模型，支持约30种语言，指令遵循和多语言能力增强。" }, { content: "密集Transformer和MoE架构。" }, { content: "高达128K [Q-11]" }, { content: "文本" }, { content: "0.5B, 1.5B, 7B, 57B-A14B (MoE), 72B" }, { content: "最高7T [Q-11]" }] },
  { cells: [{ content: "Qwen2-VL-72B" }, { content: React.createElement(Fragment, null, "2024年4月 (发布/提及, 基于Qwen2和VL-Max技术) [Q-13]") }, { content: "参考VL-Max技术报告 [Q-14]" }, { content: "视觉语言模型，可分析视频，处理多语言输入。" }, { content: "基于Qwen2 MoE。" }, { content: "未公开" }, { content: "支持视频、多语言文本输入" }, { content: "72B" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Qwen2.5"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Qwen2.5 系列 (API)" }, { content: "2024年9月19日 (API能力迭代) [Q-15]" }, { content: "阿里云文档" }, { content: "API模型，支持长上下文，针对编码和数学优化。" }, { content: "包含密集模型和MoE架构 (如Qwen2.5-Max)。" }, { content: "高达128K (API)" }, { content: "文本为主 (API模型)" }, { content: "API模型参数不公开 (含0.5B至72B级能力)" }, { content: "未公开 (Max超20T级)" }] },
  { cells: [{ content: "Qwen2.5-VL-Instruct" }, { content: React.createElement(Fragment, null, "2024年4月 (参考Qwen-VL-Plus/Max发布) [Q-13]") }, { content: "参考VL-Plus/Max Report [Q-14]" }, { content: "视觉语言模型，增强了视觉理解、智能体、长视频理解、视觉定位和结构化输出能力。" }, { content: "ViT架构优化，与Qwen2.5 LLM对齐。" }, { content: "未公开" }, { content: "支持图像、长视频输入，文本、边界框、结构化JSON输出，可作为视觉智能体" }, { content: "3B, 7B, 32B, 72B" }, { content: "未公开" }] },
  { cells: [{ content: "Qwen2.5-Omni" }, { content: React.createElement(Fragment, null, "2024年3月 (技术报告发布) [Q-16]") }, { content: "技术报告 (2024年3月) [Q-16]" }, { content: "端到端多模态模型，可处理文本、图像、音频、视频输入，并以文本和自然语音流式输出。" }, { content: "Thinker-Talker架构。" }, { content: "未公开" }, { content: "支持文本、图像、音频、视频输入，文本、语音输出" }, { content: "3B, 7B (已知开源) [Q-16]" }, { content: "未公开" }] },
  { cells: [{ content: "Qwen2.5-1M 系列" }, { content: "参考Qwen1.5-7B-Chat-1M [Q-17]" }, { content: "技术报告 (2024年1月) [Q-18]" }, { content: "采用长数据合成、渐进式预训练和多阶段SFT等技术。" }, { content: "基于Qwen2.5的Transformer架构 (或Qwen1.5)。" }, { content: "1M" }, { content: "主要针对长文本处理" }, { content: "7B-Instruct-1M, 14B-Instruct-1M (开源)" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "QVQ & QwQ (Hypothetical/Future - based on original HTML)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "QVQ-72B-Preview" }, { content: "2024年12月 (提及)" }, { content: "-" }, { content: "视觉推理模型。" }, { content: "架构细节未公开。" }, { content: "未公开" }, { content: "集成视觉和文本推理" }, { content: "72B" }, { content: "未公开" }] },
  { cells: [{ content: "QVQ-Max" }, { content: "2025年3月28日 (参考VL-Max能力) [Q-13]" }, { content: "-" }, { content: "视觉推理模型，理解图像视频内容并进行分析推理。" }, { content: "架构细节未公开。" }, { content: "未公开" }, { content: "强大的图像和视频理解与推理能力" }, { content: "未公开" }, { content: "未公开" }] },
  { cells: [{ content: "QwQ-32B-Preview" }, { content: "2024年11月" }, { content: "-" }, { content: "专注于推理的类o1模型。" }, { content: "架构细节未公开。" }, { content: "32K" }, { content: "文本推理" }, { content: "32B" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Qwen3 (Hypothetical - based on provided HTML)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Qwen3 系列" }, { content: "2025年4月28日/29日 (基于原始HTML日期)" }, { content: "LLM Training报告 (2024年4月) [Q-19]" }, { content: "多种尺寸，密集和MoE，支持119种语言，混合推理模式，增强智能体能力。" }, { content: "密集Transformer和MoE (如128专家，激活8)。" }, { content: "未公开" }, { content: "主要为文本，广泛多语言任务。" }, { content: "0.6B 至 235B-A22B (MoE)" }, { content: "25T / 36T [Q-19]" }] },
];
const qwenNotes = { general: [React.createElement(Fragment, { key: "gen1" }, React.createElement("strong", null, "注：")), React.createElement(Fragment, { key: "gen2" }, "- 表示信息暂缺或不适用。"), React.createElement(Fragment, { key: "gen3" }, "API模型的内部参数和确切训练数据通常不公开。"), React.createElement(Fragment, { key: "gen4" }, "Qwen模型系列发展迅速，本表格信息尽可能还原原始提供的内容并结合可查证链接，最新信息请以官方渠道为准。"), React.createElement(Fragment, { key: "gen5" }, "QVQ, QwQ, and Qwen3 entries remain hypothetical or future-looking, based on the original HTML structure.")], referencesTitle: "数据来源参考：", references: [{ id: "Q-1", url: "https://qwenlm.github.io/blog/qwen-7b/", text: "Qwen-7B Blog" }, { id: "Q-2", url: "https://arxiv.org/abs/2308.01033", text: "Qwen-7B Memo" }, { id: "Q-3", url: "https://arxiv.org/abs/2309.16609", text: "Qwen Technical Report (covers 7B, 14B, 1.8B, 72B)" }, { id: "Q-4", url: "https://qwenlm.github.io/blog/qwen-14b/", text: "Qwen-14B Blog" }, { id: "Q-5", url: "https://qwenlm.github.io/blog/qwen-72b/", text: "Qwen-72B Blog (also mentions 1.8B)" }, { id: "Q-6", url: "https://github.com/QwenLM/Qwen-VL", text: "Qwen-VL GitHub" }, { id: "Q-7", url: "https://arxiv.org/abs/2308.12966", text: "Qwen-VL Technical Report" }, { id: "Q-8", url: "https://qwenlm.github.io/blog/qwen1.5/", text: "Qwen1.5 Blog" }, { id: "Q-9", url: "https://huggingface.co/collections/Qwen/qwen15-65c05357947317d359595941", text: "Qwen1.5 Hugging Face Collection" }, { id: "Q-10", url: "https://huggingface.co/Qwen/Qwen1.5-MoE-A2.7B", text: "Qwen1.5-MoE-A2.7B Hugging Face" }, { id: "Q-11", url: "https://qwenlm.github.io/blog/qwen2/", text: "Qwen2 Blog" }, { id: "Q-12", url: "https://arxiv.org/abs/2406.04852", text: "Qwen2 Technical Report" }, { id: "Q-13", url: "https://qwenlm.github.io/blog/qwen-vl-plus-max/", text: "Qwen-VL-Plus/Max Blog (context for Qwen2-VL-72B, Qwen2.5-VL-Instruct, QVQ-Max)" }, { id: "Q-14", url: "https://arxiv.org/abs/2403.13606", text: "Qwen-VL-Max Technical Report (context for Qwen2-VL-72B, Qwen2.5-VL-Instruct)" }, { id: "Q-15", url: "https://help.aliyun.com/zh/dashscope/developer-reference/model-introduction#04846770f82wz", text: "Dashscope Model Introduction (for Qwen2.5 API)" }, { id: "Q-16", url: "https://arxiv.org/abs/2403.17021", text: "Qwen-Audio (Thinker-Talker Architecture for Qwen2.5-Omni)" }, { id: "Q-17", url: "https://huggingface.co/Qwen/Qwen1.5-7B-Chat-1M", text: "Qwen1.5-7B-Chat-1M Hugging Face (example for Qwen2.5-1M Series)" }, { id: "Q-18", url: "https://arxiv.org/abs/2401.14529", text: "Qwen 1M Technical Report (actual Jan 2024)" }, { id: "Q-19", url: "https://arxiv.org/abs/2404.19770", text: "LLM Training Practices (Qwen3 context, actual April 2024)" }].map(ref => ({ ...ref, url: ref.url.trim().startsWith('http') ? ref.url.trim() : `https://${ref.url.trim()}` })) };

const openaiTableRows = [
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "早期 GPT foundational models"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "GPT-1" }, { content: "- (研究)" }, { content: "论文 (2018年6月11日) [O-1], [O-2]" }, { content: "生成式预训练，无监督预训练+监督微调。" }, { content: "12层Transformer Decoder, BooksCorpus训练 (约5GB数据)。" }, { content: "512 (internal)" }, { content: "文本" }, { content: "117M" }, { content: "较小" }] },
  { cells: [{ content: "GPT-2" }, { content: "2019年2月 (部分) / 11月 (全部) [O-3]" }, { content: "论文 (2019年2月14日) [O-4]" }, { content: "更大规模，Zero-shot任务表现。" }, { content: "Transformer Decoder (最大48层), WebText训练 (40GB数据)。" }, { content: "1024" }, { content: "文本" }, { content: "117M, 345M, 774M, 1.5B" }, { content: "中等" }] },
  { cells: [{ content: "GPT-3" }, { content: "2020年6月11日 (API) [O-5]" }, { content: "论文 (2020年5月28日) [O-6]" }, { content: "大规模，上下文学习 (In-context learning)。" }, { content: "Transformer Decoder (最大96层 for 175B), 混合数据集训练。" }, { content: "2048 (davinci)" }, { content: "文本" }, { content: "多尺寸, 最高175B" }, { content: "约0.5T" }] },
  { cells: [{ content: "InstructGPT" }, { content: "- (研究, ChatGPT前身)" }, { content: "论文 (2022年1月27日) [O-7]" }, { content: "人类反馈指令微调 (RLHF)，提升遵循指令和安全性。" }, { content: "基于GPT-3微调。" }, { content: "同GPT-3" }, { content: "文本" }, { content: "1.3B, 6B, 175B (GPT-3规模)" }, { content: "基于GPT-3预训练" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "ChatGPT 与 GPT-3.5 / GPT-4.x 系列模型"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "ChatGPT (初代) / GPT-3.5" }, { content: "2022年11月30日 [O-8]" }, { content: "基于InstructGPT和GPT-3.5系列模型" }, { content: "对话式AI，RLHF，初步安全对齐。知识截至2021年Q4 (GPT-3.5)。" }, { content: "GPT-3.5系列模型 (如text-davinci-002/003微调)。" }, { content: "4096 (gpt-3.5-turbo)" }, { content: "文本" }, { content: "未披露 (GPT-3.5系列)" }, { content: "未公开" }] },
  { cells: [{ content: "GPT-4" }, { content: "2023年3月14日 (API与ChatGPT Plus) [O-9]" }, { content: "技术报告 (2023年3月15日) [O-10]" }, { content: "更强推理。知识截至2021年9月 (初版)。" }, { content: "Transformer-based (细节未公开, MoE传闻)。" }, { content: "8K/32K" }, { content: "文本、图像输入；文本输出。" }, { content: "未披露" }, { content: "未公开" }] },
  { cells: [{ content: "ChatGPT (插件与网页浏览)" }, { content: "2023年3月23日 (插件Alpha) [O-11] / 5月 (浏览Beta)" }, { content: "-" }, { content: "通过插件和工具扩展能力 (联网、代码执行等)。" }, { content: "搭载GPT-4 (及后续模型)。" }, { content: "同搭载模型" }, { content: "文本 + 工具使用" }, { content: "(基于GPT-4)" }, { content: "(同搭载模型)" }] },
  { cells: [{ content: "GPT-4 Turbo" }, { content: "2023年11月6日 (DevDay API) [O-12]" }, { content: "DevDay博客" }, { content: "更低价格，JSON模式，函数调用改进。知识截至2023年4月 (gpt-4-1106-preview), 后更新至2023年12月 (gpt-4-turbo-2024-04-09)。" }, { content: "GPT-4架构变体。" }, { content: "128K" }, { content: "文本、图像输入 (DALL·E 3, Vision API), 文本输出 (TTS, Whisper API)。" }, { content: "未披露" }, { content: "未公开" }] },
  { cells: [{ content: "GPT-4.1 (Hypothetical Series)" }, { content: "2024年4月 (API, e.g., gpt-4-turbo-2024-04-09 release) [O-14]" }, { content: "API/ChatGPT Release Notes" }, { content: "显著改进编码、指令遵循。 `gpt-4-turbo-2024-04-09` 是一个具体模型版本。" }, { content: "GPT-4 架构优化。" }, { content: "128K" }, { content: "文本、图像输入。" }, { content: "未披露" }, { content: "未公开" }] },
  { cells: [{ content: "GPT-4o (\"omni\")" }, { content: "2024年5月13日 [O-15]" }, { content: "模型卡 (2024年5月13日) [O-16]" }, { content: "原生多模态，更快响应，更自然语音交互。知识截至2023年10月。" }, { content: "单一新模型，端到端训练跨文本、视觉和音频。" }, { content: "128K" }, { content: "文本、音频、视觉 (输入与输出)。" }, { content: "未披露" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "OpenAI \"o-series\" Reasoning Models (Based on Original HTML & Timings)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "o1-preview / o1" }, { content: "2024年9月12日 (API & ChatGPT Pro) [O-17]" }, { content: "OpenAI博客 (2024年9月12日)" }, { content: "针对复杂推理任务 (STEM, 编码, 数学)，生成扩展内部思路链 (Chain-of-Thought)，RL微调。" }, { content: "Transformer-based, RL增强的CoT。" }, { content: "未披露" }, { content: "文本 (主要)" }, { content: "未披露" }, { content: "未披露 (专注于推理能力)" }] },
  { cells: [{ content: "o1-mini" }, { content: "2024年9月12日 (API & ChatGPT Pro) [O-17]" }, { content: "OpenAI博客 (2024年9月12日)" }, { content: "更快、更经济的o1版本，擅长编码和简单数学。" }, { content: "o1架构优化 (小型化)。" }, { content: "未披露" }, { content: "文本 (主要)" }, { content: "未披露" }, { content: "未披露 (编码和数学优化)" }] },
  { cells: [{ content: "GPT-4o mini audio" }, { content: "2024年12月 (Azure) [O-18]" }, { content: "Azure Release Notes" }, { content: "针对音频补全和实时音频交互优化。" }, { content: "基于GPT-4o audio。" }, { content: "未披露" }, { content: "音频输入/输出" }, { content: "未披露" }, { content: "(基于GPT-4o)" }] },
  { cells: [{ content: "o3 / o3-mini (Expected)" }, { content: "晚2024年/2025年初 (API, Azure) [O-19]" }, { content: "OpenAI Blog / arXiv paper on LRMs" }, { content: "o1的继任者，显著提升推理能力，视觉推理 (思考图像)。" }, { content: "o-series架构，增强RL和CoT。" }, { content: "未披露" }, { content: "文本、视觉 (图像可融入思路链)" }, { content: "未披露" }, { content: "未披露 (深度分析和复杂问题解决)" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "未来展望 (GPT-5 / 下一代)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "GPT-5 / 下一代前沿模型" }, { content: "(持续研发中)" }, { content: "-" }, { content: "预计在可扩展性、推理 (可能整合o-series成果)、多模态、安全性等方面有更大突破。" }, { content: "未知。" }, { content: "未知" }, { content: "(预计更深度和广泛的多模态)" }, { content: "未知" }, { content: "未知" }] },
];
const openaiNotes = { general: [React.createElement(Fragment, { key: "gen1" }, React.createElement("strong", null, "注：")), React.createElement(Fragment, { key: "gen2" }, "- 表示信息暂缺、不适用或未明确公开。"), React.createElement(Fragment, { key: "gen3" }, "模型参数量和训练Token数量，尤其是针对特定微调模型或最新模型，OpenAI通常不公开具体数字。"), React.createElement(Fragment, { key: "gen4" }, "知识截止日期会随模型版本更新而变化。"), React.createElement(Fragment, { key: "gen5" }, "GPT-4.1 in the table refers to specific iterative updates like `gpt-4-turbo-2024-04-09`, not necessarily a distinct named series. o-series (beyond o1) entries are based on original HTML structure and may represent internal or speculative naming; official releases may differ."), React.createElement(Fragment, { key: "gen6" }, "OpenAI的研究和产品迭代非常迅速，最新信息请以官方渠道为准。")], referencesTitle: "数据来源参考：", references: [{ id: "O-1", url: "https://openai.com/research/language-unsupervised", text: "GPT-1 Research Page" }, { id: "O-2", url: "https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf", text: "GPT-1 Paper" }, { id: "O-3", url: "https://openai.com/research/better-language-models", text: "GPT-2 Research Page" }, { id: "O-4", url: "https://d4mucfpksywv.cloudfront.net/better-language-models/language_models_are_unsupervised_multitask_learners.pdf", text: "GPT-2 Paper" }, { id: "O-5", url: "https://openai.com/blog/openai-api/", text: "OpenAI API Announcement" }, { id: "O-6", url: "https://arxiv.org/abs/2005.14165", text: "GPT-3 Paper" }, { id: "O-7", url: "https://arxiv.org/abs/2203.02155", text: "InstructGPT Paper" }, { id: "O-8", url: "https://openai.com/blog/chatgpt/", text: "ChatGPT Launch Blog" }, { id: "O-9", url: "https://openai.com/research/gpt-4", text: "GPT-4 Research Page" }, { id: "O-10", url: "https://arxiv.org/abs/2303.08774", text: "GPT-4 Technical Report" }, { id: "O-11", url: "https://openai.com/blog/chatgpt-plugins", text: "ChatGPT Plugins Blog" }, { id: "O-12", url: "https://openai.com/blog/new-models-and-developer-products-announced-at-devday", text: "OpenAI DevDay New Models Blog" }, { id: "O-14", url: "https://help.openai.com/en/articles/9751617-model-release-notes", text: "OpenAI Model Release Notes (for specific versions like gpt-4-turbo-2024-04-09)" }, { id: "O-15", url: "https://openai.com/index/hello-gpt-4o/", text: "GPT-4o Announcement" }, { id: "O-16", url: "https://openai.com/research/gpt-4o", text: "GPT-4o Model Card" }, { id: "O-17", url: "https://openai.com/blog/o1-reasoning-models", text: "o1 Reasoning Models Blog" }, { id: "O-18", url: "https://learn.microsoft.com/en-us/azure/ai-services/openai/whats-new", text: "Azure OpenAI What's New (for GPT-4o mini audio)" }, { id: "O-19", url: "https://learn.microsoft.com/en-us/azure/ai-services/openai/whats-new#reasoning-models---o3-and-o4-mini", text: "Azure OpenAI What's New (for o3/o4-mini)" }].map(ref => ({ ...ref, url: ref.url.trim().startsWith('http') ? ref.url.trim() : `https://${ref.url.trim()}` })) };

const metaTableRows = [
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Llama 1"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Llama" }, { content: "2023年2月24日 (访问申请) [M-1]" }, { content: "论文 (2023年2月27日) [M-2]" }, { content: "高效基础语言模型，公开数据训练。非商业授权。" }, { content: "Transformer, RoPE, SwiGLU, RMSNorm." }, { content: "2K" }, { content: "文本" }, { content: "7B, 13B, 33B, 65B" }, { content: "1.0T (7B/13B) / 1.4T (33B/65B)" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Llama 2"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Llama 2 / Llama 2-Chat" }, { content: "2023年7月18日 (开源) [M-3]" }, { content: "论文 (2023年7月18日) [M-4]" }, { content: "对话优化 (Chat)，GQA (70B模型)，可商用。" }, { content: "Llama 1改进, GQA (70B), RMSNorm. RLHF for Chat." }, { content: "4K" }, { content: "文本" }, { content: "7B, 13B, 70B" }, { content: "2.0T" }] },
  { cells: [{ content: "Code Llama" }, { content: React.createElement(Fragment, null, "2023年8月24日 (7B,13B,34B) [M-5];", React.createElement("br", null), "2024年1月29日 (70B) [M-6]") }, { content: React.createElement(Fragment, null, "论文 (2023年8月) [M-7];", React.createElement("br", null), "70B: 模型卡/博客") }, { content: "代码生成/补全/调试。Python和Instruct版本。" }, { content: "Llama 2 架构，代码任务微调。" }, { content: "高达100K (特定模型)" }, { content: "文本/代码" }, { content: "7B, 13B, 34B, 70B" }, { content: "Llama 2预训练 + 0.5T代码" }] },
  { cells: [{ content: "Llama Guard" }, { content: "2023年12月7日 [M-8]" }, { content: "博客/模型卡" }, { content: "LLM输入输出风险安全模型。Purple Llama倡议。" }, { content: "基于Llama 2-Chat 7B微调。" }, { content: "4K" }, { content: "文本 (安全分类)" }, { content: "7B" }, { content: "Llama 2预训练 + 安全微调数据" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Llama 3"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Llama 3 / Llama 3-Instruct" }, { content: "2024年4月18日 (开源) [M-9]" }, { content: "博客/模型卡 (2024年4月18日) [M-10]" }, { content: "显著提升性能，128K Tokenizer词汇表，全尺寸GQA。" }, { content: "Llama 2改进, 全尺寸GQA. Improved post-training." }, { content: "8K (可扩展)" }, { content: "文本" }, { content: "8B, 70B (后续有更大模型)" }, { content: "15T+" }] },
  { cells: [{ content: "Llama Guard 2" }, { content: "2024年4月18日 (随Llama 3发布) [M-11]" }, { content: "博客/模型卡" }, { content: "新一代安全模型，基于Llama 3，更强多语言和风险分类。" }, { content: "基于Llama 3 8B-Instruct微调。" }, { content: "8K" }, { content: "文本 (安全分类)" }, { content: "8B" }, { content: "Llama 3预训练 + 安全微调数据" }] },
  { cells: [{ content: "Meta Llama 3 Community Series" }, { content: "2024年6月6日 (宣布) [M-12]" }, { content: "博客/合作伙伴文档" }, { content: "Meta与伙伴合作，特定任务/区域优化的Llama 3模型。" }, { content: "基于Llama 3 架构微调。" }, { content: "8K (通常)" }, { content: "文本 (特定任务)" }, { content: "通常基于8B" }, { content: "Llama 3预训练 + 特定领域微调" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Llama 3.1 & Llama 3-V"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Llama 3.1 / Llama 3.1-Instruct" }, { content: "2024年7月23日 (开源) [M-13]" }, { content: "模型卡 (2024年7月23日) [M-14]" }, { content: "发布405B模型，增强推理、代码生成，可控性。" }, { content: "Llama 3优化, 405B用GQA, KV缓存fp8." }, { content: "128K" }, { content: "文本" }, { content: "8B, 70B, 405B" }, { content: "15T+ (8B/70B); 405B数据量更大" }] },
  { cells: [{ content: "Meta Llama 3-V (Instruct)" }, { content: "2024年7月23日 (开源) [M-13]" }, { content: "模型卡 (2024年7月23日) [M-15]" }, { content: "Llama家族首个官方多模态模型。" }, { content: "Llama 3.1文本解码器 + 新视觉编码器." }, { content: "128K" }, { content: "图像、文本输入，文本输出" }, { content: "8B, 70B (405B计划中)" }, { content: "Llama 3.1预训练 + 视觉数据" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Llama 4 (\"The Llama 4 Herd\") (Based on original HTML, dates are future)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Llama 4 Scout" }, { content: "2025年4月5日 (基于原始HTML) [M-16]" }, { content: "博客 (2025年4月5日)" }, { content: "原生多模态，平衡性能与效率。知识截止 Aug 2024。" }, { content: "MoE (16专家), Transformer。" }, { content: "10M" }, { content: "图像、文本、视频输入，文本输出" }, { content: "17B (激活) / 109B (总)" }, { content: "未明确" }] },
  { cells: [{ content: "Llama 4 Maverick" }, { content: "2025年4月5日 (基于原始HTML) [M-16]" }, { content: "博客 (2025年4月5日)" }, { content: "原生多模态，增强推理和编码。知识截止 Aug 2024。" }, { content: "MoE (128专家), Transformer。" }, { content: "1M" }, { content: "图像、文本、视频输入，文本输出" }, { content: "17B (激活) / 400B (总)" }, { content: "未明确" }] },
  { cells: [{ content: "Llama 4 Behemoth (Preview)" }, { content: "2025年4月5日 (预览, 基于原始HTML) [M-16]" }, { content: "博客 (2025年4月5日)" }, { content: "旗舰多模态MoE模型，仍在训练中。" }, { content: "MoE (16专家), Transformer。" }, { content: "未明确" }, { content: "图像、文本、视频输入，文本输出" }, { content: "288B (激活) / 2T (总)" }, { content: "未明确" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Meta Multimodal Research Models (非Llama系列参考)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "CM3leon" }, { content: "2023年7月13日 (博客) [M-17]" }, { content: "论文 (2023年7月14日) [M-18]" }, { content: "检索增强、Token高效的自回归多模态模型，文图互生。" }, { content: "Transformer解码器，检索增强。" }, { content: "未明确" }, { content: "图像、文本输入，图像、文本输出" }, { content: "350M, 7B (实验); 30B (潜力)" }, { content: "数T tokens (图像文本对)" }] },
  { cells: [{ content: "Chameleon" }, { content: "2024年5月14日 (博客) [M-19]" }, { content: "论文 (2024年5月14日) [M-20]" }, { content: "早期高能力原生多模态模型，理解生成图像与文本序列。" }, { content: "统一Transformer架构，端到端多模态。" }, { content: "未明确" }, { content: "图像、文本序列输入/输出" }, { content: "7B, 34B" }, { content: "4.4T (多模态数据)" }] },
];
const metaNotes = { general: [React.createElement(Fragment, { key: "gen1" }, React.createElement("strong", null, "注：")), React.createElement(Fragment, { key: "gen2" }, "- 表示信息暂缺、不适用或未明确公开。"), React.createElement(Fragment, { key: "gen3" }, "Llama 4 模型参数量分为 \"激活参数\" 和 \"总参数\" (由于MoE架构)。"), React.createElement(Fragment, { key: "gen4" }, "Llama 2 及之后主要版本通常允许商业使用（需遵守相应许可协议）。Llama 1最初为非商业授权。"), React.createElement(Fragment, { key: "gen5" }, "CM3leon, Chameleon 为Meta在多模态领域的重要模型，独立于Llama系列，列此作为参考。"), React.createElement(Fragment, { key: "gen6" }, "本表格信息基于当前可查证公开资料 (截至2025年初的模拟时间点及知识库更新)，Meta AI 模型发展迅速，最新信息请以官方渠道为准。 Llama 4 entries are based on future dates from original HTML.")], referencesTitle: "数据来源参考：", references: [{ id: "M-1", url: "https://ai.meta.com/blog/large-language-model-llama-meta-ai/", text: "Llama 1 Blog" }, { id: "M-2", url: "https://arxiv.org/abs/2302.13971", text: "Llama 1 Paper" }, { id: "M-3", url: "https://ai.meta.com/llama/", text: "Llama 2 Page" }, { id: "M-4", url: "https://arxiv.org/abs/2307.09288", text: "Llama 2 Paper" }, { id: "M-5", url: "https://ai.meta.com/blog/code-llama-large-language-model-coding/", text: "Code Llama (7-34B) Blog" }, { id: "M-6", url: "https://ai.meta.com/blog/code-llama-70b-models/", text: "Code Llama 70B Blog" }, { id: "M-7", url: "https://arxiv.org/abs/2308.12950", text: "Code Llama Paper (7-34B)" }, { id: "M-8", url: "https://ai.meta.com/blog/llama-guard-safe-and-helpful-llms/", text: "Llama Guard Blog" }, { id: "M-9", url: "https://ai.meta.com/blog/meta-llama-3/", text: "Llama 3 Blog" }, { id: "M-10", url: "https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md", text: "Llama 3 Model Card GitHub" }, { id: "M-11", url: "https://ai.meta.com/llama/purple-llama/", text: "Purple Llama Page (Llama Guard 2)" }, { id: "M-12", url: "https://ai.meta.com/blog/meta-llama-3-community-series-models/", text: "Llama 3 Community Series Blog" }, { id: "M-13", url: "https://ai.meta.com/blog/meta-llama-3-1/", text: "Llama 3.1 and 3-V Blog" }, { id: "M-14", url: "https://github.com/meta-llama/llama3/blob/main/MODEL_CARD_LLAMA3.1.md", text: "Llama 3.1 Model Card GitHub" }, { id: "M-15", url: "https://github.com/meta-llama/llama3/blob/main/MODEL_CARD_LLAMA3-V.md", text: "Llama 3-V Model Card GitHub" }, { id: "M-16", url: "https://ai.meta.com/blog/llama-4-herd-multimodal-ai-innovation/", text: "Llama 4 Herd Blog (from original HTML)" }, { id: "M-17", url: "https://ai.meta.com/blog/generative-ai-text-images-cm3leon/", text: "CM3leon Blog" }, { id: "M-18", url: "https://arxiv.org/abs/2307.07632", text: "CM3leon Paper" }, { id: "M-19", url: "https://ai.meta.com/blog/meta-chameleon-early-stage-multimodal-models/", text: "Chameleon Blog" }, { id: "M-20", url: "https://arxiv.org/abs/2405.09818", text: "Chameleon Paper" }].map(ref => ({ ...ref, url: ref.url.trim().startsWith('http') ? ref.url.trim() : `https://${ref.url.trim()}` })) };

const googleTableRows = [
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Gemini 1.0"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Gemini 1.0 Ultra" }, { content: React.createElement(Fragment, null, "2023年12月6日 (宣布) [G-1];", React.createElement("br", null), "2024年2月8日 (广泛可用) [G-2]") }, { content: "技术报告 (2023年12月6日) [G-3]" }, { content: "Google当时能力最强、规模最大的模型，优异的基准测试表现，强大的推理能力。" }, { content: "基于Transformer解码器，针对多模态和大规模训练进行了优化。" }, { content: "32K (标准)" }, { content: "原生支持文本、代码、图像、音频、视频输入。" }, { content: "Ultra" }, { content: "未公开" }] },
  { cells: [{ content: "Gemini 1.0 Pro" }, { content: React.createElement(Fragment, null, "2023年12月6日 (API可用) [G-1];", React.createElement("br", null), "2024年2月15日 (128K上下文预览) [G-4]") }, { content: "技术报告 (2023年12月6日) [G-3]" }, { content: "平衡性能和可扩展性，适用于广泛的任务。" }, { content: "同Gemini Ultra，但规模和计算需求更优化。" }, { content: "32K (标准 API); 128K (API 预览版)" }, { content: "原生支持文本、代码、图像、音频、视频输入。" }, { content: "Pro" }, { content: "未公开" }] },
  { cells: [{ content: React.createElement(Fragment, null, "Gemini 1.0 Nano", React.createElement(ModelVariant, null, "(Nano-1, Nano-2)")) }, { content: "2023年12月6日 (集成于Pixel 8 Pro) [G-1]" }, { content: "技术报告 (2023年12月6日) [G-3]" }, { content: "最高效的端侧设备模型，如智能回复、摘要。" }, { content: "针对低功耗设备优化。" }, { content: "设备端优化 (较短)" }, { content: "文本 (主要用于设备端)" }, { content: "Nano-1 (1.8B), Nano-2 (3.25B)" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Gemini 1.5"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Gemini 1.5 Pro" }, { content: React.createElement(Fragment, null, "2024年2月15日 (早期预览) [G-5];", React.createElement("br", null), "2024年4月9日 (Vertex AI公测) [G-6];", React.createElement("br", null), "2024年6月27日 (1M GA; 2M预览) [G-7]") }, { content: "技术报告 (2024年2月15日) [G-8]" }, { content: "近1.0 Ultra性能，计算效率显著提高。突破性的长上下文理解能力。" }, { content: "基于Transformer和MoE架构。" }, { content: "128K (标准); 1M (GA); 2M (预览)" }, { content: "原生支持文本、代码、图像、音频、视频。长上下文多模态理解增强。" }, { content: "Pro" }, { content: "未公开" }] },
  { cells: [{ content: "Gemini 1.5 Flash" }, { content: React.createElement(Fragment, null, "2024年5月14日 (Google I/O 宣布) [G-9];", React.createElement("br", null), "2024年6月27日 (GA) [G-7]") }, { content: "博客 (2024年5月14日)" }, { content: "针对速度和效率优化的轻量级模型，保持高质量和长上下文能力。" }, { content: "基于Transformer和MoE架构，针对速度优化。" }, { content: "1M" }, { content: "原生支持文本、代码、图像、音频、视频。" }, { content: "Flash" }, { content: "未公开" }] },
  { cells: [{ content: "Gemini 1.5 Flash-8B (exp)" }, { content: "2024年9月24日 (Stable Release Note提及) [G-10]" }, { content: "Release Notes" }, { content: "为低智能任务设计的小型实验性模型。" }, { content: "架构未详细说明。" }, { content: "未详细说明" }, { content: "未详细说明" }, { content: "Flash-8B (exp)" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Gemini 2.0 (Based on original HTML future dates)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Gemini 2.0 Flash" }, { content: React.createElement(Fragment, null, "2024年12月11日 (Experimental宣布) [G-11];", React.createElement("br", null), "2025年1月30日 (Gemini App默认模型) [G-12];", React.createElement("br", null), "2025年2月5日 (GA on Vertex AI) [G-13]") }, { content: "博客 (2024年12月11日)" }, { content: "下一代特性，更优速度，原生工具使用，多模态生成。为\"智能体时代\"(Agentic Era)设计。" }, { content: "架构未详细说明。" }, { content: "1M" }, { content: "文本、图像、音频 (输入/输出)，视频 (输入)，内置工具使用。" }, { content: "Flash" }, { content: "未公开" }] },
  { cells: [{ content: "Gemini 2.0 Flash-Lite" }, { content: "2025年2月25日 (GA in Gemini API) [G-14]" }, { content: "Release Notes" }, { content: "针对速度、规模和成本效率进行优化的版本。" }, { content: "架构未详细说明。" }, { content: "未详细说明" }, { content: "未详细说明" }, { content: "Flash-Lite" }, { content: "未公开" }] },
  { cells: [{ content: "Gemini 2.0 Flash Thinking (Experimental)" }, { content: "2025年1月21日 (Preview in Gemini API) [G-15]" }, { content: "Release Notes" }, { content: "展示语言模型思考过程的版本。" }, { content: "架构未详细说明。" }, { content: "未详细说明" }, { content: "未详细说明" }, { content: "Flash Thinking (Experimental)" }, { content: "未公开" }] },
  { cells: [{ content: "Gemini 2.0 Flash Live (Preview)" }, { content: "2025年3月12日 (Preview in Gemini API) [G-16]" }, { content: "Release Notes" }, { content: "用于实时双向流式API的模型。" }, { content: "架构未详细说明。" }, { content: "未详细说明" }, { content: "实时音频、视频流输入。" }, { content: "Flash Live (Preview)" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Gemini 2.5 (Based on original HTML future dates)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "Gemini 2.5 Pro (Experimental / Preview)" }, { content: React.createElement(Fragment, null, "2025年3月25日 (Experimental宣布) [G-17];", React.createElement("br", null), "2025年5月6日 (更新版本, Release Note) [G-18]") }, { content: "博客 (2025年3月25日)" }, { content: "Google迄今最智能模型，SOTA表现，原生\"思考\"(Thinking)能力，复杂任务（编码、数学、图像理解）性能优越。" }, { content: "架构未详细说明。" }, { content: "1M (计划显著扩展)" }, { content: "文本、音频、图像、视频、代码库。" }, { content: "Pro (Experimental)" }, { content: "未公开" }] },
  { isSeriesHeader: true, cells: [{ content: React.createElement("strong", null, "Specialized / Related Models (参考)"), colSpan: 9, isHeader: true }] },
  { cells: [{ content: "PaliGemma" }, { content: "2024年5月 (Vertex AI Model Garden) [G-19]" }, { content: "博客/代码" }, { content: "基于PaLI-3架构的视觉语言模型，使用开放的SigLIP视觉模型和Gemma语言模型组件。" }, { content: "视觉编码器 + 文本解码器。" }, { content: "专注于视觉语言任务" }, { content: "图像、文本输入，文本输出。" }, { content: "3B" }, { content: "未公开" }] },
  { cells: [{ content: React.createElement(Fragment, null, "Project Astra ", React.createElement(ModelVariant, null, "(概念/未来愿景)")) }, { content: "2024年5月14日 (Google I/O 2024 演示) [G-20]" }, { content: "概念演示" }, { content: "未来AI助手愿景，旨在构建能够理解上下文、实时响应、具有记忆和主动性的多模态AI智能体。" }, { content: "基于Gemini模型构建。" }, { content: "未公开" }, { content: "实时多模态交互 (语音、视觉、文本)。" }, { content: "- (概念阶段)" }, { content: "未公开" }] },
];
const googleNotes = { general: [React.createElement(Fragment, { key: "gen1" }, React.createElement("strong", null, "注：")), React.createElement(Fragment, { key: "gen2" }, "- 表示信息暂缺、不适用或未明确公开。"), React.createElement(Fragment, { key: "gen3" }, "Gemini模型的具体参数量 (除Nano和PaliGemma外) 通常不公开。"), React.createElement(Fragment, { key: "gen4" }, "\"发布/可用时间 (状态)\" 可能指模型宣布时间、API初步可用/预览时间、GA时间或更广泛的集成时间。"), React.createElement(Fragment, { key: "gen5" }, "PaliGemma是基于Gemma的视觉语言模型。Project Astra代表基于Gemini的未来应用方向。"), React.createElement(Fragment, { key: "gen6" }, "本表格信息基于当前可查证公开资料 (截至2025年初的模拟时间点及知识库更新)，Google AI 模型发展迅速，最新信息请以官方渠道为准。 Gemini 2.0 and 2.5 entries based on future dates from original HTML.")], referencesTitle: "数据来源参考：", references: [{ id: "G-1", url: "https://blog.google/technology/ai/google-gemini-ai/", text: "Google Gemini Announcement (Dec 2023)" }, { id: "G-2", url: "https://blog.google/products/gemini/bard-gemini-advanced-app/", text: "Gemini Advanced and App Announcement (Feb 2024)" }, { id: "G-3", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_1_report.pdf", text: "Gemini 1.0 Technical Report" }, { id: "G-4", url: "https://ai.google.dev/docs/release_notes#february_15_2024", text: "Google AI Release Notes (Feb 15, 2024 - 128K Context for Pro)" }, { id: "G-5", url: "https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/", text: "Gemini 1.5 Pro Early Preview (Feb 2024)" }, { id: "G-6", url: "https://cloud.google.com/blog/products/ai-machine-learning/gemini-15-pro-now-available-in-public-preview-in-vertex-ai", text: "Gemini 1.5 Pro Public Preview in Vertex AI (Apr 2024)" }, { id: "G-7", url: "https://ai.google.dev/docs/release_notes#june_27_2024", text: "Google AI Release Notes (June 27, 2024 - Gemini 1.5 Pro/Flash GA)" }, { id: "G-8", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_v1_5_report.pdf", text: "Gemini 1.5 Technical Report" }, { id: "G-9", url: "https://blog.google/technology/developers/google-io-2024-gemini-flash-project-astra-and-more/", text: "Google I/O 2024: Gemini 1.5 Flash, Project Astra" }, { id: "G-10", url: "https://ai.google.dev/docs/release_notes#september_24_2024", text: "Google AI Release Notes (Sept 24, 2024 - Gemini 1.5 Flash-8B exp)" }, { id: "G-11", url: "https://blog.google/products/gemini/gemini-2-flash-experimental/", text: "Gemini 2.0 Flash Experimental (Original HTML Future Date)" }, { id: "G-12", url: "https://blog.google/products/gemini/gemini-app-now-defaults-to-gemini-2-flash/", text: "Gemini App Default to Gemini 2.0 Flash (Original HTML Future Date)" }, { id: "G-13", url: "https://cloud.google.com/vertex-ai/docs/generative-ai/release-notes#february_5_2025", text: "Vertex AI Release Notes - Gemini 2.0 Flash GA (Original HTML Future Date)" }, { id: "G-14", url: "https://ai.google.dev/docs/release_notes#february_25_2025", text: "Google AI Release Notes - Gemini 2.0 Flash-Lite GA (Original HTML Future Date)" }, { id: "G-15", url: "https://ai.google.dev/docs/release_notes#january_21_2025", text: "Google AI Release Notes - Gemini 2.0 Flash Thinking Preview (Original HTML Future Date)" }, { id: "G-16", url: "https://ai.google.dev/docs/release_notes#march_12_2025", text: "Google AI Release Notes - Gemini 2.0 Flash Live Preview (Original HTML Future Date)" }, { id: "G-17", url: "https://blog.google/products/gemini/gemini-2-5-pro-experimental/", text: "Gemini 2.5 Pro Experimental (Original HTML Future Date)" }, { id: "G-18", url: "https://ai.google.dev/docs/release_notes#may_6_2025", text: "Google AI Release Notes - Gemini 2.5 Pro Update (Original HTML Future Date)" }, { id: "G-19", url: "https://cloud.google.com/vertex-ai/docs/generative-ai/open-models/paligemma", text: "PaliGemma on Vertex AI" }, { id: "G-20", url: "https://blog.google/technology/ai/google-io-2024-keynote-recap/", text: "Google I/O 2024 Keynote Recap (Project Astra Demo)" }].map(ref => ({ ...ref, url: ref.url.trim().startsWith('http') ? ref.url.trim() : `https://${ref.url.trim()}` })) };

const ALL_LLM_TAB_DATA = {
  anthropic: { id: "anthropic", label: "Anthropic Claude", headers: LLM_TABLE_HEADERS_DEFAULT, rows: anthropicTableRows, notes: anthropicNotes, theme: COMPANY_THEMES.anthropic },
  qwen: { id: "qwen", label: "Alibaba Qwen (通义千问)", headers: LLM_TABLE_HEADERS_DEFAULT, rows: qwenTableRows, notes: qwenNotes, theme: COMPANY_THEMES.qwen },
  openai: { id: "openai", label: "OpenAI GPT", headers: LLM_TABLE_HEADERS_DEFAULT, rows: openaiTableRows, notes: openaiNotes, theme: COMPANY_THEMES.openai },
  meta: { id: "meta", label: "Meta Llama", headers: LLM_TABLE_HEADERS_DEFAULT, rows: metaTableRows, notes: metaNotes, theme: COMPANY_THEMES.meta },
  google: { id: "google", label: "Google Gemini", headers: LLM_TABLE_HEADERS_DEFAULT, rows: googleTableRows, notes: googleNotes, theme: COMPANY_THEMES.google },
};
// --- END OF DATA FOR LLM Evolution ---


// --- START OF DATA FOR AI History ---
const aiHistoryData = [
    { year: "1943", event: "Warren McCulloch 和 Walter Pitts 发表《神经活动中思想内在性的逻辑演算》(A Logical Calculus of the Ideas Immanent in Nervous Activity)，提出了第一个神经元数学模型。", category: "Connectionist", people: "Warren McCulloch, Walter Pitts", sourceText: "论文", sourceLink: "https://www.cs.cmu.edu/~./epxing/Class/10715/reading/McCulloch.and.Pitts.pdf" },
    { year: "1950", event: "艾伦·图灵发表《计算机器与智能》(Computing Machinery and Intelligence)，提出了图灵测试作为机器智能的衡量标准。", category: "Milestone", people: "Alan Turing", sourceText: "论文", sourceLink: "https://academic.oup.com/mind/article/LIX/236/433/986238" },
    { year: "1951", event: "Marvin Minsky 和 Dean Edmonds 建造了 SNARC (Stochastic Neural Analog Reinforcement Calculator)，第一台人工神经网络计算机。", category: "Connectionist", people: "Marvin Minsky, Dean Edmonds", sourceText: "Minsky 的论文", sourceLink: "https://dspace.mit.edu/handle/1721.1/49313" },
    { year: "1952", event: "Arthur Samuel 开发了一款跳棋程序，这是最早的自学习程序之一。", category: "Application", people: "Arthur Samuel", sourceText: "IBM 期刊", sourceLink: "https://ieeexplore.ieee.org/document/5392560" },
    { year: "1956", event: "约翰·麦卡锡在达特茅斯会议上创造了“人工智能”(Artificial Intelligence)一词。这次会议被广泛认为是 AI 作为一个研究领域的开端。", category: "Milestone", people: "John McCarthy, Marvin Minsky, Nathaniel Rochester, Claude Shannon", sourceText: "达特茅斯提案", sourceLink: "http://jmc.stanford.edu/articles/dartmouth/dartmouth.pdf" },
    { year: "1957", event: "弗兰克·罗森布拉特开发了感知机 (Perceptron)，一种早期的神经网络，能够进行模式识别。", category: "Connectionist", people: "Frank Rosenblatt", sourceText: "康奈尔报告", sourceLink: "https://blogs.umass.edu/moir/files/2008/02/rosenblatt-1957.pdf" },
    { year: "1958", event: "约翰·麦卡锡开发了 Lisp 编程语言，成为 AI 研究的首选语言。", category: "Symbolic", people: "John McCarthy", sourceText: "Lisp 论文", sourceLink: "http://jmc.stanford.edu/articles/lisp/lisp.pdf" },
    { year: "1959", event: "Arthur Samuel 创造了术语“机器学习”(Machine Learning)。", category: "Milestone", people: "Arthur Samuel", sourceText: "论文参考", sourceLink: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3122697" },
    { year: "1965", event: "Joseph Weizenbaum 开发了 ELIZA，一个模拟心理治疗师的早期自然语言处理程序。", category: "Application", people: "Joseph Weizenbaum", sourceText: "ELIZA 论文", sourceLink: "https://dl.acm.org/doi/10.1145/365153.365168" },
    { year: "1966", event: "Shakey the Robot 由 SRI International 开发，是第一个能够推理自身行为的移动机器人。", category: "Robotics", people: "Charles Rosen, Nils Nilsson, Bertram Raphael", sourceText: "SRI 案例研究", sourceLink: "https://www.sri.com/case-studies/shakey-the-robot/" },
    { year: "1969", event: "Marvin Minsky 和 Seymour Papert 出版了《感知机》(Perceptrons)一书，指出了单层感知机的局限性，导致了神经网络研究资金的减少（第一次 AI 寒冬）。", category: "Milestone", people: "Marvin Minsky, Seymour Papert", sourceText: "书籍", sourceLink: "https://mitpress.mit.edu/9780262631112/perceptrons/" },
    { year: "1972", event: "MYCIN 专家系统在斯坦福大学开发，用于识别引起严重感染的细菌并推荐抗生素。", category: "Symbolic", people: "Edward Shortliffe, Bruce Buchanan", sourceText: "论文", sourceLink: "https://pubmed.ncbi.nlm.nih.gov/11659437/" },
    { year: "1979", event: "斯坦福车 (Stanford Cart) 成功穿过一个充满椅子的房间，未使用人工干预，依赖于计算机视觉。", category: "Robotics", people: "Hans Moravec", sourceText: "论文", sourceLink: "https://web.stanford.edu/class/cs223a/papers/moravec-cart.pdf" },
    { year: "1980s", event: "专家系统 (Expert Systems) 激增，AI 进入商业应用。日本启动了第五代计算机项目。", category: "Symbolic", people: "Various", sourceText: "关于 FGCS", sourceLink: "https://www.sciencedirect.com/topics/computer-science/fifth-generation-computer-systems" },
    { year: "1986", event: "Rumelhart, Hinton 和 Williams 发表《通过反向传播错误学习表征》(Learning representations by back-propagating errors)，普及了反向传播算法。", category: "Connectionist", people: "David Rumelhart, Geoffrey Hinton, Ronald J. Williams", sourceText: "Nature 论文", sourceLink: "https://www.nature.com/articles/323533a0" },
    { year: "1987-1993", event: "第二次 AI 寒冬：专家系统市场崩溃，政府对 AI 研究的资助减少。", category: "Milestone", people: "N/A", sourceText: "维基百科", sourceLink: "https://en.wikipedia.org/wiki/AI_winter" },
    { year: "1995", event: "Richard Wallace 开发了聊天机器人 A.L.I.C.E. (Artificial Linguistic Internet Computer Entity)，灵感来自 ELIZA。", category: "Application", people: "Richard Wallace", sourceText: "ALICE 基金会", sourceLink: "https://www.alicebot.org/" },
    { year: "1997", event: "IBM 的深蓝 (Deep Blue) 计算机击败了世界国际象棋冠军 Garry Kasparov。", category: "Application", people: "IBM Team", sourceText: "IBM 历史", sourceLink: "https://www.ibm.com/ibm/history/ibm_history_detail.html" },
    { year: "1997", event: "Sepp Hochreiter 和 Jürgen Schmidhuber 提出了长短期记忆 (LSTM) 循环神经网络。", category: "Connectionist", people: "Sepp Hochreiter, Jürgen Schmidhuber", sourceText: "LSTM 论文", sourceLink: "https://www.aaai.org/Papers/FLAIRS/1997/FLAIRS97-070.pdf" },
    { year: "1998", event: "Yann LeCun 等人开发了 LeNet-5，一种用于手写数字识别的开创性卷积神经网络 (CNN)。", category: "Vision", people: "Yann LeCun, Léon Bottou, Yoshua Bengio, Patrick Haffner", sourceText: "LeNet-5 论文", sourceLink: "http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf" },
    { year: "2006", event: "Geoffrey Hinton 等人表明，深度信念网络 (Deep Belief Networks) 可以使用逐层贪婪预训练进行有效训练，开启了深度学习 (Deep Learning) 的复兴。", category: "Connectionist", people: "Geoffrey Hinton, Simon Osindero, Yee-Whye Teh", sourceText: "论文", sourceLink: "https://www.cs.toronto.edu/~hinton/absps/fastnc.pdf" },
    { year: "2009", event: "ImageNet 数据集发布，这是一个包含数百万标记图像的大型视觉数据库，用于训练视觉对象识别软件。", category: "Vision", people: "Fei-Fei Li, Jia Deng, Kai Li, others", sourceText: "ImageNet 论文", sourceLink: "http://www.image-net.org/papers/imagenet_cvpr09.pdf" },
    { year: "2011", event: "IBM 的 Watson 在智力竞赛节目《危险边缘》(Jeopardy!) 中击败了人类冠军。", category: "Application", people: "IBM Team", sourceText: "IBM Watson", sourceLink: "https://www.ibm.com/ibm/history/ibm_watson.html" },
    { year: "2012", event: "Alex Krizhevsky, Ilya Sutskever 和 Geoffrey Hinton 开发的 AlexNet（一种深度卷积神经网络）在 ImageNet 大规模视觉识别挑战赛 (ILSVRC) 中取得了显著的胜利。", category: "Vision", people: "Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton", sourceText: "AlexNet 论文", sourceLink: "https://papers.nips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf" },
    { year: "2014", event: "Ian Goodfellow 等人提出了生成对抗网络 (GANs)。", category: "Connectionist", people: "Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio", sourceText: "GAN 论文", sourceLink: "https://papers.nips.cc/paper/2014/file/5ca3e9b122f61f8f06494c97b1afccf3-Paper.pdf" },
    { year: "2014", event: "DeepMind 开发了一种能够通过强化学习玩 Atari 游戏的 AI。", category: "Application", people: "DeepMind Team (Volodymyr Mnih et al.)", sourceText: "Nature 论文 (2015)", sourceLink: "https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf" },
    { year: "2015", event: "OpenAI 由 Elon Musk, Sam Altman 等人创立，旨在促进和发展友好的 AI。", category: "Milestone", people: "Elon Musk, Sam Altman, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, John Schulman", sourceText: "OpenAI 公告", sourceLink: "https://openai.com/blog/introducing-openai/" },
    { year: "2016", event: "DeepMind 的 AlphaGo 击败了世界围棋冠军李世石。", category: "Application", people: "DeepMind Team (David Silver et al.)", sourceText: "Nature 论文", sourceLink: "https://www.nature.com/articles/nature16961" },
    { year: "2017", event: "Google Brain 的 Ashish Vaswani 等人发表了《注意力就是你所需要的一切》(Attention Is All You Need)，介绍了 Transformer 架构。", category: "LLM", people: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin", sourceText: "Transformer 论文", sourceLink: "https://papers.nips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf" },
    { year: "2018", event: "OpenAI 发布了 GPT (Generative Pre-trained Transformer)。", category: "LLM", people: "OpenAI Team (Alec Radford et al.)", sourceText: "GPT 论文", sourceLink: "https://s3-us-west-2.amazonaws.com/openai-assets/research-covers/language-unsupervised/language_understanding_paper.pdf" },
    { year: "2018", event: "Google 发布了 BERT (Bidirectional Encoder Representations from Transformers)，在各种 NLP 任务中取得了最先进的成果。", category: "LLM", people: "Google AI Language (Jacob Devlin et al.)", sourceText: "BERT 论文", sourceLink: "https://arxiv.org/abs/1810.04805" },
    { year: "2019", event: "OpenAI 发布了 GPT-2，一个具有 15 亿参数的大型语言模型。由于担心被滥用，最初并未完全发布。", category: "LLM", people: "OpenAI Team", sourceText: "GPT-2 博客", sourceLink: "https://openai.com/blog/better-language-models/" },
    { year: "2020", event: "OpenAI 发布了 GPT-3，一个具有 1750 亿参数的语言模型，展示了强大的少样本学习能力。", category: "LLM", people: "OpenAI Team (Tom B. Brown et al.)", sourceText: "GPT-3 论文", sourceLink: "https://arxiv.org/abs/2005.14165" },
    { year: "2021", event: "GitHub 与 OpenAI 合作推出了 GitHub Copilot，一个由 Codex (GPT-3 的一个版本) 驱动的 AI 配对程序员。", category: "Application", people: "GitHub, OpenAI", sourceText: "Copilot 公告", sourceLink: "https://github.blog/2021-06-29-introducing-github-copilot-ai-pair-programmer/" },
    { year: "2021", event: "DeepMind 发布了 AlphaFold2，它以前所未有的准确性解决了蛋白质折叠问题。", category: "Application", people: "DeepMind Team (John Jumper et al.)", sourceText: "Nature 论文", sourceLink: "https://www.nature.com/articles/s41586-021-03819-2" },
    { year: "2022", event: "2月：Midjourney v1 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2022", event: "3月：OpenAI 通过 API 发布 text-davinci-002 和 code-davinci-002。", category: "LLM", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/blog/new-models-and-developer-products" },
    { year: "2022", event: "4月：Midjourney v2 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2022", event: "4月：DALL-E 2 宣布逐步发布。(*special*)", category: "Multimodal, Milestone", people: "OpenAI", sourceText: "DALL-E 2 页面", sourceLink: "https://openai.com/dall-e-2/" },
    { year: "2022", event: "7月：Midjourney v3 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2022", event: "8月：Stable Diffusion 1.4 发布。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 博客", sourceLink: "https://stability.ai/blog/stable-diffusion-public-release" },
    { year: "2022", event: "10月：Stable Diffusion 1.5 可用。", category: "Multimodal", people: "Stability AI", sourceText: "Hugging Face (v1.5)", sourceLink: "https://huggingface.co/runwayml/stable-diffusion-v1-5" },
    { year: "2022", event: "11月：OpenAI 发布使用 GPT-3.5 的聊天机器人 ChatGPT，迅速走红。(*special*)", category: "LLM, Milestone", people: "OpenAI", sourceText: "ChatGPT 博客", sourceLink: "https://openai.com/blog/chatgpt/" },
    { year: "2022", event: "11月：Midjourney v4 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2022", event: "11月：Stable Diffusion 2.0 发布。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 博客", sourceLink: "https://stability.ai/blog/stable-diffusion-v2-release" },
    { year: "2022", event: "12月：Stable Diffusion 2.1 发布。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 博客", sourceLink: "https://stability.ai/blog/stablediffusion2-1-release7-dec-2022" },
    { year: "2023", event: "2月：Meta 以开源形式发布 LLaMA 语言模型用于研究目的，模型随后泄露。(*special*)", category: "LLM, Milestone", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/large-language-model-llama-meta-ai/" },
    { year: "2023", event: "2月：Microsoft 逐步发布 Bing AI，一个基于升级版 GPT 模型并集成互联网搜索的 AI 聊天。", category: "LLM, Application", people: "Microsoft, OpenAI", sourceText: "Microsoft 博客", sourceLink: "https://blogs.microsoft.com/blog/2023/02/07/reinventing-search-with-a-new-ai-powered-microsoft-bing-and-edge-your-copilot-for-the-web/" },
    { year: "2023", event: "3月：Midjourney v5 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2023", event: "3月：OpenAI 的 GPT-4 模型部分发布，具有多模态图像分析和改进的多语言支持。", category: "Multimodal, LLM", people: "OpenAI", sourceText: "GPT-4 研究", sourceLink: "https://openai.com/research/gpt-4" },
    { year: "2023", event: "3月：Google 有限度发布基于 LaMDA 语言模型的 AI 聊天 Bard。", category: "LLM", people: "Google", sourceText: "Google 博客 (Bard)", sourceLink: "https://blog.google/technology/ai/an-important-next-step-on-our-ai-journey/" },
    { year: "2023", event: "4月：Adobe 以 Beta 版向等待名单发布 Firefly 图像创建模型。该模型允许多种功能，包括文本格式化。", category: "Multimodal", people: "Adobe", sourceText: "Adobe 博客", sourceLink: "https://blog.adobe.com/en/publish/2023/03/21/adobe-firefly-creativity-generative-ai" },
    { year: "2023", event: "5月：Midjourney v5.1 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2023", event: "5月：Google 宣布升级 Bard，将其迁移到升级后的 PaLM 2 语言模型。它将支持180个国家和多种语言。", category: "LLM", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/technology/ai/google-bard-palm-2-upgrades-may-2023/" },
    { year: "2023", event: "6月：Midjourney v5.2 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2023", event: "7月：Stable Diffusion XL 1.0 发布。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 博客", sourceLink: "https://stability.ai/blog/stable-diffusion-xl-1-0-release" },
    { year: "2023", event: "7月：Anthropic 宣布其大型语言模型的新版本 - Claude 2。", category: "LLM", people: "Anthropic", sourceText: "Anthropic 新闻", sourceLink: "https://www.anthropic.com/news/claude-2" },
    { year: "2023", event: "7月：Meta 向公众发布 LLaMA 2 开源语言模型，提供多种大小。", category: "LLM", people: "Meta", sourceText: "Llama 2 页面", sourceLink: "https://ai.meta.com/llama/" },
    { year: "2023", event: "Geoffrey Hinton 离开 Google，对 AI 的风险表示担忧。Yoshua Bengio 和其他 AI 研究人员也签署了关于 AI 风险的声明。", category: "Ethics", people: "Geoffrey Hinton, Yoshua Bengio, others", sourceText: "NYT 文章, CAIS 声明", sourceLink: "https://www.nytimes.com/2023/05/01/technology/ai-google-geoffrey-hinton.html", sourceLink2: "https://www.safe.ai/statement-on-ai-risk" },
    { year: "2023", event: "10月：DALL-E 3 发布。", category: "Multimodal", people: "OpenAI", sourceText: "DALL-E 3 页面", sourceLink: "https://openai.com/dall-e-3" },
    { year: "2023", event: "10月：Adobe 发布 Firefly 2。", category: "Multimodal", people: "Adobe", sourceText: "Adobe 博客", sourceLink: "https://blog.adobe.com/en/publish/2023/10/10/introducing-next-generation-of-firefly-models" },
    { year: "2023", event: "11月：Stable Diffusion XL Turbo 发布 - 一种可以在实时一步创建图像的快速模型。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 新闻", sourceLink: "https://stability.ai/news/sdxl-turbo-real-time-text-to-image-generation" },
    { year: "2023", event: "12月：Midjourney v6 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2023", event: "Google DeepMind 发布了 Gemini，一个本质上是多模态的 AI 模型，有 Ultra, Pro, 和 Nano 三种尺寸。 ", category: "Multimodal, LLM", people: "Google DeepMind", sourceText: "Gemini 公告", sourceLink: "https://deepmind.google/technologies/gemini/" },
    { year: "2023", event: "12月：Google 在限定区域升级 Bard，使其基于升级后的 Gemini Pro 语言模型。", category: "LLM", people: "Google", sourceText: "Google 博客 (Gemini)", sourceLink: "https://blog.google/technology/ai/google-gemini-ai/" },
    { year: "2023", event: "12月：X Corporation 为付费订阅者推出 Grok AI 聊天机器人（英语）。", category: "LLM", people: "X Corporation", sourceText: "xAI 博客", sourceLink: "https://x.ai/blog/grok" },
    { year: "2024", event: "2月：Stability AI 宣布 Stable Diffusion 3 (逐步向等待名单发布)。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 新闻", sourceLink: "https://stability.ai/news/stable-diffusion-3-research-paper" },
    { year: "2024", event: "2月：Google 升级 Bard 中的人工智能聊天功能，使其在所有可用语言中均基于新的 Gemini Pro 模型。Google 将 \"Bard\" 替换为 \"Gemini\"。", category: "LLM", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/products/gemini/bard-gemini-advanced-app/" },
    { year: "2024", event: "2月：Google 宣布 Gemini Pro 1.5 多模态语言模型，能够解析多达一百万个 token，并能解析视频和图像。该模型逐步向等待名单上的开发者发布。(*special*)", category: "Multimodal, LLM, Milestone", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/" },
    { year: "2024", event: "OpenAI 发布了 Sora，一个文本到视频模型，能够生成长达一分钟的高保真视频。(*special*)", category: "Multimodal, Milestone", people: "OpenAI", sourceText: "Sora 公告", sourceLink: "https://openai.com/sora" },
    { year: "2024", event: "3月：X Corporation 宣布即将发布 Grok 1.5 开源模型。", category: "LLM", people: "X Corporation", sourceText: "xAI 博客", sourceLink: "https://x.ai/blog/grok-1.5" },
    { year: "2024", event: "3月：Anthropic 宣布其大型语言模型的新版本 Claude 3。该版本部署了3种不同大小，最大模型的性能优于 GPT-4。", category: "LLM", people: "Anthropic", sourceText: "Anthropic 新闻", sourceLink: "https://www.anthropic.com/news/claude-3-family" },
    { year: "2024", event: "3月：开发音乐创作模型的 Suno AI 向公众发布 Suno v3。", category: "Multimodal", people: "Suno AI", sourceText: "Suno 博客", sourceLink: "https://suno.com/blog/v3" },
    { year: "2024", event: "4月：Stability AI 发布音乐创作模型的新更新 - Stable Audio 2.0。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 新闻", sourceLink: "https://stability.ai/news/stable-audio-2-0" },
    { year: "2024", event: "4月：X Corporation 发布其语言模型的升级版 Grok-1.5V，集成了高级图像识别功能。在该公司展示的测试中，该模型在识别和分析图像方面优于其他模型。", category: "Multimodal", people: "X Corporation", sourceText: "xAI 博客", sourceLink: "https://x.ai/blog/grok-1.5v" },
    { year: "2024", event: "4月：Mistral 公司以开源形式发布其新模型 Mixtral 8x22B。这是开源模型中最强大的模型，包含1410亿参数，但使用了一种允许更经济使用的方法。", category: "LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/mixtral-8x22b/" },
    { year: "2024", event: "4月：Meta 以开源形式发布 LLaMA 3 模型，参数大小为8B和70B。大型模型在多个指标上表现优于 Claude 3 Sonnet 和 Gemini Pro 1.5。Meta 预计稍后将发布具有4000亿参数及更多的更大型号。", category: "LLM", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/meta-llama-3/" },
    { year: "2024", event: "4月：Microsoft 以开源形式发布 Phi-3-mini 模型。该模型参数大小为3.8B的精简版，使其也能在移动设备上运行，并展现出与 GPT-3.5 相似的功能。(*special*)", category: "LLM, Milestone", people: "Microsoft", sourceText: "Azure 博客", sourceLink: "https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-small-language-models/" },
    { year: "2024", event: "4月：Adobe 宣布其新的图像创建模型 Firefly 3。", category: "Multimodal", people: "Adobe", sourceText: "Adobe 博客", sourceLink: "https://blog.adobe.com/en/publish/2024/04/23/firefly-image-3-model-advances-creative-control-photorealism" },
    { year: "2024", event: "4月：初创公司 Reka AI 展示了一系列3种大小的多模态语言模型。这些模型能够处理视频、音频和图像。大型模型具有与 GPT-4 相似的功能。", category: "Multimodal", people: "Reka AI", sourceText: "Reka AI 博客", sourceLink: "https://reka.ai/reka-core-flash-and-edge/" },
    { year: "2024", event: "4月：Apple 以完全开源形式发布了一系列名为 OpenELM 的小型语言模型。这些模型有四种权重，参数在2.7亿到30亿之间。", category: "LLM", people: "Apple", sourceText: "Apple 机器学习研究", sourceLink: "https://machinelearning.apple.com/research/openelm" },
    { year: "2024", event: "5月：OpenAI 宣布 GPT-4o 模型 (\"o\" 代表 \"omni\")，一个在文本、音频和视觉方面具有显著改进的多模态模型，具有更快的响应时间和免费用户的访问权限。(*special*)", category: "Multimodal, LLM, Milestone", people: "OpenAI", sourceText: "GPT-4o 公告", sourceLink: "https://openai.com/index/hello-gpt-4o/" },
    { year: "2024", event: "5月：Google 在 I/O 大会上宣布了其产品中的大量 AI 功能。主要包括：将 Gemini 1.5 的 token 限制增加到200万给等待名单用户，发布更小更快的 Gemini Flash 1.5 模型。揭示最新的图像创建模型 Imagen 3，音乐创作模型 Music AI 和视频创作模型 Veo。以及宣布具有实时音频和视频接收多模态功能的 Astra 模型。", category: "Multimodal, LLM", people: "Google", sourceText: "Google I/O 2024", sourceLink: "https://blog.google/technology/ai/google-io-2024-gemini-era/" },
    { year: "2024", event: "5月：Microsoft 宣布专用于计算机的 Copilot+，它将允许通过用户活动的屏幕截图对用户历史进行全面搜索。该公司还以开源形式发布了 SLM，这些 SLM 以最小的尺寸显示出令人印象深刻的功能：Phi-3 Small，Phi-3 Medium 和包含图像识别功能的 Phi-3 Vision。", category: "Application, LLM, Multimodal", people: "Microsoft", sourceText: "Windows 博客", sourceLink: "https://blogs.windows.com/windowsexperience/2024/05/20/introducing-copilot-pcs/" },
    { year: "2024", event: "5月：Meta 推出 Chameleon，一种无缝渲染文本和图像的新型多模态模型。", category: "Multimodal", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/meta-chameleon-early-fusion-multimodal-models/" },
    { year: "2024", event: "5月：Mistral AI 发布其语言模型的新开源版本 Mistral-7B-Instruct-v0.3。", category: "LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/mistral-7b-instruct-v0-3/" },
    { year: "2024", event: "5月：Google 宣布 AI Overviews，旨在在 Google 搜索中提供相关信息的摘要。(*special*)", category: "Application, Milestone", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/products/search/ai-overviews-google-search/" },
    { year: "2024", event: "5月：Suno AI 发布更新的音乐创作模型 Suno v3.5。", category: "Multimodal", people: "Suno AI", sourceText: "Suno 博客", sourceLink: "https://suno.com/blog/v3-5-launch" },
    { year: "2024", event: "5月：Mistral AI 发布专为编码设计的22B大小的新语言模型 Codestral。", category: "LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/codestral/" },
    { year: "2024", event: "6月：Stability AI 发布其更新的图像创建模型 Stable Diffusion 3 的中等版本，参数大小为2B。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 新闻", sourceLink: "https://stability.ai/news/stable-diffusion-3-medium" },
    { year: "2024", event: "6月：Apple 宣布 Apple Intelligence，一个将集成到公司设备中的 AI 系统，并将结合不同大小的 AI 模型用于不同任务。", category: "Application, LLM", people: "Apple", sourceText: "Apple Intelligence", sourceLink: "https://www.apple.com/apple-intelligence/" },
    { year: "2024", event: "6月：DeepSeekAI 发布 DeepSeekCoderV2 开源语言模型，其编码能力与 GPT-4、Claude 3 Opus 等模型相似。", category: "LLM", people: "DeepSeekAI", sourceText: "DeepSeek 博客", sourceLink: "https://deepseek.com/blog/deepseek-coder-v2" },
    { year: "2024", event: "6月：Runway 推出 Gen3 Alpha，一种新的 AI 视频生成模型。", category: "Multimodal", people: "Runway", sourceText: "RunwayML 博客", sourceLink: "https://runwayml.com/blog/introducing-gen-3-alpha/" },
    { year: "2024", event: "6月：Anthropic 发布 Claude 3.5 Sonnet 模型，其性能优于其他低资源消耗模型。(*special*)", category: "LLM, Milestone", people: "Anthropic", sourceText: "Anthropic 新闻", sourceLink: "https://www.anthropic.com/news/claude-3-5-sonnet" },
    { year: "2024", event: "6月：Microsoft 以开源形式发布一系列名为 Florence 2 的图像识别模型。", category: "Vision", people: "Microsoft", sourceText: "Microsoft 技术社区", sourceLink: "https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/announcing-florence-2-a-new-generation-of-vision-foundation/ba-p/4008093" },
    { year: "2024", event: "6月：Google 宣布 Gemma 2 开源语言模型，参数大小为9B和27B。此外，该公司向开发者开放高达200万 token 的上下文窗口功能。", category: "LLM", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/technology/developers/gemma-2-open-models-responsible-ai/" },
    { year: "2024", event: "7月：OpenAI 发布了小型化模型 GPT-4o mini，以低成本提供高性能。", category: "LLM", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/" },
    { year: "2024", event: "7月：Meta 以开源形式发布 llama 3.1 模型，参数大小为8B、70B和405B。大型模型具有与最佳闭源模型相同的功能。(*special*)", category: "LLM, Milestone", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/meta-llama-3-1/" },
    { year: "2024", event: "7月：Mistral AI 发布三款新模型：Codestral Mamba、Mistral NeMo 和专为数学设计的 Mathstral。", category: "LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/models-july-2024/" },
    { year: "2024", event: "7月：Google DeepMind 公布了两个新的 AI 系统 AlphaProof 和 AlphaGeometry 2，它们在今年的国际数学奥林匹克竞赛 (IMO) 中获得了银牌。(*special*)", category: "Application, Milestone", people: "Google DeepMind", sourceText: "DeepMind 博客", sourceLink: "https://deepmind.google/discover/blog/ais-achieve-silver-medals-at-international-mathematical-olympiad/" },
    { year: "2024", event: "7月：OpenAI 推出集成的网页搜索功能 SearchGPT。", category: "Application", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/index/introducing-search-in-chatgpt/" },
    { year: "2024", event: "7月：初创公司 Udio 发布其音乐创作模型的更新版本 Udio v1.5。", category: "Multimodal", people: "Udio", sourceText: "Udio 博客", sourceLink: "https://www.udio.com/blog/v1-5-release" },
    { year: "2024", event: "7月：Mistral AI 发布大型语言模型 Mistral Large 2，大小为123B，其能力接近闭源SOTA模型。(*special*)", category: "LLM, Milestone", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/mistral-large-2/" },
    { year: "2024", event: "7月：Midjourney v6.1 发布。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网", sourceLink: "https://www.midjourney.com/home" },
    { year: "2024", event: "7月：Google 以开源形式发布 Gemma 2 2B 模型。该模型表现出优于许多更大模型的能力。", category: "LLM", people: "Google", sourceText: "Google 博客 (Gemma 2)", sourceLink: "https://blog.google/technology/developers/gemma-2-open-models-responsible-ai/" },
    { year: "2024", event: "8月：\"Black Forest Labs\" 发布名为 Flux 的图像创建模型权重，其性能优于类似的闭源模型。", category: "Multimodal", people: "Black Forest Labs", sourceText: "Hugging Face (Flux)", sourceLink: "https://huggingface.co/black-forest-labs/FLUX.1-schnell" },
    { year: "2024", event: "8月：OpenAI 发布其模型的新版本 GPT-4o 0806，在生成有效 JSON 输出方面达到100%的成功率。", category: "LLM", people: "OpenAI", sourceText: "OpenAI API 更新 (含提及)", sourceLink: "https://openai.com/index/new-embedding-models-and-api-updates/" },
    { year: "2024", event: "8月：Google 的图像生成模型 Imagen 3 已发布。", category: "Multimodal", people: "Google", sourceText: "DeepMind Imagen 3", sourceLink: "https://deepmind.google/technologies/imagen-3/" },
    { year: "2024", event: "8月：xAI Corporation 推出了 Grok 2 和 Grok 2 mini 模型，其性能与市场上领先的 SOTA 模型相当。", category: "LLM", people: "xAI", sourceText: "xAI 博客", sourceLink: "https://x.ai/blog/grok-2" },
    { year: "2024", event: "8月：Microsoft 推出了其小型语言模型 Phi 3.5 的三个版本，每个版本都展现出与其大小相称的令人印象深刻的性能。", category: "LLM", people: "Microsoft", sourceText: "Microsoft 技术社区", sourceLink: "https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/announcing-phi-3-5-advancing-small-language-models-with-new/ba-p/4213904" },
    { year: "2024", event: "8月：Google 推出了三款新的实验性 AI 模型：Gemini 1.5 Flash8B、Gemini 1.5 Pro Enhanced 和 Gemini 1.5 Flash Updated。", category: "LLM", people: "Google", sourceText: "Google AI 发布说明", sourceLink: "https://ai.google.dev/docs/release-notes" },
    { year: "2024", event: "8月：Ideogram 2.0 已发布，提供超越其他领先模型的图像生成能力。", category: "Multimodal", people: "Ideogram", sourceText: "Ideogram 博客", sourceLink: "https://ideogram.ai/blog/ideogram-2.0" },
    { year: "2024", event: "8月：Luma 推出了用于视频创作的 Dream Machine 1.5 模型。", category: "Multimodal", people: "Luma", sourceText: "Luma Labs 博客", sourceLink: "https://lumalabs.ai/blog/dream-machine-1-5" },
    { year: "2024", event: "9月：法国 AI 公司 Mistral 推出了 Pixtral12B，其首个能够处理图像和文本的多模态模型。", category: "Multimodal", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/pixtral-12b/" },
    { year: "2024", event: "9月：OPENAI 向其订阅者发布了两款下一代 AI 模型：o1 preview 和 o1 mini。这些模型在性能上有了显著提升，尤其是在需要推理的任务中，包括编码、数学、GPQA 等。(*special*)", category: "LLM, Milestone", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/index/introducing-o1-and-o1-mini/" },
    { year: "2024", event: "9月：中国公司阿里巴巴发布 Qwen 2.5 模型，有多种尺寸，从0.5B到72B不等。这些模型展现出与更大模型相当的能力。", category: "LLM", people: "Alibaba", sourceText: "QwenLM 博客", sourceLink: "https://qwenlm.github.io/blog/qwen2.5/" },
    { year: "2024", event: "9月：视频生成模型 KLING 1.5 已发布。", category: "Multimodal", people: "KLING (Kuaishou)", sourceText: "KLING 官网", sourceLink: "https://kling.kuaishou.com/" },
    { year: "2024", event: "9月：OpenAI 为所有订阅者推出 GPT4o 的高级语音模式。", category: "Multimodal, Application", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/index/advanced-voice-mode-now-available/" },
    { year: "2024", event: "9月：Meta 发布 Llama 3.2，有1B、3B、11B和90B四种尺寸，首次具备图像识别能力。", category: "Multimodal, LLM", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/meta-llama-3-2-multimodal-open-source-ai-models/" },
    { year: "2024", event: "9月：Google 推出了新的模型更新，Gemini Pro 1.5 002 和 Gemini Flash 1.5 002，展示了显著改进的长上下文处理能力。", category: "LLM", people: "Google", sourceText: "Google AI 发布说明", sourceLink: "https://ai.google.dev/docs/release-notes#september_2024" },
    { year: "2024", event: "9月：Kyutai 发布了其语音到语音模型 Moshi 的两个开源版本。", category: "Multimodal", people: "Kyutai", sourceText: "Kyutai 研究", sourceLink: "https://kyutai.com/research/announcing-moshi" },
    { year: "2024", event: "9月：Google 发布其 AI 工具 NotebookLM 的更新，使用户能够根据自己的内容创建播客。", category: "Application", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/products/notebooklm/audio-overviews-notebooklm/" },
    { year: "2024", event: "9月：Mistral AI 推出名为 Mistral Small 的22B模型。", category: "LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/mistral-small-optimized-for-latency-and-cost/" },
    { year: "2024", event: "10月：Flux 1.1 Pro 发布，展示了先进的图像创建能力。", category: "Multimodal", people: "Flux (Black Forest Labs)", sourceText: "Black Forest Labs", sourceLink: "https://www.blackforestlabs.ai/flux-1-1-pro/" },
    { year: "2024", event: "10月：Meta 推出 Movie Gen，一款可根据文本输入生成视频、图像和音频的新 AI 模型。", category: "Multimodal", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/moviegen-text-video-image-audio-generation/" },
    { year: "2024", event: "10月：Pika 推出 Video Model 1.5 以及 \"Pika Effects\"。", category: "Multimodal", people: "Pika", sourceText: "Pika 博客", sourceLink: "https://pika.art/blog/video-model-1-5-and-pika-effects" },
    { year: "2024", event: "10月：Adobe 宣布其视频创作模型 Firefly Video。", category: "Multimodal", people: "Adobe", sourceText: "Adobe 博客", sourceLink: "https://blog.adobe.com/en/publish/2024/10/15/firefly-video-model-generative-ai-adobe-max" },
    { year: "2024", event: "10月：初创公司 Rhymes AI 发布 Aria，一款开源的多模态模型，其能力与同等规模的专有模型相似。", category: "Multimodal", people: "Rhymes AI", sourceText: "Rhymes AI 博客", sourceLink: "https://rhymes.ai/blog/introducing-aria" },
    { year: "2024", event: "10月：Meta 发布名为 Meta Spirit LM 的开源语音到语音语言模型。", category: "Multimodal", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/spirit-speech-to-speech-translation-model/" },
    { year: "2024", event: "10月：Mistral AI 推出 Ministral，一款新的模型，有3B和8B两种参数大小。", category: "LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/ministral/" },
    { year: "2024", event: "10月：DeepSeekAI 发布 Janus AI，一款能够识别和生成文本和图像的多模态语言模型，并将其开源。", category: "Multimodal", people: "DeepSeekAI", sourceText: "DeepSeek 博客", sourceLink: "https://deepseek.com/blog/janus-ai-open-source" },
    { year: "2024", event: "10月：Google DeepMind 和 MIT 推出 Fluid，一款参数规模为10.5B的文本到图像生成模型，具有行业领先的性能。", category: "Multimodal", people: "Google DeepMind, MIT", sourceText: "DeepMind 博客", sourceLink: "https://deepmind.google/discover/blog/fluid-text-to-image-generation-model/" },
    { year: "2024", event: "10月：Stable Diffusion 3.5 以三种尺寸开源发布。", category: "Multimodal", people: "Stability AI", sourceText: "Stability AI 新闻", sourceLink: "https://stability.ai/news/stable-diffusion-3-5-open-source-release" },
    { year: "2024", event: "10月：Anthropic 推出 Claude 3.5 Sonnet New，在特定领域比其先前版本有显著进步，并宣布了 Claude 3.5 Haiku。", category: "LLM", people: "Anthropic", sourceText: "Anthropic 新闻", sourceLink: "https://www.anthropic.com/news/claude-3-5-sonnet-new-and-haiku" },
    { year: "2024", event: "10月：Anthropic 宣布一项用于计算机使用的实验性功能，并提供公开测试版 API。", category: "Application", people: "Anthropic", sourceText: "Anthropic 新闻", sourceLink: "https://www.anthropic.com/news/experimental-computer-use-api" },
    { year: "2024", event: "10月：文本到图像模型 Recraft v3 已向公众发布，在与类似模型的基准测试中排名第一。", category: "Multimodal", people: "Recraft", sourceText: "Recraft 博客", sourceLink: "https://recraft.ai/blog/recraft-v3-release" },
    { year: "2024", event: "10月：OpenAI 推出了 Search GPT，允许用户直接在平台内执行网页搜索。", category: "Application", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/index/search-gpt-now-available/" },
    { year: "2024", event: "11月：阿里巴巴发布其新模型 QwQ 32B Preview，该模型在响应前集成了推理能力。该模型与 OpenAI 的 o1-preview 模型竞争，有时甚至超越它。", category: "LLM", people: "Alibaba", sourceText: "QwenLM 博客", sourceLink: "https://qwenlm.github.io/blog/qwq-32b-preview/" },
    { year: "2024", event: "11月：阿里巴巴开源了 Qwen2.5 Coder 32B 模型，该模型在编码领域提供了与领先专有语言模型相当的功能。", category: "LLM", people: "Alibaba", sourceText: "QwenLM 博客", sourceLink: "https://qwenlm.github.io/blog/qwen2.5-coder-32b/" },
    { year: "2024", event: "11月：DeepSeek 推出了其新的 AI 模型 DeepSeek-R1-Lite-Preview，该模型集成了推理能力，并在 AIME 和 MATH 基准测试中表现出色，达到了 OpenAI o1-preview 的水平。", category: "LLM", people: "DeepSeek", sourceText: "DeepSeek 博客", sourceLink: "https://deepseek.com/blog/deepseek-r1-lite-preview" },
    { year: "2024", event: "11月：Suno 将其 AI 驱动的音乐生成器升级到 v4，引入了新功能和性能改进。", category: "Multimodal", people: "Suno", sourceText: "Suno 博客", sourceLink: "https://suno.com/blog/v4-launch" },
    { year: "2024", event: "11月：Mistral AI 推出了 Pixtral Large 模型，这是一款在图像识别和高级性能指标方面表现出色的多模态语言模型，以及 Mistral Large 的更新版本 2411。", category: "Multimodal, LLM", people: "Mistral AI", sourceText: "Mistral AI 新闻", sourceLink: "https://mistral.ai/news/pixtral-large-and-mistral-large-2411/" },
    { year: "2024", event: "11月：Google 推出了两款实验模型 gemini-exp-1114 和 gemini-exp-1121，目前凭借增强的性能在竞技场聊天机器人中领先。", category: "LLM", people: "Google", sourceText: "Google AI 发布说明", sourceLink: "https://ai.google.dev/docs/release-notes#november_2024" },
    { year: "2024", event: "11月：Anthropic 推出 Claude 3.5 Haiku 和 Claude 中的可视化 PDF 分析功能。", category: "LLM, Application", people: "Anthropic", sourceText: "Anthropic 新闻", sourceLink: "https://www.anthropic.com/news/claude-3-5-haiku-and-visual-pdf-analysis" },
    { year: "2024", event: "12月：Amazon 推出了一系列名为 NOVA 的新模型，专为文本、图像和视频处理而设计。", category: "Multimodal", people: "Amazon", sourceText: "AWS 博客", sourceLink: "https://aws.amazon.com/blogs/machine-learning/introducing-amazon-nova-a-new-family-of-foundation-models-for-text-image-and-video-processing/" },
    { year: "2024", event: "12月：OpenAI 发布了视频生成模型 SORA，以及 O1 和 O1 Pro 的完整版本供高级订阅者使用。此外，该公司还为 GPT4o 推出了实时视频模式。(*special*)", category: "Multimodal, LLM, Milestone", people: "OpenAI", sourceText: "OpenAI 博客 (综合)", sourceLink: "https://openai.com/index/sora-o1-o1pro-live-video-gpt4o/" },
    { year: "2024", event: "12月：Google 推出了实验模型 Gemini-Exp-1206，该模型在聊天机器人排行榜上名列第一。", category: "LLM", people: "Google", sourceText: "Google AI 发布说明", sourceLink: "https://ai.google.dev/docs/release-notes#december_2024" },
    { year: "2024", event: "12月：Google 推出了 Gemini 2.0 Flash 的测试版。该模型在基准测试中领先，并优于先前版本 Gemini Pro 1.5。此外，Google 还引入了实时语音和视频模式，并宣布模型内置图像生成功能。(*special*)", category: "Multimodal, LLM, Milestone", people: "Google", sourceText: "Google 博客 (综合)", sourceLink: "https://blog.google/products/gemini/gemini-2-flash-beta-new-features/" },
    { year: "2024", event: "12月：Google 推出了基于 Gemini 2.0 Flash 的思维模型 Gemini-2.0-Flash-Thinking，该模型在聊天机器人排行榜上获得第二名。(*special*)", category: "LLM, Milestone", people: "Google", sourceText: "Google AI 发布说明", sourceLink: "https://ai.google.dev/docs/release-notes#december_2024" },
    { year: "2024", event: "12月：Google 推出了 Veo 2，一款测试版视频生成模型，能够制作长达两分钟的4K视频。该模型在人工评估中优于 SORA。此外，Google 更新了 Imagen 3，提供了增强的图像质量和真实感。(*special*)", category: "Multimodal, Milestone", people: "Google", sourceText: "DeepMind 博客 (综合)", sourceLink: "https://deepmind.google/discover/blog/veo-2-imagen-3-updates-december-2024/" },
    { year: "2024", event: "12月：xAI 集成了 Aurora，一款用于生成高质量和逼真图像的新模型。", category: "Multimodal", people: "xAI", sourceText: "xAI 博客", sourceLink: "https://x.ai/blog/aurora-image-model" },
    { year: "2024", event: "12月：Microsoft 开源了 Phi4 模型，大小为14B，展示了与其大小相称的令人印象深刻的功能。", category: "LLM", people: "Microsoft", sourceText: "Azure 博客", sourceLink: "https://azure.microsoft.com/en-us/blog/microsoft-open-sources-phi-4-model/" },
    { year: "2024", event: "12月：Meta 发布了 Llama 3.3 70B，一款性能与 Llama 3.1 405B 相当的模型。", category: "LLM", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/meta-llama-3-3-70b/" },
    { year: "2024", event: "12月：Google 推出了一款名为 PaliGemma 2 的多模态开源模型，与现有的 Gemma 模型集成。", category: "Multimodal", people: "Google", sourceText: "Google 博客", sourceLink: "https://blog.google/technology/developers/paligemma-2-open-source-multimodal-model/" },
    { year: "2024", event: "12月：Pika Labs 发布了其 AI 驱动的视频生成器的最新版本 2.0。", category: "Multimodal", people: "Pika Labs", sourceText: "Pika 博客", sourceLink: "https://pika.art/blog/pika-2-0-release" },
    { year: "2024", event: "12月：Meta 推出了 Apollo，一款提供三种不同尺寸的视频生成模型。", category: "Multimodal", people: "Meta", sourceText: "Meta AI 博客", sourceLink: "https://ai.meta.com/blog/apollo-generative-video-model/" },
    { year: "2024", event: "12月：Deepseek 开源了 Deepseek V3，一款具有671B参数的模型，在多个基准测试中超越了闭源SOTA模型。(*special*)", category: "LLM, Milestone", people: "Deepseek", sourceText: "DeepSeek 博客", sourceLink: "https://deepseek.com/blog/deepseek-v3-open-source-sota" },
    { year: "2024", event: "12月：阿里巴巴推出了 QVQ-72B-Preview，这是一款尖端的思维模型，能够分析图像，具有SOTA级性能。(*special*)", category: "Multimodal, LLM, Milestone", people: "Alibaba", sourceText: "QwenLM 博客", sourceLink: "https://qwenlm.github.io/blog/qvq-72b-preview-sota/" },
    { year: "2024", event: "12月：OpenAI 宣布推出 O3，这是一款开创性的 AI 模型，在 ARC-AGI 基准测试中达到87.5%，在 Frontier Math Benchmark 中达到25.2%（先前模型低于2%），在博士级科学问题中达到87.7%。预计将于2025年1月推出经济高效的版本 O3 Mini，其性能与 O1 相似，同时速度和效率得到提高。(*special*)", category: "LLM, Milestone", people: "OpenAI", sourceText: "OpenAI 博客", sourceLink: "https://openai.com/index/o3-breakthrough-ai-model/" },
    { year: "2024", event: "12月：视频生成模型 Kling 1.6 发布，性能显著增强。", category: "Multimodal", people: "KLING (Kuaishou)", sourceText: "KLING 新闻 (占位符)", sourceLink: "https://kling.kuaishou.com/news" },
    { year: "2025", event: "1月：OpenAI 为 Pro 订阅者发布 Operator – 一款能够浏览网站并执行操作的实验性 AI 代理。(*special*)", category: "Application, Milestone", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "1月：Google 推出 Gemini Flash Thinking 0121，一款增强的推理模型，在 Arena Chatbots 排名中名列第一。", category: "LLM", people: "Google", sourceText: "Google AI 发布说明 (预测)", sourceLink: "https://ai.google.dev/docs/release-notes" },
    { year: "2025", event: "1月：DeepSeek 开源了推理模型 R1 和 R1-Zero，它们在各个领域都表现出与 o1 相似的能力，且成本仅为其一小部分。此外，还发布了较小的蒸馏模型，以其大小实现了高性能。(*special*)", category: "LLM, Milestone", people: "DeepSeek", sourceText: "DeepSeek 博客 (预测)", sourceLink: "https://deepseek.com/blog/" },
    { year: "2025", event: "1月：Google 发表了一篇关于名为 Titans 的新语言模型架构的研究论文，该架构旨在使模型能够保留短期和长期记忆。该架构显著提高了扩展上下文窗口的处理能力。(*special*)", category: "LLM, Milestone", people: "Google", sourceText: "Google Research (预测)", sourceLink: "https://research.google/pubs/" },
    { year: "2025", event: "1月：DeepSeek 开源了一款完全多模态模型 Janus Pro 7B，该模型支持文本和图像生成。", category: "Multimodal", people: "DeepSeek", sourceText: "DeepSeek 博客 (预测)", sourceLink: "https://deepseek.com/blog/" },
    { year: "2025", event: "1月：阿里巴巴推出了 Qwen2.5-Max，这是一款超越了包括 DeepSeek-V3、GPT-4o 和 Claude 3.5 在内的多个领先模型的大型语言模型。此外，还开源了能够处理多达一百万个 token 的 Qwen2.5-1M 系列，以及三种不同尺寸的 Qwen2.5-VL 视觉模型系列。", category: "Multimodal, LLM", people: "Alibaba", sourceText: "QwenLM 博客 (预测)", sourceLink: "https://qwenlm.github.io/blog/" },
    { year: "2025", event: "1月：OpenAI 向所有用户（包括免费用户）提供 o3 mini 推理模型，具有三个推理级别。该模型在多个基准测试中与 o1 持平或接近，在编码方面显著超越 o1，并且速度更快、成本效益更高。(*special*)", category: "LLM, Milestone", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "2月：xAI 推出 Grok 3、Grok 3 Reasoning 和 Grok 3 mini，这些下一代 AI 模型的训练计算能力是 Grok 2 的10倍，显著提高了 SOTA 性能。它们包括用于高级推理的 \"Think\" 和 \"Big Brain\" 模式，以及用于自主网页搜索的 DeepSearch。(*special*)", category: "LLM, Application, Milestone", people: "xAI", sourceText: "xAI 博客 (预测)", sourceLink: "https://x.ai/blog/" },
    { year: "2025", event: "2月：Anthropic 推出 Claude 3.7 和 Claude 3.7 Thinking，这是一款具有增强编码性能、支持 \"Extended Thinking\" 模式以及分析推理过程能力的新模型。(*special*)", category: "LLM, Milestone", people: "Anthropic", sourceText: "Anthropic 新闻 (预测)", sourceLink: "https://www.anthropic.com/news" },
    { year: "2025", event: "2月：OpenAI 推出 Deep Research，这是一款用于自主研究的工具，能够进行实时网页搜索并生成综合报告。(*special*)", category: "Application, Milestone", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "2月：Google 发布 Gemini 2.0 Flash、Gemini 2.0 Flash-Lite Preview 和 Gemini 2.0 Pro Experimental。", category: "LLM", people: "Google", sourceText: "Google Gemini 博客 (预测)", sourceLink: "https://blog.google/products/gemini/" },
    { year: "2025", event: "2月：阿里巴巴推出 QwQ-Max – 一款基于 Qwen2.5-Max 的推理模型，提供改进的分析和逻辑能力。", category: "LLM", people: "Alibaba", sourceText: "QwenLM 博客 (预测)", sourceLink: "https://qwenlm.github.io/blog/" },
    { year: "2025", event: "2月：Microsoft 展示了 Phi4-mini 和 Phi4 Multimodal，这些轻量级模型（3.8B和5.6B）具有增强的性能，包括对多模态输入的支持。", category: "Multimodal, LLM", people: "Microsoft", sourceText: "Azure AI 博客 (预测)", sourceLink: "https://azure.microsoft.com/en-us/blog/tag/ai-machine-learning/" },
    { year: "2025", event: "2月：OpenAI 发布 GPT-4.5，具有先进的模式识别能力和显著减少的幻觉，提高了准确性和可靠性。(*special*)", category: "LLM, Milestone", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "3月：Google 推出了 Gemini 2.5 Pro 实验性 \"思维模型\"，具有先进的推理和规划能力，100万 token 上下文窗口，在多个关键基准测试中名列前茅。(*special*)", category: "LLM, Milestone", people: "Google", sourceText: "Google Gemini 博客 (预测)", sourceLink: "https://blog.google/products/gemini/" },
    { year: "2025", event: "3月：Google 推出了 Gemma 3 系列，具有各种参数大小的开源多模态模型、128K 上下文窗口、多语言支持以及集成的图像和视频理解能力。", category: "Multimodal", people: "Google", sourceText: "Google Developers 博客 (预测)", sourceLink: "https://blog.google/technology/developers/" },
    { year: "2025", event: "3月：OpenAI 集成了 GPT-4o 图像生成功能，能够进行高保真文本到图像创建、图像内文本渲染等。(*special*)", category: "Multimodal, Milestone", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "3月：Google 在 Gemini 2.0 Flash Experimental 中扩展了实验性图像生成和编辑功能，能够进行图像生成和编辑，包括增强的文本创建能力。(*special*)", category: "Multimodal, Milestone", people: "Google", sourceText: "Google Gemini 博客 (预测)", sourceLink: "https://blog.google/products/gemini/" },
    { year: "2025", event: "3月：阿里巴巴发布 QwQ-32B，一款开源的32B参数推理模型，具有出色的数学和编码性能，可与更大的模型相媲美。", category: "LLM", people: "Alibaba", sourceText: "QwenLM 博客 (预测)", sourceLink: "https://qwenlm.github.io/blog/" },
    { year: "2025", event: "3月：阿里巴巴发布 Qwen2.5-VL 32B，一款开源的视觉语言模型，在视觉分析、图像内文本理解和视觉代理任务方面具有强大的能力。", category: "Multimodal", people: "Alibaba", sourceText: "QwenLM 博客 (预测)", sourceLink: "https://qwenlm.github.io/blog/" },
    { year: "2025", event: "3月：DeepSeek 更新了其开源 MoE 模型 DeepSeek-V3-0324，具有增强的推理、编码和数学能力，使其成为顶级基础模型。", category: "LLM", people: "DeepSeek", sourceText: "DeepSeek 博客 (预测)", sourceLink: "https://deepseek.com/blog/" },
    { year: "2025", event: "3月：Sesame AI 推出了其对话式语音模型 (CSM)，能够实现非常逼真的人类实时语音交互，融合了情感细微差别、自然停顿、笑声和上下文记忆。(*special*)", category: "Multimodal, Milestone", people: "Sesame AI", sourceText: "Sesame AI 博客 (预测)", sourceLink: "https://www.sesameai.com/blog" },
    { year: "2025", event: "4月：Meta 发布 Llama 4，有三种尺寸，上下文窗口为1000万 token，性能中等。", category: "LLM", people: "Meta", sourceText: "Meta AI 博客 (预测)", sourceLink: "https://ai.meta.com/blog/" },
    { year: "2025", event: "4月：Google 推出 Gemini 2.5 Flash，具有动态推理模式，可根据需要调整推理级别或禁用它。", category: "LLM", people: "Google", sourceText: "Google Gemini 博客 (预测)", sourceLink: "https://blog.google/products/gemini/" },
    { year: "2025", event: "4月：Amazon 推出 Nova Act，一个新的用于构建多步骤自主代理的框架。", category: "Application", people: "Amazon", sourceText: "AWS ML 博客 (预测)", sourceLink: "https://aws.amazon.com/blogs/machine-learning/" },
    { year: "2025", event: "4月：OpenAI 发布 GPT-4.1，有三种尺寸，上下文窗口为100万 token。", category: "LLM", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "4月：OpenAI 推出 O3 full 和 O4 mini，用于推理、数学和编码的高度先进模型。", category: "LLM", people: "OpenAI", sourceText: "OpenAI 博客 (预测)", sourceLink: "https://openai.com/blog/" },
    { year: "2025", event: "4月：Midjourney 推出 v7，具有更高的图像质量和更精确的风格控制。", category: "Multimodal", people: "Midjourney", sourceText: "Midjourney 官网 (预测)", sourceLink: "https://www.midjourney.com/home" },
    { year: "2025", event: "4月：一系列视频模型更新 - Veo 2.0 (Google)、Runway Gen-4、Vidu Q1 和 Kling 2.0 – 在高质量视频生成方面取得了飞跃，响应时间、真实感和风格均有改进。", category: "Multimodal", people: "Google, Runway, Vidu, Kling", sourceText: "AI 新闻综合 (预测)", sourceLink: "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0JXVnVMVWRDS0FBUAE?hl=en-US&gl=US&ceid=US%3Aen" },
    { year: "2025", event: "4月：阿里巴巴以开源形式发布 Qwen 3，有多种尺寸，其大小具有非常令人印象深刻的功能。(*special*)", category: "LLM, Milestone", people: "Alibaba", sourceText: "QwenLM 博客 (预测)", sourceLink: "https://qwenlm.github.io/blog/" },
    { year: "2025", event: "4月：Microsoft 以开源形式推出 Phi-4 reasoning 系列，这些模型小巧但高质量，并集成了推理功能。", category: "LLM", people: "Microsoft", sourceText: "Azure AI 博客 (预测)", sourceLink: "https://azure.microsoft.com/en-us/blog/tag/ai-machine-learning/" },
];
// --- END OF DATA FOR AI History ---


// --- START OF DATA FOR Video Models ---
const videoModelsData = [
    { type: "闭源", name: "Gen-1", org: "Runway", date: "2023-02", projectLink: "https://runwayml.com/research/gen-1", paperLink: "https://arxiv.org/pdf/2302.03011", paperLinkText: "paper", blogLink: "https://runwayml.com/research/gen-1", seriesColor: "#1f77b4" },
    { type: "闭源", name: "Gen-2", org: "Runway", date: "2023-06", projectLink: "https://runwayml.com/research/gen-2", blogLink: "https://runwayml.com/research/introducing-gen-2-alpha", seriesColor: "#1f77b4" },
    { type: "闭源", name: "Gen-3", org: "Runway", date: "2024-03", projectLink: "https://runwayml.com/research/introducing-gen-3-alpha", blogLink: "https://runwayml.com/research/introducing-gen-3-alpha", seriesColor: "#1f77b4" },
    { type: "闭源", name: "Gen-4", org: "Runway", date: "2025-03", projectLink: "https://runwayml.com/research/introducing-runway-gen-4", blogLink: "https://runwayml.com/research/introducing-runway-gen-4", seriesColor: "#1f77b4" },
    { type: "闭源", name: "Pika 1.0", org: "Pika Labs", date: "2023-11", projectLink: "https://pika.art/", seriesColor: "#ff7f0e" },
    { type: "闭源", name: "Pika 1.5", org: "Pika Labs", date: "2024-10", projectLink: "https://pika.art/", seriesColor: "#ff7f0e" },
    { type: "闭源", name: "Pika 2.0", org: "Pika Labs", date: "2024-12", projectLink: "https://pika.art/", seriesColor: "#ff7f0e" },
    { type: "闭源", name: "Sora", org: "OpenAI", date: "2024-02", projectLink: "https://openai.com/sora/", blogLink: "https://openai.com/index/video-generation-models-as-world-simulators/", seriesColor: "#2ca02c" },
    { type: "闭源", name: "Vidu 1.0", org: "清华+生数科技", date: "2024-04", projectLink: "https://www.vidu.cn/", paperLink: "https://arxiv.org/abs/2405.04233", paperLinkText: "paper", seriesColor: "#d62728" },
    { type: "闭源", name: "Vidu 1.5", org: "清华+生数科技", date: "2024-11", projectLink: "https://www.vidu.cn/", seriesColor: "#d62728" },
    { type: "闭源", name: "Vidu 2.0", org: "清华+生数科技", date: "2025-01", projectLink: "https://www.vidu.cn/", seriesColor: "#d62728" },
    { type: "闭源", name: "Vidu Q1", org: "清华+生数科技", date: "2025-03", projectLink: "https://www.vidu.cn/", seriesColor: "#d62728" },
    { type: "闭源", name: "Veo 1", org: "Google DeepMind", date: "2024-05", projectLink: "https://deepmind.google/models/veo/", seriesColor: "#9467bd" },
    { type: "闭源", name: "Veo 2", org: "Google DeepMind", date: "2024-12", projectLink: "https://deepmind.google/models/veo/", seriesColor: "#9467bd" },
    { type: "闭源", name: "Veo 3", org: "Google DeepMind", date: "2025-05", projectLink: "https://deepmind.google/models/veo/", seriesColor: "#9467bd" },
    { type: "闭源", name: "Kling 1.0", org: "快手", date: "2024-06", projectLink: "https://app.klingai.com/cn/", seriesColor: "#8c564b" },
    { type: "闭源", name: "Kling 1.5", org: "快手", date: "2024-12", projectLink: "https://app.klingai.com/cn/", seriesColor: "#8c564b" },
    { type: "闭源", name: "Kling 1.6", org: "快手", date: "2025-03", projectLink: "https://app.klingai.com/cn/", seriesColor: "#8c564b" },
    { type: "闭源", name: "Kling 2.0", org: "快手", date: "2025-05", projectLink: "https://app.klingai.com/cn/", seriesColor: "#8c564b" },
    { type: "闭源", name: "Kling 2.1", org: "快手", date: "2025-06", projectLink: "https://app.klingai.com/cn/", seriesColor: "#8c564b" },
    { type: "闭源", name: "Luma", org: "LUMA AI", date: "2024-06", projectLink: "https://dream-machine.lumalabs.ai/", seriesColor: "#e377c2" },
    { type: "闭源", name: "Hailuo Video", org: "MiniMax", date: "2024-09", projectLink: "https://hailuoai.com/video", seriesColor: "#7f7f7f" },
    { type: "闭源", name: "Movie Gen", org: "Meta", date: "2024-10", paperLink: "https://arxiv.org/pdf/2410.13720", paperLinkText: "paper", seriesColor: "#bcbd22" },
    { type: "开源", name: "Open-Sora 1.0", org: "Colossal AI", date: "2024-03", projectLink: "https://github.com/hpcaitech/Open-Sora", paperLink: "https://github.com/hpcaitech/Open-Sora/blob/main/docs/report_01.md", paperLinkText: "report", seriesColor: "#17becf" },
    { type: "开源", name: "Open-Sora 1.1", org: "Colossal AI", date: "2024-04", projectLink: "https://github.com/hpcaitech/Open-Sora", paperLink: "https://github.com/hpcaitech/Open-Sora/blob/main/docs/report_02.md", paperLinkText: "report", seriesColor: "#17becf" },
    { type: "开源", name: "Open-Sora 1.2", org: "Colossal AI", date: "2024-06", projectLink: "https://github.com/hpcaitech/Open-Sora", paperLink: "https://github.com/hpcaitech/Open-Sora/blob/main/docs/report_03.md", paperLinkText: "report", seriesColor: "#17becf" },
    { type: "开源", name: "Open-Sora 1.3", org: "Colossal AI", date: "2024-09", projectLink: "https://github.com/hpcaitech/Open-Sora", paperLink: "https://github.com/hpcaitech/Open-Sora/blob/main/docs/report_04.md", paperLinkText: "report", seriesColor: "#17becf" },
    { type: "开源", name: "Open-Sora 2.0", org: "Colossal AI", date: "2025-03", projectLink: "https://github.com/hpcaitech/Open-Sora", paperLink: "https://arxiv.org/abs/2503.09642v1", paperLinkText: "paper", seriesColor: "#17becf" },
    { type: "开源", name: "Open-Sora Plan v1.0.0", org: "北大", date: "2024-04", projectLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan", paperLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan/blob/main/docs/Report-v1.0.0.md", paperLinkText: "report", seriesColor: "#aec7e8" },
    { type: "开源", name: "Open-Sora Plan v1.1.0", org: "北大", date: "2024-05", projectLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan", paperLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan/blob/main/docs/Report-v1.1.0.md", paperLinkText: "report", seriesColor: "#aec7e8" },
    { type: "开源", name: "Open-Sora Plan v1.2.0", org: "北大", date: "2024-08", projectLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan", paperLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan/blob/main/docs/Report-v1.2.0.md", paperLinkText: "report", seriesColor: "#aec7e8" },
    { type: "开源", name: "Open-Sora Plan v1.3.0", org: "北大", date: "2024-10", projectLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan", paperLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan/blob/main/docs/Report-v1.3.0.md", paperLinkText: "report", seriesColor: "#aec7e8" },
    { type: "开源", name: "Open-Sora Plan v1.5.0", org: "北大", date: "2025-06", projectLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan", paperLink: "https://github.com/PKU-YuanGroup/Open-Sora-Plan/blob/main/docs/Report-v1.5.0.md", paperLinkText: "report", seriesColor: "#aec7e8" },
    { type: "开源", name: "CogVideoX 1.0", org: "清华+智谱", date: "2024-08", projectLink: "https://github.com/THUDM/CogVideo/tree/main", paperLink: "https://arxiv.org/pdf/2408.06072", paperLinkText: "report", seriesColor: "#ffbb78" },
    { type: "开源", name: "CogVideoX 1.5", org: "清华+智谱", date: "2024-11", projectLink: "https://github.com/THUDM/CogVideo/tree/main", seriesColor: "#ffbb78" },
    { type: "开源", name: "LTX-Video", org: "Lightricks(以色列公司)", date: "2024-11", projectLink: "https://github.com/Lightricks/LTX-Video", paperLink: "https://arxiv.org/abs/2501.00103", paperLinkText: "paper", seriesColor: "#98df8a" },
    { type: "开源", name: "Mochi", org: "GenmoTeam", date: "2024-11", projectLink: "https://github.com/genmoai/mochi", blogLink: "https://www.genmo.ai/blog", seriesColor: "#ff9896" },
    { type: "开源", name: "HunyuanVideo", org: "腾讯", date: "2024-12", projectLink: "https://github.com/Tencent-Hunyuan/HunyuanVideo", paperLink: "https://arxiv.org/abs/2412.03603", paperLinkText: "report", seriesColor: "#c5b0d5" },
    { type: "开源", name: "Wan2.1", org: "阿里巴巴", date: "2025-02", projectLink: "https://github.com/Wan-Video/Wan2.1", paperLink: "https://arxiv.org/abs/2503.20314", paperLinkText: "report", seriesColor: "#c49c94" },
];
// --- END OF DATA FOR Video Models ---


// --- START OF UI COMPONENTS ---
const MainTabButton = ({ tabId, label, activeTab, setActiveTab, theme }) => {
    const isActive = activeTab === tabId;
    // Use theme.headerBgColor for the active main tab background for prominence
    const activeBgColor = isActive ? theme.headerBgColor : 'bg-slate-200'; // Lighter for inactive
    const activeTextColor = isActive ? theme.seriesHeaderTextColor : 'text-slate-700'; // White text for active, dark for inactive
    const activeBorderClasses = `border-b-4 ${theme.borderColor}`;
    const inactiveClasses = `text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-400`;

    return (
        React.createElement('button', {
            onClick: () => setActiveTab(tabId),
            className: `py-3 px-4 md:px-6 focus:outline-none transition-all duration-150 ease-in-out text-sm md:text-base font-medium whitespace-nowrap 
                        ${isActive ? `${activeBorderClasses} font-semibold ${activeBgColor} ${activeTextColor}` : `${inactiveClasses} hover:bg-slate-300/70`} 
                        ${isActive ? 'shadow-md' : ''} rounded-t-md`, // Added rounded-t-md for better tab appearance
            role: 'tab',
            'aria-selected': isActive,
            id: `main-tab-${tabId}`,
        }, label)
    );
};

const LLMTabButton = ({ tabId, label, activeTab, setActiveTab, theme }) => {
  const isActive = activeTab === tabId;
  const activeBgColor = isActive ? theme.seriesHeaderBgColor : 'bg-transparent'; 
  const activeTextColor = isActive ? theme.seriesHeaderTextColor : theme.textColor;
  const activeBorderClasses = `border-b-2 ${theme.borderColor}`; 
  const inactiveClasses = `text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-300`;

  return (
    React.createElement('button', {
      onClick: () => setActiveTab(tabId),
      className: `py-2 px-3 md:px-4 focus:outline-none transition-all duration-150 ease-in-out text-xs md:text-sm whitespace-nowrap rounded-t-md ${isActive ? `${activeBorderClasses} font-semibold ${activeBgColor} ${activeTextColor}` : inactiveClasses} ${isActive ? '' : `hover:${theme.borderColor}`}`,
      role: 'tab',
      'aria-selected': isActive,
      id: `llm-tab-${tabId}`,
    }, label)
  );
};


const NotesSection = ({ notes, theme }) => {
    if (!notes || (!notes.general && !notes.references)) return null;
    return (
        React.createElement('div', { className: `mt-8 p-6 border-t-4 ${theme.notesBorderColor} ${theme.notesBgColor} rounded-b-lg shadow-md` },
            notes.general && notes.general.length > 0 && (
                React.createElement('div', { className: "mb-6" },
                    notes.general.map((note, index) => (
                        React.createElement('p', { key: `gen-note-${index}`, className: "text-sm text-slate-700 mb-2" }, note)
                    ))
                )
            ),
            notes.references && notes.references.length > 0 && (
                React.createElement(Fragment, null,
                    React.createElement('h3', { className: `text-lg font-semibold ${theme.textColor} mb-3` }, notes.referencesTitle || "Data Sources:"),
                    React.createElement('ul', { className: "list-disc list-inside space-y-1" },
                        notes.references.map((ref) => (
                            React.createElement('li', { key: ref.id, id: `ref-${ref.id}`, className: "text-sm" },
                                React.createElement('a', {
                                    href: ref.url,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    className: `font-medium ${theme.notesLinkColor} ${theme.notesLinkHoverColor} underline-offset-2 hover:underline`
                                }, `[${ref.id}] ${ref.text}`)
                            )
                        ))
                    )
                )
            )
        )
    );
};

const processContentForLinks = (content, references, theme) => {
    if (typeof content !== 'string') {
        if (Array.isArray(content)) {
            return content.map((child, i) => processContentForLinks(child, references, theme));
        } else if (React.isValidElement(content)) {
            if (typeof content.props === 'object' && content.props !== null && 'children' in content.props) {
                const childrenProp = (content.props).children;
                if (childrenProp) {
                    const processedChildren = processContentForLinks(childrenProp, references, theme);
                    return React.cloneElement(content, content.props, processedChildren);
                }
            }
            return content;
        }
        return content;
    }

    const parts = content.split(/(\[[A-Z]{1,2}-[0-9]{1,2}[a-z]?\])/g);
    return parts.map((part, index) => {
        if (part.match(/^\[[A-Z]{1,2}-[0-9]{1,2}[a-z]?\]$/)) {
            const refId = part.slice(1, -1);
            const refExists = references && references.some(r => r.id === refId);
            if (refExists) {
                return React.createElement('a', {
                    key: `reflink-${refId}-${index}`,
                    href: `#ref-${refId}`,
                    className: `font-medium ${theme.notesLinkColor} ${theme.notesLinkHoverColor} underline-offset-2 hover:underline`
                }, part);
            }
        }
        return part;
    });
};

const LLMModelTable = ({ headers, rows, theme, references }) => {
    return (
        React.createElement('div', { className: "overflow-x-auto rounded-lg shadow-md border border-slate-200" },
            React.createElement('table', { className: "min-w-full divide-y divide-slate-200 bg-white" },
                React.createElement('thead', { className: `${theme.headerBgColor} text-white` },
                    React.createElement('tr', null,
                        headers.map((header, index) => (
                            React.createElement('th', { key: `header-${index}`, scope: 'col', className: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap" }, header)
                        ))
                    )
                ),
                React.createElement('tbody', { className: "bg-white divide-y divide-slate-200" },
                    rows.map((row, rowIndex) => {
                        if (row.isSeriesHeader) {
                            return (
                                React.createElement('tr', { key: `series-header-${rowIndex}`, className: `${theme.seriesHeaderBgColor} ${theme.seriesHeaderTextColor}` },
                                    React.createElement('td', { colSpan: headers.length, className: "px-4 py-2.5 text-sm font-semibold" }, row.cells[0].content)
                                )
                            );
                        }
                        return (
                            React.createElement('tr', { key: `row-${rowIndex}`, className: `transition-colors duration-150 ${theme.rowHoverBgColor}` },
                                row.cells.map((cell, cellIndex) => (
                                    React.createElement('td', { key: `cell-${rowIndex}-${cellIndex}`, className: `px-4 py-3 text-sm text-slate-700 align-top ${cell.className || ''}`, colSpan: cell.colSpan || 1 },
                                        processContentForLinks(cell.content, references, theme)
                                    )
                                ))
                            )
                        );
                    })
                )
            )
        )
    );
};
// --- END OF UI COMPONENTS (LLM specific, some will be reused/adapted) ---

// --- START OF AI HISTORY COMPONENTS ---
const AIHistoryTimelineSection = ({ searchTerm, setSearchTerm }) => {
    const [filteredData, setFilteredData] = useState(aiHistoryData);

    useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (!lowerSearchTerm) {
            setFilteredData(aiHistoryData);
            return;
        }
        const filtered = aiHistoryData.filter(item =>
            item.year.toLowerCase().includes(lowerSearchTerm) ||
            item.event.toLowerCase().includes(lowerSearchTerm) ||
            item.category.toLowerCase().includes(lowerSearchTerm) ||
            item.people.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredData(filtered);
    }, [searchTerm]);

    const getCategoryClass = (category) => {
        const cat = category.toLowerCase().split(',')[0].trim();
        return `category-${cat}`;
    };
    
    return (
      React.createElement('div', null,
        React.createElement('input', {
          type: 'text',
          id: 'aiHistorySearchBox',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: '搜索事件、年份、人物...',
          className: 'w-full p-3 mb-6 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow'
        }),
        React.createElement('div', { className: 'overflow-x-auto shadow-md rounded-lg border border-slate-200' },
          React.createElement('table', { id: 'aiHistoryTable', className: 'min-w-full bg-white' },
            React.createElement('thead', { className: 'bg-slate-50' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, '年份'),
                React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, '事件'),
                React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, '类别'),
                React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, '关键人物'),
                React.createElement('th', { className: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, '来源')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-slate-200' },
              filteredData.map((item, index) => (
                React.createElement('tr', { key: index, className: 'hover:bg-indigo-50 transition-colors' },
                  React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm text-slate-700' }, item.year),
                  React.createElement('td', { className: 'px-4 py-3 text-sm text-slate-700' }, item.event),
                  React.createElement('td', { className: `px-4 py-3 text-sm whitespace-nowrap ${getCategoryClass(item.category)}` }, item.category.split(',').map(c => c.trim()).join(', ')),
                  React.createElement('td', { className: 'px-4 py-3 text-sm text-slate-700' }, item.people),
                  React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm' }, 
                    item.sourceLink && React.createElement('a', { href: item.sourceLink, target: '_blank', rel: 'noopener noreferrer', className: 'text-indigo-600 hover:text-indigo-800 hover:underline' }, item.sourceText),
                    item.sourceLink2 && React.createElement(Fragment, null, ", ", React.createElement('a', { href: item.sourceLink2, target: '_blank', rel: 'noopener noreferrer', className: 'text-indigo-600 hover:text-indigo-800 hover:underline' }, 'CAIS 声明'))
                  )
                )
              ))
            )
          )
        )
      )
    );
};

const AIHistoryMetaSection = () => (
    React.createElement('div', { className: 'prose max-w-none text-slate-700' },
        React.createElement('h2', {className: 'text-xl font-semibold text-slate-800 border-b pb-2 mb-4 border-indigo-500'}, '关于此时间线'),
        React.createElement('p', null, '此时间线旨在记录人工智能 (AI) 历史上的重要里程碑。它涵盖了从早期理论概念到当前快速发展的各种进展，包括：'),
        React.createElement('ul', { className: 'list-disc pl-5 space-y-1' },
            React.createElement('li', null, React.createElement('strong', null, '理论基础：'), ' 奠定 AI 基础的关键论文和思想。'),
            React.createElement('li', null, React.createElement('strong', null, '算法突破：'), ' 推动领域向前发展的新算法和技术 (例如，反向传播，Transformers)。'),
            React.createElement('li', null, React.createElement('strong', null, '硬件进步：'), ' 实现更复杂 AI 模型所需的计算能力发展。'),
            React.createElement('li', null, React.createElement('strong', null, '关键应用：'), ' 展示 AI 能力并影响世界的现实世界应用 (例如，深蓝，AlphaGo，ChatGPT)。'),
            React.createElement('li', null, React.createElement('strong', null, '主要参与者和机构：'), ' 对 AI 发展做出重大贡献的研究人员、公司和组织。'),
            React.createElement('li', null, React.createElement('strong', null, '伦理和社会影响：'), ' 围绕 AI 的伦理考虑和更广泛的社会影响。')
        ),
        React.createElement('p', null, 'AI 是一个快速发展的领域。此时间线将定期更新以反映最新的突破和事件。'),
        React.createElement('p', { className: 'font-semibold mt-4 mb-2' }, '类别说明：'),
        React.createElement('ul', { className: 'list-disc pl-5 space-y-1' },
            React.createElement('li', null, React.createElement('span', { className: 'category-symbolic font-semibold' }, 'Symbolic:'), ' 基于规则和逻辑的 AI 方法 (例如，专家系统，逻辑编程)。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-connectionist font-semibold' }, 'Connectionist:'), ' 受大脑启发的 AI 方法，使用互连节点或“神经元”(例如，神经网络，深度学习)。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-milestone font-semibold' }, 'Milestone:'), ' 领域中的关键转折点或基础性事件。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-application font-semibold' }, 'Application:'), ' AI 技术在现实世界中的应用或演示。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-ethics font-semibold' }, 'Ethics:'), ' 与 AI 相关的伦理考虑、讨论或事件。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-hardware font-semibold' }, 'Hardware:'), ' 与 AI 相关的硬件开发，如专用芯片。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-llm font-semibold' }, 'LLM:'), ' 特指大型语言模型及其相关开发。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-multimodal font-semibold' }, 'Multimodal:'), ' 处理和整合多种类型数据 (例如，文本、图像、音频) 的 AI 系统。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-vision font-semibold' }, 'Vision:'), ' 与计算机视觉相关的进展。'),
            React.createElement('li', null, React.createElement('span', { className: 'category-robotics font-semibold' }, 'Robotics:'), ' AI 在机器人技术中的应用和进展。')
        )
    )
);

const AIHistoryContributeSection = () => (
    React.createElement('div', { className: 'prose max-w-none text-slate-700' },
        React.createElement('h2', {className: 'text-xl font-semibold text-slate-800 border-b pb-2 mb-4 border-indigo-500'}, '如何贡献'),
        React.createElement('p', null, '非常欢迎对此时间线做出贡献！如果您有建议、更正或希望添加的新事件，请通过以下方式之一进行：'),
        React.createElement('ul', { className: 'list-disc pl-5 space-y-1' },
            React.createElement('li', null, React.createElement('strong', null, 'GitHub 问题 (Issues):'), ' 在 ', React.createElement('a', { href: 'https://github.com/nhlocal/AiTimeline/issues', target: '_blank', rel: 'noopener noreferrer', className: 'text-indigo-600 hover:text-indigo-800 hover:underline' }, 'GitHub 仓库'), ' 中创建一个新的 Issue，详细说明您的建议。'),
            React.createElement('li', null, React.createElement('strong', null, 'GitHub 拉取请求 (Pull Requests):'), ' 如果您熟悉 Git 和 GitHub，可以直接 Fork 仓库，进行更改，然后提交 Pull Request。')
        ),
        React.createElement('p', { className: 'mt-4' }, '在建议新事件时，请尝试包含以下信息：'),
        React.createElement('ul', { className: 'list-disc pl-5 space-y-1' },
            React.createElement('li', null, React.createElement('strong', null, '年份：'), ' 事件发生的年份。'),
            React.createElement('li', null, React.createElement('strong', null, '事件描述：'), ' 对事件及其重要性的简要总结。'),
            React.createElement('li', null, React.createElement('strong', null, '类别：'), ' 从现有类别中选择一个最合适的（Symbolic, Connectionist, Milestone, Application, Ethics, Hardware, LLM, Multimodal, Vision, Robotics），或建议一个新的类别。'),
            React.createElement('li', null, React.createElement('strong', null, '关键人物：'), ' 参与事件的关键个人或组织。'),
            React.createElement('li', null, React.createElement('strong', null, '来源：'), ' 指向权威来源 (例如，研究论文，官方公告，知名新闻文章) 的链接以验证事件。')
        ),
        React.createElement('p', { className: 'mt-4' }, '感谢您帮助改进此资源！')
    )
);

const AIHistoryPage = () => {
    const [activeSection, setActiveSection] = useState('timeline');
    const [searchTerm, setSearchTerm] = useState('');
    const currentTheme = COMPANY_THEMES.default; // AI History uses the default theme

    const renderSection = () => {
        switch (activeSection) {
            case 'timeline': return React.createElement(AIHistoryTimelineSection, { searchTerm, setSearchTerm });
            case 'meta': return React.createElement(AIHistoryMetaSection);
            case 'contribute': return React.createElement(AIHistoryContributeSection);
            default: return React.createElement(AIHistoryTimelineSection, { searchTerm, setSearchTerm });
        }
    };
    
    const SubNavButton = ({ sectionId, label }) => (
        React.createElement('button', {
            onClick: () => { setActiveSection(sectionId); setSearchTerm(''); },
            className: `px-4 py-2 text-sm font-medium rounded-md transition-colors
                        ${activeSection === sectionId ? `${currentTheme.headerBgColor} text-white shadow-md` : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`
        }, label)
    );

    return (
        React.createElement('div', { className: 'bg-white p-4 md:p-6 rounded-lg shadow' },
             React.createElement('div', { className: `${currentTheme.headerBgColor} text-white rounded-t-lg -m-4 md:-m-6 p-4 md:p-6 mb-6 text-center` },
                React.createElement('h1', { className: 'text-3xl md:text-4xl font-bold' }, 'AI 时间线'),
                React.createElement('p', { className: 'text-indigo-200 mt-1' }, '一部人工智能发展史，频繁更新，欢迎贡献！'),
                 React.createElement('p', { className: 'text-sm text-indigo-300 mt-2' },
                    '创建者 ', React.createElement('a', { href: 'https://twitter.com/NiallMaher', target: '_blank', rel: 'noopener noreferrer', className: 'text-indigo-300 hover:text-white hover:underline' }, 'Niall Maher'),
                    ' | ', React.createElement('a', { href: 'https://github.com/nhlocal/AiTimeline', target: '_blank', rel: 'noopener noreferrer', className: 'text-indigo-300 hover:text-white hover:underline' }, '在 GitHub 上查看')
                )
            ),
            React.createElement('nav', { className: 'flex justify-center space-x-2 md:space-x-4 mb-6 pb-6 border-b border-slate-200' },
                React.createElement(SubNavButton, { sectionId: 'timeline', label: '时间线' }),
                React.createElement(SubNavButton, { sectionId: 'meta', label: '元信息' }),
                React.createElement(SubNavButton, { sectionId: 'contribute', label: '贡献' })
            ),
            renderSection()
        )
    );
};
// --- END OF AI HISTORY COMPONENTS ---


// --- START OF VIDEO MODELS COMPONENTS ---
const VideoModelsPage = () => {
    const [sortOrder, setSortOrder] = useState('series'); // 'series' or 'date'
    const [models, setModels] = useState(videoModelsData);
    const currentTheme = COMPANY_THEMES.default; // Video Models uses the default theme


    const originalModelsBySeries = useMemo(() => [...videoModelsData], []);

    const sortByDate = useCallback(() => {
        const sorted = [...models].sort((a, b) => a.date.localeCompare(b.date));
        setModels(sorted);
        setSortOrder('date');
    }, [models]);

    const sortBySeries = useCallback(() => {
        setModels(originalModelsBySeries);
        setSortOrder('series');
    }, [originalModelsBySeries]);

    return (
        React.createElement('div', { className: 'bg-white p-4 md:p-6 rounded-lg shadow' },
            React.createElement('div', { className: `${currentTheme.headerBgColor} text-white rounded-t-lg -m-4 md:-m-6 p-4 md:p-6 mb-6 text-center`},
                React.createElement('h1', { className: 'text-2xl md:text-3xl font-bold' }, '视频生成模型的演进')
            ),
            React.createElement('div', { className: 'flex justify-end items-center mb-6 pb-6 border-b border-slate-200' },
                React.createElement('button', {
                    onClick: sortBySeries,
                    className: `px-4 py-2 text-sm font-medium rounded-full transition-colors mr-2
                        ${sortOrder === 'series' ? `${currentTheme.headerBgColor} text-white shadow-md` : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`
                }, '按模型系列排序'),
                React.createElement('button', {
                    onClick: sortByDate,
                    className: `px-4 py-2 text-sm font-medium rounded-full transition-colors
                        ${sortOrder === 'date' ? `${currentTheme.headerBgColor} text-white shadow-md` : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`
                }, '按发布时间排序')
            ),
            React.createElement('div', { className: 'overflow-x-auto shadow-md rounded-lg border border-slate-200' },
                React.createElement('table', { className: 'min-w-full bg-white video-models-table' },
                    React.createElement('thead', { className: 'bg-slate-50' },
                        React.createElement('tr', null,
                            ['类型', '模型名字', '发布机构', '发布时间', '项目主页', '论文/报告/Blog'].map(header => (
                                React.createElement('th', { key: header, className: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, header)
                            ))
                        )
                    ),
                    React.createElement('tbody', { className: 'divide-y divide-slate-200' },
                        models.map((model, index) => (
                            React.createElement('tr', { key: index, 'data-date': model.date, className: `hover:bg-indigo-50 transition-all duration-150 ease-in-out hover:shadow-md` },
                                React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap' },
                                    React.createElement('span', { className: `video-model-badge ${model.type === '开源' ? 'badge-open' : 'badge-closed'}` }, model.type)
                                ),
                                React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800' },
                                  React.createElement('span', { className: 'series-indicator', style: { backgroundColor: model.seriesColor } }),
                                  model.name
                                ),
                                React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm text-slate-600' }, model.org),
                                React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm text-slate-600' }, model.date),
                                React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm' },
                                    model.projectLink && React.createElement('a', { href: model.projectLink, target: '_blank', rel: 'noopener noreferrer', className: `${currentTheme.notesLinkColor} ${currentTheme.notesLinkHoverColor} hover:underline` }, model.projectLink.replace(/^https?:\/\//, ''))
                                ),
                                React.createElement('td', { className: 'px-4 py-3 whitespace-nowrap text-sm' },
                                    model.paperLink && React.createElement('a', { href: model.paperLink, target: '_blank', rel: 'noopener noreferrer', className: `${currentTheme.notesLinkColor} ${currentTheme.notesLinkHoverColor} hover:underline mr-2` }, 
                                        model.paperLinkText || (model.blogLink ? 'paper' : 'report/paper')
                                    ),
                                    model.blogLink && React.createElement('a', { href: model.blogLink, target: '_blank', rel: 'noopener noreferrer', className: `${currentTheme.notesLinkColor} ${currentTheme.notesLinkHoverColor} hover:underline` }, 'blog')
                                )
                            )
                        ))
                    )
                )
            )
        )
    );
};
// --- END OF VIDEO MODELS COMPONENTS ---


// --- START OF LLM EVOLUTION COMPONENTS ---
const LLMEvolutionPage = () => {
    const [activeLLMTab, setActiveLLMTab] = useState(LLM_COMPANY_ORDER[0]);
    const [processedLLMData, setProcessedLLMData] = useState(ALL_LLM_TAB_DATA);

    useEffect(() => {
        const cleanCellContent = (content, validRefIds, theme) => {
            if (typeof content !== 'string') return content;
            let cleanedString = content;
            const regex = /\[([A-Z]{1,2}-[0-9]{1,2}[a-z]?)\]/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                const refId = match[1];
                if (!validRefIds.has(refId)) {
                    cleanedString = cleanedString.replace(match[0], '');
                }
            }
            return cleanedString.replace(/\s\s+/g, ' ').trim();
        };

        const newProcessedData = { ...ALL_LLM_TAB_DATA };
        LLM_COMPANY_ORDER.forEach(tabId => {
            const tabData = newProcessedData[tabId];
            if (tabData && tabData.notes && tabData.notes.references) {
                const validRefIds = new Set(tabData.notes.references.map(r => r.id));
                const cleanedRows = tabData.rows.map(row => {
                    if (row.isSeriesHeader) return row;
                    const cleanedCells = row.cells.map(cell => ({
                        ...cell,
                        content: cleanCellContent(cell.content, validRefIds, tabData.theme)
                    }));
                    return { ...row, cells: cleanedCells };
                });
                newProcessedData[tabId] = { ...tabData, rows: cleanedRows };
            }
        });
        setProcessedLLMData(newProcessedData);
    }, []);
    
    const activeLLMTabData = processedLLMData[activeLLMTab];
    if (!activeLLMTabData) return React.createElement('div', null, 'LLM Data not found for: ', activeLLMTab);


    return (
        React.createElement('div', null,
            React.createElement('nav', {
                className: "bg-slate-100 p-2 rounded-t-lg sticky top-[48px] z-30 flex justify-center overflow-x-auto hide-scrollbar border-b border-slate-300 shadow-sm",
                'aria-label': "LLM Model Companies"
            },
                LLM_COMPANY_ORDER.map((companyId) => (
                    React.createElement(LLMTabButton, {
                        key: companyId,
                        tabId: companyId,
                        label: processedLLMData[companyId].label,
                        activeTab: activeLLMTab,
                        setActiveTab: setActiveLLMTab,
                        theme: processedLLMData[companyId].theme,
                    })
                ))
            ),
             React.createElement('div', {className: "bg-white p-4 md:p-6 rounded-b-lg shadow mt-0"},
                React.createElement(LLMModelTable, { headers: activeLLMTabData.headers, rows: activeLLMTabData.rows, theme: activeLLMTabData.theme, references: activeLLMTabData.notes.references }),
                React.createElement(NotesSection, { notes: activeLLMTabData.notes, theme: activeLLMTabData.theme })
            )
        )
    );
};
// --- END OF LLM EVOLUTION COMPONENTS ---


// --- Main App Component ---
const App = () => {
    const [activeMainTab, setActiveMainTab] = useState(MAIN_TAB_ORDER[0]);

    const mainTabsConfig = {
        aiHistory: { id: "aiHistory", label: "AI发展史", component: AIHistoryPage, theme: COMPANY_THEMES.default },
        llmEvolution: { id: "llmEvolution", label: "大语言模型演进", component: LLMEvolutionPage, theme: COMPANY_THEMES.openai }, // Main theme for this tab container, sub-tabs have their own.
        videoModels: { id: "videoModels", label: "视频生成模型", component: VideoModelsPage, theme: COMPANY_THEMES.default },
    };
    
    const ActiveComponent = mainTabsConfig[activeMainTab].component;
    // Footer and other general app elements will use the consistent default theme.
    const appBaseTheme = COMPANY_THEMES.default;


    return (
        React.createElement('div', { className: "flex flex-col min-h-screen" },
            React.createElement('nav', {
                className: "sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-md overflow-x-auto hide-scrollbar",
                'aria-label': "主要板块导航"
            },
                React.createElement('div', { className: "container mx-auto flex justify-start md:justify-center", role: "tablist" },
                    MAIN_TAB_ORDER.map((tabId) => (
                        React.createElement(MainTabButton, {
                            key: tabId,
                            tabId: tabId,
                            label: mainTabsConfig[tabId].label,
                            activeTab: activeMainTab,
                            setActiveTab: setActiveMainTab,
                            // Pass the specific theme for the tab button itself if it's active, otherwise use a generic style for inactive
                            theme: activeMainTab === tabId ? mainTabsConfig[tabId].theme : appBaseTheme,
                        })
                    ))
                )
            ),
            React.createElement('main', { className: "container mx-auto px-4 py-4 md:py-8 flex-grow" }, 
                 React.createElement(ActiveComponent, null)
            ),
            React.createElement('footer', { className: `py-8 text-center ${appBaseTheme.notesBgColor} border-t ${appBaseTheme.borderColor}` },
                React.createElement('p', { className: `text-sm ${appBaseTheme.textColor}` },
                    `© ${new Date().getFullYear()} AI追踪器。信息仅供参考。当前视图: ${mainTabsConfig[activeMainTab].label}`
                ),
                 React.createElement('p', { className: `text-xs ${appBaseTheme.textColor} opacity-75 mt-1` }, "原始AI时间线由Niall Maher创建。LLM演进数据及视频模型数据独立整理。")
            )
        )
    );
};

// --- Rendering logic ---
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    React.createElement(React.StrictMode, null,
        React.createElement(App, null)
    )
);