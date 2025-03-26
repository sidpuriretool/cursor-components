import React, { useEffect, useRef, useState } from 'react'
import { type FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import * as d3 from 'd3'

export const HelloWorld: FC = () => {
  const [name, _setName] = Retool.useStateString({
    name: 'name'
  })

  return (
    <div>
      <div>Hello {name}!</div>
    </div>
  )
}

export const CursorComponent1: FC = () => {
  const [text, setText] = Retool.useStateString({
    name: 'text'
  });
  
  const [backgroundColor, setBackgroundColor] = Retool.useStateString({
    name: 'backgroundColor'
  });
  
  const [textColor, setTextColor] = Retool.useStateString({
    name: 'textColor'
  });

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: backgroundColor || '#ffffff',
        color: textColor || '#000000',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
    >
      {text || 'Hello from Cursor Component 1!'}
    </div>
  );
};

interface PlatformConfigProps {
  width?: number;
  height?: number;
  data?: {
    instances: Array<{
      name: string;
      spaces: Array<{
        name: string;
        permissions: Array<{
          name: string;
          type: string;
        }>;
      }>;
    }>;
  };
}

interface Architecture {
  name: string;
  instances: {
    name: string;
    spaces: string[];
  }[];
  showGit?: boolean;
}

interface SpacePattern {
  title: string;
  description: string;
  nodes: {
    id: string;
    type: 'space' | 'team' | 'env';
    label: string;
  }[];
  connections: {
    source: string;
    target: string;
    type: 'access' | 'sync';
  }[];
}

export const PlatformConfig: FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [patternIndex, setPatternIndex] = Retool.useStateNumber({
    name: 'patternIndex',
    initialValue: 0
  });

  const patterns: SpacePattern[] = [
    {
      title: "Team-Based Spaces",
      description: "Separate spaces for each team (Engineering, Finance, etc)",
      nodes: [
        { id: "root", type: "space", label: "Admin Space" },
        { id: "eng", type: "team", label: "Engineering" },
        { id: "finance", type: "team", label: "Finance" },
        { id: "sales", type: "team", label: "Sales" }
      ],
      connections: [
        { source: "root", target: "eng", type: "access" },
        { source: "root", target: "finance", type: "access" },
        { source: "root", target: "sales", type: "access" }
      ]
    },
    {
      title: "Environment-Based Spaces",
      description: "Separate spaces for dev/staging/prod environments",
      nodes: [
        { id: "root", type: "space", label: "Admin Space" },
        { id: "dev", type: "env", label: "Dev" },
        { id: "staging", type: "env", label: "Staging" },
        { id: "prod", type: "env", label: "Prod" }
      ],
      connections: [
        { source: "root", target: "dev", type: "sync" },
        { source: "root", target: "staging", type: "sync" },
        { source: "root", target: "prod", type: "sync" }
      ]
    },
    {
      title: "Hybrid Space Model",
      description: "Team spaces with environment segregation",
      nodes: [
        { id: "root", type: "space", label: "Admin Space" },
        { id: "eng_dev", type: "env", label: "Eng Dev" },
        { id: "eng_prod", type: "env", label: "Eng Prod" },
        { id: "fin_dev", type: "env", label: "Finance Dev" },
        { id: "fin_prod", type: "env", label: "Finance Prod" }
      ],
      connections: [
        { source: "root", target: "eng_dev", type: "access" },
        { source: "root", target: "eng_prod", type: "sync" },
        { source: "root", target: "fin_dev", type: "access" },
        { source: "root", target: "fin_prod", type: "sync" }
      ]
    }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;
    svg.attr('width', width).attr('height', height);

    const draw = (pattern: SpacePattern) => {
      svg.selectAll('*').remove();

      // Add title with hand-drawn style
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1A1A1A')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '24px')
        .attr('font-weight', 'bold')
        .text(pattern.title);

      // Add description
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 80)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '16px')
        .text(pattern.description);

      // Add main admin space circle
      svg
        .append('circle')
        .attr('cx', width / 2)
        .attr('cy', 150)
        .attr('r', 40)
        .attr('fill', '#E84393')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      // Add "Admin Space" label
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 155)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '14px')
        .text('Admin Space');

      // Calculate positions for child nodes
      const nodeCount = pattern.nodes.length - 1; // Excluding root
      const spacing = width / (nodeCount + 1);
      const bottomY = 300;

      // Draw child nodes
      pattern.nodes.forEach((node, i) => {
        if (node.id === 'root') return;

        const x = spacing * i;
        
        // Node circle with color based on type
        const color = node.type === 'team' ? '#805AD5' : '#38B2AC';
        svg
          .append('circle')
          .attr('cx', x + spacing)
          .attr('cy', bottomY)
          .attr('r', 35)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 2)
          .attr('opacity', 0.9);

        // Node label
        svg
          .append('text')
          .attr('x', x + spacing)
          .attr('y', bottomY + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-family', 'Comic Sans MS, cursive')
          .attr('font-size', '12px')
          .text(node.label);

        // Connection line
        const connection = pattern.connections.find(c => c.target === node.id);
        if (connection) {
          const isSync = connection.type === 'sync';
          svg
            .append('line')
            .attr('x1', width / 2)
            .attr('y1', 190)
            .attr('x2', x + spacing)
            .attr('y2', bottomY - 35)
            .attr('stroke', '#666')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', isSync ? '5,5' : '0')
            .attr('marker-end', 'url(#arrow)');
        }
      });

      // Add arrow marker definition
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#666');
    };

    draw(patterns[patternIndex]);

    const interval = setInterval(() => {
      setPatternIndex((patternIndex + 1) % patterns.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [patternIndex]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#FFFFFF' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

interface InstancePattern {
  title: string;
  description: string;
  isVPC: boolean;
  instances: {
    id: string;
    label: string;
    type: 'primary' | 'vpc';
    spaces?: {
      id: string;
      label: string;
      type: 'team' | 'env';
    }[];
  }[];
}

export const InstanceConfig: FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVPC, setIsVPC] = Retool.useStateBoolean({
    name: 'isVPC',
    initialValue: false
  });

  const patterns: InstancePattern[] = [
    {
      title: "Single Instance Setup",
      description: "Perfect for most teams - simple and scalable",
      isVPC: false,
      instances: [
        {
          id: "main",
          label: "Retool Cloud",
          type: "primary",
          spaces: [
            { id: "admin", label: "Admin", type: "team" },
            { id: "eng", label: "Engineering", type: "team" },
            { id: "prod", label: "Production", type: "env" }
          ]
        }
      ]
    },
    {
      title: "VPC Setup (2 Instances)",
      description: "Enhanced security with VPC isolation",
      isVPC: true,
      instances: [
        {
          id: "vpc1",
          label: "VPC Instance 1",
          type: "vpc"
        },
        {
          id: "vpc2",
          label: "VPC Instance 2",
          type: "vpc"
        }
      ]
    }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;
    svg.attr('width', width).attr('height', height);

    const pattern = patterns[isVPC ? 1 : 0];

    const draw = () => {
      svg.selectAll('*').remove();

      // Add cloud background with hand-drawn feel
      svg
        .append('path')
        .attr('d', `M${width/2-100},80 
          c-20-20,60-40,100-20 
          c30-30,80-20,100,10 
          c30-10,60,10,60,40 
          c0,30-30,50-60,40 
          c-20,30-70,40-100,20 
          c-30,20-80,20-100-10 
          c-30,0-60-30-40-60 
          c-10-20,20-40,40-20z`)
        .attr('fill', '#F7FAFC')
        .attr('stroke', '#718096')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      // Add title with hand-drawn style
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1A1A1A')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '24px')
        .attr('font-weight', 'bold')
        .text(pattern.title);

      // Add description
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 80)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '16px')
        .text(pattern.description);

      if (isVPC) {
        // Draw VPC instances
        pattern.instances.forEach((instance, i) => {
          const x = width / 2 + (i === 0 ? -150 : 150);
          const y = height / 2;

          // VPC container
          svg
            .append('rect')
            .attr('x', x - 80)
            .attr('y', y - 60)
            .attr('width', 160)
            .attr('height', 120)
            .attr('rx', 10)
            .attr('fill', '#EBF8FF')
            .attr('stroke', '#4299E1')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');

          // Instance circle
          svg
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 40)
            .attr('fill', '#4299E1')
            .attr('stroke', '#2B6CB0')
            .attr('stroke-width', 2);

          // Instance label
          svg
            .append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-family', 'Comic Sans MS, cursive')
            .attr('font-size', '14px')
            .text(instance.label);

          // VPC label
          svg
            .append('text')
            .attr('x', x)
            .attr('y', y + 80)
            .attr('text-anchor', 'middle')
            .attr('fill', '#2B6CB0')
            .attr('font-family', 'Comic Sans MS, cursive')
            .attr('font-size', '12px')
            .text('VPC');
        });

        // Add connection line between VPCs
        svg
          .append('line')
          .attr('x1', width / 2 - 90)
          .attr('y1', height / 2)
          .attr('x2', width / 2 + 90)
          .attr('y2', height / 2)
          .attr('stroke', '#4299E1')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5');
      } else {
        // Draw single instance with spaces
        const instance = pattern.instances[0];
        
        // Main instance circle
        svg
          .append('circle')
          .attr('cx', width / 2)
          .attr('cy', 180)
          .attr('r', 50)
          .attr('fill', '#E84393')
          .attr('stroke', '#000')
          .attr('stroke-width', 2);

        // Instance label
        svg
          .append('text')
          .attr('x', width / 2)
          .attr('y', 180)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-family', 'Comic Sans MS, cursive')
          .attr('font-size', '16px')
          .text(instance.label);

        // Draw spaces
        instance.spaces?.forEach((space, i) => {
          const angle = (i * 2 * Math.PI) / instance.spaces!.length;
          const radius = 150;
          const x = width / 2 + radius * Math.cos(angle - Math.PI / 2);
          const y = 300 + radius * Math.sin(angle - Math.PI / 2);

          // Space circle
          svg
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 35)
            .attr('fill', space.type === 'team' ? '#805AD5' : '#38B2AC')
            .attr('stroke', '#000')
            .attr('stroke-width', 2);

          // Space label
          svg
            .append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-family', 'Comic Sans MS, cursive')
            .attr('font-size', '12px')
            .text(space.label);

          // Connection line
          svg
            .append('line')
            .attr('x1', width / 2)
            .attr('y1', 230)
            .attr('x2', x)
            .attr('y2', y - 35)
            .attr('stroke', '#666')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow)');
        });
      }

      // Add arrow marker definition
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#666');
    };

    draw();

    // Add click handler to toggle between patterns
    svg.on('click', () => {
      setIsVPC(!isVPC);
    });

  }, [isVPC]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#FFFFFF' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      <div 
        style={{ 
          position: 'absolute', 
          bottom: 20, 
          left: '50%', 
          transform: 'translateX(-50%)',
          fontFamily: 'Comic Sans MS, cursive',
          fontSize: '14px',
          color: '#666'
        }}
      >
        Click to toggle between Single Instance and VPC setup
      </div>
    </div>
  );
};

interface PCStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  deliverables?: string[];
  stakeholders: string[];
  tools?: string[];
  content?: {
    type: 'spaces' | 'instance' | 'doc';
    component?: 'PlatformConfig' | 'InstanceConfig';
    docLink?: string;
  };
  nextSteps?: string[];
}

export const PCJourney: FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = Retool.useStateNumber({
    name: 'activeStage',
    initialValue: 0
  });

  const stages: PCStage[] = [
    {
      id: "info-capture",
      title: "Info Capture",
      description: "Initial platform configuration requirements",
      duration: "Week 0",
      deliverables: ["PS Info Form (Page 1)", "Architecture Requirements"],
      stakeholders: ["Customer", "Sales"],
      content: {
        type: 'doc',
        docLink: "https://docs.retool.com/docs/platform-overview"
      },
      nextSteps: [
        "Fill out PS Info Capture form",
        "Document current architecture",
        "List integration requirements"
      ]
    },
    {
      id: "internal-kickoff",
      title: "Internal Kickoff",
      description: "DM sets kickoff with SA and TAMs to review form",
      duration: "Week 1",
      stakeholders: ["SA", "DM", "TAM"],
      tools: ["Rocketlane"],
      content: {
        type: 'spaces',
        component: 'PlatformConfig'
      },
      nextSteps: [
        "Review space architecture options",
        "Prepare initial recommendations",
        "Schedule customer kickoff"
      ]
    },
    {
      id: "customer-kickoff",
      title: "Customer Kickoff",
      description: "Initial meeting with PC deck presentation",
      duration: "Week 1-2",
      deliverables: ["PC Deck", "Initial Execution Plan"],
      stakeholders: ["SA", "Customer", "TAM"],
      content: {
        type: 'instance',
        component: 'InstanceConfig'
      },
      nextSteps: [
        "Present recommended architecture",
        "Gather feedback on space structure",
        "Confirm deployment preferences"
      ]
    },
    {
      id: "execution",
      title: "Execution & Planning",
      description: "Feature matching, demos, and plan refinement",
      duration: "Weeks 2-4",
      deliverables: ["Updated Execution Plan", "Scripts", "Utilities"],
      stakeholders: ["SA", "Customer"],
      tools: ["Whimsical", "Terraform"],
      content: {
        type: 'spaces',
        component: 'PlatformConfig'
      },
      nextSteps: [
        "Implement space structure",
        "Set up initial permissions",
        "Configure deployment pipeline"
      ]
    },
    {
      id: "office-hours",
      title: "Office Hours",
      description: "Remaining time for coaching and support",
      duration: "Weeks 4-6",
      deliverables: ["Implementation Support", "Builder Coaching"],
      stakeholders: ["SA", "Customer"],
      content: {
        type: 'doc',
        docLink: "https://docs.retool.com/docs/platform-configuration"
      },
      nextSteps: [
        "Review implementation",
        "Address questions",
        "Plan next steps"
      ]
    }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 300;
    svg.attr('width', width).attr('height', height);

    const draw = () => {
      svg.selectAll('*').remove();

      // Add title with hand-drawn style
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1A1A1A')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '24px')
        .attr('font-weight', 'bold')
        .text('Platform Configuration Journey');

      // Add subtitle
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 80)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '16px')
        .text('4-6 Week Enterprise Onboarding Process');

      // Draw timeline
      const timelineY = 180;
      const stageWidth = width / (stages.length + 1);

      // Timeline base line with hand-drawn feel
      const lineData = d3.range(stages.length + 1).map((_, i) => ({
        x: stageWidth * (i + 0.5),
        y: timelineY + (Math.random() * 4 - 2)
      }));

      const lineGenerator = d3.line<{x: number, y: number}>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis);

      svg
        .append('path')
        .attr('d', lineGenerator(lineData))
        .attr('stroke', '#CBD5E0')
        .attr('stroke-width', 3)
        .attr('fill', 'none');

      // Draw stages
      stages.forEach((stage, i) => {
        const x = stageWidth * (i + 1);
        const isActive = i === activeStage;
        const isPast = i < activeStage;

        // Stage circle
        const circle = svg
          .append('circle')
          .attr('cx', x)
          .attr('cy', timelineY)
          .attr('r', isActive ? 25 : 20)
          .attr('fill', isActive ? '#E84393' : (isPast ? '#9F7AEA' : '#CBD5E0'))
          .attr('stroke', '#2D3748')
          .attr('stroke-width', 2)
          .attr('cursor', 'pointer')
          .on('click', () => setActiveStage(i));

        // Add wobble animation on hover
        circle.on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(300)
            .attr('r', isActive ? 28 : 23);
        }).on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(300)
            .attr('r', isActive ? 25 : 20);
        });

        // Stage number
        svg
          .append('text')
          .attr('x', x)
          .attr('y', timelineY + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-family', 'Comic Sans MS, cursive')
          .attr('font-size', '14px')
          .text(i + 1);

        // Stage title
        svg
          .append('text')
          .attr('x', x)
          .attr('y', timelineY - 40)
          .attr('text-anchor', 'middle')
          .attr('fill', isActive ? '#2D3748' : '#718096')
          .attr('font-family', 'Comic Sans MS, cursive')
          .attr('font-size', '14px')
          .attr('font-weight', isActive ? 'bold' : 'normal')
          .text(stage.title);

        // Duration
        svg
          .append('text')
          .attr('x', x)
          .attr('y', timelineY + 40)
          .attr('text-anchor', 'middle')
          .attr('fill', '#718096')
          .attr('font-family', 'Comic Sans MS, cursive')
          .attr('font-size', '12px')
          .text(stage.duration);
      });
    };

    draw();
  }, [activeStage]);

  const activeStageData = stages[activeStage];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#FFFFFF' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '300px' }} />
      
      <div ref={contentRef} style={{ 
        padding: '20px',
        height: 'calc(100% - 320px)',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          fontFamily: 'Comic Sans MS, cursive'
        }}>
          {/* Left column: Stage details */}
          <div style={{ 
            background: '#F7FAFC',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #E2E8F0'
          }}>
            <h2 style={{ 
              fontSize: '20px',
              color: '#2D3748',
              marginBottom: '15px'
            }}>
              {activeStageData.title}
            </h2>
            
            <p style={{ 
              color: '#4A5568',
              marginBottom: '20px'
            }}>
              {activeStageData.description}
            </p>

            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#2D3748', marginBottom: '8px' }}>👥 Stakeholders</h3>
              <p>{activeStageData.stakeholders.join(', ')}</p>
            </div>

            {activeStageData.deliverables && (
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ color: '#2D3748', marginBottom: '8px' }}>📦 Deliverables</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {activeStageData.deliverables.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeStageData.tools && (
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ color: '#2D3748', marginBottom: '8px' }}>🛠️ Tools</h3>
                <p>{activeStageData.tools.join(', ')}</p>
              </div>
            )}

            {activeStageData.nextSteps && (
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ color: '#2D3748', marginBottom: '8px' }}>📝 Next Steps</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {activeStageData.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column: Interactive content */}
          <div style={{ 
            background: '#FFFFFF',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #E2E8F0',
            height: '400px'
          }}>
            {activeStageData.content?.type === 'spaces' && <PlatformConfig />}
            {activeStageData.content?.type === 'instance' && <InstanceConfig />}
            {activeStageData.content?.type === 'doc' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                <p style={{ marginBottom: '20px', textAlign: 'center' }}>
                  Learn more about this stage in our documentation:
                </p>
                <a 
                  href={activeStageData.content.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: '#E84393',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}
                >
                  View Documentation
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: '50%', 
        transform: 'translateX(-50%)',
        fontFamily: 'Comic Sans MS, cursive',
        fontSize: '14px',
        color: '#666'
      }}>
        Click on any stage to explore details
      </div>
    </div>
  );
};

interface EducationSlide {
  id: string;
  title: string;
  description: string;
  type: 'spaces' | 'instance' | 'journey' | 'doc';
  docLink?: string;
  component?: 'PlatformConfig' | 'InstanceConfig' | 'PCJourney';
}

export const SpacesEducator: FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const sliderRef = useRef<SVGSVGElement>(null);
  const [currentSlide, setCurrentSlide] = Retool.useStateNumber({
    name: 'currentSlide',
    initialValue: 0
  });
  const [isDragging, setIsDragging] = useState(false);

  const slides: EducationSlide[] = [
    {
      id: "intro",
      title: "Retool Spaces Overview",
      description: "Learn how to organize your Retool deployment for enterprise scale",
      type: "doc",
      docLink: "https://docs.retool.com/org-users/tutorials/spaces"
    },
    {
      id: "space-patterns",
      title: "Common Space Patterns",
      description: "Explore different ways to organize your spaces",
      type: "spaces",
      component: "PlatformConfig"
    },
    {
      id: "instance-types",
      title: "Deployment Options",
      description: "Choose between single instance and VPC setups",
      type: "instance",
      component: "InstanceConfig"
    },
    {
      id: "implementation",
      title: "Implementation Journey",
      description: "Follow the platform configuration process",
      type: "journey",
      component: "PCJourney"
    }
  ];

  useEffect(() => {
    if (!sliderRef.current) return;

    const svg = d3.select(sliderRef.current);
    const width = 300;
    const height = 60;
    svg.attr('width', width).attr('height', height);

    const draw = () => {
      svg.selectAll('*').remove();

      // Draw slider track (hand-drawn style)
      const trackY = height / 2;
      const trackPoints = d3.range(20).map((_, i) => ({
        x: (width * 0.1) + (width * 0.8 * i / 19),
        y: trackY + Math.sin(i) * 2
      }));

      const lineGenerator = d3.line<{x: number, y: number}>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis);

      // Draw track background
      svg
        .append('path')
        .attr('d', lineGenerator(trackPoints))
        .attr('stroke', '#CBD5E0')
        .attr('stroke-width', 4)
        .attr('fill', 'none')
        .style('stroke-linecap', 'round');

      // Calculate handle position
      const handleX = width * 0.1 + (width * 0.8 * currentSlide / (slides.length - 1));

      // Draw handle
      const handleGroup = svg
        .append('g')
        .attr('transform', `translate(${handleX}, ${trackY})`)
        .style('cursor', 'pointer');

      // Handle circle with hand-drawn effect
      handleGroup
        .append('circle')
        .attr('r', 12)
        .attr('fill', '#E84393')
        .attr('stroke', '#2D3748')
        .attr('stroke-width', 2);

      // Add slide number to handle
      handleGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-family', 'Comic Sans MS, cursive')
        .attr('font-size', '12px')
        .text(currentSlide + 1);

      // Add slide markers
      slides.forEach((_, i) => {
        const markerX = width * 0.1 + (width * 0.8 * i / (slides.length - 1));
        svg
          .append('circle')
          .attr('cx', markerX)
          .attr('cy', trackY)
          .attr('r', 4)
          .attr('fill', i <= currentSlide ? '#E84393' : '#CBD5E0')
          .attr('stroke', '#2D3748')
          .attr('stroke-width', 1);
      });

      // Add drag behavior
      const drag = d3.drag()
        .on('start', () => setIsDragging(true))
        .on('drag', (event) => {
          const xPos = Math.max(width * 0.1, Math.min(width * 0.9, event.x));
          const slideIndex = Math.round(((xPos - width * 0.1) / (width * 0.8)) * (slides.length - 1));
          setCurrentSlide(slideIndex);
        })
        .on('end', () => setIsDragging(false));

      handleGroup.call(drag as any);
    };

    draw();
  }, [currentSlide, isDragging]);

  const currentSlideData = slides[currentSlide];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#FFFFFF' }}>
      <div style={{ 
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Comic Sans MS, cursive'
      }}>
        <h1 style={{ 
          fontSize: '28px',
          color: '#1A1A1A',
          marginBottom: '10px'
        }}>
          {currentSlideData.title}
        </h1>
        <p style={{ 
          fontSize: '16px',
          color: '#666',
          marginBottom: '30px'
        }}>
          {currentSlideData.description}
        </p>
      </div>

      <div style={{ 
        position: 'relative',
        height: 'calc(100% - 200px)',
        margin: '0 20px'
      }}>
        {currentSlideData.type === 'spaces' && <PlatformConfig />}
        {currentSlideData.type === 'instance' && <InstanceConfig />}
        {currentSlideData.type === 'journey' && <PCJourney />}
        {currentSlideData.type === 'doc' && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Comic Sans MS, cursive'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Learn more about Retool Spaces in the official documentation:
            </p>
            <a 
              href={currentSlideData.docLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#E84393',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              View Documentation
            </a>
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px'
      }}>
        <svg ref={sliderRef} style={{ width: '100%', height: '60px' }} />
      </div>

      <svg ref={svgRef} style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px'
      }} />
    </div>
  );
};

export const TranscriptAnalyzer: FC = () => {
  const [input, setInput] = Retool.useStateString({
    name: 'input',
    initialValue: ''
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
  };

  return (
    <div style={{ 
      padding: '20px',
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '10px'
      }}>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '8px 16px',
            background: '#E84393',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
            <path d="M9 14h6"></path>
            <path d="M9 18h6"></path>
          </svg>
          Copy to Clipboard
        </button>
      </div>
      <pre style={{ 
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        margin: 0,
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
        {input || 'No input provided'}
      </pre>
    </div>
  );
};

export const FormattedDisplay: FC = () => {
  const [inputHtml, setInputHtml] = Retool.useStateString({
    name: 'inputHtml',
    initialValue: ''
  });

  return (
    <div style={{ 
      fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "14px",
      lineHeight: "1.6",
      padding: "24px",
      backgroundColor: "white",
      color: "#202124",
      maxWidth: "700px",
      margin: "auto",
      whiteSpace: "pre-wrap",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      borderRadius: "4px"
    }} 
    dangerouslySetInnerHTML={{ __html: inputHtml || 'No content to display' }} 
    />
  );
};

export const GoogleDocsPreviewer: FC = () => {
  const [input, setInput] = Retool.useStateString({
    name: 'input',
    initialValue: ''
  });

  const processText = (text: string) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    let html = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines at the start
      if (line === '' && html === '') continue;
      
      // Title (# heading)
      if (line.startsWith('# ')) {
        html += `<div class="title">${line.substring(2)}</div>`;
      }
      // Section headers (## heading)
      else if (line.startsWith('## ')) {
        html += `<div class="section-header">${line.substring(3)}</div>`;
      }
      // Metadata (**key:** value)
      else if (line.match(/^\*\*.*:\*\*/)) {
        const cleanLine = line.replace(/\*\*/g, '');
        html += `<div class="text">${cleanLine}</div>`;
      }
      // Bullet points (-)
      else if (line.startsWith('- ')) {
        html += `<div class="bullet-list bullet-point">${line.substring(2)}</div>`;
      }
      // Sub-bullet points (+)
      else if (line.startsWith('+')) {
        html += `<div class="bullet-list bullet-point" style="margin-left: 72pt">${line}</div>`;
      }
      // Links
      else if (line.includes('http')) {
        const [label, url] = line.split(': ');
        html += `<div class="text">
          ${label}: <span class="link">${url}</span>
        </div>`;
      }
      // Regular text
      else if (line) {
        html += `<div class="text">${line}</div>`;
      }
      // Empty lines
      else {
        html += `<div style="height: 12pt;"></div>`;
      }
    }
    
    return html;
  };

  const hardcodedStyle = `
    .title {
      color: rgb(67, 70, 187);
      font-family: "Google Sans", Roboto, Arial, sans-serif;
      font-size: 20pt;
      line-height: 1.2;
      margin-bottom: 14pt;
    }
    .subtitle {
      color: rgb(32, 33, 36);
      font-family: "Google Sans", Roboto, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      margin-bottom: 14pt;
    }
    .section-header {
      color: rgb(32, 33, 36);
      font-family: "Google Sans", Roboto, Arial, sans-serif;
      font-size: 16pt;
      line-height: 1.2;
      margin: 20pt 0 14pt 0;
      font-weight: 400;
    }
    .bullet-list {
      margin-left: 36pt;
      position: relative;
      line-height: 1.5;
      margin-bottom: 8pt;
      color: rgb(32, 33, 36);
      font-family: "Google Sans", Roboto, Arial, sans-serif;
      font-size: 11pt;
    }
    .bullet-point::before {
      content: "•";
      position: absolute;
      left: -18pt;
    }
    .text {
      color: rgb(32, 33, 36);
      font-family: "Google Sans", Roboto, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      margin-bottom: 8pt;
    }
    .link {
      color: rgb(17, 85, 204);
      text-decoration: underline;
      cursor: pointer;
    }
  `;

  return (
    <div style={{ 
      display: 'flex',
      gap: '20px',
      height: '100%',
      padding: '20px',
      background: '#f8f9fa'
    }}>
      {/* Left side: Input */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <label style={{
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#202124'
        }}>
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'none',
            background: 'white',
            whiteSpace: 'pre-wrap'
          }}
          placeholder="Paste your text here..."
        />
      </div>

      {/* Right side: Preview */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        <label style={{
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#202124'
        }}>
          Preview
        </label>
        <div style={{
          flex: 1,
          padding: '24px',
          background: 'white',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          overflow: 'auto'
        }}>
          <style>{hardcodedStyle}</style>
          <div style={{ 
            padding: '0 20px'
          }}
          dangerouslySetInnerHTML={{ __html: processText(input) }}
          />
        </div>
      </div>
    </div>
  );
};

export const GoogleDocsStyle: FC = () => {
  const [input] = Retool.useStateString({
    name: 'inputTranscript',
    initialValue: ''
  });

  const styles = `
    .gdoc-container {
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 96px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #202124;
      background: white;
    }

    .gdoc-header-l1 {
      font-size: 24pt;
      color: #202124;
      margin: 24pt 0 16pt;
      font-weight: 500;
    }

    .gdoc-header-l2 {
      font-size: 20pt;
      color: #202124;
      margin: 20pt 0 14pt;
      font-weight: 500;
    }

    .gdoc-text {
      font-size: 11pt;
      line-height: 1.5;
      margin-bottom: 8pt;
    }

    .gdoc-bold {
      font-weight: bold;
    }
  `;

  const processText = (text: string) => {
    if (!text) return '';

    const lines = text.split('\n');
    let html = '';
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Skip empty lines at start
      if (line === '' && html === '') continue;

      // Handle level 1 headers (##)
      if (line.startsWith('## ')) {
        html += `<div class="gdoc-header-l1">${line.substring(3)}</div>`;
        continue;
      }

      // Handle level 2 headers (###)
      if (line.startsWith('### ')) {
        html += `<div class="gdoc-header-l2">${line.substring(4)}</div>`;
        continue;
      }

      // Handle bold text (**text**)
      if (line.includes('**')) {
        line = line.replace(/\*\*(.*?)\*\*/g, '<span class="gdoc-bold">$1</span>');
      }

      // Regular text
      if (line) {
        html += `<div class="gdoc-text">${line}</div>`;
      } else {
        html += `<div style="height: 12pt;"></div>`;
      }
    }
    
    return html;
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <style>{styles}</style>
      <div className="gdoc-container" dangerouslySetInnerHTML={{ __html: processText(input) }} />
    </div>
  );
};
