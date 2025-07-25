#!/usr/bin/env node

/**
 * Agent Instructions Audit Script
 * Audits all agent instruction files against available utilities
 * Phase 4: Agent Instructions Audit & Refinement
 */

const fs = require('fs').promises;
const path = require('path');

class AgentInstructionsAuditor {
  constructor() {
    this.agentsDir = 'agents';
    this.utilsDir = 'utils';
    this.auditResults = {};
  }

  /**
   * Run comprehensive audit of all agent instructions
   */
  async runAudit() {
    console.log('🔍 Starting Agent Instructions Audit (Phase 4)\n');

    const agents = ['seo', 'blog', 'review', 'image', 'publishing', 'social'];
    
    for (const agent of agents) {
      console.log(`📋 Auditing ${agent.toUpperCase()} Agent Instructions...`);
      await this.auditAgent(agent);
    }

    this.generateAuditReport();
    this.generateCompatibilityMatrix();
    this.generateGapAnalysis();
  }

  /**
   * Audit a specific agent's instructions
   */
  async auditAgent(agentName) {
    const instructionFile = path.join(this.agentsDir, agentName, 'instructions.md');
    const utilsFile = this.getUtilsFile(agentName);
    
    try {
      // Read instruction file
      const instructions = await fs.readFile(instructionFile, 'utf8');
      
      // Read utility file if it exists
      let utilsContent = null;
      let utilsExists = false;
      
      if (utilsFile) {
        try {
          utilsContent = await fs.readFile(utilsFile, 'utf8');
          utilsExists = true;
        } catch (error) {
          console.log(`   ⚠️  Utility file not found: ${utilsFile}`);
        }
      }

      // Analyze instructions
      const analysis = this.analyzeInstructions(instructions, utilsContent, utilsExists);
      
      this.auditResults[agentName] = {
        instructionFile,
        utilsFile,
        utilsExists,
        analysis
      };

      console.log(`   ✅ ${agentName.toUpperCase()} Agent audit completed`);
      
    } catch (error) {
      console.log(`   ❌ Error auditing ${agentName} agent: ${error.message}`);
      this.auditResults[agentName] = {
        error: error.message,
        instructionFile,
        utilsFile
      };
    }
  }

  /**
   * Get the corresponding utility file for an agent
   */
  getUtilsFile(agentName) {
    const utilsMap = {
      'seo': 'utils/enhancedSEOProcessor.js',
      'blog': null, // No existing utility file
      'review': 'utils/contentChecker.js',
      'image': 'utils/images.js',
      'publishing': 'utils/githubAPI.js', // Also utils/cloudflareAPI.js
      'social': 'utils/notificationService.js'
    };
    
    return utilsMap[agentName];
  }

  /**
   * Analyze instruction content against utility capabilities
   */
  analyzeInstructions(instructions, utilsContent, utilsExists) {
    const analysis = {
      tools: [],
      methods: [],
      dependencies: [],
      gaps: [],
      recommendations: []
    };

    // Extract tools mentioned in instructions
    const toolMatches = instructions.match(/\*\*([^*]+)\*\*: ([^\n]+)/g);
    if (toolMatches) {
      analysis.tools = toolMatches.map(match => {
        const [tool, description] = match.replace(/\*\*/g, '').split(': ');
        return { tool, description };
      });
    }

    // Extract methods/functions mentioned
    const methodMatches = instructions.match(/`([^`]+)`/g);
    if (methodMatches) {
      analysis.methods = methodMatches.map(match => match.replace(/`/g, ''));
    }

    // Check for utility compatibility
    if (utilsExists && utilsContent) {
      analysis.utilityCompatibility = this.checkUtilityCompatibility(instructions, utilsContent);
    } else {
      analysis.utilityCompatibility = {
        status: 'NO_UTILITY_FILE',
        message: 'No corresponding utility file found'
      };
    }

    // Identify gaps
    analysis.gaps = this.identifyGaps(instructions, utilsContent, utilsExists);

    return analysis;
  }

  /**
   * Check compatibility between instructions and utility file
   */
  checkUtilityCompatibility(instructions, utilsContent) {
    const compatibility = {
      status: 'UNKNOWN',
      methods: [],
      missing: [],
      available: []
    };

    // Extract method names from utility file
    const methodMatches = utilsContent.match(/async\s+(\w+)\s*\(/g);
    if (methodMatches) {
      compatibility.available = methodMatches.map(match => 
        match.replace(/async\s+/, '').replace(/\s*\(/, '')
      );
    }

    // Check for class definitions
    const classMatches = utilsContent.match(/class\s+(\w+)/g);
    if (classMatches) {
      compatibility.classes = classMatches.map(match => 
        match.replace(/class\s+/, '')
      );
    }

    // Check for specific methods mentioned in instructions
    const instructionMethods = instructions.match(/`(\w+)`/g);
    if (instructionMethods) {
      const methods = instructionMethods.map(match => match.replace(/`/g, ''));
      compatibility.methods = methods;
      
      methods.forEach(method => {
        if (compatibility.available.includes(method)) {
          compatibility.status = 'PARTIAL_MATCH';
        } else {
          compatibility.missing.push(method);
        }
      });
    }

    if (compatibility.missing.length === 0 && compatibility.methods.length > 0) {
      compatibility.status = 'COMPATIBLE';
    } else if (compatibility.missing.length > 0) {
      compatibility.status = 'INCOMPATIBLE';
    }

    return compatibility;
  }

  /**
   * Identify gaps between instructions and utilities
   */
  identifyGaps(instructions, utilsContent, utilsExists) {
    const gaps = [];

    if (!utilsExists) {
      gaps.push({
        type: 'MISSING_UTILITY_FILE',
        description: 'No corresponding utility file exists',
        severity: 'HIGH'
      });
      return gaps;
    }

    // Check for missing methods
    const methodMatches = instructions.match(/`(\w+)`/g);
    if (methodMatches) {
      const methods = methodMatches.map(match => match.replace(/`/g, ''));
      methods.forEach(method => {
        if (!utilsContent.includes(method)) {
          gaps.push({
            type: 'MISSING_METHOD',
            method,
            description: `Method '${method}' mentioned in instructions but not found in utility`,
            severity: 'HIGH'
          });
        }
      });
    }

    // Check for missing dependencies
    const dependencyMatches = instructions.match(/\*\*([^*]+)\*\*: ([^\n]+)/g);
    if (dependencyMatches) {
      dependencyMatches.forEach(match => {
        const [tool, description] = match.replace(/\*\*/g, '').split(': ');
        if (description.includes('not found') || description.includes('missing')) {
          gaps.push({
            type: 'MISSING_DEPENDENCY',
            tool,
            description,
            severity: 'MEDIUM'
          });
        }
      });
    }

    return gaps;
  }

  /**
   * Generate comprehensive audit report
   */
  generateAuditReport() {
    console.log('\n📊 Agent Instructions Audit Report\n');
    console.log('=' .repeat(60));

    Object.entries(this.auditResults).forEach(([agent, result]) => {
      console.log(`\n🤖 ${agent.toUpperCase()} AGENT`);
      console.log('-'.repeat(40));
      
      if (result.error) {
        console.log(`❌ Error: ${result.error}`);
        return;
      }

      console.log(`📄 Instructions: ${result.instructionFile}`);
      console.log(`🔧 Utility: ${result.utilsFile || 'None'}`);
      console.log(`✅ Utility Exists: ${result.utilsExists ? 'Yes' : 'No'}`);

      if (result.analysis) {
        console.log(`\n📋 Analysis:`);
        console.log(`   Tools: ${result.analysis.tools.length}`);
        console.log(`   Methods: ${result.analysis.methods.length}`);
        console.log(`   Gaps: ${result.analysis.gaps.length}`);

        if (result.analysis.utilityCompatibility) {
          const comp = result.analysis.utilityCompatibility;
          console.log(`   Compatibility: ${comp.status}`);
          if (comp.missing && comp.missing.length > 0) {
            console.log(`   Missing Methods: ${comp.missing.join(', ')}`);
          }
        }

        if (result.analysis.gaps && result.analysis.gaps.length > 0) {
          console.log(`\n⚠️  Gaps Found:`);
          result.analysis.gaps.forEach(gap => {
            console.log(`   - ${gap.type}: ${gap.description} (${gap.severity})`);
          });
        }
      }
    });
  }

  /**
   * Generate compatibility matrix
   */
  generateCompatibilityMatrix() {
    console.log('\n📊 Instruction-Utility Compatibility Matrix\n');
    console.log('=' .repeat(80));
    console.log('Agent'.padEnd(15) + 'Utility File'.padEnd(25) + 'Status'.padEnd(15) + 'Methods'.padEnd(25));
    console.log('-'.repeat(80));

    Object.entries(this.auditResults).forEach(([agent, result]) => {
      if (result.error) {
        console.log(`${agent.padEnd(15)} ${'ERROR'.padEnd(25)} ${'ERROR'.padEnd(15)} ${'ERROR'.padEnd(25)}`);
        return;
      }

      const utilityFile = result.utilsFile || 'None';
      const status = result.analysis?.utilityCompatibility?.status || 'UNKNOWN';
      const methods = result.analysis?.methods ? result.analysis.methods.join(', ') : 'None';

      console.log(`${agent.padEnd(15)} ${utilityFile.padEnd(25)} ${status.padEnd(15)} ${methods.padEnd(25)}`);
    });
  }

  /**
   * Generate gap analysis
   */
  generateGapAnalysis() {
    console.log('\n📊 Gap Analysis Report\n');
    console.log('=' .repeat(60));

    const allGaps = [];
    Object.entries(this.auditResults).forEach(([agent, result]) => {
      if (result.analysis?.gaps) {
        result.analysis.gaps.forEach(gap => {
          allGaps.push({
            agent,
            ...gap
          });
        });
      }
    });

    if (allGaps.length === 0) {
      console.log('✅ No gaps found! All instructions are compatible with utilities.');
      return;
    }

    // Group by severity
    const highGaps = allGaps.filter(gap => gap.severity === 'HIGH');
    const mediumGaps = allGaps.filter(gap => gap.severity === 'MEDIUM');
    const lowGaps = allGaps.filter(gap => gap.severity === 'LOW');

    if (highGaps.length > 0) {
      console.log('\n🔴 HIGH PRIORITY GAPS:');
      highGaps.forEach(gap => {
        console.log(`   ${gap.agent.toUpperCase()}: ${gap.description}`);
      });
    }

    if (mediumGaps.length > 0) {
      console.log('\n🟡 MEDIUM PRIORITY GAPS:');
      mediumGaps.forEach(gap => {
        console.log(`   ${gap.agent.toUpperCase()}: ${gap.description}`);
      });
    }

    if (lowGaps.length > 0) {
      console.log('\n🟢 LOW PRIORITY GAPS:');
      lowGaps.forEach(gap => {
        console.log(`   ${gap.agent.toUpperCase()}: ${gap.description}`);
      });
    }

    console.log(`\n📈 Summary: ${allGaps.length} total gaps (${highGaps.length} high, ${mediumGaps.length} medium, ${lowGaps.length} low)`);
  }
}

// Run the audit
async function main() {
  const auditor = new AgentInstructionsAuditor();
  await auditor.runAudit();
}

main().catch(console.error); 