Page({
  data: {
    markers: [{
      iconPath: "/image/icon-guanzhu.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 25,
      height: 25
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/image/icon-guanzhu.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 25,
        height: 25
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})