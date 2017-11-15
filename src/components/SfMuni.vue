<template>
    <div class="sf-muni-rt">
        <div class="map-container" map></div>
        <div id='route-list'>
            <div v-for="route in routeList" class="route-list-row">
                <input type="checkbox" id="route.tag"
                       v-bind:value="route.tag" v-on:change="editRoute(route.tag)"
                       v-model="selectedRoute">
                <label>{{route.tag}}</label>
            </div>
        </div>
        <h2>SF Muni Real Time</h2>
    </div>
</template>

<script>
    'use strict';
    import * as d3 from 'd3';
    import {getMuniRouteConfig, getMuniBusData} from '../helpers/api.js';
    import {drawSfMap} from '../helpers/maps';

    export default {
        components: {},
        name: 'SF-Muni-Realtime',
        data: function() {
            return {
                routes: [],
                store: [],
                selectedRoute: []
            }
        },
        mounted: function() {
            const width = 1000;
            const height = 500;
            d3.select('svg').remove();
            this.projection = d3.geoMercator().scale(200000).center([-122.45, 37.75]);
            const path = d3.geoPath().projection(this.projection);
            this.svg = d3.select('.map-container').append('svg')
                .attr('width', width)
                .attr('height', height);

            // draw the map of SF using the data in geoJSON format
            drawSfMap(this.svg, path);
            this.fetchRoute(this.svg, this.projection);

            // calling the api to fetch the Bus location every 15 seconds after the route is rendered
            setInterval(function() {
                this.fetchBusData(this.svg)
            }.bind(this), 30000)
        },
        computed: {
            routeList: function() {
                let arr = [];
                for (let route of this.routes) {
                    arr.push({ tag: route.tag, color: route.color });
                    this.renderRoute(route)
                }
                return arr;
            }
        },
        methods: {
            fetchRoute: function() {
                let self = this;
                getMuniRouteConfig().then(response => {
                    self.routes = response.data.route;
                    self.fetchBusData()
                }).catch(e => {
                    console.log(e)
                });
            },
            renderRoute: function(routeData) {
                let self = this;
                let routeLineFunction = d3.line()
                    .x(d => self.projection([d.lon, d.lat])[0])
                    .y(d => self.projection([d.lon, d.lat])[1])
                    .curve(d3.curveLinear);
                let tag = routeData.tag;
                for (let value of routeData.path) {
                    self.svg.append('path')
                        .attr('d', routeLineFunction(value.point))
                        .attr('class', 'route')
                        .attr('data-tag', tag)
                        .attr('stroke', '#' + routeData.color)
                        .attr('stroke-width', 2)
                        .style('stroke-opacity', 0.5)
                        .attr('fill', 'none')
                        .append('svg:title')
                        .text(() => routeData.title)
                }
            },
            fetchBusData: function() {
                var self = this;
                self.store = [];
                for (const route of self.routes) {
                    getMuniBusData(route.tag).then(bus => {
                        self.formatBusData(bus)
                    });
                }
            },
            formatBusData: function(bus) {
                var self = this;
                if (bus.data.hasOwnProperty('vehicle')) {
                    for (let vehicle of bus.data.vehicle) {
                        if (vehicle) {
                            self.store.push(vehicle)
                        }
                    }
                }
                self.drawBus();
            },
            selectRoute: function() {
                if (this.selectedRoute.length === 0) {
                    return
                }
                d3.selectAll('.map').style('stroke-opacity', 0.3);
                d3.selectAll('.route').style('stroke-opacity', 0.05).attr('stroke-width', 2);

                for (let route of this.selectedRoute) {
                    const routeTag = '.route[data-tag="' + route + '"]';
                    d3.selectAll(routeTag).style('stroke-opacity', 1).attr('stroke-width', 5);
                }
                d3.selectAll('.bus').style('fill-opacity', 0.5);
                for (let selectRoute of this.selectedRoute) {
                    const buses = '.bus[data-route-tag="' + selectRoute + '"]';
                    d3.selectAll(buses).style('fill-opacity', 1)
                }
            },
            editRoute: function(routeTag) {
                // if the route is not in the model then remove the focus on the route
                if (this.selectedRoute.indexOf(routeTag) < 0) {
                    const route = '.route[data-tag="' + routeTag + '"]';
                    const buses = '.bus[data-route-tag="' + routeTag + '"]';
                    if (this.selectedRoute.length === 0) {
                        d3.selectAll('.map').style('stroke-opacity', 0.8);
                        d3.selectAll('.route').style('stroke-opacity', 1).attr('stroke-width', 2);
                        d3.selectAll('.bus').style('fill-opacity', 0.75);
                    } else {
                        d3.selectAll(route).style('stroke-opacity', 0.05).attr('stroke-width', 2);
                        d3.selectAll(buses).style('opacity', 0.50);
                    }
                }
                else {
                    this.selectRoute()
                }

            },
            drawBus() {
                let self = this;
                const projection = d3.geoMercator().scale(200000).center([-122.45, 37.75]);
                self.svg.selectAll('.bus')
                    .data(self.store)
                    .enter()
                    .append('circle')
                    .attr('r', 5)
                    .attr('fill', '#31558d')
                    .style('fill-opacity', 0.5)
                    .attr('class', 'bus')
                    .attr('data-route-tag', d => d.routeTag)
                    .attr('data-dir-tag', d => d.dirTag)
                    .attr('data-heading', d => d.heading)
                    .attr('data-id', d => d.id)
                    .attr('cx', d => projection([d.lon, d.lat])[0])
                    .attr('cy', d => projection([d.lon, d.lat])[1])
            }
        }
    }
</script>

<style>
    svg {
        background-color: white;
    }
    
    .map-container {
        border: 1px solid green;
        background-color: lightcyan;
    }

    .map-container .streets {
        stroke-linejoin: round;
        stroke: lightblue;
    }

    .map-container .arteries {
        stroke-linejoin: round;
        stroke: red;
        stroke-width: 1px;
    }

    .map-container .freeways {
        stroke-linejoin: round;
        stroke: darkgrey;
        stroke-width: 3px;
    }

    .neighborhoods {
        stroke-linejoin: round;
        stroke: orange;
        stroke-width: 1px;
    }

    .route-list {
        width: 100%;
        display: flow-root;
        margin-top: 40px;
    }

    .route-list-row {
        display: inline-block;
        width: 100px;
        text-align: left;
    }

    .route, .bus {
        cursor: pointer;
    }

    .bus:hover {
        fill-opacity: 1 !important;
        fill: #8d3155;
    }

</style>


