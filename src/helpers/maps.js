import neighborhoodMap from '../../sfmaps/neighborhoods.json'
import arteriesMap from '../../sfmaps/arteries.json'
import freewaysMap from '../../sfmaps/freeways.json'
import streetMap from '../../sfmaps/streets.json'

export const mapFiles = {
    neighborhoodMap, arteriesMap, freewaysMap, streetMap
};

export const drawSfMap = (svg, path) => {
    drawMap(svg, streetMap, 'streets', path);
    drawMap(svg, arteriesMap, 'arteries', path);
    drawMap(svg, freewaysMap, 'freeways', path);
    drawMap(svg, neighborhoodMap, 'neighborhoods', path);
};

const drawMap = (svg, json, className, path) => {
    return svg
        .append('path')
        .datum(json)
        .attr('class', 'map ' + className)
        .style('fill', 'none')
        .attr('d', path);
};


