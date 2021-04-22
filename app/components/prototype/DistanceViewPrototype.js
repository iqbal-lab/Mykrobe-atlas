/* @flow */

// 82fa4fc2-0356-46c6-8681-7cd1e38c628c

import * as React from 'react';
import styles from './DistanceViewPrototype.module.scss';
import * as d3 from 'd3';
import HeaderContainer from '../ui/header/HeaderContainer';
import useSize from '@react-hook/size';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const SCALE_VISUAL_DISTANCE = 50;

const sources = {
  'd48aca21-fb18-4e42-96db-0299ed82eedb.5': require('./mst-backend-generated/d48aca21-fb18-4e42-96db-0299ed82eedb.5.json'),
  'd9c38ab1-e949-44b3-ad92-5a402bb0669d.21': require('./mst-backend-generated/d9c38ab1-e949-44b3-ad92-5a402bb0669d.21.json'),
  '31bc3b8b-a5f1-46fb-b9e6-047c5073643b.201': require('./mst-backend-generated/31bc3b8b-a5f1-46fb-b9e6-047c5073643b.201.json'),
};

const transformData = (data) => {
  // create unique set of nodes by id

  const nodesById = {};

  const nodeWithRepresentedId = (id) =>
    Object.values(nodesById).find(({ representedIds }) => {
      return representedIds.includes(id);
    });

  let nodeId = 0;

  if (true) {
    data.forEach(({ start, end, distance }) => {
      const startNode = nodeWithRepresentedId(start);
      const endNode = nodeWithRepresentedId(end);
      // 82fa4fc2-0356-46c6-8681-7cd1e38c628c
      // const DEBUG = end === '82fa4fc2-0356-46c6-8681-7cd1e38c628c';
      // "9ff4792d-d368-4163-afb4-27c69ba82fd4"
      const DEBUG = start === '9ff4792d-d368-4163-afb4-27c69ba82fd4';
      if (DEBUG) {
        console.log(JSON.stringify({ startNode, endNode, distance }, null, 2));
      }
      if (distance === 0) {
        if (startNode && endNode) {
          // do nothing
        } else {
          if (startNode) {
            DEBUG && console.log('Pushing a');
            startNode.representedIds.push(end);
          } else if (endNode) {
            DEBUG && console.log('Pushing b');
            endNode.representedIds.push(start);
          } else {
            // create single node with both start and end
            DEBUG && console.log('Creating a');
            nodesById[nodeId] = { id: nodeId, representedIds: [start, end] };
            nodeId++;
          }
        }
      } else {
        if (startNode && endNode) {
          // do nothing
        } else {
          if (!startNode) {
            DEBUG && console.log('Creating b');
            nodesById[nodeId] = { id: nodeId, representedIds: [start] };
            nodeId++;
          }
          if (!endNode) {
            DEBUG && console.log('Creating c');
            nodesById[nodeId] = { id: nodeId, representedIds: [end] };
            nodeId++;
          }
        }
      }
    });
  } else {
    data.forEach(({ start, end }) => {
      if (!nodesById[start]) {
        nodesById[start] = { id: start, representedIds: [start] };
      }
      if (!nodesById[end]) {
        nodesById[end] = { id: end, representedIds: [end] };
      }
    });
  }

  const nodes = Object.values(nodesById);

  const links = data.flatMap(({ start, end, distance }) => {
    const startNode = nodeWithRepresentedId(start);
    const endNode = nodeWithRepresentedId(end);
    // if (!startNode || !endNode) {
    //   debugger;
    // }
    // if (distance === 0) {
    //   return [];
    // }
    if (startNode == endNode) {
      return [];
    }
    return {
      source: startNode.id,
      target: endNode.id,
      distance,
      visualDistance: distance * SCALE_VISUAL_DISTANCE,
    };
  });

  console.log(JSON.stringify({ nodesById }, null, 2));

  // create mst and flag each link that is in the mst

  return { nodes, links };
};

const drag = (simulation) => {
  const dragstarted = (event) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  };

  const dragged = (event) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };

  const dragended = (event) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

const DistanceViewPrototype = () => {
  const [source, setSource] = React.useState(Object.keys(sources)[0]);
  const [showDistance, setShowDistance] = React.useState(true);

  const svgContainerRef = React.useRef();
  const svgRef = React.useRef();

  const [width, height] = useSize(svgContainerRef);
  const [svg, setSvg] = React.useState(null);
  const [simulation, setSimulation] = React.useState(null);

  React.useEffect(() => {
    const sourceData = sources[source];
    const data = transformData(sourceData);
    const { nodes, links } = data;

    // add forces to the centre of each link to help with overlapping
    // http://bl.ocks.org/couchand/7190660

    const linkNodes = [];

    links.forEach(function (link) {
      linkNodes.push({
        source: nodes.find(({ id }) => id === link.source),
        target: nodes.find(({ id }) => id === link.target),
      });
    });

    const newSvg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    newSvg.selectAll('*').remove();

    const newSimulation = d3
      .forceSimulation(nodes.concat(linkNodes))
      .force(
        'link',
        d3
          .forceLink(links)
          .distance((d) => d.visualDistance)
          .strength(1) // achieve better uniformity of distance
          .id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alpha(1)
      .alphaDecay(0.01);

    const link = newSvg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 0.5)
      .attr('visibility', () => 'visible');

    const linkNode = newSvg
      .append('g')
      .selectAll('g')
      .data(linkNodes)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('fill', 'gray')
      .attr('visibility', 'hidden');

    const text = newSvg
      .append('g')
      .selectAll('g')
      .data(links)
      .enter()
      .append('text')
      .text(function (d) {
        return `${d.distance}`;
      })
      .attr('x', function (d) {
        return d.source.x + (d.target.x - d.source.x) * 0.5;
      })
      .attr('y', function (d) {
        return d.source.y + (d.target.y - d.source.y) * 0.5;
      })
      .attr('dy', '.25em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#999')
      .attr('visibility', () => (showDistance ? 'visible' : 'hidden'));

    const node = newSvg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(newSimulation));

    node
      .append('circle')
      .attr('fill', 'gray')
      .attr('r', (d) => 5 * Math.sqrt(d.representedIds.length));

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.representedIds.map((id) => id.substr(0, 3)).join(', '))
      .attr('font-size', '12px');

    newSimulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);

      text
        .attr('x', function (d) {
          return d.source.x + (d.target.x - d.source.x) * 0.5;
        })
        .attr('y', function (d) {
          return d.source.y + (d.target.y - d.source.y) * 0.5;
        });

      linkNode
        .attr('cx', function (d) {
          return (d.x = (d.source.x + d.target.x) * 0.5);
        })
        .attr('cy', function (d) {
          return (d.y = (d.source.y + d.target.y) * 0.5);
        });
    });

    if (simulation) {
      simulation.stop();
    }

    setSvg(newSvg);
    setSimulation(newSimulation);
  }, [source, showDistance]);

  React.useEffect(() => {
    // console.log({ width, height });
    svg?.attr('viewBox', [0, 0, width, height]);
    simulation
      ?.force('center', d3.forceCenter(width / 2, height / 2))
      .restart();
  }, [width, height, svg]);

  const toggleShowDistance = React.useCallback(() => {
    setShowDistance(!showDistance);
  }, [setShowDistance, showDistance]);

  return (
    <div className={styles.container}>
      <HeaderContainer title={'Distance view prototype'} />
      <div ref={svgContainerRef} className={styles.svgContainer}>
        <svg ref={svgRef} />
        <div className={styles.controlsContainer}>
          <UncontrolledDropdown>
            <DropdownToggle color="mid" outline size={'sm'}>
              {source} <i className="fa fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu right>
              {Object.keys(sources).map((thisSource, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setSource(thisSource);
                  }}
                >
                  {thisSource}
                </DropdownItem>
              ))}
              <DropdownItem divider />
              <DropdownItem onClick={toggleShowDistance}>
                {showDistance ? (
                  <i className="fa fa-check-square" />
                ) : (
                  <i className="fa fa-square-o" />
                )}{' '}
                Show distance
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </div>
  );
};

export default DistanceViewPrototype;
