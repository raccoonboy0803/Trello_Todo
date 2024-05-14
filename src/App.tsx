import { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import BoardComponent from './components/BoardComponent';

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  useEffect(() => {
    const todosFromLocalStorage = localStorage.getItem('todos');
    if (todosFromLocalStorage !== null) {
      const parsedTodos = JSON.parse(todosFromLocalStorage);
      setToDos(parsedTodos);
    }
  }, []);

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;

    if (!destination) return;

    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];

        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        localStorage.setItem(
          'todos',
          JSON.stringify({ ...allBoards, [source.droppableId]: boardCopy })
        );
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    }

    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        const taskObj = sourceBoard[source.index];

        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        localStorage.setItem(
          'todos',
          JSON.stringify({
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          })
        );

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <BoardComponent
              key={boardId}
              boardId={boardId}
              toDos={toDos[boardId]}
            />
          ))}
        </Boards>
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
