'use client';

import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterTextIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  LanguageIcon,
  LightBulbIcon,
  MusicalNoteIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import React from 'react';
import { Handle, Position } from 'reactflow';

// Import base node style and structure
import { BaseNode, nodeStyles } from './BaseNode';

// Types for AI node props
interface AINodeProps {
  data: {
    label: string;
    description?: string;
    selected?: boolean;
    config?: any;
    model?: string;
    parameters?: any;
  };
  selected?: boolean;
}

// ============ TEXT GENERATION NODES ============

export const TextGenerationNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={DocumentTextIcon}>
    {props.data.model && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex items-center">
          <span className="bg-[#312e81] text-indigo-200 px-1.5 py-0.5 rounded text-xs mr-2">Model</span>
          <span className="truncate">{props.data.model}</span>
        </div>
        {props.data.config?.prompt && (
          <div className="mt-1 truncate">
            <span className="text-gray-500">Prompt:</span> {props.data.config.prompt.substring(0, 40)}...
          </div>
        )}
      </div>
    )}
  </BaseNode>
);

export const SummarizationNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={DocumentDuplicateIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex flex-wrap items-center gap-1 mt-1">
          {props.data.config.style && (
            <span className="bg-[#1a202c] px-2 py-0.5 rounded">
              {props.data.config.style}
            </span>
          )}
          {props.data.config.length && (
            <span className="bg-[#1a202c] px-2 py-0.5 rounded">
              {props.data.config.length} words
            </span>
          )}
        </div>
      </div>
    )}
  </BaseNode>
);

export const ChatCompletionNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={ChatBubbleBottomCenterTextIcon}>
    {props.data.model && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex items-center">
          <span className="bg-[#312e81] text-indigo-200 px-1.5 py-0.5 rounded text-xs mr-2">Model</span>
          <span className="truncate">{props.data.model}</span>
        </div>
        {props.data.config?.systemPrompt && (
          <div className="mt-1 truncate">
            <span className="text-gray-500">System:</span> {props.data.config.systemPrompt.substring(0, 30)}...
          </div>
        )}
      </div>
    )}
  </BaseNode>
);

// ============ DOCUMENT PROCESSING NODES ============

export const DocumentExtractionNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={DocumentMagnifyingGlassIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        {props.data.config.extractionType && (
          <div className="flex items-center">
            <span className="bg-[#312e81] text-indigo-200 px-1.5 py-0.5 rounded text-xs mr-2">
              {props.data.config.extractionType}
            </span>
            {props.data.config.format && (
              <span className="text-gray-400 ml-auto">
                Format: {props.data.config.format}
              </span>
            )}
          </div>
        )}
      </div>
    )}
  </BaseNode>
);

export const SemanticSearchNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={BookOpenIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Top results:</span>
          <span className="bg-[#1a202c] px-2 py-0.5 rounded">
            {props.data.config.topK || 3}
          </span>
        </div>
      </div>
    )}
  </BaseNode>
);

// ============ LANGUAGE PROCESSING NODES ============

export const TranslationNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={LanguageIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex items-center">
          {props.data.config.sourceLanguage && props.data.config.targetLanguage && (
            <>
              <span className="bg-[#1a202c] px-2 py-0.5 rounded">
                {props.data.config.sourceLanguage}
              </span>
              <span className="mx-2">→</span>
              <span className="bg-[#1a202c] px-2 py-0.5 rounded">
                {props.data.config.targetLanguage}
              </span>
            </>
          )}
        </div>
      </div>
    )}
  </BaseNode>
);

export const SentimentAnalysisNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={LightBulbIcon} />
);

// ============ MULTI-MODAL NODES ============

export const ImageGenerationNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={PhotoIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        {props.data.config.resolution && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Resolution:</span>
            <span className="bg-[#1a202c] px-2 py-0.5 rounded">
              {props.data.config.resolution}
            </span>
          </div>
        )}
      </div>
    )}
  </BaseNode>
);

export const ImageAnalysisNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={DocumentMagnifyingGlassIcon} />
);

export const TextToSpeechNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={MusicalNoteIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        {props.data.config.voice && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Voice:</span>
            <span className="bg-[#1a202c] px-2 py-0.5 rounded">
              {props.data.config.voice}
            </span>
          </div>
        )}
      </div>
    )}
  </BaseNode>
);

export const SpeechToTextNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={MusicalNoteIcon} />
);

export const VideoAnalysisNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={VideoCameraIcon} />
);

// ============ SPECIALIZED AI NODES ============

export const ClassificationNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={AcademicCapIcon}>
    {props.data.config && props.data.config.categories && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <span className="text-gray-400 block mb-1">Categories:</span>
        <div className="flex flex-wrap gap-1">
          {props.data.config.categories.slice(0, 3).map((category: string, idx: number) => (
            <span key={idx} className="bg-[#1a202c] px-2 py-0.5 rounded">
              {category}
            </span>
          ))}
          {props.data.config.categories.length > 3 && (
            <span className="text-gray-400">+{props.data.config.categories.length - 3} more</span>
          )}
        </div>
      </div>
    )}
  </BaseNode>
);

export const CustomModelNode: React.FC<AINodeProps> = (props) => (
  <BaseNode {...props} type="ai" icon={PuzzlePieceIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex items-center">
          {props.data.config.endpoint && (
            <span className="truncate text-gray-400">
              {props.data.config.endpoint}
            </span>
          )}
        </div>
      </div>
    )}
  </BaseNode>
);

// Export all AI node types for the react-flow node types configuration
export const aiNodeTypes = {
  textGeneration: TextGenerationNode,
  summarization: SummarizationNode,
  chatCompletion: ChatCompletionNode,
  documentExtraction: DocumentExtractionNode,
  semanticSearch: SemanticSearchNode,
  translation: TranslationNode,
  sentimentAnalysis: SentimentAnalysisNode,
  imageGeneration: ImageGenerationNode,
  imageAnalysis: ImageAnalysisNode,
  textToSpeech: TextToSpeechNode,
  speechToText: SpeechToTextNode,
  videoAnalysis: VideoAnalysisNode,
  classification: ClassificationNode,
  customModel: CustomModelNode
}; 