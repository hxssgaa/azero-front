import React, { PureComponent } from 'react';
// 组件定义
import HigherChart from './HigherChart';
import data from './data.json';

const CONFIG = {
  kiraRadius : 5,
  kiraLineWidth: 2,
  kiraSpeed : 0.3,
  biuSpeed : 2,
  biuAcceleration: 1.02,
  biuCollectionCont: 10,
  biuLineWidth: 3,
  boomSpeed: 10,
  boomAcceleration: 0.95,
  boomAngel: Math.PI*2,
  boomTargetCount: 100,
  boomGradient : 0.015,
  boomGravity: 0.98,
  boomCollectionCont: 2,
  boomLineWidth: 3,
  boomLineCont: {min: 10, max: 30},
  animateTimerTarget: 50
};

export default class Fireworks extends PureComponent {
  componentDidMount() {
    // let canvas = document.querySelector('#canvas');
    // let context = canvas.getContext('2d');
    // let cw = canvas.width = window.innerWidth;
    // let ch = canvas.height = window.innerHeight;
    // let a = new Animate();
    // a.run();
  }
  //
  // componentDidUpdate() {
  //   Service.queryStockCandle().then((data) => {
  //     if (data) {
  //       this.renderG6Graph(data);
  //     } else {
  //       message.error('有问题');
  //     }
  //   });
  // }

  render() {

    return (
      <div>
        <canvas id="canvas"></canvas>
      </div>
    );
  }
}

// class Kirakira {
//   constructor(targetX, targetY){
//     // 指定产生的坐标点
//     this.targetLocation = {x: targetX, y: targetY}
//     this.radius = CONFIG.kiraRadius
//   }
//   draw() {
//     // 绘制一个圆
//     context.beginPath()
//     context.arc(this.targetLocation.x, this.targetLocation.y, this.radius, 0, Math.PI * 2)
//     context.lineWidth = CONFIG.kiraLineWidth
//     context.strokeStyle = `rgba(${randomColor()}, 1)`;
//     context.stroke()
//   }
//
//   update(){
//     // 让圆进行扩张，实现闪烁效果
//     if(this.radius < CONFIG.kiraRadius){
//       this.radius += CONFIG.kiraSpeed
//     }else{
//       this.radius = 1
//     }
//   }
//
//   init() {
//     this.draw()
//     this.update()
//   }
// }
//
// class Biubiubiu {
//   constructor(startX, startY, targetX, targetY) {
//     this.startLocation = {x: startX, y: startY}
//     this.targetLocation = {x: targetX, y: targetY}
//     // 运动当前的坐标，初始默认为起点坐标
//     this.nowLoaction = {x: startX, y: startY}
//     // 到目标点的距离
//     this.targetDistance = this.getDistance(this.startLocation.x, this.startLocation.y, this.targetLocation.x, this.targetLocation.y);
//     // 速度
//     this.speed = CONFIG.biuSpeed
//     // 加速度
//     this.acceleration = CONFIG.biuAcceleration
//     // 角度
//     this.angle = Math.atan2(this.targetLocation.y - this.startLocation.y, this.targetLocation.x - this.startLocation.x)
//
//     // 线段集合, 每次存10个，取10个帧的距离
//     this.collection = new Array(CONFIG.biuCollectionCont)
//
//     // 是否到达目标点
//     this.arrived = false
//   }
//
//   draw() {
//     context.beginPath()
//     try{
//       context.moveTo(this.collection[0][0], this.collection[0][1])
//     }catch(e){
//       context.moveTo(this.nowLoaction.x, this.nowLoaction.y)
//     }
//     context.lineWidth = CONFIG.biuLineWidth
//     context.lineCap = 'round'
//     context.lineTo(this.nowLoaction.x, this.nowLoaction.y)
//     context.strokeStyle = `rgba(${randomColor()}, 1)`;
//     context.stroke()
//   }
//
//   update() {
//     this.collection.shift()
//     this.collection.push([this.nowLoaction.x, this.nowLoaction.y])
//     this.speed *= this.acceleration
//     let vx = Math.cos(this.angle) * this.speed
//     let vy = Math.sin(this.angle) * this.speed
//     let nowDistance = this.getDistance(this.startLocation.x, this.startLocation.y, this.nowLoaction.x+vx, this.nowLoaction.y+vy)
//     if(nowDistance >= this.targetDistance){
//       this.arrived = true
//     }else{
//       this.nowLoaction.x += vx
//       this.nowLoaction.y += vy
//       this.arrived = false
//     }
//   }
//
//   getDistance(x0, y0, x1, y1) {
//     // 计算两坐标点之间的距离
//     let locX = x1 - x0
//     let locY = y1 - y0
//     // 勾股定理
//     return Math.sqrt(Math.pow(locX, 2) + Math.pow(locY, 2))
//   }
//
//   init() {
//     this.draw()
//     this.update()
//   }
// }
//
// class Boom {
//   // 爆炸物是没有确定的结束点坐标， 这个可以通过设定一定的阀值来限定
//   constructor(startX, startY){
//     this.startLocation = {x: startX, y: startY}
//     this.nowLocation = {x: startX, y: startY}
//     // 速度
//     this.speed = Math.random()*CONFIG.boomSpeed+2
//     // 加速度
//     this.acceleration = CONFIG.boomAcceleration
//     // 没有确定的结束点，所以没有固定的角度，可以随机角度扩散
//     this.angle = Math.random()*CONFIG.boomAngel
//     // 这里设置阀值为100
//     this.targetCount = CONFIG.boomTargetCount
//     // 当前计算为1，用于判断是否会超出阀值
//     this.nowNum = 1
//     // 透明度
//     this.alpha = 1
//     // 透明度减少梯度
//     this.gradient = CONFIG.boomGradient
//     // 重力系数
//     this.gravity = CONFIG.boomGravity
//
//     // 线段集合, 每次存10个，取10个帧的距离
//     this.collection = []
//     this.collection = new Array(CONFIG.boomCollectionCont)
//
//     // 是否到达目标点
//     this.arrived = false
//   }
//
//   draw(){
//     context.beginPath()
//     try{
//       context.moveTo(this.collection[0][0], this.collection[0][1])
//     }catch(e){
//       context.moveTo(this.nowLocation.x, this.nowLocation.y)
//     }
//     context.lineWidth = CONFIG.boomLineWidth
//     context.lineCap = 'round'
//     context.lineTo(this.nowLocation.x, this.nowLocation.y)
//     // 设置由透明度减小产生的渐隐效果，看起来没这么突兀
//     context.strokeStyle = `rgba(${randomColor()}, ${this.alpha})`
//     context.stroke()
//   }
//
//   update(){
//     this.collection.shift()
//     this.collection.push([this.nowLocation.x, this.nowLocation.y])
//     this.speed *= this.acceleration
//
//     let vx = Math.cos(this.angle) * this.speed
//     // 加上重力系数，运动轨迹会趋向下
//     let vy = Math.sin(this.angle) * this.speed + this.gravity
//
//     // 当前计算大于阀值的时候的时候，开始进行渐隐处理
//     if(this.nowNum >= this.targetCount){
//       this.alpha -= this.gradient
//     }else{
//       this.nowLocation.x += vx
//       this.nowLocation.y += vy
//       this.nowNum++
//     }
//
//     // 透明度为0的话，可以进行移除处理，释放空间
//     if(this.alpha <= 0){
//       this.arrived = true
//     }
//   }
//
//   init(){
//     this.draw()
//     this.update()
//   }
// }
//
// class Animate {
//   constructor(){
//     // 定义一个数组做为闪烁球的集合
//     this.kiras = []
//     // 定义一个数组做为射线类的集合
//     this.bius = []
//     // 定义一个数组做为爆炸类的集合
//     this.booms = []
//     // 避免每帧都进行绘制导致的过量绘制，设置阀值，到达阀值的时候再进行绘制
//     this.timerTarget = CONFIG.animateTimerTarget
//     this.timerNum = 0
//   }
//
//   pushBoom(x, y){
//     // 实例化爆炸效果，随机条数的射线扩散
//     for(let bi = Math.random()*(CONFIG.boomLineCont.max - CONFIG.boomLineCont.min)+CONFIG.boomLineCont.min; bi>0; bi--){
//       this.booms.push(new Boom(x, y))
//     }
//   }
//
//   initAnimate(target, cb){
//     // 绘制动画
//     target.map((item, index) => {
//       if(!(item instanceof Object)){
//         console.error('数组值错')
//         return false
//       }else{
//         item.init()
//         if(cb) { cb(index) }
//       }
//     })
//   }
//
//   run() {
//     window.requestAnimationFrame(this.run.bind(this))
//     context.clearRect(0, 0, cw, ch)
//
//     // 触发射线动画
//     this.initAnimate(this.bius, (i)=>{
//       // 同时开始绘制闪烁圆
//       this.kiras[i].init()
//       if(this.bius[i].arrived){
//         // 到达目标后，可以开始绘制爆炸效果, 当前线条的目标点则是爆炸实例的起始点
//         this.pushBoom(this.bius[i].nowLoaction.x, this.bius[i].nowLoaction.y)
//         // 到达目标后，把当前类给移除，释放空间
//         this.bius.splice(i, 1)
//         this.kiras.splice(i, 1)
//       }
//     })
//
//     // 触发爆炸动画
//     this.initAnimate(this.booms, (i)=>{
//       if(this.booms[i].arrived){
//         // 到达目标透明度后，把炸点给移除，释放空间
//         this.booms.splice(i, 1)
//       }
//     })
//
//     if(this.timerNum >= this.timerTarget){
//       // 到达阀值后开始绘制实例化射线
//       var startX = Math.random()*(cw/2)
//       var startY = ch
//       var targetX = Math.random()*cw
//       var targetY = Math.random()*(ch/2)
//       // 射线实例化，并入合集中
//       let exBiu = new Biubiubiu(startX, startY, targetX, targetY)
//       this.bius.push(exBiu)
//       // 闪烁球实例化，并入合集中
//       let exKira = new Kirakira(targetX, targetY)
//       this.kiras.push(exKira)
//       // 到达阀值后把当前计数重置一下
//       this.timerNum = 0
//     }else{
//       this.timerNum ++
//     }
//   }
// }

function randomColor(){
  // 返回一个0-255的数值，三个随机组合为一起可定位一种rgb颜色
  let num = 3;
  let color = [];
  while(num--){
    color.push(Math.floor(Math.random()*254+1))
  }
  return color.join(', ')
}
