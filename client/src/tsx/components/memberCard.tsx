import React, {CSSProperties, RefObject, useEffect, useState} from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import If from './general/if'

export default function MemberCard(props:{ id:string, name:string,col:RefObject<HTMLDivElement>}) {
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

  const [style,setStyle] = useState({} as CSSProperties)

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false })
  }, [])

  function drag(e:React.DragEvent<HTMLDivElement>){
    const pos = props.col.current!.getBoundingClientRect()
    const memberRef = document.querySelector('.quizForm__member--notdragging')
    setStyle({
      top:`${e.clientY - pos.top}px`,
      left:`${e.clientX - pos.left}px`,
      width:`${memberRef?.clientWidth}px`
    })
  }

  return (
    <>
      <div 
        onDrag={drag}
        className={"quizForm__member " + (isDragging ? "quizForm__member--dragging" : "quizForm__member--notdragging")}
        style={style} 
        ref={ref}
      >{props.name}</div>
      <If condition={isDragging}>
        <div className="quizForm__member quizForm__member--blank">blank</div>
      </If>
    </>
  )
}