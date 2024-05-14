import { useEffect } from 'react';
import { DragDropContext, DragStart, Droppable } from 'react-beautiful-dnd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { BoardState, toDoState, TrashCanState } from './atoms';
import Board from './components/Board';
import TrashCan from './components/TrashCan';
import { onDrageEnd } from './utils';

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boards, setBoards] = useRecoilState(BoardState);
  const setTrashCan = useSetRecoilState(TrashCanState);
  const onBeforeDragStart = (info: DragStart) => {
    if (info.type === 'DEFAULT') setTrashCan(true);
  };

  useEffect(() => {
    const todosFromLocalStorage = localStorage.getItem('todos');
    if (todosFromLocalStorage !== null) {
      const parsedTodos = JSON.parse(todosFromLocalStorage);
      setToDos(parsedTodos);
    }
  }, []);

  return (
    <DragDropContext
      onDragEnd={(info) => onDrageEnd(info, setBoards, setToDos, setTrashCan)}
      onBeforeDragStart={onBeforeDragStart}
    >
      <Wrapper>
        <Droppable droppableId="boards" direction="horizontal" type="board">
          {(magic) => (
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {boards.map((boardId, index) => (
                <Board
                  boardId={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                  key={index}
                />
              ))}
              {magic.placeholder}
            </Boards>
          )}
        </Droppable>
        <TrashCan />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  min-height: 200px;
`;
