import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

interface DragProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragComponent({ toDoId, toDoText, index }: DragProps) {
  return (
    <Draggable key={toDoId} draggableId={toDoId + ''} index={index}>
      {(magic, snapshot) => (
        <Card
          ref={magic.innerRef}
          $isDragging={snapshot.isDragging}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragComponent);

const Card = styled.div<{ $isDragging: boolean }>`
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.$isDragging ? '#74b9ff' : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? '0px 2px 5px rgba(0,0,0,0.5)' : 'none'};
`;
