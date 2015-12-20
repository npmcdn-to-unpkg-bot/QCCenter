option = {
    tooltip : {
        trigger: 'item',
        formatter: '{b}'
    },
    series : [
        {
            name: '中国',
            type: 'map',
            mapType: 'china',
            selectedMode : 'multiple',
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
            data:[
                {name:'广东',selected:true}
            ]
        }
    ]
};