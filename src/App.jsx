import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

// 사이즈 줄이기
const DIVSIZE = 2;

function App() {
  /**
   * @type {React.LegacyRef<HTMLCanvasElement>}
   */
  const canv = useRef(null)

  useEffect(() => {
    let ctx = canv.current.getContext('2d');
    /**
     * @type {Array<{
     *  x: number,
     *  y: number,
     *  goalX: number,
     *  goalY: number,
     *  drawing: boolean
     * }>}
     */
    let CorrectionHandlerList = []
    let cursor = -1;
    let correctionPower = 20;
    let mouse = {
      x: 0,
      y: 0,
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    // ctx.moveTo(0, 0);
    // ctx.lineTo(100, 100);

    ctx.lineWidth = 40;

    ctx.strokeStyle = '#000000';
    // ctx.stroke();

    window.addEventListener('resize', () => {
      canv.current.width = window.innerWidth;
      canv.current.height = window.innerHeight;
    })
    let mousePressed = false;
    // window.addEventListener('mouseenter', () => {mousePressed = false})
    // window.addEventListener('mouseleave', () => {mousePressed = false})
    // window.addEventListener('mouseout', () => {mousePressed = false})
    window.addEventListener('mousedown', e => {
      ctx.moveTo(e.clientX * DIVSIZE, e.clientY * DIVSIZE);
      cursor++;
      CorrectionHandlerList.push(
        {
          x: e.clientX,
          y: e.clientY,
          goalX: e.clientX,
          goalY: e.clientY,
          drawing: true
        }
      );
      mousePressed = true
    })


    window.addEventListener('mouseup', () => {
      mousePressed = false
      CorrectionHandlerList[cursor].drawing = false;
    })
    window.addEventListener('mousemove', e => {
      if (!mousePressed) return;
      CorrectionHandlerList[cursor].goalX = e.clientX;
      CorrectionHandlerList[cursor].goalY = e.clientY;
    })
    setInterval(() => {
      for (let i = 0; i < CorrectionHandlerList.length; i++) {
        let before = {
          x: CorrectionHandlerList[i].x,
          y: CorrectionHandlerList[i].y,
        };  
        CorrectionHandlerList[i].x += (CorrectionHandlerList[i].goalX - CorrectionHandlerList[i].x) / correctionPower;
        CorrectionHandlerList[i].y += (CorrectionHandlerList[i].goalY - CorrectionHandlerList[i].y) / correctionPower;
  
        const DISTANCE = 0.1;
        console.log(
          CorrectionHandlerList[i].goalX - CorrectionHandlerList[i].x,
          CorrectionHandlerList[i].goalY - CorrectionHandlerList[i].y
        )
        if (Math.abs(CorrectionHandlerList[i].goalX - CorrectionHandlerList[i].x) > DISTANCE || Math.abs(CorrectionHandlerList[i].goalY - CorrectionHandlerList[i].y) > DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(before.x * DIVSIZE, before.y * DIVSIZE);
          ctx.lineTo(CorrectionHandlerList[i].x * DIVSIZE, CorrectionHandlerList[i].y * DIVSIZE);
          ctx.stroke();
          ctx.closePath();
        }else {
          if (!CorrectionHandlerList[i].drawing) {
            CorrectionHandlerList.splice(i, 1);
            cursor--;
          }
        }
      }
    }, 1000 / 120)

  }, [])
  return (
    <>
      <canvas ref={canv} width={window.innerWidth * DIVSIZE} height={window.innerHeight * DIVSIZE} style={{
        width: "100vw",
        height: "100vh",
      }} />
    </>
  )
}

export default App
