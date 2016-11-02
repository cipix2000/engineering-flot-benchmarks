/*global $, HistoryBuffer*/
/*jshint browser: true*/

$(function () {
    'use strict';
    var plot;
    var globalIndex = 0;
    var chartStep = 0.001;

    var plots = 2;
    var samples = 16000;
    var buffer = [];

    var initBuffer = function () {
        for (var j = 0 ; j < plots; j++) {
            buffer.push([]);
        }
    }


    function updateData() {
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
        updateData();
        window.requestAnimationFrame(updateDataAndRAF);
    };

    window.requestAnimationFrame(updateDataAndRAF);
});
