import { Team, TeamMember, OrganizationMember, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  organizationId: z.string().uuid(),
  description: z.string().optional(),
});

const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

const addTeamMemberSchema = z.object({
  teamId: z.string().uuid(),
  organizationMemberId: z.string().uuid(),
  role: z.enum(['member', 'admin']).default('member'),
});

export class TeamService {
  /**
   * Create a new team
   */
  async createTeam(data: z.infer<typeof createTeamSchema>, userId: string): Promise<Team> {
    // Validate input
    const validatedData = createTeamSchema.parse(data);
    
    // Check if user has permission to create teams in the organization
    const orgMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: validatedData.organizationId,
        userId: userId,
      },
    });
    
    if (!orgMember) {
      throw new Error('User is not a member of the organization');
    }
    
    // Create the team
    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        organizationId: validatedData.organizationId,
        description: validatedData.description,
      },
    });
    
    // Add the creator as an admin of the team
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        organizationMemberId: orgMember.id,
        role: 'admin',
      },
    });
    
    return team;
  }
  
  /**
   * Update a team
   */
  async updateTeam(teamId: string, data: z.infer<typeof updateTeamSchema>, userId: string): Promise<Team> {
    // Validate input
    const validatedData = updateTeamSchema.parse(data);
    
    // Check if user has permission to update the team
    const team = await this.getTeamWithMembers(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    const hasPermission = await this.checkUserTeamPermission(userId, teamId, 'admin');
    if (!hasPermission) {
      throw new Error('User does not have permission to update the team');
    }
    
    // Update the team
    return prisma.team.update({
      where: { id: teamId },
      data: validatedData,
    });
  }
  
  /**
   * Delete a team
   */
  async deleteTeam(teamId: string, userId: string): Promise<void> {
    // Check if user has permission to delete the team
    const team = await this.getTeamWithMembers(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    const hasPermission = await this.checkUserTeamPermission(userId, teamId, 'admin');
    if (!hasPermission) {
      throw new Error('User does not have permission to delete the team');
    }
    
    // Delete the team
    await prisma.team.delete({
      where: { id: teamId },
    });
  }
  
  /**
   * Get a team by ID
   */
  async getTeam(teamId: string): Promise<Team | null> {
    return prisma.team.findUnique({
      where: { id: teamId },
    });
  }
  
  /**
   * Get a team with its members
   */
  async getTeamWithMembers(teamId: string) {
    return prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            organizationMember: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }
  
  /**
   * Get all teams in an organization
   */
  async getTeamsByOrganization(organizationId: string) {
    return prisma.team.findMany({
      where: { organizationId },
      include: {
        members: {
          include: {
            organizationMember: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }
  
  /**
   * Add a member to a team
   */
  async addTeamMember(data: z.infer<typeof addTeamMemberSchema>, userId: string): Promise<TeamMember> {
    // Validate input
    const validatedData = addTeamMemberSchema.parse(data);
    
    // Check if user has permission to add members to the team
    const hasPermission = await this.checkUserTeamPermission(userId, validatedData.teamId, 'admin');
    if (!hasPermission) {
      throw new Error('User does not have permission to add members to the team');
    }
    
    // Check if the organization member exists
    const orgMember = await prisma.organizationMember.findUnique({
      where: { id: validatedData.organizationMemberId },
    });
    
    if (!orgMember) {
      throw new Error('Organization member not found');
    }
    
    // Check if the organization member is already in the team
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_organizationMemberId: {
          teamId: validatedData.teamId,
          organizationMemberId: validatedData.organizationMemberId,
        },
      },
    });
    
    if (existingMember) {
      throw new Error('Member is already in the team');
    }
    
    // Add the member to the team
    return prisma.teamMember.create({
      data: {
        teamId: validatedData.teamId,
        organizationMemberId: validatedData.organizationMemberId,
        role: validatedData.role,
      },
    });
  }
  
  /**
   * Remove a member from a team
   */
  async removeTeamMember(teamId: string, organizationMemberId: string, userId: string): Promise<void> {
    // Check if user has permission to remove members from the team
    const hasPermission = await this.checkUserTeamPermission(userId, teamId, 'admin');
    if (!hasPermission) {
      throw new Error('User does not have permission to remove members from the team');
    }
    
    // Remove the member from the team
    await prisma.teamMember.delete({
      where: {
        teamId_organizationMemberId: {
          teamId,
          organizationMemberId,
        },
      },
    });
  }
  
  /**
   * Update a team member's role
   */
  async updateTeamMemberRole(teamId: string, organizationMemberId: string, role: string, userId: string): Promise<TeamMember> {
    // Check if user has permission to update member roles
    const hasPermission = await this.checkUserTeamPermission(userId, teamId, 'admin');
    if (!hasPermission) {
      throw new Error('User does not have permission to update member roles');
    }
    
    // Update the member's role
    return prisma.teamMember.update({
      where: {
        teamId_organizationMemberId: {
          teamId,
          organizationMemberId,
        },
      },
      data: { role },
    });
  }
  
  /**
   * Check if a user has a specific permission in a team
   */
  async checkUserTeamPermission(userId: string, teamId: string, requiredRole: string): Promise<boolean> {
    // Get the team
    const team = await this.getTeamWithMembers(teamId);
    if (!team) {
      return false;
    }
    
    // Find the user's organization member record
    const orgMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: team.organizationId,
        userId,
      },
    });
    
    if (!orgMember) {
      return false;
    }
    
    // Find the user's team member record
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_organizationMemberId: {
          teamId,
          organizationMemberId: orgMember.id,
        },
      },
    });
    
    if (!teamMember) {
      return false;
    }
    
    // Check if the user has the required role
    if (requiredRole === 'admin') {
      return teamMember.role === 'admin';
    }
    
    // For other roles, any team member has permission
    return true;
  }
  
  /**
   * Get all teams a user is a member of
   */
  async getUserTeams(userId: string) {
    // Find the user's organization memberships
    const orgMembers = await prisma.organizationMember.findMany({
      where: { userId },
    });
    
    const orgMemberIds = orgMembers.map(member => member.id);
    
    // Find all teams the user is a member of
    return prisma.team.findMany({
      where: {
        members: {
          some: {
            organizationMemberId: {
              in: orgMemberIds,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            organizationMember: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }
} 