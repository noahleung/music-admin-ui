<template>
<div>
  <white-board>
    <div class="draw-nav">
      <div id='songsCharts' style='width:500px;height:500px' class="draw"></div>
      <div id='historyCharts' style='width:500px;height:500px' class="draw"></div>
    </div>
  </white-board>
</div>
</template>

<script>
import WhiteBoard from '@/components/layout/white-board'
import ChartsApi from '@/api/ChartsApi'
var echarts = require('echarts')
export default {
  name: 'Charts',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      songsCharts: new Map(),
      historyCharts: new Map()
    }
  },
  methods: {
    drawSongs () {
      var myChart = echarts.init(document.getElementById('songsCharts'))
      myChart.setOption({
        color: ['#3398DB'],
        title: {
          text: '各个类型音乐数量'
        },
        tooltip: {},
        xAxis: {
          data: ['流行乐', '摇滚乐', '爵士', '原创', '翻唱', '轻音乐']
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: [this.songsCharts.pop, this.songsCharts.rock, this.songsCharts.jazz, this.songsCharts.original, this.songsCharts.cover, this.songsCharts.light]
        }]
      })
    },
    drawHistory () {
      let myChart = echarts.init(document.getElementById('historyCharts'))
      myChart.setOption({
        title: {
          text: '不同类型音乐受欢迎程度'
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          hoverAnimation: true, // 是否开启 hover 在扇区上的放大动画效果
          data: [
            {value: this.historyCharts.pop, name: '流行乐'},
            {value: this.historyCharts.rock, name: '摇滚乐'},
            {value: this.historyCharts.jazz, name: '爵士'},
            {value: this.historyCharts.original, name: '原创'},
            {value: this.historyCharts.cover, name: '翻唱'},
            {value: this.historyCharts.light, name: '轻音乐'}]
        }],
        itemStyle: {
          // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
          // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(30, 144, 255，0.5)'
          }
        },
        tooltip: {
          trigger: 'item',
          showDelay: 20,
          hideDelay: 20,
          backgroundColor: 'rgba(255,0,0,0.7)',
          textStyle: {
            fontSize: '16px',
            color: '#000'
          }
        },
        legend: {
          y: 'bottom',
          x: 'center'
        }
      })
    }
  },
  mounted () {
    ChartsApi.songsCharts().then(data => {
      this.songsCharts = data
      this.drawSongs()
    })

    ChartsApi.historyCharts().then(data => {
      this.historyCharts = data
      this.drawHistory()
    })
  }
}
</script>

<style scoped>
  .draw-nav{
    display: flex;
  }
  .draw{
    /*float: left;*/
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
</style>
