import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const initialData = {
  nodes: [
    { id: 'Shiva (Suspect)', group: 1 },
    { id: 'FIR 102', group: 2 },
    { id: 'Location X', group: 3 },
    { id: 'Witness B', group: 4 }
  ],
  links: [
    { source: 'Shiva (Suspect)', target: 'FIR 102' },
    { source: 'FIR 102', target: 'Location X' },
    { source: 'Witness B', target: 'Location X' }
  ]
};

const KnowledgeGraph = () => {
  const svgRef = useRef();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const handleExpand = () => {
      setData({
        nodes: [
          ...initialData.nodes,
          { id: 'Accomplice Y', group: 1 },
          { id: 'Vehicle KA01', group: 5 }
        ],
        links: [
          ...initialData.links,
          { source: 'Shiva (Suspect)', target: 'Accomplice Y' },
          { source: 'Accomplice Y', target: 'Vehicle KA01' }
        ]
      });
    };
    
    window.addEventListener('demo:expand-shiva-node', handleExpand);
    return () => window.removeEventListener('demo:expand-shiva-node', handleExpand);
  }, []);

  useEffect(() => {
    const width = 600;
    const height = 400;
    
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    // Clone data so D3 doesn't mutate React state
    const nodes = data.nodes.map(d => ({...d}));
    const links = data.links.map(d => ({...d}));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 15)
      .attr('fill', d => {
        if(d.group === 1) return 'red';
        if(d.group === 2) return 'blue';
        if(d.group === 3) return 'green';
        if(d.group === 5) return 'purple';
        return 'orange';
      })
      .call(drag(simulation));

    node.transition().duration(750).attr('r', 18).transition().duration(750).attr('r', 15);

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('dy', -20)
      .attr('dx', -10)
      .text(d => d.id)
      .attr('font-size', '12px')
      .attr('fill', 'var(--color-text-primary)');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [data]);

  return <svg ref={svgRef} style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}></svg>;
};

export default KnowledgeGraph;
