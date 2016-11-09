/*global $, HistoryBuffer*/
/*jshint browser: true*/

$(function () {
    'use strict';
    var plot;
    var globalIndex = 0;

    var plots = 2;
    var samples = 10000;
    var buffer = [];
    var chartStep = 9/samples;

    var initBuffer = function () {
        for (var j = 0 ; j < plots; j++) {
            buffer.push({flat: true, data: [[],[]]});
        }
    }

    function processRawData(plot, series, data, datapoints){
        datapoints.pointsize = 2;
        datapoints.points.length = data[0].length * 2;
        for (var i = 0 ; i < data[0].length; i++) {
            datapoints.points[i*2] = data[0][i];
            datapoints.points[i*2 + 1] = data[1][i];
        }
    }

    $.plot.plugins.push({
        init: function(plot) {
            plot.hooks.processRawData.push(processRawData);
        },
        name: 'flat_data',
        version: '0.0.1'
    });

    function fillData() {
        var sin;

        for (var j = 0 ; j < plots; j++) {
            for (var i = 0; i < samples; i++) {
                sin = Math.sin((globalIndex + i) * chartStep);
                buffer[j].data[0][i] = i;
                buffer[j].data[1][i] = sin + 2 * j;
            }
        }

        globalIndex += samples/60;
    }

    // update data reuses the same buffer, so no memory is allocated here, except the first time when it runs
    function updateDataAndDraw() {

        fillData();
        plot.setData(buffer);
        plot.setupGrid();
        plot.draw();
    }

    initBuffer();
    fillData();

    plot = $.plot('#placeholder', buffer, {
        series: {
            lines: {
                show: true,
                lineWidth: 1
            },
            shadowSize: 0
        },
        xaxes: [{show: true}],
        yaxes: [{show: true}],
        legend: {
            show: false
        }
    });

    function updateDataAndRAF() {
        updateDataAndDraw();
        window.requestAnimationFrame(updateDataAndRAF);
    };

    window.requestAnimationFrame(updateDataAndRAF);
});
