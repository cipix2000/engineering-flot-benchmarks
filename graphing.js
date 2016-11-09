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
            buffer.push([]);
        }
    }

    // update data reuses the same buffer, so no memory is allocated here, except the first time when it runs
    function updateDataAndDraw() {
        var sin, cos, sin1, tan;
        var tarray;

        for (var j = 0 ; j < plots; j++) {
            for (var i = 0; i < samples; i++) {
                sin = Math.sin((globalIndex + i) * chartStep);
                if (!Array.isArray(buffer[j][i])) {
                    buffer[j][i] = [];
                }
                buffer[j][i][0] = i;
                buffer[j][i][1] = sin + 2 * j;
            }
        }

        globalIndex += samples/60;

        plot.setData(buffer);
        plot.setupGrid();
        plot.draw();
    }

    plot = $.plot('#placeholder', [[], [], [], []], {
        series: {
            lines: {
                show: true,
                lineWidth: 1
            },
            shadowSize: 0
        },
        legend: {
            show: false
        }
    });

    initBuffer();

    function updateDataAndRAF() {
        updateDataAndDraw();
        window.requestAnimationFrame(updateDataAndRAF);
    };

    window.requestAnimationFrame(updateDataAndRAF);
});
