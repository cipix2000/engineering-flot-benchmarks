/*global $, HistoryBuffer*/
/*jshint browser: true*/

$(function () {
    'use strict';
    var plot;
    var globalIndex = 0;

    var plots = 2;
    var samples = 80000;
    var buffer = [];
    var chartStep = 9/samples;

    var initBuffer = function () {
        for (var j = 0 ; j < plots; j++) {
            buffer.push({flat: true, decimate: decimate1D, data: []});
        }
    }

    function decimate1D(data, startIndex, endIndex, buckets) {
        var i,
            j,
            index = 0,
            iindex= 0,
            length = endIndex - startIndex,
            res;

        if (buckets > length) {
            return data;
        }

        res = [];

        for (j = 0; j < buckets *4 ; j+=4) {
            // min
            res[j]= 0;
            // min index
            res[j+1]= Infinity;
            // max
            res[j+2]= 0;
            // max index
            res[j+3]= -Infinity;
        }

        // fill buckets
        for (i = startIndex * 2; i < endIndex * 2; i += 2) {
            if (data[i+1] < res[iindex+1]) {
                res[iindex] = data[i];
                res[iindex+1] = data[i+1];
            }
            if (data[i+1] > res[iindex+3]) {
                res[iindex+2] = data[i];
                res[iindex+3] = data[i+1];
            }

            index += buckets/length;
            iindex = Math.floor(index) * 4;
        }

        return res;
    }

    function process1DRawData(plot, series, data, datapoints) {
        datapoints.pointsize = 2;
        datapoints.points.length = data.length * 2;
        for (var i = 0 ; i < data.length; i++) {
            datapoints.points[i*2] = i;
            datapoints.points[i*2 + 1] = data[i];
        }
    }

    $.plot.plugins.push({
        init: function(plot) {
            plot.hooks.processRawData.push(process1DRawData);
        },
        name: 'flat_1Ddata',
        version: '0.0.1'
    });

    function fillData() {
        var sin;

        for (var j = 0 ; j < plots; j++) {
            for (var i = 0; i < samples; i++) {
                sin = Math.sin((globalIndex + i) * chartStep);
                buffer[j].data[i] = sin + 2 * j;
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
        },
        interaction: {
            redrawOverlayInterval: -1
        }
    });

    function updateDataAndRAF() {
        window.requestAnimationFrame(updateDataAndRAF);
        updateDataAndDraw();
    };

    window.requestAnimationFrame(updateDataAndRAF);
});
