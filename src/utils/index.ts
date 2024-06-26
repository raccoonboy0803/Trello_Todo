import { DropResult } from 'react-beautiful-dnd';
import { SetterOrUpdater } from 'recoil';
import { IToDoState } from '../atoms';

export const onDrageEnd = (
  info: DropResult,
  setBoards: SetterOrUpdater<string[]>,
  setToDos: SetterOrUpdater<IToDoState>,
  setTrashCan: SetterOrUpdater<boolean>
) => {
  const { destination, source } = info;
  if (!destination) return;

  setTrashCan(false);

  if (source.droppableId === 'boards') {
    setBoards((prev) => {
      const boardCopy = [...prev];
      const item = boardCopy.splice(source.index, 1)[0];
      boardCopy.splice(destination.index, 0, item);
      return boardCopy;
    });
  } else if (destination.droppableId === 'trashcan') {
    setToDos((allBoards) => {
      const boardCopy = [...allBoards[source.droppableId]];
      boardCopy.splice(source.index, 1);
      localStorage.setItem(
        'todos',
        JSON.stringify({ ...allBoards, [source.droppableId]: boardCopy })
      );
      return { ...allBoards, [source.droppableId]: boardCopy };
    });
  } else if (source.droppableId === destination?.droppableId) {
    setToDos((allBoards) => {
      const boardCopy = [...allBoards[source.droppableId]];
      const item = boardCopy.splice(source.index, 1)[0];
      boardCopy.splice(destination.index, 0, item);
      localStorage.setItem(
        'todos',
        JSON.stringify({ ...allBoards, [source.droppableId]: boardCopy })
      );
      return {
        ...allBoards,
        [source.droppableId]: boardCopy,
      };
    });
  } else if (destination.droppableId !== source.droppableId) {
    setToDos((allBoards) => {
      const destinationCopy = [...allBoards[destination.droppableId]];
      const sourceCopy = [...allBoards[source.droppableId]];
      const item = sourceCopy.splice(source.index, 1)[0];
      destinationCopy.splice(destination.index, 0, item);
      localStorage.setItem(
        'todos',
        JSON.stringify({
          ...allBoards,
          [source.droppableId]: sourceCopy,
          [destination.droppableId]: destinationCopy,
        })
      );
      return {
        ...allBoards,
        [source.droppableId]: sourceCopy,
        [destination.droppableId]: destinationCopy,
      };
    });
  }
};
