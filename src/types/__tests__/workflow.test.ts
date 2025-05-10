import { describe, it, expect } from 'vitest';

import {
  CommandType,
  NodeType,
  WorkflowStatus,
  TriggerType,
  ExecutionStatus,
  StepStatus,
  type WorkflowCommand,
  type WorkflowNode,
  type Workflow,
  type ExecutionStep
} from '../workflow';

describe('Workflow Types', () => {
  describe('CommandType', () => {
    it('should have all required command types', () => {
      expect(Object.values(CommandType)).toContain('CREATE_NODE');
      expect(Object.values(CommandType)).toContain('CONNECT_NODES');
      expect(Object.values(CommandType)).toContain('DELETE_NODE');
      expect(Object.values(CommandType)).toContain('RENAME_NODE');
      expect(Object.values(CommandType)).toContain('CONFIGURE_NODE');
      expect(Object.values(CommandType)).toContain('SAVE_WORKFLOW');
      expect(Object.values(CommandType)).toContain('LOAD_WORKFLOW');
      expect(Object.values(CommandType)).toContain('RUN_WORKFLOW');
      expect(Object.values(CommandType)).toContain('STOP_WORKFLOW');
    });
  });

  describe('WorkflowCommand', () => {
    it('should create valid workflow commands', () => {
      const command: WorkflowCommand = {
        type: CommandType.CREATE_NODE,
        nodeType: 'trigger',
        nodeName: 'Start'
      };

      expect(command.type).toBe(CommandType.CREATE_NODE);
      expect(command.nodeType).toBe('trigger');
      expect(command.nodeName).toBe('Start');
    });
  });

  describe('WorkflowNode', () => {
    it('should create valid workflow nodes', () => {
      const node: WorkflowNode = {
        id: 'node1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: {
          label: 'Start Node',
          description: 'Workflow start',
          config: { trigger: 'manual' }
        }
      };

      expect(node.id).toBe('node1');
      expect(node.type).toBe('trigger');
      expect(node.position).toEqual({ x: 100, y: 100 });
      expect(node.data.label).toBe('Start Node');
    });

    it('should accept all valid node types', () => {
      const nodeTypes: NodeType[] = [
        'trigger',
        'action',
        'condition',
        'loop',
        'delay',
        'http',
        'script',
        'aiAgent',
        'database',
        'transformation'
      ];

      nodeTypes.forEach(type => {
        const node: WorkflowNode = {
          id: 'test',
          type,
          position: { x: 0, y: 0 },
          data: {
            label: 'Test',
            description: 'Test node',
            config: {}
          }
        };
        expect(node.type).toBe(type);
      });
    });
  });

  describe('Workflow', () => {
    it('should create valid workflow', () => {
      const workflow: Workflow = {
        id: 'workflow1',
        name: 'Test Workflow',
        description: 'Test workflow description',
        status: 'active',
        triggerType: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionCount: 0,
        successCount: 0,
        failureCount: 0,
        averageExecutionTime: 0,
        creditsConsumed: 0,
        tags: ['test']
      };

      expect(workflow.id).toBe('workflow1');
      expect(workflow.status).toBe('active');
      expect(workflow.triggerType).toBe('manual');
    });

    it('should accept all valid workflow statuses', () => {
      const statuses: WorkflowStatus[] = ['active', 'inactive', 'draft', 'error'];
      statuses.forEach(status => {
        const workflow: Workflow = {
          id: 'test',
          name: 'Test',
          description: 'Test',
          status,
          triggerType: 'manual',
          createdAt: '',
          updatedAt: '',
          executionCount: 0,
          successCount: 0,
          failureCount: 0,
          averageExecutionTime: 0,
          creditsConsumed: 0,
          tags: []
        };
        expect(workflow.status).toBe(status);
      });
    });
  });

  describe('ExecutionStep', () => {
    it('should create valid execution step', () => {
      const step: ExecutionStep = {
        id: 'step1',
        name: 'Test Step',
        type: 'action',
        status: 'running',
        startTime: new Date().toISOString(),
        input: { key: 'value' },
        output: { result: 'success' }
      };

      expect(step.id).toBe('step1');
      expect(step.type).toBe('action');
      expect(step.status).toBe('running');
      expect(step.input).toEqual({ key: 'value' });
    });

    it('should accept all valid step statuses', () => {
      const statuses: StepStatus[] = ['success', 'failed', 'running', 'pending', 'skipped'];
      statuses.forEach(status => {
        const step: ExecutionStep = {
          id: 'test',
          name: 'Test',
          type: 'action',
          status,
          startTime: ''
        };
        expect(step.status).toBe(status);
      });
    });
  });
}); 