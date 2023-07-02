import React, { RefObject, useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

export default function MemberCard(props:{ id:string, name:string,updateFn:(name:string,top:number,left:number) => void}) {
  const [{isDragging},ref,preview] = useDrag(() => ({
    type:"member",
    item:{
        id:props.id,
        name:props.name
    },
    collect:(monitor) => ({
        isDragging:monitor.isDragging()
    })
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false })
  }, [])

  function drag(e:React.DragEvent<HTMLDivElement>){
    props.updateFn(props.name,e.clientY,e.clientX)
  }

  return (
    <div onDrag={drag}  className="quizForm__member quizForm__member--notdragging" style={{opacity:isDragging ? 0: 1}} ref={ref}>{props.name}</div>
  )
}