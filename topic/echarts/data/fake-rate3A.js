var xAxis = ["201601", "201603", "201604", "201605", "201606"];
var yAxis = [
    [0.12, 0.169, 0.146, 0.097, 0.108],
    [0.154, 0.336, 0.249, 0.325, 0.293],
    [0.02, 0.019, 0.042, 0.023, 0.015],
    [0.085, 0.392, 0.391, 0.165, 0.445],
    [0.194, 0.157, 0.094, 0.061, '-'],
    [0.43, 0.232, 0.269, 0.289, '-'],
    [0.008, 0.005, 0.01, 0.003, '-'],
    [0.219, 0.13, 0.125, 0.134, '-']
];
var itemStyle = {
    "normal": {
        "label": {
            "show": true,
            "position": "insideTop",
            "formatter": "{c}"
        }
    }
};
var seriesName = ['胶印', '凹印', '印码', '其它'];
var seriesData = [];

var sum = [];
xAxis.map(function(data, index) {
    sum[index] = {
        lastYear: 0,
        thisYear: 0
    };

    for (var i = 0; i < 4; i++) {
        if (yAxis[i][index] != '-') {
            sum[index].lastYear += yAxis[i][index];
        }
        if (yAxis[i + 4][index] != '-') {
            sum[index].thisYear += yAxis[i + 4][index];
        }
    }
})
    
var level =  [0.36, 0.472, 0.635, 0.848, 1.06]
var levelDesc = ['优秀值', '良好值', '中间值', '较低值', '较差值'];
var markLine = {
    data: []
};
var lineLabel = {
    normal: {
        formatter: '{c}:\n{b}',
        position: 'end'
    }
};
level.map(function(data,i){
    markLine.data.push({
        "name": levelDesc[i],
        "yAxis": level[i],
        label:lineLabel
    });
});

seriesName.map(function(data, i) {
    seriesData.push({
        "name": data,
        "type": "bar",
        "stack": "去年同期",
        "barMaxWidth": "100",
        "barMinHeight": 15,
        "data": yAxis[i],
        "itemStyle": itemStyle,
        "symbolSize": "12",
    });
    seriesData.push({
        "name": data,
        "type": "bar",
        "stack": "今年",
        "barMaxWidth": "100",
        "barMinHeight": 15,
        "data": yAxis[i + 4],
        "itemStyle": itemStyle,
        "symbolSize": "12",
    })
});
seriesData[0].markLine = markLine;

option = {
    backgroundColor: '#fff',
    "title": [{
        "text": "9603A作废率对比",
        "x": "center"
    }, {
        "text": "数据来源:质量综合管理系统",
        "borderWidth": 0,
        "textStyle": {
            "fontSize": 10,
            "fontWeight": "normal"
        },
        "x": 5,
        "y2": 3
    }, {
        "text": "统计时间：20160101 - 20160630",
        "borderWidth": 0,
        "textStyle": {
            "fontSize": 10,
            "fontWeight": "normal"
        },
        "x": 5,
        "y2": 18
    }, {
        "text": "©成都印钞有限公司 技术质量部",
        "borderColor": "#999",
        "borderWidth": 0,
        "textStyle": {
            "fontSize": 10,
            "fontWeight": "normal"
        },
        "x": "right",
        "y2": 3
    }],
    "grid": {
        "left": "5%",
        "right": "8%",
        "top": "10%",
        "bottom": "10%",
        "containLabel": true
    },
    "connectNulls": true,
    "toolbox": {
        "left": "left",
        "show": true,
        "feature": {
            "mark": {
                "show": true
            },
            "dataView": {
                "show": true,
                "readOnly": false
            },
            "dataZoom": {
                "show": true
            },
            "magicType": {
                "show": true,
                "type": ["line", "bar", "stack", "tiled"]
            },
            "restore": {
                "show": true
            },
            "saveAsImage": {
                "show": true
            }
        }
    },
    "calculable": true,
    "tooltip": {
        "backgroundColor": "rgba(255,255,255,0.85)",
        "extraCssText": "box-shadow: 0 0 3px #e6e6e6;border-radius:4px;border:1px solid #d4d4d4;padding:10px;",
        "textStyle": {
            "color": "#333"
        },
        formatter: function(param) {
            var str = '去年同期合计 : ' + sum[param[0].dataIndex].lastYear.toFixed(3) + '‰<br>';
            var str2 = '<br/>今年合计 : ' + sum[param[0].dataIndex].thisYear.toFixed(3) + '‰<br>';
            param.map(function(data, i) {
                if (i % 2 == 0) {
                    str += data.seriesName + '工序 : ' + data.data + '‰<br>';
                } else {
                    str2 += data.seriesName + '工序 : ' + data.data + '‰<br>';
                }

            });
            return str + str2;
        },
        "trigger": "axis",
        "axisPointer": {
            "type": "shadow",
            "lineStyle": {
                "color": "#aaa"
            },
            "crossStyle": {
                "color": "#aaa"
            },
            "shadowStyle": {
                "color": "rgba(128,200,128,0.1)"
            }
        }
    },
    "legend": {
        "data": seriesName,
        "x2": "5%",
        "y": 40,
        "itemGap": 20,
        "textStyle": {
            "fontSize": 16
        },
        "show": true
    },
    "xAxis": [{
        "name": "月份",
        "nameTextStyle": {
            "fontSize": 16
        },
        "axisTick": {
            "show": true,
            "length": 8,
            "lineStyle": {
                "color": "#aaa",
                "width": 2
            }
        },
        "axisLabel": {
            "textStyle": {
                "fontSize": 16
            }
        },
        "type": "category",
        "boundaryGap": true,
        "data": xAxis
    }],
    "yAxis": [{
        "name": "作废率",
        "nameLocation": "middle",
        "nameGap": 35,
        "nameTextStyle": {
            "fontSize": 16
        },
        "type": "value",
        "position": "left",
        "scale": true,
        "axisLabel": {
            "show": true,
            "interval": "auto",
            "margin": 10,
            "textStyle": {
                "fontSize": 16
            }
        },
        "axisTick": {
            "show": false
        },
        "min": 0
    }],
    "series": seriesData,
    "color": ["#61A5E8", "#7ECF51", "#EECB5F", "#E4925D", "#E16757", "#9570E5", "#605FF0", "#85ca36", "#1c9925", "#0d8b5f", "#0f9cd3", "#2f7e9b", "#2f677d", "#9b7fed", "#7453d6", "#3b1d98", "#27abb1", "#017377", "#015f63", "#b86868", "#5669b7", "#e5aab4", "#60b65f", "#98d2b2", "#c9c8bc", "#45c3dc", "#e17979", "#5baa5a", "#eaccc2", "#ffaa74"]
}