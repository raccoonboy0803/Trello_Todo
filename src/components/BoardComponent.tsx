import { useForm } from 'react-hook-form';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DragComponent from './DragComponent';
import { ITodo, IToDoState, toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function BoardComponent({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    const currentTodos = localStorage.getItem('todos');
    let todos: IToDoState = currentTodos
      ? JSON.parse(currentTodos)
      : {
          'To Do': [],
          Doing: [],
          Done: [],
        };
    if (currentTodos) {
      todos = JSON.parse(currentTodos);
    }

    todos[boardId] = [...(todos[boardId] || []), newToDo];
    localStorage.setItem('todos', JSON.stringify(todos));

    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });

    setValue('toDo', '');
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('toDo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            ref={magic.innerRef}
            $isDraggingOver={snapshot.isDraggingOver}
            $isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragComponent
                key={toDo.id}
                toDoId={toDo.id}
                toDoText={toDo.text}
                index={index}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}
export default BoardComponent;

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

interface IAreaProps {
  $isDraggingFromThis: boolean;
  $isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.$isDraggingOver
      ? '#dfe6e9'
      : props.$isDraggingFromThis
      ? '#b2bec3'
      : 'transparent'};
  flex-grow: 1;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;
