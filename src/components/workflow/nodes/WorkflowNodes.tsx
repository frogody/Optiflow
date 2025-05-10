'use client';

import {
  // Core icons
  PlayIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  CpuChipIcon,
  
  // Action icons
  EnvelopeIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  CalculatorIcon,
  CloudIcon,
  GlobeAltIcon,
  TableCellsIcon,
  ChatBubbleOvalLeftIcon,
  
  // Integration icons
  CodeBracketSquareIcon,
  CircleStackIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  CreditCardIcon,
  
  // Utility icons
  ArrowsPointingOutIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import React from 'react';
import { Handle, Position } from 'reactflow';

// Shared styles for all nodes
const nodeStyles = {
  base: 'px-3 py-2 rounded-lg border shadow-sm min-w-[180px] bg-[#1F2937] hover:shadow-md transition-shadow duration-200',
  selected: 'ring-2 ring-[#22D3EE]',
  trigger: 'border-[#F97316] bg-[#7C2D12]/40',
  action: 'border-[#22D3EE] bg-[#164E63]/40',
  condition: 'border-[#A855F7] bg-[#6B21A8]/40',
  loop: 'border-[#F59E0B] bg-[#78350F]/40',
  error: 'border-[#EF4444] bg-[#7F1D1D]/40',
  integration: 'border-[#10B981] bg-[#065F46]/40',
  utility: 'border-[#6366F1] bg-[#3730A3]/40',
  transform: 'border-[#EC4899] bg-[#831843]/40',
  title: 'flex items-center font-medium text-white mb-1',
  content: 'text-xs text-gray-300',
  icon: 'h-5 w-5 mr-2 flex-shrink-0',
  handleIn: 'w-3 h-3 bg-gray-400 border border-gray-600 top-1/2',
  handleOut: 'w-3 h-3 bg-gray-400 border border-gray-600 top-1/2'
};

// Node type definitions for TypeScript
interface NodeProps {
  data: {
    label: string;
    description?: string;
    selected?: boolean;
    config?: any;
  };
  selected?: boolean;
}

// Base node component that other nodes will extend
const BaseNode: React.FC<NodeProps & { type: string; icon: React.ElementType }> = ({ 
  data, 
  selected, 
  type, 
  icon: Icon,
  children 
}) => {
  // Determine node style based on type
  const getNodeStyle = () => {
    let style = nodeStyles.base;
    
    // Add type-specific styling
    switch (type) {
      case 'trigger': style += ' ' + nodeStyles.trigger; break;
      case 'action': style += ' ' + nodeStyles.action; break;
      case 'condition': style += ' ' + nodeStyles.condition; break;
      case 'loop': style += ' ' + nodeStyles.loop; break;
      case 'error': style += ' ' + nodeStyles.error; break;
      case 'integration': style += ' ' + nodeStyles.integration; break;
      case 'utility': style += ' ' + nodeStyles.utility; break;
      case 'transform': style += ' ' + nodeStyles.transform; break;
      default: style += ' ' + nodeStyles.action;
    }
    
    // Add selected styling if selected
    if (selected || data.selected) {
      style += ' ' + nodeStyles.selected;
    }
    
    return style;
  };
  
  return (
    <div className={getNodeStyle()}>
      <Handle
        type="target"
        position={Position.Left}
        className={nodeStyles.handleIn}
      />
      
      <div className={nodeStyles.title}>
        <Icon className={nodeStyles.icon} />
        <span>{data.label}</span>
      </div>
      
      {data.description && (
        <div className={nodeStyles.content}>
          {data.description}
        </div>
      )}
      
      {children}
      
      <Handle
        type="source"
        position={Position.Right}
        className={nodeStyles.handleOut}
      />
    </div>
  );
};

// ============ TRIGGER NODES ============

export const ManualTriggerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="trigger" icon={PlayIcon} />
);

export const ScheduleTriggerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="trigger" icon={ClockIcon} />
);

export const WebhookTriggerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="trigger" icon={GlobeAltIcon} />
);

export const EventTriggerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="trigger" icon={BellAlertIcon} />
);

export const FileTriggerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="trigger" icon={DocumentTextIcon} />
);

export const PollingTriggerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="trigger" icon={ArrowPathIcon} />
);

// ============ ACTION NODES ============

export const EmailNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="action" icon={EnvelopeIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div>To: {props.data.config.to || 'Not set'}</div>
        <div className="truncate">Subject: {props.data.config.subject || 'Not set'}</div>
      </div>
    )}
  </BaseNode>
);

export const HttpRequestNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="action" icon={GlobeAltIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="flex items-center">
          <span className={`px-1 py-0.5 rounded text-xs ${
            props.data.config.method === 'GET' ? 'bg-blue-800 text-blue-200' :
            props.data.config.method === 'POST' ? 'bg-green-800 text-green-200' :
            props.data.config.method === 'PUT' ? 'bg-yellow-800 text-yellow-200' :
            props.data.config.method === 'DELETE' ? 'bg-red-800 text-red-200' :
            'bg-gray-800 text-gray-200'
          }`}>
            {props.data.config.method || 'GET'}
          </span>
          <span className="ml-2 truncate">{props.data.config.url || 'https://api.example.com'}</span>
        </div>
      </div>
    )}
  </BaseNode>
);

export const FileOperationNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="action" icon={DocumentDuplicateIcon} />
);

export const CloudStorageNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="action" icon={CloudArrowUpIcon} />
);

export const DatabaseNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="integration" icon={CircleStackIcon} />
);

export const TransformDataNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="transform" icon={AdjustmentsHorizontalIcon} />
);

export const AIProcessingNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="action" icon={CpuChipIcon} />
);

export const SlackNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="integration" icon={ChatBubbleLeftRightIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div>Channel: {props.data.config.channel || '#general'}</div>
        <div className="truncate">Message: {props.data.config.message || 'Not set'}</div>
      </div>
    )}
  </BaseNode>
);

export const SpreadsheetNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="integration" icon={TableCellsIcon} />
);

// ============ CONTROL FLOW NODES ============

export const ConditionNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="condition" icon={FunnelIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div className="truncate">if {props.data.config.condition || '[condition]'}</div>
      </div>
    )}
  </BaseNode>
);

export const SwitchNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="condition" icon={AdjustmentsHorizontalIcon} />
);

export const LoopNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="loop" icon={ArrowPathIcon} />
);

export const DelayNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="utility" icon={ClockIcon}>
    {props.data.config && (
      <div className="mt-2 p-2 bg-[#111827] rounded text-xs text-gray-300">
        <div>Delay: {props.data.config.duration || '1'} {props.data.config.unit || 'minutes'}</div>
      </div>
    )}
  </BaseNode>
);

export const ErrorHandlerNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="error" icon={ExclamationTriangleIcon} />
);

// ============ UTILITY NODES ============

export const LoggingNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="utility" icon={DocumentTextIcon} />
);

export const CustomCodeNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="utility" icon={CodeBracketIcon} />
);

export const CalculationNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="utility" icon={CalculatorIcon} />
);

export const CommentNode: React.FC<NodeProps> = (props) => (
  <BaseNode {...props} type="utility" icon={ChatBubbleOvalLeftIcon} />
);

// Export node types map for React Flow
export const nodeTypes = {
  // Triggers
  manualTrigger: ManualTriggerNode,
  scheduleTrigger: ScheduleTriggerNode,
  webhookTrigger: WebhookTriggerNode,
  eventTrigger: EventTriggerNode,
  fileTrigger: FileTriggerNode,
  pollingTrigger: PollingTriggerNode,
  
  // Actions
  email: EmailNode,
  httpRequest: HttpRequestNode,
  fileOperation: FileOperationNode,
  cloudStorage: CloudStorageNode,
  database: DatabaseNode,
  transformData: TransformDataNode,
  aiProcessing: AIProcessingNode,
  slack: SlackNode,
  spreadsheet: SpreadsheetNode,
  
  // Control Flow
  condition: ConditionNode,
  switch: SwitchNode,
  loop: LoopNode,
  delay: DelayNode,
  errorHandler: ErrorHandlerNode,
  
  // Utility
  logging: LoggingNode,
  customCode: CustomCodeNode,
  calculation: CalculationNode,
  comment: CommentNode
};