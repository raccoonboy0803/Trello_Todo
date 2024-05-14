import React, { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from '../atoms';

interface DragProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DragComponent({ toDoId, toDoText, index, boardId }: DragProps) {
  const setToDos = useSetRecoilState(toDoState);
  const onDelete = () => {
    setToDos((allBoards) => {
      const boardCopy = [...allBoards[boardId]];
      boardCopy.splice(index, 1);

      localStorage.setItem(
        'todos',
        JSON.stringify({ ...allBoards, [boardId]: boardCopy })
      );

      return { ...allBoards, [boardId]: boardCopy };
    });
  };
  return (
    <Wrapper>
      <Draggable key={toDoId} draggableId={toDoId + ''} index={index}>
        {(magic, snapshot) => (
          <Card
            ref={magic.innerRef}
            $isDragging={snapshot.isDragging}
            {...magic.dragHandleProps}
            {...magic.draggableProps}
          >
            {toDoText}
            <Button onClick={onDelete}>delete</Button>
          </Card>
        )}
      </Draggable>
    </Wrapper>
  );
}

export default React.memo(DragComponent);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 5px;
`;

const Button = styled.button`
  position: absolute;
  right: 2px;
  top: 2px;
  height: 30px;
  width: 50px;
`;

const Card = styled.div<{ $isDragging: boolean }>`
  position: relative;
  width: 100%;
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.$isDragging ? '#74b9ff' : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.$isDragging ? '0px 2px 5px rgba(0,0,0,0.5)' : 'none'};
`;
